<script>
import { useBookStore } from "@/stores/bookStore";
import BarChart from "@/components/BarChart.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "StatisticsView",
  components: { BarChart },
  data() {
    return {
      authUser: null,
      booksReadChartData: null,
      pagesReadChartData: null,
      chartOptions: {
        responsive: true,
        scales: {
          x: { type: 'category' },
          y: { beginAtZero: true },
        },
      },
      loading: true,
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.authUser = user;
        await this.fetchReadingData();
      } else {
        this.authUser = null;
      }
      this.loading = false;
    });
  },
  computed: {
    userStats() {
      return useBookStore().userStats;
    },
  },
  methods: {
    async fetchReadingData() {
      const books = useBookStore().allBooks;
      if (books && books.length > 0) {
        this.aggregateDataByTime(books);
      }

      if (this.authUser) {
        await this.fetchUserBooks(this.authUser.uid);
      }
    },
    async fetchUserBooks(uid) {
      try {
        const userBooksRef = collection(db, "users", uid, "books");
        const querySnapshot = await getDocs(userBooksRef);
        const books = querySnapshot.docs.map((doc) => doc.data());
        this.aggregateDataByTime(books);
      } catch (error) {
        console.error("Error fetching user books:", error);
      }
    },
    aggregateDataByTime(books) {
      const booksRead = {};
      const pagesRead = {};
      let totalBooksRead = 0;
      let totalPagesRead = 0;

      // Initialize author frequency count
      const authorCount = {};

      books.forEach((book) => {
        if (book.readingStatus === "finished") {
          const date = book.finishedDate ? new Date(book.finishedDate).toISOString().split("T")[0] : "Unknown Date";
          booksRead[date] = (booksRead[date] || 0) + 1;
          pagesRead[date] = (pagesRead[date] || 0) + book.totalPages;

          totalBooksRead += 1;
          totalPagesRead += book.totalPages;

          // Count author frequency
          const author = book.author;
          authorCount[author] = (authorCount[author] || 0) + 1;
        }
      });

      // Find the most frequent author
      const mostFrequentAuthor = Object.keys(authorCount).reduce((a, b) => authorCount[a] > authorCount[b] ? a : b, null);

      // Update userStats with total books, pages read, and most frequent author
      useBookStore().updateUserStats({
        totalBooksRead,
        totalPagesRead,
        mostReadGenre: this.calculateMostReadGenre(books),
        mostFrequentAuthor,
      });

      if (Object.keys(booksRead).length > 0) {
        this.booksReadChartData = this.generateChartData(Object.entries(booksRead).map(([date, totalBooks]) => ({ date, totalBooks })), "Books Read");
      } else {
        this.booksReadChartData = { labels: [], datasets: [{ label: "Books Read", data: [], backgroundColor: "#42A5F5", borderColor: "#1E88E5", borderWidth: 1 }] };
      }

      if (Object.keys(pagesRead).length > 0) {
        this.pagesReadChartData = this.generateChartData(Object.entries(pagesRead).map(([date, totalPages]) => ({ date, totalPages })), "Pages Read");
      } else {
        this.pagesReadChartData = { labels: [], datasets: [{ label: "Pages Read", data: [], backgroundColor: "#66BB6A", borderColor: "#43A047", borderWidth: 1 }] };
      }
    },
    generateChartData(data, label) {
      return {
        labels: data.map((entry) => entry.date),
        datasets: [{
          label: label,
          data: data.map((entry) => entry.totalBooks || entry.totalPages),
          backgroundColor: label === "Books Read" ? "#42A5F5" : "#66BB6A",
          borderColor: label === "Books Read" ? "#1E88E5" : "#43A047",
          borderWidth: 1,
        }],
      };
    },
    calculateMostReadGenre(books) {
      const genreCount = {};

      books.forEach((book) => {
        if (book.readingStatus === "finished") {
          const genre = book.genre;
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
      });

      const mostReadGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, null);

      return mostReadGenre || "Unknown Genre";
    },
  },
};
</script>

<template>
  <div>
    <h2>Statistics</h2>

    <div v-if="booksReadChartData && pagesReadChartData">
      <BarChart :chart-data="booksReadChartData" :chart-options="chartOptions" />
      <BarChart :chart-data="pagesReadChartData" :chart-options="chartOptions" />
    </div>

    <div class="stats-summary">
      <p>Most Read Genre: {{ userStats.mostReadGenre }}</p>
      <p>Total Books Read: {{ userStats.totalBooksRead }}</p>
      <p>Total Pages Read: {{ userStats.totalPagesRead }}</p>
      <p>Most Frequent Author: {{ userStats.mostFrequentAuthor }}</p>
    </div>
  </div>
</template>

<style scoped>
.stats-summary {
  margin-top: 20px;
}

.stats-summary p {
  font-size: 1.2rem;
  font-weight: bold;
}
p{
  color: #E2E1E7
}
</style>