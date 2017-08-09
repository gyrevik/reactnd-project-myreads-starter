import React from 'react'
import Book from './Book'

/**
* @description Contains the shelf data
* @param {object} books - The array of books to display
*/
class Shelf extends React.Component {     
    render () {  
        const { books, shelfTitle } = this.props;
        
        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{shelfTitle}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                    {
                        books && books.length > 0 && (books.map((book) => (
                            <Book key={book.id + '-' + book.title +'-'+ book.shelf} book={book}
                                onChangeValue={this.props.updateShelf}
                                onClickBook={this.props.handleBook}
                            />
                        )))
                    }
                    </ol>
                </div>
            </div>
        )
    }
}

export default Shelf