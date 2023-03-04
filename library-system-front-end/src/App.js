import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Home from './Components/Home/Home';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AllBooks from './Components/Books/AllBooks/AllBooks';
import Profile from './Components/Profile/Profile';
import Navigation from './Components/Navigation/Navigation';
import Footer from './Components/Footer/Footer';
import Login from './Components/User/Login/Login';
import AuthContext, { getToken, extractUser, extractIsAdmin } from './providers/AuthContext';
import GuardedRoute from './providers/GuardedRoute';
import CreateBook from './Components/Books/CreateBook/CreateBook';
import Logout from './Components/User/Logout/Logout';
import Register from './Components/User/Register/Register';
import DetailsBook from './Components/Books/DetailsBook/DetailsBook';
import EditBook from './Components/Books/EditBook/EditBook';
import AllUsers from './Components/User/AllUsers/AllUsers';
import BorrowedUserBooks from './Components/Books/BorrowedUserBooks/BorrowedUserBooks';
import EditReview from './Components/Reviews/EditReview/EditReview';


function App() {
  const [authValue, setAuthValue] = useState({
    isLoggedIn: !!extractUser(getToken()),
    isAdmin: extractIsAdmin(getToken()),
    user: extractUser(getToken())
  });


  return (
      <BrowserRouter>
      <AuthContext.Provider value={{...authValue, setLoginState: setAuthValue}}>
        <div className="App">
          <Navigation />
          <Switch>
            <Redirect path="/" exact to="/home" />
            <Route path="/home" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/allbooks" component={AllBooks} />
            {/* <GuardedRoute path="/books/create" exact auth={authValue.isLoggedIn} component={CreateBook} />
            <GuardedRoute path="/books" exact auth={authValue.isLoggedIn} component={AllBooks} />
            <GuardedRoute path="/profile" exact auth={authValue.isLoggedIn} component={Profile} />
          <GuardedRoute path="/profile/:id" exact auth={authValue.isLoggedIn} component={Profile} /> */}
            <GuardedRoute path="/books/:id" exact auth={authValue.isLoggedIn} component={DetailsBook} />
            <GuardedRoute path="/books/:bookId/reviews/:reviewId/edit" exact auth={authValue.isLoggedIn} component={EditReview} />
            <GuardedRoute path="/users" exact auth={authValue.isLoggedIn && authValue.isAdmin} component={AllUsers} />
            <GuardedRoute path="/books/:id/edit" exact auth={authValue.isLoggedIn && authValue.isAdmin} component={EditBook} />
            <GuardedRoute path="/logout" exact auth={authValue.isLoggedIn} component={Logout} />
            <GuardedRoute path="/createbook" exact auth={authValue.isLoggedIn && authValue.isAdmin} component={CreateBook} />
            <GuardedRoute path="/myborrowed" exact auth={authValue.isLoggedIn} component={BorrowedUserBooks} />
          </Switch>
        </div>
        </AuthContext.Provider>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
