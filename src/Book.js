import React from 'react';

function Book(props) {
    return (
        <li>
            <div className="book">
                <div className="book-top">
                <div className="book-cover" style={{ 
                    width: 128, 
                    height: 193, 
                    backgroundImage: `url(${props.value.imageLinks.thumbnail})`
                    }}>
                </div>
                <div className="book-shelf-changer">
                    <select defaultValue={props.value.shelf}>
                        <option value="none" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
                </div>
                <div className="book-title">{props.value.title}</div>
                <div className="book-authors">{props.value.authors && props.value.authors.join(', ')}</div>
                <div>{}</div>
            </div>
        </li>                
    );
}

export default Book