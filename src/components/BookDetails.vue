<script>
import BookAction from "@/components/BookAction.vue";
import RecommendedBooks from "@/components/RecommendedBooks.vue";

export default {
  name: "BookDetails",
  components: { BookAction, RecommendedBooks },
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "addToLibrary", "addToFavorites", "startReading"],
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    close() {
      this.isOpen = false;
      this.$emit("close");
    },
    addToLibrary() {
      this.$emit("addToLibrary", this.book);
      this.close();
    },
    addToFavorites() {
      this.$emit("addToFavorites", this.book);
      this.close();
    },
    startReading() {
      this.$emit("startReading", this.book);
      this.close();
    },
    openBookDetails(book) {
      this.$emit("openBookDetails", book);
    },
  },
};
</script>

<template>
  <q-dialog v-model="isOpen">
    <q-card style="max-width: 400px;">
      <q-card-section>
        <div class="row">
          <q-img :src="book.volumeInfo?.imageLinks?.thumbnail" alt="Book cover" />
        </div>
        <div class="text-h6">{{ book.volumeInfo?.title || 'Untitled' }}</div>
        <div class="text-subtitle2">{{ book.volumeInfo?.authors?.join(", ") || 'Unknown Author' }}</div>
        <p>{{ book.volumeInfo?.description || 'No description available' }}</p>
        <div v-if="book.volumeInfo?.categories">
          <p>Categories: {{ book.volumeInfo.categories.join(", ") }}</p>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <BookAction
            :book="book"
            @addToLibrary="addToLibrary"
            @click="addToFavorites"
            @startReading="startReading"
        />
        <q-btn label="Close" color="negative" @click="close" />
      </q-card-actions>

      <!-- RecommendedBooks Component -->
      <RecommendedBooks
          :category="book.volumeInfo?.categories?.[0]"
          @openBookDetails="openBookDetails"
      />
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
q-img {
  max-width: 100%;
  height: auto;
}
</style>