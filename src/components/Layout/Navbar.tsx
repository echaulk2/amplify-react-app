import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

export function Navbar() {
  const { route, signOut } = useAuthenticator((context) => [
      context.route,
      context.signOut,
  ]);    
  const navigate = useNavigate();
  function logOut() {
    signOut();
    navigate('/login');
  }

  return (
    <Menu mode="horizontal" theme="dark">
        <Menu.Item onClick={() => navigate('/')} key={uuidv4()}>Home</Menu.Item>
        <Menu.Item onClick={() => navigate('/collection')} key={uuidv4()}>
          Collection
        </Menu.Item>
        <Menu.Item onClick={() => navigate('/protected2')} key={uuidv4()}>
          Second Protected Route
        </Menu.Item>
        {route !== 'authenticated' ? (
          <Menu.Item onClick={() => navigate('/login')} key={uuidv4()}>Login</Menu.Item>
        ) : (
          <Menu.Item onClick={() => logOut()} key={uuidv4()}>Logout</Menu.Item>
        )}
    </Menu>
  );
}