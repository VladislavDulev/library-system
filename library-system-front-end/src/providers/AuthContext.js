import { createContext } from 'react';
import jwtDecode from 'jwt-decode';
import { UserRole } from '../common/user-roles.enum';

export const getToken = () => localStorage.getItem('token') || '';

export const extractUser = token => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export const extractIsAdmin = (token) => {
  const user = extractUser(token);
  return user?.role === UserRole.Admin
}

const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  user: null,
  setLoginState: () => {},
});

export default AuthContext;
