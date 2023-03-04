import React from 'react';
import { users } from '../data/user';

const Profile = (props) => {
  const match = props.match;

  let user;
  if (match.params.id) {
    user = users.find(u => u.id === +match.params.id);
  } else {
    user = { displayName: 'Admin' } ;
  }

  return (
    <div>
      <h1>Username: {user.displayName}</h1>
    </div>
  );
}

export default Profile;
