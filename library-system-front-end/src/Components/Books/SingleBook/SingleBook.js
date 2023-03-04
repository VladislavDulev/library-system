import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthContext from '../../../providers/AuthContext';
import { Card, Button } from 'react-bootstrap';
import './SingleBook.css'


const SingleBook = ({history, match, location, book, deleteBook}) => {
  const { isAdmin } = useContext(AuthContext);
  

  
  const redirectToEditPage = (id) => {
    history.push(`/books/${id}/edit`)
  }

  const redirectToDetailsPage = (id) => {
    history.push(`/books/${id}`)
  }


  return (
    <Card className='single-book mb-4'>
    <Card.Img variant="top" className="image" src={book.coverURL} />
    <Card.Body>
    <Card.Title>{book.title}</Card.Title>
    <Card.Text>{book.content.length >= 25 ? `${book.content.slice(0, 25)}...` : book.content}</Card.Text>
    <Button variant="dark" onClick={() => redirectToDetailsPage(book.id)} >See more </Button> 
    {isAdmin &&
      <Button variant="dark" onClick={() => redirectToEditPage(book.id)}>Edit</Button>
    } 
    {isAdmin && 
      <Button variant="red" onClick={() => deleteBook(book.id)}>Delete</Button>
    }
    </Card.Body>
  </Card>

)
};

SingleBook.propTypes = {
  book: propTypes.object.isRequired,
  deleteBook: propTypes.func.isRequired,
};

export default withRouter(SingleBook);
