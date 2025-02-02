import { db } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, setDoc, query, where, getDocs } from "firebase/firestore";
import Book from "@/models/Book.js";  // Import the Book model

export default class BookCollection {
    static COLLECTION_NAME = 'bookCollection';  // Firestore collection name for books

    /**
     * Get a book by its ID from Firestore.
     * @param {string} bookId
     * @returns {Promise<Book>}
     */
    static async getBook(bookId) {
        const bookDocRef = BookCollection.getBookDoc(bookId);
        const bookDocSnap = await getDoc(bookDocRef.withConverter(Book));
        return bookDocSnap.data();
    }

    /**
     * Find a book by its title.
     * @param {string} title
     * @returns {Promise<Book>}
     */
    static async findBookByTitle(title) {
        const booksCollection = BookCollection.getBooksCollection();
        const bookQuery = query(booksCollection, where('title', '==', title));
        const bookDocsSnap = await getDocs(bookQuery.withConverter(Book));
        return bookDocsSnap?.docs[0]?.data();
    }

    /**
     * Sync book data in real-time. Listens for updates and modifies the book object accordingly.
     * @param {string} bookId
     * @param {Book} book
     */
    static syncBook(bookId, book) {
        const bookDocRef = BookCollection.getBookDoc(bookId);
        onSnapshot(bookDocRef.withConverter(Book), doc => {
            Object.assign(book, doc.data());
        });
    }

    /**
     * Set book data in Firestore.
     * @param {Book} book
     * @returns {Promise<void>}
     */
    static async setBook(book) {
        const bookDocRef = BookCollection.getBookDoc(book.id);
        return setDoc(bookDocRef, book.toFirestore());
    }

    /**
     * Get a reference to a book's document by its ID.
     * @param {string} bookId
     * @returns {DocumentReference}
     */
    static getBookDoc(bookId) {
        return doc(BookCollection.getBooksCollection(), bookId);
    }

    /**
     * Get the Firestore books collection reference.
     * @returns {CollectionReference}
     */
    static getBooksCollection() {
        return collection(db, BookCollection.COLLECTION_NAME);
    }
}
