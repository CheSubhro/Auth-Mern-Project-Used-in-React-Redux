import React from 'react';
import './Card.css'; 

const Card = ({ title, description ,thumbnail }) => {
    return (
        <>
            <div className="card">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
                <img className='card-image' src={thumbnail} alt={title} />
            </div>
        </>
    )
}

export default Card