export default class Book {
    static type = 'Book';

    // Book's unique identifier
    kind = '';
    id = '';
    selfLink = '';
    volumeInfo = {
        imageLinks: {
            thumbnail: '',
        },
        title: '',
        subtitle: '',
        authors: [],
        categories: [],
        publisher: '',
        pageCount: '',
        description: '',
    };
    accessInfo = {
        webReaderLink: ''
    };
    saleInfo = {
        buyLink: ''
    };

    // Add finishedDate field
    finishedDate = null;

    // Getter for type
    get type() {
        return Book.type;
    }

    // Thumbnail for the book image
    get thumbnail() {
        return this.volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '');
    }

    // Method to convert a book instance into a Firestore-compatible format
    toFirestore() {
        return {
            id: this.id,
            title: this.volumeInfo.title,
            subtitle: this.volumeInfo.subtitle,
            authors: this.volumeInfo.authors,
            categories: this.volumeInfo.categories,
            publisher: this.volumeInfo.publisher,
            pageCount: this.volumeInfo.pageCount,
            description: this.volumeInfo.description,
            thumbnail: this.thumbnail,
            buyLink: this.saleInfo.buyLink,
            webReaderLink: this.accessInfo.webReaderLink,
            finishedDate: this.finishedDate,
            readingStatus: this.readingStatus || 'reading',
        };
    }

    // Static method to create a Book instance from API data
    static fromApi(data) {
        const book = new Book();
        book.kind = data.kind || '';
        book.id = data.id || '';
        book.selfLink = data.selfLink || '';
        book.volumeInfo = {
            imageLinks: data.volumeInfo?.imageLinks || { thumbnail: '' },
            title: data.volumeInfo?.title || '',
            subtitle: data.volumeInfo?.subtitle || '',
            authors: data.volumeInfo?.authors || [],
            categories: data.volumeInfo?.categories || [],
            publisher: data.volumeInfo?.publisher || '',
            pageCount: data.volumeInfo?.pageCount || '',
            description: data.volumeInfo?.description || '',
        };
        book.accessInfo = {
            webReaderLink: data.accessInfo?.webReaderLink || ''
        };
        book.saleInfo = {
            buyLink: data.saleInfo?.buyLink || ''
        };
        // Set finishedDate if available in the data
        book.finishedDate = data.finishedDate || null;
        book.readingStatus = data.readingStatus || 'reading';
        return book;
    }
}