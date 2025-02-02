<script>
import BookDetailsModal from "@/components/BookDetailsModal.vue";

export default {
  name: "BookList",
  components: {BookDetailsModal},
  props: {
    books: Array,
  },
  data() {
    return {
      selectedBook: null,
      isModalOpen: false,
      isLoading: true,
    };
  },
  methods: {
    viewDetails(book) {
      this.selectedBook = book;
      this.isModalOpen = true;
    },
    deleteBook(bookId) {
      this.$emit("deleteBook", bookId);
    },
    updateProgress(book) {
      this.$emit("updatePage", {...book});
    },
    finishBook(bookId) {
      this.$emit("finishBook", bookId);
    },
    rereadBook(book) {
      this.$emit("rereadBook", book);
    },
    favoriteBook(book) {
      this.$emit("favoriteBook", book);
    },
  },
  mounted() {

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },
};
</script>

<template>
  <div class="q-pa-md">
    <!-- Skeleton Loader for Cards -->
    <div v-if="isLoading" class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-2" v-for="index in 6" :key="index">
        <q-card class="book-card">
          <q-skeleton height="400px" square />
          <q-card-section>
            <q-skeleton type="text" />
            <q-skeleton type="text" />
            <q-skeleton type="text" />
            <q-skeleton type="QBtn" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Actual Book Cards -->
    <div v-else class="row q-col-gutter-md">
      <div
          class="col-12 col-md-6 col-lg-2"
          v-for="book in books"
          :key="book.id"
          :class="['animate__animated', 'animate__bounceInRight']"
      >
        <q-card
            class="book-card"
            @click="viewDetails(book)"
        >
          <q-img
              :src="book.coverURL || '/default-cover.png'"
              :alt="book.title"
              class="book-cover"
          />
          <q-card-section>
            <div class="text-h6">{{ book.title }}</div>

            <!-- Display Finished Status -->
            <q-chip
                v-if="book.readingStatus === 'finished'"
                color="green"
                icon="done"
            >
              Finished
            </q-chip>

            <!-- Display Favorite Status -->
            <q-chip v-if="book.isFavorite" color="amber" icon="star">
              Favorite
            </q-chip>

            <!-- Show Progress Bar -->
            <q-linear-progress
                v-if="book.totalPages"
                :value="book.currentPage / book.totalPages"
                color="primary"
                :label="book.readingStatus === 'finished' ? 'Completed' : `${book.currentPage} of ${book.totalPages}`"
            />

            <!-- Current Page Input -->
            <q-input
                v-model.number="book.currentPage"
                type="number"
                :min="1"
                :max="book.totalPages"
                label="Current Page"
                dense
                filled
                v-if="book.readingStatus !== 'finished'"
                @blur="updateProgress(book)"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Book Details Modal -->
    <book-details-modal
        v-if="selectedBook"
        v-model="isModalOpen"
        :book="selectedBook"
        @deleteBook="deleteBook"
        @finishBook="finishBook"
        @favoriteBook="favoriteBook"
        @rereadBook="rereadBook"
    />
  </div>
</template>


<style scoped>
/* Animation class */
.animate__bounceInRight {
  animation: bounceInRight 1s ease-in-out;
}


/* Book Card Styling */
.book-card {
  margin-bottom: 16px;
  max-height: 650px;
  cursor: pointer;
}

.book-cover {
  height: 400px;
  object-fit: cover;
}
.q-card-section{
  height: 100px;
}
</style>