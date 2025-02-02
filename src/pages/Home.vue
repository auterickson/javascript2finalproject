<script>
import BookSearch from "@/components/BookSearch.vue";
import BookList from "@/components/BookList.vue";
import DiscoverBooks from "@/components/DiscoverBooks.vue";
import {db, auth} from "@/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {collection, getDocs, setDoc, doc} from "firebase/firestore";


export default {
  components: {
    BookList,
    BookSearch,
    DiscoverBooks,

  },
  data() {
    return {
      loading: true,
      currentlyReadingBooks: [],
      userBooks: {
        type: Array,
        required: true,
      },
    };
  },
  created() {

    // Listen for user authentication state
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.authUser = user;
          await this.fetchUserBooks(user.uid);
        } else {
          this.authUser = null;
          this.userBooks = [];
        }
        this.loading = false;
      });
    },
  methods: {
    async addToLibrary(book) {
      const user = auth.currentUser;
      if (user) {
        try {
          const userBooksRef = collection(db, "users", user.uid, "books");
          const bookId = book.id; // Google Books API ID

          // Check if the book already exists in the user's library
          const existingBook = this.currentlyReadingBooks.find((b) => b.id === bookId);

          if (!existingBook) {
            await setDoc(doc(userBooksRef, bookId), {
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors.join(", "),
              genre: book.volumeInfo.categories?.[0] || "Unknown",
              currentPage: 1, // Default to the first page
              totalPages: book.volumeInfo.pageCount || 0,
              coverURL: book.volumeInfo.imageLinks?.thumbnail || "",
              readingStatus: "reading",
            });

            // Update local state
            this.currentlyReadingBooks.push({
              id: bookId,
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors.join(", "),
              genre: book.volumeInfo.categories?.[0] || "Unknown",
              currentPage: 1,
              totalPages: book.volumeInfo.pageCount || 0,
              coverURL: book.volumeInfo.imageLinks?.thumbnail || "",
              readingStatus: "reading",
            });
          }
        } catch (error) {
          console.error("Error adding book to library:", error);
        }
      } else {
        console.error("User is not authenticated.");
      }
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
    }, async fetchUserBooks(uid) {
      try {
        const userBooksRef = collection(db, "users", uid, "books");
        const querySnapshot = await getDocs(userBooksRef);
        const books = querySnapshot.docs.map((doc) => doc.data());

        this.userBooks = books
            .filter((book) => book.readingStatus === "finished" && book.finishedDate)
            .sort((a, b) => new Date(b.finishedDate) - new Date(a.finishedDate))
            .slice(0, 6);
      } catch (error) {
        console.error("Error fetching user books:", error);
      }
    },
  },
};
</script>

<template>
  <div>

    <!-- Show content after loading is false -->
      <BookSearch @addToLibrary="addToLibrary"/>
      <DiscoverBooks @addToLibrary="addToLibrary"/>

    <div class="q-pa-md">
      <!-- Skeleton Loader for Cards -->
      <div v-if="loading" class="row q-col-gutter-md">
        <div class="col-12 col-md-6 col-lg-2" v-for="index in 5" :key="index">
          <q-card class="book-card">
            <q-skeleton height="400px" square />
            <q-card-section>
              <q-skeleton type="text" />
              <q-skeleton type="text" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Display "No books read yet" if userBooks is empty -->
      <div v-else-if="userBooks.length === 0">
        <p>No books read yet.</p>
      </div>

      <!-- Actual Book Cards -->
      <div v-else class="row q-col-gutter-md">
        <div
            class="col-12 col-md-6 col-lg-2"
            v-for="book in userBooks"
            :key="book.id"
        >
          <q-card class="book-card">
            <q-img
                :src="book.coverURL || '/default-cover.png'"
                :alt="book.title"
                class="book-cover"
            />
            <q-card-section>
              <div class="text-h6">{{ book.title }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped lang="scss">
p {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}
.book-card {
  margin-bottom: 16px;
}

.book-cover {
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.q-card-section {
  height: 250px;
}

.text-h6 {
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: bold;
}
</style>