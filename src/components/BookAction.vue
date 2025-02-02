<script>
import { collection, setDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase";

export default {
  name: "BookAction",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  emits: ["addToLibrary"],
  methods: {
    addToLibrary() {
      this.$emit("addToLibrary", this.book);
    },
    async favoriteBook() {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }

      try {
        const favoritesRef = collection(db, "users", user.uid, "favorites");
        const bookId = this.book.id || this.book.volumeInfo.id;

        // Save the book as a favorite in Firestore
        await setDoc(doc(favoritesRef, bookId), {
          title: this.book.volumeInfo.title,
          author: this.book.volumeInfo.authors?.join(", "),
          genre: this.book.volumeInfo.categories?.[0] || "Unknown",
          coverURL: this.book.volumeInfo.imageLinks?.thumbnail || "",
          description: this.book.volumeInfo.description || "",
        });

      } catch (error) {
        console.error("Error adding book to favorites:", error);
      }
    },
  },
};
</script>

<template>
  <q-card-actions align="right">
    <q-btn label="Add to Library" color="primary" @click="addToLibrary" />
    <q-btn label="Favorite" color="warning" @click="favoriteBook" />
  </q-card-actions>
</template>

<style scoped>
.book-actions {
  display: flex;
  gap: 10px;
}
</style>