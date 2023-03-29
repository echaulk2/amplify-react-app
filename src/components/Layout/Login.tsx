// components/Login.js
import { useEffect } from "react";
import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate, useLocation } from 'react-router';

export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location: any = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    if (route === 'authenticated') {
      navigate(from, { replace: true });
      console.log(route);
    }
  }, [route, navigate, from]);
  
  return (
    <div className="login-wrapper">
      <View className="auth-wrapper">
        <h1>The Game Bazaar</h1>
        <Authenticator></Authenticator>
      </View>
    </div>
  );
}
