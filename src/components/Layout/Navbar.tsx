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
        {route !== 'authenticated' ? (
          <Menu.Item onClick={() => navigate('/login')} key={uuidv4()} style={{ marginLeft: 'auto' }}>Login</Menu.Item>
        ) : (
          <Menu.Item onClick={() => logOut()} key={uuidv4()} style={{ marginLeft: 'auto' }}>Logout</Menu.Item>
        )}
    </Menu>
  );
}