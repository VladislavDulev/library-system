import React, { useContext } from 'react';
import { withRouter, Link } from "react-router-dom";
import { Nav, NavDropdown } from 'react-bootstrap';
import './Navigation.css';
import AuthContext from '../../providers/AuthContext';

const Navigation = (props) => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  return (
        <Nav activeKey="/home" className={'menu'}>
          <Nav.Item>
            <Nav.Link as={Link} to="/home" className={"menu-item"}>Home</Nav.Link>
          </Nav.Item>
          { !isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/login' className={"menu-item"}>Login</Nav.Link>
            </Nav.Item>
          }
          { !isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/register' className={"menu-item"}>Register</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/allbooks' className={"menu-item"}>All Books</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/myborrowed' className={"menu-item"}>Borrowed</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn && isAdmin &&  
            <Nav.Item>
              <Nav.Link as={Link} to='/createbook' className={"menu-item"}>Create Book</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn && isAdmin &&  
            <Nav.Item>
              <Nav.Link as={Link} to='/users' className={"menu-item"}>Users</Nav.Link>
            </Nav.Item>
          }
          { isLoggedIn && 
            <Nav.Item>
              <Nav.Link as={Link} to='/logout' className={"menu-item"}>Logout</Nav.Link>
            </Nav.Item>
          }
        </Nav>
    )
};
    
    export default withRouter(Navigation);