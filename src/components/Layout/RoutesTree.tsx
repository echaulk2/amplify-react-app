import { Collection } from '../Collection/Collection';
import { RequireAuth } from './RequireAuth';
import { Login } from './Login';
import { ProtectedSecond } from './ProtectSecond';
import { Home } from './Home';
import { BasicLayout } from './BasicLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../../App.css';
import 'antd/dist/antd.css'; 
import GameComponent from '../Game/GameComponent';

export function RoutesTree() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/collection"
            element={
              <RequireAuth>
                <Collection />
              </RequireAuth>
            }
          />
          <Route
            path="/protected2"
            element={
              <RequireAuth>
                <ProtectedSecond />
              </RequireAuth>
            }
          />
          <Route 
            path="/game/:gameID" 
            element={
            <RequireAuth>
              <GameComponent />
            </RequireAuth>} 
          />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}