import React, { useState, useContext, useEffect } from 'react';
import './Register.css'
import { BASE_URL } from '../../../common/url';
import { Limits } from '../../../common/limits.enum';
import AuthContext from '../../../providers/AuthContext';

const Register = (props) => {
    const history = props.history;
    const { isLoggedIn } = useContext(AuthContext);
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
      repeatPassword: {
        value: '',
        touched: false,
        valid: false,
      }
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
        (value) => value === user.password.value || 'Passwords do not match', 
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
      
    const validateForm = () => !Object
      .keys(user)
      .reduce((isValid, prop) => isValid && user[prop].valid && user[prop].touched , true);
  
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

    const getValidationErrors = (prop) => {
      return userValidators[prop]
        .map(validatorFn => validatorFn(user[prop].value)) 
        .filter(value => typeof value === 'string');
    };

    const register = () => {
        fetch(`${BASE_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username.value,
            password: user.password.value,
            repeatpassword: user.repeatPassword.value,
          }),
        })
          .then(r => r.json())
          .then(result => {
            if (result.error) {
              return (result);
            }else {
              history.push('/login');
            }
    
          })
          .catch(alert);
      };


    return (
        
        <div className={"container register-container"}>
            <div className={"row"}>
                <div className={"col-md-6 register-form-1"}>
                    <h3>Register</h3>
                    <div className={"form-group"}>
                        <input type="text" className={`form-control ${getClassNames('username')}`} placeholder="Your Username *" value={user.username.value} onChange={(e) => updateUser('username', e.target.value)} />
                    </div>
                    <div className={"form-group"}>
                        <input type="password" required={true} className={`form-control ${getClassNames('password')}`} placeholder="Your Password *" value={user.password.value} onChange={(e) => updateUser('password', e.target.value)} />
                    </div>
                    <div className={"form-group"}>
                        <input type="password" required={true} className={`form-control ${getClassNames('repeatPassword')}`} placeholder="Repeat Password *" value={user.repeatPassword.value} onChange={(e) => updateUser('repeatPassword', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="submit" disabled={validateForm()} required={true} className="btnSubmit" value="Register" onClick={register} />
                    </div>
                </div>
            </div>
            <div className="alert alert-danger" hidden={!validateForm()} onClick={() => setError(null)} style={{margin:'auto', maxWidth:'300px'}}>
              {Object.keys(user).map(key => getValidationErrors(key)).join('\n')}
              {error}
            </div>
        </div>  
    )
};

export default Register;





