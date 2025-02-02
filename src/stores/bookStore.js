import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookStore = defineStore('bookStore', () => {
    const allBooks = ref([]);
    const pagesReadData = ref([]);
    const userStatsData = ref({
        totalBooksRead: 0,
        totalPagesRead: 0,
        mostReadGenre: 'N/A',
        mostFrequentAuthor: 'N/A',
        booksReadData: [],
        pagesReadData: [],
    });

    // Update pages read data when currentPage is updated
    const updatePagesReadData = (updatedBook) => {
        const date = new Date().toISOString().split('T')[0];  // Get current date in YYYY-MM-DD format
        const entry = pagesReadData.value.find(entry => entry.date === date);  // Find existing entry for today

        if (entry) {
            // Subtract the previous page count and add the new one
            entry.totalPages = entry.totalPages - (updatedBook.previousPage || 0) + updatedBook.currentPage;
        } else {
            // If no entry exists for today, create a new one
            pagesReadData.value.push({ date, totalPages: updatedBook.currentPage });
        }
    };

    const removeBook = (bookId) => {
        allBooks.value = allBooks.value.filter((book) => book.id !== bookId);
    };

    const updateBookStatus = (bookId, status) => {
        const book = allBooks.value.find((book) => book.id === bookId);
        if (book) book.readingStatus = status;
    };

    const markAsFavorite = (bookId) => {
        const book = allBooks.value.find((book) => book.id === bookId);
        if (book) book.isFavorite = true;
    };

    // New function to get a book by its ID
    const getBookById = (bookId) => {
        return allBooks.value.find(book => book.id === bookId);
    };

    // Define the updateUserStats method
    const updateUserStats = ({ totalBooksRead, totalPagesRead, mostReadGenre, mostFrequentAuthor }) => {
        userStatsData.value = {
            totalBooksRead,
            totalPagesRead,
            mostReadGenre,
            mostFrequentAuthor,
            booksReadData: userStatsData.value.booksReadData,  // Assuming you want to retain previous data
            pagesReadData: userStatsData.value.pagesReadData,  // Same here
        };
    };

    // Computed property to calculate user stats
    const userStats = computed(() => userStatsData.value);

    return {
        allBooks,
        pagesReadData,
        updatePagesReadData,
        removeBook,
        updateBookStatus,
        markAsFavorite,
        getBookById,
        updateUserStats, // Add this method to the store
        userStats, // Expose user stats as a computed property
    };
});