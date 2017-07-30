import React, { Component } from 'react';
import { Link } from 'react-router-dom'
//import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import Book from './Book'

class SearchBooks extends Component {
    state = {
        books: [],
        query: ''
    }

    updateQuery = (query) => {
        this.setState({ query: query })
        console.log(query)

        if (query.length > 0) {
            BooksAPI.search(query, 20).then((books) => {
                //this.setState({ books });
                //debugger;
                //showingBooks = books.slice();
                this.setState({ books });
                debugger;
            });
            //showingBooks = books.slice();
        }
        else {
            //books.length = 0;
            //this.setState({ books: books });
        }
    }

    /*componentDidMount() {
        BooksAPI.getAll().then((books) => {
            this.setState({ books });
        })
    }*/

    render() {
        //debugger
        //let { query, books } = this.state;
        //let { query } = this.state;

        //let showingBooks = [];    //, showingBooksByTitle, showingBooksByAuthors
        //if (query) {
            //const match = new RegExp(escapeRegExp(query), 'i')
            //showingBooksByTitle = books.filter((book) => match.test(book.title))
            //showingBooksByAuthors = books.filter((book) => match.test(book.authors.join(' ')))
            //showingBooks = showingBooksByTitle.concat(showingBooksByAuthors)
            //showingBooks = showingBooksByTitle.filter(function(obj) { return showingBooksByAuthors.indexOf(obj) == -1; });

            /*
            if (query.length > 0) {
                BooksAPI.search(query, 20).then((books) => {
                    //this.setState({ books });
                    //debugger;
                    //showingBooks = books.slice();
                    this.setState({ books });
                    debugger;
                });
                //showingBooks = books.slice();
            }
            else {
                //books.length = 0;
                //this.setState({ books: books });
            }
            */
        //} 

        //console.log(`query length: ${query.length}`);
        //console.log(`books length: ${books.length}`);
        //console.log(`showingBooks length: ${showingBooks.length}`);
        //debugger;
        //showingBooks = books.slice();
        //debugger;
        
        return (
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
                    <ol className="books-grid"></ol>
                    query: {this.state.query}
                    {
                        //debugger;
                        this.state.books && this.state.books.length > 0 && (
                            this.state.books.map((book) => (
                                <Book key={book.id} value={book}/>
                            ))
                        )
                    }
                </div>
            </div>
        )
    }
}

export default SearchBooks