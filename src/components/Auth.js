import React, { useContext } from 'react';

import Card from './UI/Card';
import { AuthContext } from '../context/auth-context'; //context object
import './Auth.css';

const Auth = props => {
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    authContext.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>未認証です</h2>
        <p>以下のボタンを押してログイン！</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;
