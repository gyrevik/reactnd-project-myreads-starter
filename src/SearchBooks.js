import React from 'react'
import SearchBooksBar from './SearchBooksBar'
import SearchBooksResults from './SearchBooksResults'

class SearchBooks extends React.Component {
    render() {
        const { booksFromSearch } = this.props;
        
        return (
            <div className="search-books">
                <SearchBooksBar onQueryChange={this.updateQuery}/>
                <SearchBooksResults 
                    booksFromSearch={booksFromSearch}
                    updateShelf={this.updateShelf}
                    handleBook={this.handleBook}/>
            </div>
        )
    }
}

export default SearchBooks