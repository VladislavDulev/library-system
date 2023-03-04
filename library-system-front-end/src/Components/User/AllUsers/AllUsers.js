import React, { useState, useContext, useEffect } from 'react';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { BASE_URL } from '../../../common/url';
import { CardColumns } from 'react-bootstrap';
import SingleUser from '../SingleUser/SingleUser';

export default function AllUsers({ history, match, location }){
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

  const { isLoggedIn , isAdmin } = useContext(AuthContext);

    const deleteUser = (id) => {
        fetch(`${BASE_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        .then(r => r.json())
        .then(result => {
            if (!result.id || !result.username) {
                setError("Couldn't find the user, something happened");
            }else{
                fetch(`${BASE_URL}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                })
                .then(r => r.json())
                .then(result => {
                if (Array.isArray(result)) {
                    setUsers(result);
                }else{
                    setError("Couldn't get users, something happened");
                }})
            }
        })
    }

    const banUser = (id) => {
        fetch(`${BASE_URL}/api/users/${id}/ban`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        .then(r => r.json())
        .then(result => {
            if (!result.id || !result.username) {
                setError("Couldn't find the user, something happened");
            }else{
                fetch(`${BASE_URL}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                })
                .then(r => r.json())
                .then(result => {
                if (Array.isArray(result)) {
                    setUsers(result);
                }else{
                    setError("Couldn't get users, something happened");
                }})
            }
        })
    }


  useEffect(() => {
    if(!isLoggedIn || !isAdmin) {
      history.pushState('/home')
    }else{
      fetch(`${BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
        .then(r => r.json())
        .then(result => {
            if (Array.isArray(result)) {
                setUsers(result);
            }else {
                setError("Couldn't get users");
            }
        })
      }

  }, [isLoggedIn, history, isAdmin]);

  const userComponent = !(users.length) ? 
  <div className='home'>
    <h1 className={"title"}>There are currently no users</h1>
  </div> :
  users.map(u => <SingleUser user={u} key={u.id} deleteUser={deleteUser} userId={u.id} banUser={banUser}/>)

  return (
    <CardColumns style={{position:"relative", gridColumn:"-moz-initial"}}>
      {error ?
       <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
            {error}
      </div> : userComponent
      }
    </CardColumns>
  );
}