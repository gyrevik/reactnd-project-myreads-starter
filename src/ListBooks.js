import React from 'react'
import Book from './Book'

function ListBooks(props) {     
    return (
        <ol className="books-grid">          
        {
            props.books && props.books.length > 0 && (
                props.books.map((book) => (
                    <Book key={book.id} value={book}/>
                ))
            )
        }
        </ol>
    )
}


export default ListBooks