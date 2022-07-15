import { CollectionView } from '../Collection/CollectionView';
import { RequireAuth } from './RequireAuth';
import { Login } from './Login';
import { Home } from './Home';
import { BasicLayout } from './BasicLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../../App.css';
import 'antd/dist/antd.css'; 
import GameView from '../Game/GameView';

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
                <CollectionView />
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
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}