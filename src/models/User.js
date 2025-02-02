export default class User {
    id;
    displayName;
    email;
    avatarURL;
    booksRead;
    genresRead;
    totalPagesRead;

    constructor(id, displayName, email, avatarURL, booksRead = [], genresRead = [], totalPagesRead = 0) {
        this.id = id ?? '';
        this.displayName = displayName ?? '';
        this.email = email ?? '';
        this.avatarURL = avatarURL ?? '';
        this.booksRead = booksRead ?? [];
        this.genresRead = genresRead ?? [];
        this.totalPagesRead = totalPagesRead ?? 0;
    }

    exists() {
        return !!this.id;
    }

    // Convert the User object into a Firestore-compatible format
    toFirestore() {
        return {
            displayName: this.displayName,
            email: this.email,
            avatarURL: this.avatarURL,
            booksRead: this.booksRead.map(book => book.toFirestore()),  // Map the books to Firestore format
            genresRead: this.genresRead,
            totalPagesRead: this.totalPagesRead
        };
    }

    // Static method to create a User instance from Firestore data
    static fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        const user = new User(
            snapshot.id,
            data.displayName,
            data.email,
            data.avatarURL,
            data.booksRead,
            data.genresRead || [],
            data.totalPagesRead || 0
        );
        return user;
    }

    // Method to add a book to the user's list of books read
    addBook(book) {
        if (book && this.booksRead.every(b => b.id !== book.id)) {
            this.booksRead.push(book);
            this.totalPagesRead += book.volumeInfo.pageCount || 0;
            this.addGenres(book.volumeInfo.categories);
        }
    }

    // Method to add genres from the book to the user's genresRead list
    addGenres(genres) {
        genres.forEach(genre => {
            if (!this.genresRead.includes(genre)) {
                this.genresRead.push(genre);
            }
        });
    }

    // Method to update the pages read statistics
    updatePagesRead(updatedBook) {
        this.totalPagesRead += updatedBook.currentPage - (updatedBook.previousPage || 0);
    }
}