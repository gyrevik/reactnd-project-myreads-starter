import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Book from './Book'
import './App.css'

class BooksApp extends React.Component {
    state = {
        booksFromSearch: [],
        booksForShelves: [],
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

    updateQuery = (query) => {
        this.setState({ query: query })
        console.log(query)
        //let { booksFromSearch } = this.state;

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
        console.log(this.state.booksFromSearch.length);
        console.log(this.state.booksFromSearch[0].id);
        //debugger;

        this.setState((state) => ({
            book: book
        }));

        console.log(this.state.booksFromSearch.length);
        console.log(this.state.booksFromSearch[0].id);
        //debugger;

        this.myState.book = book;

        console.log(`BookApp.handleBook -> this.state.book.id: ${this.state.book.id}`);
        console.log(`BookApp.handleBook -> this.state.book.shelf: ${this.state.book.shelf}`);
        console.log(`BookApp.handleBook -> this.state.shelfState: ${this.state.shelfState}`);
        
        console.log(`BookApp.handleBook -> this.myState.book.id: ${this.myState.book.id}`);
        console.log(`BookApp.handleBook -> this.myState.book.shelf: ${this.myState.book.shelf}`);
        console.log(`BookApp.handleBook -> this.myState.shelfState: ${this.myState.shelfState}`);

        let shelfUpdated = false;
        /*for (let b in this.state.booksFromSearch) {
            if (b.id === this.state.book.id) {
                console.log(`Updating shelf for ${this.state.book.title} from ${b.shelf} to ${this.state.book.shelfState}`);
                b.shelf = this.state.shelfState;
                //this.setState({ b.shelf: this.state.shelfState });
                shelfUpdated = true;
            }
        }*/

        console.log('*************************************************');
        console.log('myState code:')
        console.log(`shelf updated: ${shelfUpdated}`);

        shelfUpdated = false;
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
        console.log(this.state.booksFromSearch[0].id);
        for (let i = 0; i < booksFromSearch.length; i++)
          console.log(booksFromSearch[i].id);
        
        console.log(`myState.booksFromSearch.length: ${this.myState.booksFromSearch.length}`);
        console.log(this.myState.booksFromSearch.length);
        console.log(this.myState.booksFromSearch[0].id);
        //for (let b in this.myState.booksFromSearch) {
        for (let i = 0; i < this.myState.booksFromSearch.length; i++) {
            let currentBook = this.myState.booksFromSearch[i];
            console.log(`book id: ${currentBook.id}`);
            if (currentBook.id === this.myState.book.id) {
                console.log(`Updating shelf for ${currentBook.title} from ${currentBook.shelf} to ${this.myState.shelfState}`);
                currentBook.shelf = this.myState.shelfState;
                shelfUpdated = true;
            }
        }

        console.log(`shelf updated: ${shelfUpdated}`);

        /*
        BooksAPI.update(book.id, this.state.shelfState).then((msg) => {
            console.log(`shelf update api result: 
                currently reading: ${msg.currentlyReading && msg.currentlyReading.join(',')}
                want to read: ${msg.wantToRead && msg.wantToRead.join(',')}
                read: ${msg.read && msg.read.join(',')}`);
            //debugger;
        });
        */
    }

    render() {
        const { booksFromSearch } = this.state;
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
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">To Kill a Mockingbird</div>
                                  <div className="book-authors">Harper Lee</div>
                                </div>
                              </li>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 188, backgroundImage: 'url("http://books.google.com/books/content?id=yDtCuFHXbAYC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72RRiTR6U5OUg3IY_LpHTL2NztVWAuZYNFE8dUuC0VlYabeyegLzpAnDPeWxE6RHi0C2ehrR9Gv20LH2dtjpbcUcs8YnH5VCCAH0Y2ICaKOTvrZTCObQbsfp4UbDqQyGISCZfGN&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">Ender's Game</div>
                                  <div className="book-authors">Orson Scott Card</div>
                                </div>
                              </li>
                            </ol>
                          </div>





                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Want to Read</h2>
                          <div className="bookshelf-books">
                            <ol className="books-grid">
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=uu1mC6zWNTwC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73pGHfBNSsJG9Y8kRBpmLUft9O4BfItHioHolWNKOdLavw-SLcXADy3CPAfJ0_qMb18RmCa7Ds1cTdpM3dxAGJs8zfCfm8c6ggBIjzKT7XR5FIB53HHOhnsT7a0Cc-PpneWq9zX&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">1776</div>
                                  <div className="book-authors">David McCullough</div>
                                </div>
                              </li>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=wrOQLV6xB-wC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72G3gA5A-Ka8XjOZGDFLAoUeMQBqZ9y-LCspZ2dzJTugcOcJ4C7FP0tDA8s1h9f480ISXuvYhA_ZpdvRArUL-mZyD4WW7CHyEqHYq9D3kGnrZCNiqxSRhry8TiFDCMWP61ujflB&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">Harry Potter and the Sorcerer's Stone</div>
                                  <div className="book-authors">J.K. Rowling</div>
                                </div>
                              </li>
                            </ol>
                          </div>
                        </div>
                        <div className="bookshelf">
                          <h2 className="bookshelf-title">Read</h2>
                          <div className="bookshelf-books">
                            <ol className="books-grid">
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=pD6arNyKyi8C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70Rw0CCwNZh0SsYpQTkMbvz23npqWeUoJvVbi_gXla2m2ie_ReMWPl0xoU8Quy9fk0Zhb3szmwe8cTe4k7DAbfQ45FEzr9T7Lk0XhVpEPBvwUAztOBJ6Y0QPZylo4VbB7K5iRSk&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">The Hobbit</div>
                                  <div className="book-authors">J.R.R. Tolkien</div>
                                </div>
                              </li>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 174, backgroundImage: 'url("http://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE712CA0cBYP8VKbEcIVEuFJRdX1k30rjLM29Y-dw_qU1urEZ2cQ42La3Jkw6KmzMmXIoLTr50SWTpw6VOGq1leINsnTdLc_S5a5sn9Hao2t5YT7Ax1RqtQDiPNHIyXP46Rrw3aL8&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">Oh, the Places You'll Go!</div>
                                  <div className="book-authors">Seuss</div>
                                </div>
                              </li>
                              <li>
                                <div className="book">
                                  <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url("http://books.google.com/books/content?id=32haAAAAMAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72yckZ5f5bDFVIf7BGPbjA0KYYtlQ__nWB-hI_YZmZ-fScYwFy4O_fWOcPwf-pgv3pPQNJP_sT5J_xOUciD8WaKmevh1rUR-1jk7g1aCD_KeJaOpjVu0cm_11BBIUXdxbFkVMdi&source=gbs_api")' }}></div>
                                    <div className="book-shelf-changer">
                                      <select>
                                        <option value="none" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="book-title">The Adventures of Tom Sawyer</div>
                                  <div className="book-authors">Mark Twain</div>
                                </div>
                              </li>
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