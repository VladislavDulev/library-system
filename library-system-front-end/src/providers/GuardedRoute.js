import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from  'prop-types';

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest} render={(props) => (
        auth === true
            ? <Component {...props} />
            : <Redirect to='/home' />
    )}
  />
);

GuardedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired,
};

export default GuardedRoute;
