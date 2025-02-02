<script>
import { onAuthStateChanged } from "firebase/auth";
import { useBookStore } from "@/stores/bookStore";
import UserProfile from "@/components/Profile.vue";
import { auth } from "@/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebase";

export default {
  name: "ProfilePage",
  components: { UserProfile },
  data() {
    return {
      authUser: null,
      userBooks: [],
      loading: true,
    };
  },
  created() {
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
  computed: {
    userStats() {
      return useBookStore().userStats;
    },
  },
  methods: {
    async fetchUserBooks(uid) {
      try {
        const userBooksRef = collection(db, "users", uid, "books");
        const querySnapshot = await getDocs(userBooksRef);
        const books = querySnapshot.docs.map((doc) => doc.data());

        this.userBooks = books
            .filter((book) => book.readingStatus === "finished" && book.finishedDate)
            .sort((a, b) => new Date(b.finishedDate) - new Date(a.finishedDate))
            .slice(0, 4);
      } catch (error) {
        console.error("Error fetching user books:", error);
      }
    },
  },
};
</script>

<template>
  <q-page class="profile-view q-pa-lg">
    <div v-if="loading">Loading...</div>

    <div v-else-if="authUser && userStats">
      <UserProfile
          :authUser="authUser"
          :userStats="userStats"
          :userBooks="userBooks"
      />
    </div>

    <div v-else>
      <p>Please log in to view your profile.</p>
    </div>
  </q-page>
</template>

<style scoped>
.q-page {
  padding: 20px;
}
</style>