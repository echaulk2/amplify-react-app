import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Menu } from "antd";
import { useNavigate } from "react-router-dom";

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
        <Menu.Item onClick={() => navigate('/')} >Home</Menu.Item>
        <Menu.Item onClick={() => navigate('/collection')}>
          Collection
        </Menu.Item>
        <Menu.Item onClick={() => navigate('/protected2')}>
          Second Protected Route
        </Menu.Item>
        {route !== 'authenticated' ? (
          <Menu.Item onClick={() => navigate('/login')}>Login</Menu.Item>
        ) : (
          <Menu.Item onClick={() => logOut()}>Logout</Menu.Item>
        )}
    </Menu>
  );
}