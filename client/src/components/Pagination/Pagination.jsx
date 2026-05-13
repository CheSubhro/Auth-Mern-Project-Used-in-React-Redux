import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    const handleClick = (page) => {
        onPageChange(page);
    };

    return (
        <>
            <div className="pagination">
                <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{currentPage}</span> / <span>{totalPages}</span>
                <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </>
    )
}

export default Pagination