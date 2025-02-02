import { db } from "@/firebase";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, FieldValue } from "firebase/firestore";  // Updated import for Firestore
import Book from "@/models/Book.js";
import User from "@/models/User.js";

// Note: Firestore and other Firebase services need to be imported directly
export default class UserCollection {
    static COLLECTION_NAME = 'users';  // Firestore collection name for users
    static BOOKS_COLLECTION_NAME = 'books';  // Firestore collection name for books

    /**
     * Set or update user data in Firestore.
     * @param {User} user
     * @returns {Promise<void>}
     */
    static async setUser(user) {
        const userDocRef = UserCollection.getUserDoc(user.id);
        return setDoc(userDocRef, user.toFirestore(), { merge: true });
    }

    /**
     * Update specific fields for a user.
     * @param {string} uid
     * @param {Object} updates - The fields to update (e.g., booksRead, genresRead, etc.)
     * @returns {Promise<void>}
     */
    static async updateUser(uid, updates) {
        const userDocRef = UserCollection.getUserDoc(uid);
        return updateDoc(userDocRef, updates);
    }

    /**
     * Add a book to a user's collection.
     * @param {string} uid
     * @param {Book} book
     * @returns {Promise<void>}
     */
    static async addBookToUser(uid, book) {
        const userDocRef = UserCollection.getUserDoc(uid);
        // Add the book to the user's booksRead array
        const bookData = book.toFirestore();
        return updateDoc(userDocRef, {
            booksRead: arrayUnion(bookData)  // Use arrayUnion for adding items to an array
        });
    }

    /**
     * Get a reference to a user's document by their UID.
     * @param {string} uid
     * @returns {DocumentReference}
     */
    static getUserDoc(uid) {
        return doc(UserCollection.getUsersCollection(), uid);
    }

    /**
     * Get a reference to the books collection.
     * @returns {CollectionReference}
     */
    static getBooksCollection() {
        return collection(db, UserCollection.BOOKS_COLLECTION_NAME);
    }

    /**
     * Get the Firestore users collection reference.
     * @returns {CollectionReference}
     */
    static getUsersCollection() {
        return collection(db, UserCollection.COLLECTION_NAME);
    }
}