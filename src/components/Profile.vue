<script>
import EditProfileModal from "@/components/EditProfileModal.vue";
import User from "@/models/User.js"

export default {
  name: "UserProfile",
  props: {
    authUser: {
      type: Object,
      required: true,
    },
    userStats: {
      type: Object,
      required: true,
    },
    userBooks: {
      type: Array,
      required: true,
    },
  },
  components: { EditProfileModal },
  data() {
    return {
      isEditModalOpen: false,
    };
  },
  methods: {
    handleProfileUpdated(updatedData) {
      this.authUser.displayName = updatedData.displayName;
      this.authUser.birthday = updatedData.birthday;
    },
  },
  mounted() {
    console.log(this.authUser);
  }
};
</script>

<template>
  <div class="user-profile">
    <!-- Profile Header -->
    <q-card class="profile-card">
      <q-card-section>
        <div class="q-pa-md">

          <div class="row">
            <div class="col">
              <q-avatar v-if="authUser.photoURL" size="120px" :src="authUser.photoURL" />
              <h2 class="user-name">{{ authUser.displayName || "User" }}</h2>
              <p class="user-email">{{ authUser.email }}</p>
            </div>
          </div>

          <div   class="row">
            <div class="col">
            <div class="profile-stats">
              <h3>Statistics</h3>
              <p><strong>Total Books Read:</strong> {{ userStats.totalBooksRead }}</p>
              <p><strong>Total Pages Read:</strong> {{ userStats.totalPagesRead }}</p>
              <p><strong>Most Read Genre:</strong> {{ userStats.mostReadGenre }}</p>
            </div>

            <!-- Edit Profile Button -->
            <q-btn
                rounded
                label="Edit Profile"
                @click="isEditModalOpen = true"
                class="q-mt-md"
            />
          </div>
          </div>


        </div>

      </q-card-section>
    </q-card>

    <!-- Recently Finished Books -->
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

    <!-- Edit Profile Modal -->
    <EditProfileModal
        v-model="isEditModalOpen"
        :user="authUser"
        @updated="handleProfileUpdated"
    />
  </div>
</template>

<style scoped>
.q-btn {
  background-color: #FF9746;
  color: #000000;
}

/* Profile Card */
.profile-card {
  background-color: #1f2b23;
  border-radius: 10px;
  padding: 20px;
}

.profile-stats {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.profile-stats h3 {
  margin-bottom: 20px;
}

.profile-stats p {
  margin-bottom: 10px;
}

.user-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.user-email {
  font-size: 1rem;
  opacity: 0.8;
}


/* User Books Section */
.user-books {
  margin-top: 20px;
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

/* Responsiveness */
@media (max-width: 768px) {
  .profile-header {
    margin-bottom: 15px;
  }

  .pill-button {
    font-size: 0.9rem;
    padding: 6px 20px;
  }

  .books-grid {
    gap: 10px;
  }

  .book-item {
    width: 100px;
  }
}
</style>