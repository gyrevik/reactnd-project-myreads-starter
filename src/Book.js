import React from 'react';

function Book(props) {
    return (
        <div>
            <div>
                book id: {props.value.id}
            </div>
            <div>
                book title: {props.value.title}
            </div>
            <div>
                book authors: {props.value.authors}
            </div>
            <div>
                book shelf: {props.value.shelf}
            </div>
            <div>&nbsp;</div>
        </div>
    );
}

export default Book