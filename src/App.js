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

    componentDidMount() {    
        BooksAPI.getAll().then((booksAll) => {
            this.setState({ booksAll });

            console.log(`booksAll.length: ${booksAll.length}`);
        });
            
        //this.setState({ booksCurrentlyReading: cr });
        //this.setState({ booksWantToRead: wtr });
        //this.setState({ booksRead: r });
    }

    updateQuery = (query) => {
        this.setState({ query: query })

        if (query.length > 0) {
            BooksAPI.search(query, 20).then((booksFromSearch) => {
                this.setState({ booksFromSearch });
            });
        }

        console.log(this.state.booksFromSearch.length);
        //debugger;
    }

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
        //debugger;
    }

    handleBook = (book) => {
        console.log(`BookApp.handleBook book.id: ${book.id}`);
        let booksFromSearch = this.state.booksFromSearch;

        this.setState((state) => ({
            book: book
        }));

        this.myState.book = book;

        console.log(`BookApp.handleBook -> this.state.book.id: ${this.state.book.id}`);
        console.log(`BookApp.handleBook -> this.state.book.shelf: ${this.state.book.shelf}`);
        console.log(`BookApp.handleBook -> this.state.shelfState: ${this.state.shelfState}`);
        
        console.log(`BookApp.handleBook -> this.myState.book.id: ${this.myState.book.id}`);
        console.log(`BookApp.handleBook -> this.myState.book.shelf: ${this.myState.book.shelf}`);
        console.log(`BookApp.handleBook -> this.myState.shelfState: ${this.myState.shelfState}`);

        //let shelfUpdated = false;
        console.log('*************************************************');
        console.log('myState code:')
        //console.log(`shelf updated: ${shelfUpdated}`);

        //shelfUpdated = false;
        this.myState.booksFromSearch = this.state.booksFromSearch.slice();
        //debugger;
        if (++this.myState.handleBookCounter !== this.myState.shelfUpdateCounter) {
            console.log('shelf has not been updated so will not update book');
            return;
        } else {
            console.log('shelf has been updated so will update book');
        }

        //debugger;
        console.log(`books in state.booksFromSearch:`);
        console.log(this.state.booksFromSearch.length);
        //for (let i = 0; i < booksFromSearch.length; i++)
        //  console.log(booksFromSearch[i].id);
        
        console.log(`myState.booksFromSearch.length: ${this.myState.booksFromSearch.length}`);
        console.log(this.myState.booksFromSearch.length);
        
        /*for (let i = 0; i < this.myState.booksFromSearch.length; i++) {
            let currentBook = this.myState.booksFromSearch[i];
            if (currentBook.id === this.myState.book.id) {
                console.log(`Updating shelf for ${currentBook.title} from ${currentBook.shelf} to ${this.myState.shelfState}`);
                currentBook.shelf = this.myState.shelfState;
                //shelfUpdated = true;
            }
        }*/

        console.log('before updateBookArray');
        this.updateBookArray(this.myState.booksFromSearch, this.myState.shelfState, book.id);
        console.log('after updateBookArray');
    }

    updateBookArray(array, shelf, bookId) {
        console.log(`array.length: ${array.length}, shelf: ${shelf}, bookId: ${bookId}`);
        let updatedBook = false;
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === bookId) {
                console.log(`Updating shelf for book id ${bookId} to ${shelf}`);
                array[i].shelf = shelf;
                updatedBook = true;
            }
        }
        console.log(`updatedBook: ${updatedBook}`);
    }

    render() {
        const { booksFromSearch, booksCurrentlyReading, booksWantToRead, booksRead } = this.state;
        console.log(`this.state.booksAll.length: ${this.state.booksAll.length}`);

        let cr = this.state.booksAll.filter(function(book) {
            return book.shelf === 'currentlyReading';
        })

        let wtr = this.state.booksAll.filter(function(book) {
            return book.shelf === 'wantToRead';
        })

        let r = this.state.booksAll.filter(function(book) {
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
                                    value={this.state.query}
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