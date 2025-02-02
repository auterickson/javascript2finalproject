<script>
import axios from 'axios';
import BookDetails from "@/components/BookDetails.vue";

export default {
  name: "DiscoverBooks",
  components: {
    BookDetails,
  },
  data() {
    return {
      discoverBooks: [],
      selectedBook: null,
      loading: false,
      error: null,
      selectedIndex: 0,
    };
  },
  created() {
    this.fetchRandomBooks();
  },
  methods: {
    async fetchRandomBooks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
          params: {
            q: "City of Brass",
            printType: "books",
            maxResults: 20,
            orderBy: "newest",
          }
        });

        this.discoverBooks = response.data.items || [];
      } catch (error) {
        this.error = "Failed to load books. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    openBookDetails(book) {
      this.selectedBook = book;
    },
    handleAddToLibrary(book) {
      // Emit event to add the book to the library
      this.$emit("addToLibrary", book);
    },
    // Method to chunk the books array into smaller arrays of the specified size
    chunkBooks(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
  },
};
</script>

<template>
  <div>
    <h2>Discover New Books</h2>

    <!-- Loading and error handling -->
    <div v-if="loading" class="loading-message">
      <q-spinner color="primary" />
      <p>Loading books...</p>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- Book Thumbnails as a Quasar Carousel -->
    <div v-if="!loading && !error">
      <q-carousel
          v-if="discoverBooks.length"
          v-model="selectedIndex"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="amber"
          navigation
          padding
          arrows
          height="300px"
          class="bg-grey-9 shadow-2 rounded-borders"
      >
        <!-- Display books in groups of 4 -->
        <q-carousel-slide
            v-for="(chunk, index) in chunkBooks(discoverBooks, 4)"
            :key="index"
            :name="index.toString()"
        >
          <div class="book-slide">
            <div class="book-thumbnails">
              <!-- Loop through each chunk and display books side by side -->
              <q-img
                  v-for="(book) in chunk"
                  :key="book.id"
                  :src="book.volumeInfo.imageLinks?.thumbnail"
                  alt="Book cover"
                  @click="openBookDetails(book)"
                  class="book-thumbnail"
                  style="cursor: pointer; max-width: 150px; height: auto; margin: 5px;"
              />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- Book Details Modal -->
    <BookDetails
        v-if="selectedBook"
        :book="selectedBook"
        @close="selectedBook = null"
        @addToLibrary="handleAddToLibrary"
    />
  </div>
</template>

<style scoped lang="scss">
.loading-message {
  text-align: center;
  margin-top: 20px;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 20px;
}
.book-thumbnail {
  cursor: pointer;
  margin-bottom: 10px;
}

.book-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-thumbnails {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

.my-carousel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
</style>