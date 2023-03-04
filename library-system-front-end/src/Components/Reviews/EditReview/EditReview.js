import React, { useState, useEffect } from 'react';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { BASE_URL } from '../../../common/url';
import { Limits } from '../../../common/limits.enum';

export default function EditReview({ history, match, location }){
    const bookId = match.params.bookId;
    const reviewId = match.params.reviewId;

    const [hasReview, setHasReview] = useState(false)
  
    const [error, setError] = useState(null);
  
    const [reviewContent, setReviewContent] = useState({
      content:{
        value:'',
        touched:false,
        valid:false
      }
    })
  
    const updateReviewContent = (prop, value) => setReviewContent({
      ...reviewContent,
      [prop]:{
        value:value,
        touched: true,
        valid: reviewValidators[prop].reduce((isValid, validFunc) => isValid && (typeof validFunc(value) !== 'string'), true)
      }
    });
  
    const reviewValidators = {
      content:[
        value => value?.length <= Limits.MAX_REVIEW_LENGTH || `Review must be less than ${Limits.MAX_REVIEW_LENGTH} characters`,
        value => value?.length >= Limits.MIN_REVIEW_LENGTH || `Review must be more than ${Limits.MIN_REVIEW_LENGTH} characters`,
      ]
    }
  
    const validateForm = () => !Object
        .keys(reviewContent)
        .reduce((isValid, prop) => isValid && reviewContent[prop].valid , true);
  
    const getValidationErrors = (prop) => {
        return reviewValidators[prop]
            .map(validatorFn => validatorFn(reviewContent[prop].value)) 
            .filter(value => typeof value === 'string');
    };
  
    const getClassNames = (prop) => {
      let classes = '';
      if (reviewContent[prop].touched) {
        classes += 'touched '
      }
      if (reviewContent[prop].valid) {
        classes += 'is-valid ';
      } else {
        classes += 'is-invalid ';
      }
  
      return classes;
    };
  
    const updateReview = (e) => {
      e.preventDefault();
      setError(null);
      fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content: reviewContent.content.value
        })
      })
      .then(r => r.json())
      .then(r => {
        if(!r.id || !r.content) {
          setError("Couldn't post review, try again")
        }else {
            history.push(`/books/${bookId}`)
        }
      })
    }
  
    useEffect(() => {
      fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
        method:'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        }
      })
      .then(r => r.json())
      .then(r => {
        if (!r.id || !r.content) {
            setError('Couldnt the review');
        } else {
            setReviewContent({
                content: {
                    value: r.content,
                    touched: false,
                    valid: reviewValidators.content.reduce((isValid, validatorFn) => isValid && (typeof validatorFn(r.content) !== 'string'), true)
                }
            })
        }
      })
    }, [setHasReview, setError])
  
    return (
        <div className="commentForm panel panel-default" hidden={hasReview}>
          <div className="panel-body">
            <form className="form" >
              <input className={`form-control ${getClassNames('content')}`} type="text" placeholder="Your review here" value={reviewContent.content.value} onChange={(e) => updateReviewContent('content', e.target.value)} /><br/>
              <input className="btn btn-default" type="submit" disabled={validateForm()} value="Write review" onClick={updateReview}/>
            </form>
          </div>
          <div className="alert alert-danger" hidden={!validateForm()} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
            {Object.keys(reviewContent).map(key => getValidationErrors(key)).join('\n')}
            {error}
          </div>
        </div>
    );
}