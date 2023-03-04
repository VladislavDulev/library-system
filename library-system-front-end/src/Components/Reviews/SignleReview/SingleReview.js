import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { BASE_URL } from '../../../common/url';
import { Vote } from '../../../common/votes.enum';
import { useHistory } from 'react-router';

export default function Review({ username, userId, content, bookId, reviewId, book, setBook }) {
    const { user } = useContext(AuthContext);
    const history = useHistory();
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [vote, setVote] = useState({})

    useEffect(() => {
        fetch(`${BASE_URL}/api/users/${user.sub}/reviews/${reviewId}/vote`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })
        .then(r => r.json())
        .then(r => {
            if(!r[0]){
                setLiked(false);
                setDisliked(false);
            }else {
                setVote(r[1]);
                if(r[1].reaction === Vote.Like.reaction){
                    setLiked(true);
                    setDisliked(false);
                } else {
                    setLiked(false);
                    setDisliked(true);
                }
            }
        })

    }, [reviewId, user])

    const likeReview = () => {
        if(disliked){
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/${vote.id}`, {
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
                    setLiked(true);
                    setDisliked(false);
                    setVote(r);
                }
            })
        }else if(liked){
            console.log('changin vote')
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/${vote.id}`, {
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
                    setLiked(false);
                    setDisliked(false);
                }
            })
        } else {
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/`, {
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
                    setLiked(true);
                    setVote(r);
                }
            })
        }
    }

    const dislikeReview = () => {
        if(liked){
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/${vote.id}`, {
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
                    setLiked(false);
                    setDisliked(true);
                    setVote(r);
                }
            })
        }else if(disliked){
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/${vote.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            .then(r => r.json())
            .then(r => {
                console.log(r);
                if(!r.id || !r.reaction){
                    setError('Couldnt like/dislike the review')
                }else {
                    setLiked(false);
                    setDisliked(false);
                }
            })
        } else {
            fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes/`, {
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
                    setDisliked(true);
                    setVote(r);
                }
            })
        }
    }

    const deleteReview = () => {
        fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })
        .then(r => r.json())
        .then(r => {
            if (!r.id || !r.content) {
                setError('Couldnt delete review')
            } else {
                const bookWithoutReview = {...book};
                bookWithoutReview.reviews = bookWithoutReview.reviews.filter(e => e.id !== r.id);
                setBook(bookWithoutReview);
            }
        })
    }

    const redirectToEditReview = (bookId, reviewId) => {
        history.push(`/books/${bookId}/reviews/${reviewId}/edit`)
    }

    return (
        <div style={{textAlign: "left"}} className="panel panel-default">
            <hr></hr>
            <div className="panel-heading">
                <h4>User: {username}</h4>
            </div>
            <div className="panel-body">
                Review:
                <br />
                {content}
            </div>
            <Button variant={`${liked ? "secondary" : "green"}`} onClick={likeReview}>Upvote</Button>
            <Button variant={`${disliked ? "secondary" : "red"}`} onClick={dislikeReview}>Downvote</Button>
            { userId === user.sub && 
                <Button variant='error' style={{backgroundColor:'maroon', color:"white"}} onClick={deleteReview}>REMOVE</Button>
            }
            { userId === user.sub && 
                <Button variant='info' onClick={() => redirectToEditReview(bookId, reviewId)}>EDIT</Button>
            }
            { error && 
                <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
                    {error}
                </div>
            }
            <hr />
        </div>
    )
}