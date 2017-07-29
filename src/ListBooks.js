import React, { Component } from 'react';
//import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
//import escapeRegExp from 'escape-string-regexp'

class ListBooks extends Component {
    static propTypes = {
        books: PropTypes.array.isRequired
    }

    state = {
        query: ''
    }

    render() {
        let { books } = this.props
        debugger
        return (
            <div>
                <div>'Book 1'</div>
                <div>'Book 2'</div>

                <div>
                    {
                        books.length > 0 && books[0].id
                    }
                </div>
            </div>
        )
    }
}

export default ListBooks