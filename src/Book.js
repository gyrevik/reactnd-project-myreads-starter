import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'

class Book extends Component {
    updateShelf = (shelf) => {
        if (this.props.value) {
            console.log(`calling update with 
                this.props.value.id: ${this.props.value.id}
                and shelf: ${shelf}`);

            BooksAPI.update(this.props.value, shelf).then((msg) => {
                console.log(`shelf update api result: 
                    currently reading: ${msg.currentlyReading && msg.currentlyReading.join(',')}
                    want to read: ${msg.wantToRead && msg.wantToRead.join(',')}
                    read: ${msg.read && msg.read.join(',')}`);
                //debugger;
            });
        }
        else
            console.log('this.props.value is undefined')
    }

    render() {
        console.log(`id: ${this.props.value.id}, shelf: ${this.props.value.shelf}, title: ${this.props.value.title}`)

        return (
            <li>
                <div className="book">
                    <div className="book-top">
                    <div className="book-cover" style={{ 
                        width: 128, 
                        height: 193, 
                        backgroundImage: `url(${this.props.value.imageLinks && this.props.value.imageLinks.thumbnail})`
                        }}>
                    </div>
                    <div className="book-shelf-changer">
                        <select defaultValue={this.props.value && this.props.value.shelf} 
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
                    <div className="book-title">id: {this.props.value.id}</div>
                    <div className="book-title">shelf: {this.props.value.shelf}</div>
                </div>
            </li>                
        );
    }
}

export default Book