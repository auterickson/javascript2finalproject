<script>
import axios from "axios";

export default {
  name: "RecommendedBooks",
  props: {
    category: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recommendedBooks: [],
      loadingRecommendations: false,
    };
  },
  created() {
    this.fetchRecommendedBooks();
  },
  methods: {
    async fetchRecommendedBooks() {
      if (!this.category) return;

      this.loadingRecommendations = true;

      try {
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
          params: {
            q: `subject:${this.category}`,
            maxResults: 5,
          },
        });

        this.recommendedBooks = response.data.items || [];
      } catch (error) {
        console.error("Failed to fetch recommended books", error);
      } finally {
        this.loadingRecommendations = false;
      }
    },
    openBookDetails(book) {
      this.$emit("openBookDetails", book);
    },
  },
};
</script>

<template>
  <q-card-section v-if="!loadingRecommendations">
    <div v-if="recommendedBooks.length" class="recommended-books">
      <h6>Recommended for You</h6>
      <div class="recommended-books-list">
        <q-img
            v-for="(recommendedBook, index) in recommendedBooks"
            :key="index"
            :src="recommendedBook.volumeInfo.imageLinks?.thumbnail"
            alt="Recommended Book"
            @click="openBookDetails(recommendedBook)"
            class="recommended-book-thumbnail"
            style="cursor: pointer; max-width: 100px; height: auto; margin: 5px;"
        />
      </div>
    </div>
    <div v-else>
      <p>No recommendations available.</p>
    </div>
  </q-card-section>

  <!-- Loading Spinner for Recommendations -->
  <q-card-section v-else class="text-center">
    <q-spinner color="primary" />
  </q-card-section>
</template>

<style scoped lang="scss">
.recommended-books {
  margin-top: 20px;
}

.recommended-books-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}

.recommended-book-thumbnail {
  cursor: pointer;
  border-radius: 8px;
}
</style>