import React, { useState, useEffect, useContext } from 'react';
import SingleBook from '../SingleBook/SingleBook';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { CardColumns } from 'react-bootstrap';
import '../../Home/Home.css';
import { BASE_URL } from '../../../common/url';



const BorrowedUserBooks = ({ history }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const { isLoggedIn, user } = useContext(AuthContext);

  const deleteBook = (id) => {
    fetch(`${BASE_URL}/api/admin/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
    }})
    .then(r => r.json())
    .then(result => {
      if (!result.id || !result.title || !result.content) {
          setError("Couldn't create book, something happened");
      }else{
        fetch(`${BASE_URL}/api/${user.sub}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        .then(r => r.json())
        .then(result => {
        if (!result.id || !result.title || !result.content) {
            setError("Couldn't get book, it doesnt exist");
        }else{
            setBooks(books);
        }})
      }
  })
  }


  useEffect(() => {
    if(!isLoggedIn) {
      history.pushState('/home')
    }else{
      fetch(`${BASE_URL}/api/users/${user.sub}/books`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
        .then(r => r.json())
        .then(books => {
          if (!Array.isArray(books)) {
            setError("Couldn't get user books")
          }else {
              setBooks(books);
          }
        })
      }

  }, [isLoggedIn, history, user]);

  const booksComponent = !(books.length) ? 
  <div className='home'>
    <h1 className={"title"}>You have currently no borrowed books</h1>
  </div> :
  books.map(b => <SingleBook book={b} key={b.id} deleteBook={deleteBook}/>)

  return (
    <CardColumns style={{position:"relative", gridColumn:"-moz-initial"}}>
      {error ?
       <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
            {error}
      </div> : booksComponent
      }
    </CardColumns>
  );
}

export default BorrowedUserBooks;
