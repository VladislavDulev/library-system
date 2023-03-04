import React, { useEffect, useState, useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BASE_URL } from '../../../common/url';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import AllReviews from '../../Reviews/AllReviews/AllReviews';
import { Vote } from '../../../common/votes.enum';


export default function DetailsBook({ history, match, location }) {
    const { user } = useContext(AuthContext);

    const [error, setError] = useState(null);
    const [likedBook, setLikedBook] = useState(false);
    const [dislikedBook, setDislikedBook] = useState(false);
    const [bookVote, setBookVote] = useState({});

    const [book, setBook] = useState({
        coverURL:"",
        title:"",
        content:"",
        isBorrowed: false,
        borrower: {
            id:null
        },
        reviews:[]
    });

    useEffect(() => {
        fetch(`${BASE_URL}/api/books/${match.params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }})
            .then(r => r.json())
            .then(result => {
                if (!result.id || !result.title || !result.content) {
                    setError("Couldn't get book, it doesnt exist");
                }else{
                    setBook(result);
                    
                    const vote = result.bookVotes.find(e => e.user.id === user.sub);
                    console.log(vote);
                    if (vote) {
                        setBookVote(vote);
                        if(vote.reaction === Vote.Like.reaction) {
                            setLikedBook(true);
                        } else {
                            setDislikedBook(true);
                        }
                    }
                }
            })
    }, [])
    
    const borrowBook = (bookId) => {
        fetch(`${BASE_URL}/api/books/${bookId}/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }})
            .then(r => r.json())
            .then(result => {
                if (!result.id || !result.title || !result.coverURL) {
                    setError("Couldn't get book, it doesnt exist");
                }else{
                    setBook(result);
                }
            })
    }

    const returnBook = (bookId) => {
        fetch(`${BASE_URL}/api/books/${bookId}/borrow`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            }})
            .then(r => r.json())
            .then(result => {
                if (!result.id || !result.title || !result.content) {
                    setError("Couldn't get book, it doesnt exist");
                }else{
                    setBook(result);
                }
            })
    }

    const likeBook = () => {
        if(dislikedBook){
            fetch(`${BASE_URL}/api/books/${book.id}/votes/${bookVote.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(Vote.Like)
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLikedBook(true);
                    setDislikedBook(false);
                    setBookVote(r);
                }
            })
        }else if(likedBook){
            fetch(`${BASE_URL}/api/books/${book.id}/votes/${bookVote.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLikedBook(false);
                    setDislikedBook(false);
                }
            })
        } else {
            fetch(`${BASE_URL}/api/books/${book.id}/votes/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(Vote.Like)
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLikedBook(true);
                    setBookVote(r);
                }
            })
        }
    }

    const dislikeBook = () => {
        if(likedBook){
            fetch(`${BASE_URL}/api/books/${book.id}/votes/${bookVote.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(Vote.Dislike)
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLikedBook(false);
                    setDislikedBook(true);
                    setBookVote(r);
                }
            })
        }else if(dislikedBook){
            fetch(`${BASE_URL}/api/books/${book.id}/votes/${bookVote.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLikedBook(false);
                    setDislikedBook(false);
                }
            })
        } else {
            fetch(`${BASE_URL}/api/books/${book.id}/votes/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(Vote.Dislike)
            })
            .then(r => r.json())
            .then(r => {
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setDislikedBook(true);
                    setBookVote(r);
                }
            })
        }
    }

    return (
        <Card className='mx-auto'>
        <Card.Img style={{ maxWidth: '25em' }} className='mx-auto' variant="top" src={book?.coverURL} />
        <Card.Body>
            <Card.Title>{book?.title}</Card.Title>
            <Card.Text>{book?.content}</Card.Text>
            {
                book?.isBorrowed &&
                Boolean(book?.borrower) &&
                book?.borrower?.id === user.sub && 
                <Button variant="dark" onClick={() => returnBook(book?.id)}>Return book</Button>
            }
            {
                book?.borrower?.id !== user.sub &&
                <Button variant="dark" disabled={book?.isBorrowed} onClick={() => borrowBook(book?.id)}>Boorow</Button>
            }
            <Button variant={`${likedBook ? 'secondary' : 'green'}`} onClick={likeBook}>Upvote</Button>
            <Button variant={`${dislikedBook ? 'secondary' : 'red'}`} onClick={dislikeBook}>Downvote</Button>
            <hr></hr>
            <Card.Title>Reviews</Card.Title>
            <AllReviews className='mx-left' setBook={setBook} book={book} reviews={book?.reviews} bookId={match.params.id} />
        </Card.Body>
        <div className="alert alert-danger" hidden={!error} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
            {error}
        </div>
        </Card>
    )
}