<script>
import axios from "axios";
import BookDetails from "@/components/BookDetails.vue";

export default {
  name: "BookSearch",
  components: { BookDetails },
  data() {
    return {
      searchQuery: "",
      books: [],
      selectedBook: null,
      genres: [
        "Fiction", "Fantasy", "Mystery", "Science", "Romance", "History", "Education",
        "Biography & Autobiography", "Law", "Religion", "Political Science", "Poetry",
        "Classics", "Horror", "Mythology", "Nonfiction", "Graphic Novels", "Historical Fiction",
        "Science Fiction", "Thrillers"
      ],
      selectedGenres: [],
    };
  },
  emits: ['addToLibrary'],
  computed: {
    booksInRows() {
      let rows = [];
      for (let i = 0; i < this.books.length; i += 5) {
        rows.push(this.books.slice(i, i + 5));
      }
      return rows;
    },
  },
  methods: {
    async searchBooks() {
      if (this.searchQuery) {
        const url = "https://www.googleapis.com/books/v1/volumes";
        const config = {
          params: {
            q: this.searchQuery,
            maxResults: 36,
          },
        };

        try {
          const response = await axios.get(url, config);
          this.books = response.data.items || [];
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      }
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
      } else {
        this.selectedGenres.push(genre);
      }
    },
    async searchBySelectedGenres() {
      if (this.selectedGenres.length === 0) {
        alert("Please select at least one genre!");
        return;
      }

      const query = this.selectedGenres.map((genre) => `subject:${genre}`).join("+");
      const url = "https://www.googleapis.com/books/v1/volumes";
      const config = {
        params: {
          q: query,
          maxResults: 36,
        },
      };

      try {
        const response = await axios.get(url, config);
        this.books = response.data.items || [];
      } catch (error) {
        console.error("Error fetching books by genres:", error);
      }
    },
    openBookDetails(book) {
      this.selectedBook = book;
    },
    handleAddToLibrary(book) {
      // Reset the search query and results
      this.searchQuery = "";
      this.books = [];

      // Emit event to add the book to the library
      this.$emit("addToLibrary", book);
    },
  },
};
</script>

<template>

    <q-input
        v-model="searchQuery"
        label="Search for Books"
        debounce="500"
        @keyup.enter="searchBooks"
    />
    <q-btn  rounded label="Search"  @click="searchBooks" />

    <!-- Genre Buttons -->
    <div class="q-my-md genre-buttons">
      <q-btn rounded
          v-for="genre in genres"
          :key="genre"
          :label="genre"
          :color="selectedGenres.includes(genre) ? 'primary' : 'secondary'"
          @click="toggleGenre(genre)"
          class="q-mr-sm genre-btn"
      />
    </div>

    <q-btn rounded
        label="Search by Genres"
        @click="searchBySelectedGenres"
        class="q-my-md"
    />

    <!-- Book Results in Rows of 5 -->
    <div class="q-pa-md example-row-all-breakpoints">
      <div class="row" v-for="(row, index) in booksInRows" :key="index">
        <div class="col" v-for="book in row" :key="book.id">
          <q-item>
            <q-item-section>
              <q-img
                  :src="book.volumeInfo.imageLinks?.thumbnail"
                  alt="Book cover"
                  @click="openBookDetails(book)"
                  class="book-thumbnail"
                  style="cursor: pointer;"
              />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </div>

    <!-- Book Details Modal -->
    <BookDetails
        v-if="selectedBook"
        :book="selectedBook"
        @close="selectedBook = null"
        @addToLibrary="handleAddToLibrary"
    />

</template>

<style scoped lang="scss">
.q-input{
  margin-top: 20px;
}
:root {
  --q-primary: #E2E1E7 !important;
  --q-secondary: #FF9746 !important;
}
.genre-btn {
  color: var(--q-primary);
}
.q-btn{
  margin-top: 15px;
  background-color: #E2E1E7;
  color: #1C4112;
}
.q-btn:hover{
  background-color:#FF9746 ;
  color: #000000;
}
.book-thumbnail {
  max-width: 150px;
  height: auto;
}
</style>