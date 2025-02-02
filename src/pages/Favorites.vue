<script>
import { ref, onMounted } from "vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import FilterBy from "@/components/FilterBy.vue";

export default {
  name: "FavoritesPage",
  components: { FilterBy },
  setup() {
    const favoriteBooks = ref([]);
    const filteredFavorites = ref([]);
    const availableGenres = ref([]);
    const availableAuthors = ref([]);
    const loading = ref(true);
    const filterOptions = ref({
      genres: [],
      authors: [],
      title: "",
      readingStatus: "all",
    });

    const applyFilters = (filters) => {
      filterOptions.value = filters;
      filteredFavorites.value = favoriteBooks.value.filter((book) => {
        const matchesGenre =
            !filters.genres.length || filters.genres.includes(book.genre);
        const matchesAuthor =
            !filters.authors.length || filters.authors.includes(book.author);
        const matchesTitle =
            !filters.title || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const matchesReadingStatus =
            filters.readingStatus === "all" ||
            (filters.readingStatus === "reading" && book.currentPage > 0) ||
            (filters.readingStatus === "finished" &&
                book.currentPage === book.totalPages);

        return (
            matchesGenre &&
            matchesAuthor &&
            matchesTitle &&
            matchesReadingStatus
        );
      });
    };

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userFavoritesRef = collection(db, "users", user.uid, "favorites");
            const querySnapshot = await getDocs(userFavoritesRef);
            favoriteBooks.value = querySnapshot.docs.map((doc) => doc.data());
            filteredFavorites.value = [...favoriteBooks.value];

            // Populate genres and authors
            availableGenres.value = [...new Set(favoriteBooks.value.map((book) => book.genre))];
            availableAuthors.value = [...new Set(favoriteBooks.value.map((book) => book.author))];
          } catch (error) {
            console.error("Error fetching favorite books:", error);
          } finally {
            loading.value = false;
          }
        } else {
          loading.value = false;
        }
      });
    });

    return {favoriteBooks, filteredFavorites, loading, availableGenres, availableAuthors, filterOptions, applyFilters};
  },
};
</script>

<template>
    <h2>My Favorites</h2>

    <q-page-container>
      <div class="q-pa-md">
        <q-card v-if="loading">
          <q-card-section class="text-center">
            <q-spinner color="primary" size="lg"/>
            <p>Loading your favorite books...</p>
          </q-card-section>
        </q-card>

        <div v-else>
          <FilterBy
              :genres="availableGenres"
              :authors="availableAuthors"
              :filterOptions="filterOptions"
              @updateFilters="applyFilters"
          />
          <q-card v-if="filteredFavorites.length > 0">
            <q-card-section>
              <div class="text-h6 text-center">Your Favorite Books</div>
            </q-card-section>
            <q-list>
              <q-item class="animate__animated animate__bounceInDown" v-for="(book, index) in filteredFavorites" :key="index">
                <q-item-section avatar>
                  <q-img :src="book.coverURL || 'https://via.placeholder.com/100'"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ book.title }}</q-item-label>
                  <q-item-label caption>{{ book.author }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <q-card v-else>
            <q-card-section class="text-center">
              <q-icon name="favorite_border" size="40px" color="grey"/>
              <p class="q-mt-sm">No favorites match your filters. Try different filters.</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page-container>

</template>

<style scoped>
.animate__bounceInDown {
  animation: bounceInDown 1s ease-in-out;
}

</style>