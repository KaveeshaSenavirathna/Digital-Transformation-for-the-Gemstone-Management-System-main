// SimpleStarRating.jsx - Clickable Star Rating Without Comments
import { useState } from 'react';
import '../Styles/StarRating.css';

const SimpleStarRating = ({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'medium',
  showValue = false 
}) => {
  const [hover, setHover] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const handleClick = (ratingValue) => {
    if (readonly) return;
    setCurrentRating(ratingValue);
    if (onRatingChange) {
      onRatingChange(ratingValue);
    }
  };

  const handleMouseEnter = (ratingValue) => {
    if (readonly) return;
    setHover(ratingValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHover(0);
  };

  const displayRating = hover || currentRating || rating;

  return (
    <div className={`simple-star-rating ${size} ${readonly ? 'readonly' : 'interactive'}`}>
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= displayRating ? 'filled' : 'empty'}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          </button>
        ))}
      </div>
      {showValue && (
        <span className="rating-value">
          {displayRating > 0 ? displayRating.toFixed(1) : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default SimpleStarRating;