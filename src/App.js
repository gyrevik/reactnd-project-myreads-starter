import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
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
        shelfState: ''
    }

    myState = {
        booksFromSearch: [],
        booksForShelves: [],
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
        BooksAPI.getAll().then((booksAll) => {
            this.setState({ booksAll });

            console.log('got all books');
            console.log(`booksAll.length: ${booksAll.length}`);
        });

        // See if we have a query value
        // (this will only happen if the page is accidentally refreshed -- not sure, see below link)
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
        if (sessionStorage.getItem("query")) {
            // Restore the contents of the text field
            //field.value = sessionStorage.getItem("autosave");
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

        this.myState.shelfState = value;
        this.myState.shelfUpdateCounter = this.myState.handleBookCounter + 1;

        console.log(`BookApp.updateShelf -> this.state.shelfState: ${this.state.shelfState}`);
        console.log(`BookApp.updateShelf -> this.myState.shelfState: ${this.myState.shelfState}`);
    }

    /**
    * @description Updates the shelf for a book on a shelf change
    * @param {object} book
    */
    handleBook = (book) => {
        console.log(`BookApp.handleBook book.id: ${book.id}`);

        this.setState((state) => ({
            book: book
        }));

        this.myState.book = book;

        this.myState.booksFromSearch = this.state.booksFromSearch.slice();
        this.myState.booksAll = this.state.booksAll.slice();
        
        if (++this.myState.handleBookCounter !== this.myState.shelfUpdateCounter) {
            console.log('shelf has not been updated so will not update book');
            return;
        } else {
            console.log('shelf has been updated so will update book');
        }

        console.log(`books in state.booksFromSearch:`);
        console.log(this.state.booksFromSearch.length);
        
        console.log(`myState.booksFromSearch.length: ${this.myState.booksFromSearch.length}`);
        console.log(this.myState.booksFromSearch.length);

        this.updateBookArray(this.myState.booksFromSearch, this.myState.shelfState, book);
        
        if (!this.updateBookArray(this.myState.booksAll, this.myState.shelfState, book)) {
            this.myState.booksAll.push(book);
            console.log('added book');
        }
        
        this.setState((booksFromSearch) => ({ 
            booksFromSearch: this.myState.booksFromSearch
        }));

        this.setState((booksAll) => ({ 
            booksAll: this.myState.booksAll
        }));
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
                        <div className="search-books-bar">
                            <Link to="/" className="close-search">Close</Link>
                            <div className="search-books-input-wrapper">
                                {/* 
                                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                                You can find these search terms here:
                                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
                                
                                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                                you don't find a specific author or title. Every search is limited by search terms.
                                */}
                                <input 
                                    type="text" 
                                    placeholder="Search by title or author"
                                    //value={this.state.query}
                                    value={sessionStorage.getItem("query") || ''}
                                    onChange={(event) => this.updateQuery(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className="books-grid">          
                            {
                                booksFromSearch && booksFromSearch.length > 0 && (
                                    booksFromSearch.map((book) => (
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