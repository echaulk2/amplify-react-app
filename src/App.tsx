import { Authenticator } from '@aws-amplify/ui-react';
import { RoutesTree } from "./components/RoutesTree";
import './App.css';
import 'antd/dist/antd.css'; 

function App() {
  return (
    <Authenticator.Provider>
      <RoutesTree />
    </Authenticator.Provider>
  );
}

export default App;
