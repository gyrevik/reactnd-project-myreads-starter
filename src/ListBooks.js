import React from 'react'
//import Book from './Book'

// search on j and get JavaScript and JQuery from API with Want to Read selected
function ListBooks(props) {     
    return (
        <ol className="books-grid">          
        {
            props.books && props.books.length > 0 && (
                props.books.map((book) => (
                     <li key={book.id}>
                        <div className="book">
                            <div className="book-top">
                            <div className="book-cover" style={{ 
                                width: 128, 
                                height: 193, 
                                backgroundImage: `url(${book && book.imageLinks && book.imageLinks.thumbnail})`
                                }}>
                            </div>
                            <div className="book-shelf-changer">
                                <select defaultValue={book && book.shelf} 
                                    //onChange={(event) => props.updateShelf(event.target.value)}
                                    onChange={props.onChangeValue}>
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
                            <div className="book-title">id: {book.id}</div>
                            <div className="book-title">shelf: {book.shelf}</div>
                        </div>
                    </li>                
                ))
            )
        }
        </ol>
    )
}


export default ListBooks