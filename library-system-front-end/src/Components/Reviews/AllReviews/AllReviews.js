import React from 'react';
import Review from '../SignleReview/SingleReview';
import CreateReview from '../CreateReview/CreateReview';

export default function AllReviews({ book, setBook, reviews, bookId }) {
    return (
    <div className="reviewsList">
        <CreateReview book={book} setBook={setBook} bookId={bookId}/>
        {reviews.map(function(review, index) {
            return <Review key={index} book={book} setBook={setBook} reviewId={review.id} bookId={bookId} userId={review.user.id} username={review.user.username} content={review?.content} />;
        })}
    </div>
    );
}