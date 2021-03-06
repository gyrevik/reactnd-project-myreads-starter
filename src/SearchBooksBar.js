import React from 'react'
import { Link } from 'react-router-dom'
//import { Throttle } from 'react-throttle';
//import { Debounce } from 'react-throttle';

class SearchBooksBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleQuery = this.handleQuery.bind(this);
    }

    handleQuery(e) {
        this.props.onQueryChange(e.target.value);
    }

    render() {
        return (
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

                    {/*Debounce and Throttle don't seem to work here*/}
                    {/*<Debounce time="200" handler="onChange">*/}
                        <input 
                            type="text" 
                            placeholder="Search by title or author"
                            //value={this.state.query}
                            value={sessionStorage.getItem("query") || ''}
                            //onChange={(event) => this.handleQuery(event.target.value)}
                            onChange={this.handleQuery}
                        />
                    {/*</Debounce>*/}
                </div>
            </div>
        )
    }
}

export default SearchBooksBar