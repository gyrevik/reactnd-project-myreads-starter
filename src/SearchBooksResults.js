import React from 'react'
import Book from './Book'

/**
* @description Contains the search grid
* @param {object} booksFromSearch - The array of books to display
*/
class SearchBooksResults extends React.Component {     
    render () {  
        const { booksFromSearch } = this.props;
        
        return (                             
            <div className="search-books-results">
                <ol className="books-grid">          
                {
                    booksFromSearch && booksFromSearch.length > 0 && (
                        booksFromSearch.map((book) => (
                            <Book key={book.id} book={book}
                                onChangeValue={this.props.updateShelf}
                                onClickBook={this.props.handleBook}
                            />
                        ))
                    )
                }
                </ol>
            </div>
        )
    }
}

export default SearchBooksResults