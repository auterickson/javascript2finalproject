<script>
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, setDoc, deleteDoc, collection, onSnapshot, increment } from "firebase/firestore";
import { db, auth } from "@/firebase/index.js";
import { useBookStore } from "@/stores/bookStore";
import BookList from "@/components/BookList.vue";
import FilterBy from "@/components/FilterBy.vue";

export default {
  components: {
    BookList,
    FilterBy,
  },
  data() {
    return {
      filterOptions: {
        genres: [],
        authors: [],
        title: "",
        readingStatus: "all",
      },
      availableGenres: [],
      availableAuthors: [],
      filteredBooks: [],
    };
  },
  methods: {
    handleUpdatePage(updatedBook) {
      const bookRef = doc(db, "users", auth.currentUser.uid, "books", updatedBook.id);

      // Check if the book is completed
      if (updatedBook.currentPage === updatedBook.totalPages) {
        // Update status to completed and currentPage to totalPages
        updateDoc(bookRef, {
          status: "completed",
          currentPage: updatedBook.totalPages,
        })
            .then(() => {
              useBookStore().updatePagesReadData(updatedBook);

              // Update the total books read and total pages read
              this.updateUserStatsOnFinish(updatedBook);

              this.$q.notify({
                type: "positive",
                message: `You have finished reading ${updatedBook.title}!`,
              });
            })
            .catch((error) => {
              console.error("Error updating book:", error);
              this.$q.notify({
                type: "negative",
                message: "Failed to mark book as completed.",
              });
            });
      } else {
        // Continue updating currentPage if the book is not finished
        updateDoc(bookRef, { currentPage: updatedBook.currentPage })
            .then(() => {
              useBookStore().updatePagesReadData(updatedBook);
            })
            .catch((error) => {
              console.error("Error updating book:", error);
              this.$q.notify({
                type: "negative",
                message: "Failed to update book progress.",
              });
            });
      }
    },

    updateUserStatsOnFinish(book) {
      const userRef = doc(db, "users", auth.currentUser.uid);

      // Use increment() directly from the import
      updateDoc(userRef, {
        totalBooksRead: increment(1),
        totalPagesRead: increment(book.totalPages),
      })
          .then(() => {
            this.$q.notify({
              type: "positive",
              message: `Updated your stats: +1 book, +${book.totalPages} pages.`,
            });
          })
          .catch((error) => {
            console.error("Error updating user stats:", error);
            this.$q.notify({
              type: "negative",
              message: "Failed to update user statistics.",
            });
          });
    },
    handleRereadBook(book) {
      const bookRef = doc(db, "users", auth.currentUser.uid, "books", book.id);

      // Reset the currentPage to 0 and set status to 'reading' when rereading
      updateDoc(bookRef, { currentPage: 0, readingStatus: "reading" })
          .then(() => {
            // Notify the user and update the UI
            this.$q.notify({
              type: "positive",
              message: `You can now reread ${book.title}!`,
            });
            // Optionally, update the store or local component data
            useBookStore().updateBookStatus(book.id, "reading");
          })
          .catch((error) => {
            console.error("Error starting reread:", error);
            this.$q.notify({
              type: "negative",
              message: "Failed to start rereading.",
            });
          });
    },

    handleFinishBook(bookId) {
      const bookRef = doc(db, "users", auth.currentUser.uid, "books", bookId);

      // Mark the book as finished and add a finishedDate
      const finishedDate = new Date().toISOString();

      updateDoc(bookRef, {
        readingStatus: "finished",
        finishedDate: finishedDate,
      })
          .then(() => {
            useBookStore().updateBookStatus(bookId, "finished");

            const book = useBookStore().getBookById(bookId);
            if (book) {
              this.updateUserStatsOnFinish(book);
            }

            this.$q.notify({
              type: "positive",
              message: `You have finished reading ${book.title}!`,
            });
          })
          .catch((error) => {
            console.error("Error finishing book:", error);
          });
    },
    async handleFavoriteBook(book) {
      const favoriteRef = doc(db, "users", auth.currentUser.uid, "favorites", book.id);
      const libraryRef = doc(db, "users", auth.currentUser.uid, "books", book.id);

      try {
        // Add the book to the favorites collection
        await setDoc(favoriteRef, { ...book, isFavorite: true });

        // Remove the book from the library collection
        await deleteDoc(libraryRef);

        // Update the local store or state
        const bookStore = useBookStore();
        bookStore.removeBook(book.id);

        // Notify the user
        this.$q.notify({
          type: "positive",
          message: `${book.title} has been moved to your favorites!`,
        });
      } catch (error) {
        console.error("Error moving book to favorites:", error);
        this.$q.notify({
          type: "negative",
          message: `Failed to move ${book.title} to favorites.`,
        });
      }
    },
    handleDeleteBook(bookId) {
      // Delete the book from the database and the store
      const bookRef = doc(db, "users", auth.currentUser.uid, "books", bookId);
      deleteDoc(bookRef)
          .then(() => {
            useBookStore().removeBook(bookId);
            this.$q.notify({
              type: "positive",
              message: "Book deleted successfully.",
            });
          })
          .catch((error) => {
            console.error("Error deleting book:", error);
            this.$q.notify({
              type: "negative",
              message: "Failed to delete book.",
            });
          });
    },
    applyFilters(updatedFilters) {
      if (updatedFilters) {
        this.filterOptions = { ...updatedFilters };
      }
      const bookStore = useBookStore();
      this.filteredBooks = bookStore.allBooks.filter((book) => {
        if (book.isFavorite) return false;

        const genreMatch =
            this.filterOptions.genres.length === 0 ||
            this.filterOptions.genres.includes(book.genre);
        const authorMatch =
            this.filterOptions.authors.length === 0 ||
            this.filterOptions.authors.includes(book.author);
        const titleMatch = book.title
            .toLowerCase()
            .includes(this.filterOptions.title.toLowerCase());
        const statusMatch =
            this.filterOptions.readingStatus === "all" ||
            book.readingStatus === this.filterOptions.readingStatus;

        return genreMatch && authorMatch && titleMatch && statusMatch;
      });
    },
    fetchGenresAndAuthors() {
      const bookStore = useBookStore();
      const genres = new Set();
      const authors = new Set();

      bookStore.allBooks.forEach((book) => {
        genres.add(book.genre);
        authors.add(book.author);
      });

      this.availableGenres = Array.from(genres);
      this.availableAuthors = Array.from(authors);
    },
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userBooksRef = collection(db, "users", user.uid, "books");
        onSnapshot(userBooksRef, (querySnapshot) => {
          const bookStore = useBookStore();
          bookStore.allBooks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.fetchGenresAndAuthors();
          this.applyFilters();
        });
      }
    });
  },
};
</script>

<template>
  <div>
    <h2>My Library</h2>
    <FilterBy
        :genres="availableGenres"
        :authors="availableAuthors"
        :filterOptions="filterOptions"
        @updateFilters="applyFilters"
    />
    <div v-if="filteredBooks.length">
      <BookList
          :books="filteredBooks"
          title="Books"
          @updatePage="handleUpdatePage"
          @deleteBook="handleDeleteBook"
          @finishBook="handleFinishBook"
          @rereadBook="handleRereadBook"
          @favoriteBook="handleFavoriteBook"
      />
    </div>
    <div v-else>
      <p>No books match your filters. Adjust filters to see results.</p>
    </div>
  </div>
</template>

<style>

</style>