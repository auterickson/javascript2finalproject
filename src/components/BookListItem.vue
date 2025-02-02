<script>
export default {
  name: "BookListItem",
  props: {
    book: Object,
  },
};
</script>

<template>
  <div @click="$emit('viewDetails', book)" class="book-cover-container">
    <img :src="book.coverURL || '/default-cover.png'" :alt="book.title" class="book-cover" />
  </div>
</template>


<style scoped>
.book-cover-container {
  cursor: pointer;
  width: 120px;
  margin: 10px;
}
.book-cover {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>