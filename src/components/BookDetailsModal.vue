<script>
import confetti from "canvas-confetti";

export default {
  name: "BookDetailsModal",
  props: {
    book: Object,
    modelValue: Boolean,
  },
  data() {
    return {
      animateFavorite: false,
    };
  },
  computed: {
    localModelValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    close() {
      this.localModelValue = false;
    },
    handleUpdatePage() {
      this.$emit("updatePage", this.book);
    },
    rereadBook() {
      this.$emit("rereadBook", this.book);
    },
    toggleFavorite() {
      this.animateFavorite = true;
      this.$emit("favoriteBook", this.book);


      setTimeout(() => {
        this.animateFavorite = false;
      }, 1000);
    },
    finishBook() {
      // Emit the finishBook event
      this.$emit("finishBook", this.book.id);

      // Trigger confetti animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: {y: 0.6},
        zIndex: 10000,
      });
    },
  },
};
</script>
<template>
  <q-dialog v-model="localModelValue">
    <q-card class="modal-card">
      <q-card-section class="modal-content">
        <!-- Book Cover -->
        <div class="book-cover-container">
          <q-img :src="book.coverURL || '/default-cover.png'" class="book-detail-cover" />
          <q-btn
              flat
              round
              dense
              :class="['favorite-icon', { 'animate__animated animate__heartBeat': animateFavorite }]"
              :icon="book.isFavorite ? 'favorite' : 'favorite_border'"
              @click="toggleFavorite"
          />
        </div>

        <!-- Right Side Content -->
        <div class="details-container">
          <div class="text-h6">{{ book.title }}</div>

          <!-- Progress Bar -->
          <q-linear-progress
              v-if="book.totalPages"
              :value="book.currentPage / book.totalPages"
              color="primary"
              :label="book.readingStatus === 'finished' ? 'Completed' : `${book.currentPage} of ${book.totalPages}`"
          />

          <!-- Current Page Input -->
          <q-input
              v-if="book.readingStatus !== 'finished'"
              v-model.number="book.currentPage"
              type="number"
              :min="1"
              :max="book.totalPages"
              label="Current Page"
              dense
              filled
              @blur="handleUpdatePage"
          />

        </div>
      </q-card-section>

      <!-- Action Buttons -->
      <q-card-actions align="right" class="button-section">
        <q-btn
            rounded
            v-if="book.readingStatus === 'reading'"
            label="Finish"
            @click="finishBook"
        />
        <q-btn
            rounded
            v-if="book.readingStatus === 'finished'"
            label="Reread"
            @click="rereadBook"
        />
        <q-btn
            rounded
            label="Delete"
            color="negative"
            @click="$emit('deleteBook', book.id)"
        />
        <q-btn
            flat
            rounded
            color="negative"
            label="Close"
            @click="close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.q-dialog__inner {
  z-index: 9999;
}
.modal-card {
  width: 600px;
  max-width: 100%;
}

/* Two-Column Layout */
.modal-content {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
}

/* Book Cover Section */
.book-cover-container {
  position: relative;
  flex: 1;
  max-width: 200px;
  height: 300px;
  overflow: hidden;
}

.book-detail-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* Favorite Icon */
.favorite-icon {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
  background: rgba(255, 151, 70, 0.7);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

/* Details Section */
.details-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Action Buttons */
.button-section {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

</style>