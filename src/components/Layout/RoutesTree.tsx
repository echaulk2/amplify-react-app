import { ProfileView } from '../Profile/ProfileView';
import { RequireAuth } from './RequireAuth';
import { Login } from './Login';
import { Home } from './Home';
import { BasicLayout } from './BasicLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../../App.css';
import 'antd/dist/antd.css'; 
import GameView from '../Game/GameView';
import CollectionView from '../Collection/CollectionView';

export function RoutesTree() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfileView />
              </RequireAuth>
            }
          />
          <Route 
            path="/game/:gameID" 
            element={
            <RequireAuth>
              <GameView />
            </RequireAuth>} 
          />
          <Route 
            path="/collection/:collectionID" 
            element={
            <RequireAuth>
              <CollectionView />
            </RequireAuth>} 
          />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}