import React, { useContext, useState, useEffect } from "react";
import { BASE_URL } from "../../../common/url";
import AuthContext, { getToken } from "../../../providers/AuthContext";
import { Limits } from "../../../common/limits.enum";

const CreateReview = ({ bookId, book, setBook }) => {
 
  const { user }= useContext(AuthContext);

  const [hasReview, setHasReview] = useState(false)

  const [error, setError] = useState(null);

  const [reviewContent, setReviewContent] = useState({
    content:{
      value:'',
      touched:false,
      valid:false
    }
  })

  const updateReview = (prop, value) => setReviewContent({
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
  .reduce((isValid, prop) => isValid && reviewContent[prop].valid && reviewContent[prop].touched , true);


  const getClassNames = (prop) => {
    console.log('in get class name')
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

  const writeReview = (e) => {
    e.preventDefault();
    setError(null);
    fetch(`${BASE_URL}/api/books/${bookId}/reviews`, {
      method:'POST',
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
        setHasReview(true);
        const newBook = {...book};
        newBook.reviews = [...book.reviews, r];
        setBook(newBook)
      }
    })
  }

  useEffect(() => {
    console.log(bookId)
    fetch(`${BASE_URL}/api/users/${user.sub}/reviews`, {
      method:'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    })
    .then(r => r.json())
    .then(r => {
      if (!Array.isArray(r)) {
          setError('Couldnt check if user has a review');
      } else {
        Boolean(r.find(e => +e.book.id === +bookId))? setHasReview(true): setHasReview(false)
      }
    })
  }, [setHasReview, setError])


  if(error) {
    return (
      <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
        {error}
      </div>
    )
  }


  return (
      <div className="commentForm panel panel-default" hidden={hasReview}>
        <div className="panel-body">
          <form className="form" >
            <input className={`form-control ${getClassNames('content')}`} type="text" placeholder="Your review here" value={reviewContent.content.value} onChange={(e) => updateReview('content', e.target.value)} /><br/>
            <input className="btn btn-default" type="submit" disabled={validateForm()} value="Write review" onClick={writeReview}/>
          </form>
        </div>
      </div>
  );
};
 
export default CreateReview;