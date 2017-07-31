import React, { Component } from 'react';

class Book extends Component {
    updateShelf = (shelf) => {
        if (shelf.length > 0) {
            /*BooksAPI.search(query, 20).then((books) => {
                this.setState({ books });
            });*/
        }
        console.log(`shelf: ${shelf}`);
        //debugger;
    }

    render() {
        return (
            <li>
                <div className="book">
                    <div className="book-top">
                    <div className="book-cover" style={{ 
                        width: 128, 
                        height: 193, 
                        backgroundImage: `url(${this.props.value.imageLinks.thumbnail})`
                        }}>
                    </div>
                    <div className="book-shelf-changer">
                        <select defaultValue={this.props.value.shelf} 
                             onChange={(event) => this.updateShelf(event.target.value)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    </div>
                    <div className="book-title">{this.props.value.title}</div>
                    <div className="book-authors">{this.props.value.authors && this.props.value.authors.join(', ')}</div>
                </div>
            </li>                
        );
    }
}

export default Book