import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
//import SearchBooksBar from './SearchBooksBar'
//import SearchBooksResults from './SearchBooksResults'
import SearchBooks from './SearchBooks'
import Shelf from './Shelf'
import './App.css'

class BooksApp extends React.Component {
    state = {
        booksFromSearch: [],
        booksAll: [],

        booksCurrentlyReading: [],
        booksWantToRead: [],
        booksRead: [],

        book: {},
        query: '',
        shelf: '',
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
                console.log(`got all books from API (${booksAll.length} books) and saved to sessionStorage and state`);                
            });
        }
        else {
            const booksAll = JSON.parse(sessionStorage.getItem("booksAll"));
            this.setState({ booksAll: booksAll});
            console.log(`got booksAll from sessionStorage (${booksAll.length} books) and saved it to state`);
            //this.listBooks(booksAll);
        }

        // See if we have a query value
        // (this will only happen if the page is accidentally refreshed -- not sure, see below link)
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
        if (sessionStorage.getItem("query")) {
            // Restore the contents of the text field
            this.updateQuery(sessionStorage.getItem("query"));
        }
    }

    listBooks = (array) => {
        for(let i = 0; i < array.length; i++) {
            console.log(`${i}) ${array[i].title}`);
        };
    }

    /**
    * @description Responds to query changes and loads new array from 
    *              search in API
    * @param {string} query
    */
    updateQuery = (query) => {
        console.log(`entered updateQuery(${query}), query length is ${query.length}`);
        let booksFromSearch = {};
        if (sessionStorage.getItem("query") === query) {
            booksFromSearch = JSON.parse(sessionStorage.getItem("booksFromSearch"));
            this.setState({ booksFromSearch: booksFromSearch }, () => { 
                console.log('loaded booksFromSearch from sessionStorage because query did not change');
            })
            console.log(`the query (${query}) has not changed. Exiting updateQuery`);
            return;
        }

        this.setState({ query: query });
        sessionStorage.setItem('query', query);

        if (query.length > 0) {
            console.log(`query changed and it's not empty so requerying API`);
            BooksAPI.search(query, 20).then((booksFromSearch) => {
                console.log('updating shelves in booksFromSearch');
                this.updateEmptyShelvesToNone(booksFromSearch);
                if (booksFromSearch !== this.state.booksFromSearch)
                    this.setState({ booksFromSearch });
                sessionStorage.setItem('booksFromSearch', JSON.stringify(booksFromSearch));
            });
        }
    }

    /**
    * @description Takes a shelf that has been selected in search or
    *              MyReads and saves it for access by handleBook.
    *              It updates a counter so that handleBook knows when
    *              to update a shelf. This is kind of hacky. Could not
    *              figure out how to make the shelf change event off the
    *              menu pass bookId in addition to the shelf string.
    * @param {object} shelfState
    */
    updateShelf = (shelfState) => {
        console.log(`updateShelf top: shelfState.target.value in updateShelf: ${shelfState.target.value}`);
        const book = this.state.book;
        console.log(`got ${book.title}, ${book.id} from state`);
        const shelf = shelfState.target.value;

        let bfs = this.state.booksFromSearch.slice();
        this.updateBookArray(bfs, shelf, book);
        this.setState({ booksFromSearch: bfs});
        
        sessionStorage.setItem('booksFromSearch', JSON.stringify(bfs));
        console.log('handleBook put search into storage and state after shelf update')
        
        let ba = this.state.booksAll.slice();
        if (!this.updateBookArray(ba, shelf, book)) {
            book.shelf = shelf;
            ba.push(book);
            this.setState({ booksAll: ba });
            console.log(`added book (${book.title}(${book.id})) to booksAll (array for shelves) and updated state`);
        }

        console.log('saving ba to sessionStorage booksAll key');
        sessionStorage.setItem('booksAll', JSON.stringify(ba));
    }

    /**
    * @description Updates the shelf for a book on a shelf change
    *              and uses sessionStorage to keep shelf state across
    *              browser refresh
    * @param {object} book
    */
    handleBook = (book) => {
        if (book === this.state.book) {
            console.log(`book has not changed, exiting handleBook`);
            return;
        }

        console.log(`entered handleBook (${book.title}, ${book.shelf}, ${book.id})`);
        console.log(`putting book (${book.title}(${book.id})) in sessionStorage`);
        //sessionStorage.setItem('book', JSON.stringify(book));

        console.log(`putting book in state`);
        this.setState({ book: book });
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
                console.log(`Updating shelf for ${book.title} to ${shelf}`);
                array[i].shelf = shelf;
                updatedBook = true;
            }
        }
        console.log(`updatedBook: ${updatedBook}`);

        return updatedBook;
    }

    updateEmptyShelvesToNone(array) {
        array.forEach(function(book) {
            (typeof book.shelf === 'undefined') && (book.shelf = 'none');
        }, this);
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
                    
                    
                    <SearchBooks onQueryChange={this.updateQuery}
                        booksFromSearch={booksFromSearch}
                        updateShelf={this.updateShelf}
                        handleBook={this.handleBook}/>
                    
                )}/>
              
                <Route exact path="/" render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <Shelf books={cr} shelfTitle='Currently Reading'
                                    updateShelf={this.updateShelf}
                                    handleBook={this.handleBook}/>
                                <Shelf books={wtr} shelfTitle='Want to Read'
                                    updateShelf={this.updateShelf}
                                    handleBook={this.handleBook}/>
                                <Shelf books={r} shelfTitle='Read'
                                    updateShelf={this.updateShelf}
                                    handleBook={this.handleBook}/>
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