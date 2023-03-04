import React, { useContext, useEffect, useState } from 'react';
import AuthContext, { extractUser, getToken, extractIsAdmin } from '../../../providers/AuthContext';
import { Limits } from '../../../common/limits.enum';
import { BASE_URL } from '../../../common/url';
import './Login.css';

export default function Login({history, match, location}) {
  const { isLoggedIn, setLoginState } = useContext(AuthContext);
  const [error, setError] = useState(null);
  useEffect(() => {
      if (isLoggedIn) {
        history.push('/home');
      }

  }, [history, isLoggedIn]);

  const [user, setUserObject] = useState({
    username: {
      value: '',
      touched: false,
      valid: false,
    },
    password: {
      value: '',
      touched: false,
      valid: false,
    },
  });

  const userValidators = {
    username: [
      value => value?.length >= Limits.MIN_USERNAME_LENGTH || `Username should be at least ${Limits.MIN_USERNAME_LENGTH} letters.`, 
      value => value?.length <= Limits.MAX_USERNAME_LENGTH || `Username should be no more than ${Limits.MAX_USERNAME_LENGTH} letters.`,
    ],
    password: [
      value => value?.length >= Limits.MIN_PASSWORD_LENGTH || `Password should be at least ${Limits.MIN_PASSWORD_LENGTH} letters.`,
      value => value?.length <= Limits.MAX_PASSWORD_LENGTH || `Password should be no more than ${Limits.MAX_PASSWORD_LENGTH} letters.`,
    ],
    repeatPassword: [
      (value, password) => password === value || 'Passwords do not match', 
    ],
  };

  const updateUser = (prop, value) => setUserObject({
    ...user,
    [prop]: {
      value,
      touched: true,
      valid: userValidators[prop].reduce((isValid, validatorFn) => isValid && (typeof validatorFn(value) !== 'string'), true),
    }
  });

  const getClassNames = (prop) => {
    let classes = '';
    if (user[prop].touched) {
      classes += 'touched '
    }
    if (user[prop].valid) {
      classes += 'is-valid ';
    } else {
      classes += 'is-invalid ';
    }
  
    return classes;
  };
    
  const login = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username.value,
        password: user.password.value
      }),
    })
      .then(r => r.json())
      .then(result => {
        if (!result.token && result.statusCode % 100 !== 2) {
          throw result;
        }
        localStorage.setItem('token', result.token);
        history.push('/home');
        setLoginState({
          isLoggedIn: !!extractUser(getToken()),
          isAdmin: extractIsAdmin(getToken()),
          user: extractUser(getToken())
        });
    
      })
      .catch((e) => (setError(e.error))); // (...rest) => alert(...rest);
  };

  return (
      <div className={"container login-container"}>
          <div className={"row"}>
              <div className={"col-md-6 login-form-1"}>
                  <h3>Login</h3>
                  <div className={`form-group`}>
                      <input type="text" required={true} className={`form-control ${getClassNames('username')}`} placeholder="Your Username *" value={user.username.value} onChange={e => updateUser('username', e.target.value)} />
                  </div>
                  <div className={`form-group`}>
                      <input type="password" required={true} className={`form-control ${getClassNames('password')}`} placeholder="Your Password *" value={user.password.value} onChange={e => updateUser('password', e.target.value)} />
                  </div>
                  <div className="form-group">
                      <input type="submit" className="btnSubmit" value="Login" onClick={login} />
                  </div>
              </div>
          </div>
          {error && 
                <div className="alert alert-danger" onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
                  <strong>{error}</strong>
                </div>
          }
      </div>
  );
}