import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Heading, View } from '@aws-amplify/ui-react';
import { Navbar } from './Navbar';

export function Layout() {
  const { route } = useAuthenticator((context) => [
    context.route
  ]);
  
  return (
    <>
      <Navbar />
      <Heading level={1}>Example Auth Routes App</Heading>
      <View>
        {route === 'authenticated' ? 'You are logged in!' : 'Please Login!'}
      </View>

      <Outlet />
    </>
  );
}
