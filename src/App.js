import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import SearchBooksBar from './SearchBooksBar'
import Book from './Book'
import './App.css'

class BooksApp extends React.Component {
    state = {
        booksFromSearch: [],
        booksAll: [],

        booksCurrentlyReading: [],
        booksWantToRead: [],
        booksRead: [],

        query: '',
        book: {},
        shelfState: '',

        shelfUpdateCounter: 0,
        handleBookCounter: 0
    }

    /**
    * @description Initiates array with all books for main page
    *              Uses sessionStorage to persist search across
    *              browser refresh
    */
    componentDidMount() {
        console.log('getting all books')  
        if (!sessionStorage.getItem("booksAll")) {
            BooksAPI.getAll().then((booksAll) => {
                this.setState({ booksAll });

                sessionStorage.setItem('booksAll', JSON.stringify(booksAll));
                console.log('got all books');
                console.log(`booksAll.length: ${booksAll.length}`);
            });
        }
        else {
            const booksAll = JSON.parse(sessionStorage.getItem("booksAll"));
            this.setState({ booksAll: booksAll});
        }

        // See if we have a query value
        // (this will only happen if the page is accidentally refreshed -- not sure, see below link)
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
        if (sessionStorage.getItem("query")) {
            // Restore the contents of the text field
            this.updateQuery(sessionStorage.getItem("query"));
        }
    }

    /**
    * @description Responds to query changes and loads new array from 
    *              search in API
    * @param {string} query
    */
    updateQuery = (query) => {
        this.setState({ query: query })
        sessionStorage.setItem('query', query);

        if (query.length > 0) {
            BooksAPI.search(query, 20).then((booksFromSearch) => {
                if (booksFromSearch !== this.state.booksFromSearch)
                    this.setState({ booksFromSearch });
            });

            console.log(this.state.booksFromSearch.length);
        }
    }

    /**
    * @description Takes a shelf that has been selected in search or
    *              MyReads and saves it for access by handleBook.
    *              It updates a counter so that handleBook knows when
    *              to update a shelf. This is kind of hacky. Could not
    *              figure out how to make the shelf change event off the
    *              menu pass bookId in addition to the shelf string.
    * @param {string} shelf
    */
    updateShelf = (shelf) => {
        console.log(`App.js: shelf.target.value in updateShelf: ${shelf.target.value}`);
        const value = shelf.target.value;

        this.setState((state) => ({
            shelfState: value
        }));

        this.setState((state) => ({
            shelfState: value
        }));

        let hbc = this.state.handleBookCounter;
        this.setState((state) => ({
            handleBookCounter: ++hbc
        }));

        this.setState((state) => ({
            shelfUpdateCounter: hbc
        }));

        console.log(`BookApp.updateShelf -> this.state.shelfState: ${this.state.shelfState}`);
    }

    /**
    * @description Updates the shelf for a book on a shelf change
    *              and uses sessionStorage to keep shelf state across
    *              browser refresh
    * @param {object} book
    */
    handleBook = (book) => {
        console.log(`BookApp.handleBook book.id: ${book.id}`);
        const shelfState = this.state.shelfState;
        if (shelfState === '') {
            console.log('empty shelfState in handleBook. May be initial click on menu control. Exiting handleBook event handler');
            return;
        }

        this.setState((state) => ({
            book: book
        }));
        
        let hbc = this.state.handleBookCounter;
        this.setState((state) => ({
            handleBookCounter: ++hbc
        }));

        if (hbc !== this.state.shelfUpdateCounter) {
            console.log('shelf has not been updated so will not update book');
            return;
        } else {
            console.log('shelf has been updated so will update book');
        }

        this.updateBookArray(this.state.booksFromSearch, this.state.shelfState, book);
        
        if (!this.updateBookArray(this.state.booksAll, this.state.shelfState, book)) {
            let ba = this.state.booksAll.slice();
            ba.push(book);
            this.setState((state) => ({
              booksAll: ba
            }));

            console.log('added book');
        }

        sessionStorage.setItem('booksAll', JSON.stringify(this.state.booksAll));
    }

    /**
    * @description Takes an array of books and updates the appropriate book
    *              in the array based on book.id and the shelf argument
    * @param {Array} array
    * @param {string} shelf
    * @param {object} book
    * @returns {Boolean}
    */
    updateBookArray(array, shelf, book) {
        if (!array)
            return;

        console.log(`array.length: ${array.length}, shelf: ${shelf}, bookId: ${book.id}`);
        let updatedBook = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === book.id) {
                console.log(`Updating shelf for book id ${book.id} to ${shelf}`);
                array[i].shelf = shelf;
                updatedBook = true;
            }
        }
        console.log(`updatedBook: ${updatedBook}`);

        return updatedBook;
    }

    /**
    * @description Renders MyReads or Search based on Route.
    *              Chops up books from the getAll API call into three
    *              arrays for the shelves. Uses a Book component to
    *              render books.
    * @returns {string}
    */
    render() {
        const { booksAll, booksFromSearch } = this.state;

        let cr = this.state.booksAll.filter(function(book) {
            return book.shelf === 'currentlyReading';
        })

        let wtr = booksAll.filter(function(book) {
            return book.shelf === 'wantToRead';
        })

        let r = booksAll.filter(function(book) {
            return book.shelf === 'read';
        })

        return (
            <div className="app">
                <Route path="/search" render={() => (
                    <div className="search-books">
                        <SearchBooksBar onQueryChange={this.updateQuery}/>
                        <div className="search-books-results">
                            <ol className="books-grid">          
                            {
                                booksFromSearch && booksFromSearch.length > 0 && (
                                    booksFromSearch.map((book) => (
                                        <Book key={book.id} book={book}
                                            onChangeValue={this.updateShelf}
                                            onClickBook={this.handleBook}
                                        />
                                    ))
                                )
                            }
                            </ol>
                        </div>
                    </div>
                )}/>
              
                <Route exact path="/" render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Currently Reading</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                        {
                                            cr && cr.length > 0 && (
                                                cr.map((book) => (
                                                    <Book key={book.id} book={book}
                                                        onChangeValue={this.updateShelf}
                                                        onClickBook={this.handleBook}
                                                        onChangeShelf={this.changeShelf}
                                                    />
                                                ))
                                            )
                                        }
                                        </ol>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">  
                                        {
                                            wtr && wtr.length > 0 && (
                                                wtr.map((book) => (
                                                    <Book key={book.id} book={book}
                                                        onChangeValue={this.updateShelf}
                                                        onClickBook={this.handleBook}
                                                        onChangeShelf={this.changeShelf}
                                                    />
                                                ))
                                            )
                                        }
                                        </ol>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <div className="bookshelf-books">
                                        <ol className="books-grid">
                                        {
                                            r && r.length > 0 && (
                                                r.map((book) => (
                                                    <Book key={book.id} book={book}
                                                        onChangeValue={this.updateShelf}
                                                        onClickBook={this.handleBook}
                                                        onChangeShelf={this.changeShelf}
                                                    />
                                                ))
                                            )
                                        }
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="open-search">
                            <Link to="/search" className="open-search">Add a book</Link>
                        </div>
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp