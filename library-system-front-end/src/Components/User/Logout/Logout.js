import React, { useContext, useEffect, useState } from 'react';
import AuthContext, { getToken } from '../../../providers/AuthContext';
import { Redirect } from 'react-router';
import { BASE_URL } from '../../../common/url';

export default function Logout({ history, match, location }){
    const { isLoggedIn, setLoginState } = useContext(AuthContext);
    const [error, setError] = useState("asd");

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`${BASE_URL}/api/session`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                })
                .then(r => r.json())
                .then(result => {
                    if (!result.token && result.statusCode % 100 !== 2 && result.message !== "You have been logged out!" ) {
                        throw result;
                    }

                    localStorage.clear('token');
                    setLoginState({
                        isLoggedIn: false,
                        isAdmin: false,
                        user: null
                      });
                })
                .catch((e) => setError(e.error));
        } else {
            history.push('/home')
        }
      }, [history, isLoggedIn, setLoginState, setError]);


      if(error) {
        return (
          <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
              <strong>{error}</strong>
          </div>
        )
      }


      return <Redirect to='/' push={true}></Redirect>
}