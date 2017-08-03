import React from 'react'

/**
* @description Represents a book
* @param {object} book - The book object to render
*/
class Book extends React.Component {     
    render () {  
        const { book, onClickBook } = this.props;
        
        return (     
            <li key={book.id} onClick={() => onClickBook(book)}>
                <div className="book">
                    <div className="book-top">
                    <div className="book-cover" style={{ 
                        width: 128, 
                        height: 193, 
                        backgroundImage: `url(${book && book.imageLinks && book.imageLinks.thumbnail})`
                        }}>
                    </div>
                    <div className="book-shelf-changer">
                        <select 
                            defaultValue={book && book.shelf} 
                            onChange={this.props.onChangeValue}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{book.authors && book.authors.join(', ')}</div>
                </div>
            </li>
        ) 
    }
}


export default Book