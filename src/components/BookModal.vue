<script>
export default {
  props: {
    book: Object,
    isVisible: Boolean,
  },
  methods: {
    closeModal() {
      this.$emit("update:isVisible", false);
    },
    onFavorite() {
      this.$emit("favorite-book", this.book);
    },
    onDelete() {
      this.$emit("delete-book", this.book.id);
    },
    onFinish() {
      this.$emit("finish-book", this.book.id);
    },
    onReread() {
      this.$emit("reread-book", this.book);
    },
  },
};
</script>

<template>
  <q-dialog :value="isVisible" @input="closeModal">
    <q-card>
      <q-card-section>
        <div class="text-center">
          <q-img :src="book.coverURL" alt="Book cover" class="book-modal-thumbnail" />
        </div>
        <h3>{{ book.title }}</h3>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Genre:</strong> {{ book.genre }}</p>

        <!-- Progress Bar -->
        <div v-if="book.currentPage !== undefined">
          <p><strong>Progress:</strong> {{ book.currentPage }} / {{ book.totalPages }}</p>
          <q-slider v-model="book.currentPage" :min="0" :max="book.totalPages" label />
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn @click="onFavorite" label="Favorite" color="primary" />
        <q-btn @click="onDelete" label="Delete" color="negative" />
        <q-btn @click="onFinish" label="Finish" color="secondary" />
        <q-btn @click="onReread" label="Reread" color="warning" />
        <q-btn @click="closeModal" label="Close" color="secondary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.book-modal-thumbnail {
  width: 100px;
  height: auto;
  margin: 0 auto;
}
.q-btn {
  margin: 5px 0;
}
</style>