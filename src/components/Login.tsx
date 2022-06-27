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
    <View className="auth-wrapper">
      <Authenticator></Authenticator>
    </View>
  );
}
