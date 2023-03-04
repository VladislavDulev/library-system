import React from "react";
import { Card, Button } from "react-bootstrap";

export default function SingleUser({ user, userId, deleteUser, banUser }) {
  
    return (
      <Card className='single-book mb-4'>
      <Card.Body>
      <Card.Title>{user.username}</Card.Title>
      <Button variant="dark">See more </Button>
      <Button variant="red" onClick={() => deleteUser(userId)}>{user.isDeleted ? 'Undelete' : 'Delete'}</Button>
      <Button variant="red" onClick={() => banUser(userId)}>{user.isBanned ? 'Unban' : 'Ban'}</Button>
      </Card.Body>
    </Card>
  
  )
}