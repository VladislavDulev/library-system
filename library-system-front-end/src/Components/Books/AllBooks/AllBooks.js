import React, { useState, useEffect, useContext } from 'react';
import SingleBook from '../SingleBook/SingleBook';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { CardColumns } from 'react-bootstrap';
import '../../Home/Home.css';
import { BASE_URL } from '../../../common/url';



const AllBooks = ({ history }) => {
  const [books, setBooks] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoggedIn } = useContext(AuthContext);

  const deleteBook = (id) => {
    fetch(`${BASE_URL}/api/admin/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
    }})
    .then(r => r.json())
    .then(result => {
      console.log(result)
      if (!result.isDeleted) {
        console.log(result.isDeleted)
        setError("Couldn't create book, something happened");
      }else{
        fetch(`${BASE_URL}/api/books`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
          .then(r => r.json())
          .then(result => {
            if (!Array.isArray(result)) {
              setError("Couldn't get books, it doesnt exist");
            }else{
              setBooks(result);
            }})
      }
  })
  }


  useEffect(() => {
    if(!isLoggedIn) {
      history.pushState('/home')
    }else{
      fetch(`${BASE_URL}/api/books`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
        .then(r => r.json())
        .then(books => {
          if (books.error) {
            throw new Error(books.message);
          }
          setBooks(books);
        })
        .catch(error => alert(error.message))
        // .finally(() => setLoading(false));
      }

  }, [isLoggedIn, history]);

  const booksComponent = !(books.length) ? 
  <div className='home'>
    <h1 className={"title"}>There are currently no books in the library</h1>
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

export default AllBooks;
