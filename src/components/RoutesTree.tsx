import { Protected } from './Protected';
import { RequireAuth } from './RequireAuth';
import { Login } from './Login';
import { ProtectedSecond } from './ProtectSecond';
import { Home } from './Home';
import { Layout } from './Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../App.css';
import 'antd/dist/antd.css'; 

export function RoutesTree() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <Protected />
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
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}