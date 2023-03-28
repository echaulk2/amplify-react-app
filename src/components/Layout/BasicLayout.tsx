import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Layout } from 'antd';

export function BasicLayout() {
  const { Header, Content, Footer } = Layout;
  
  return (
    <Layout>
      <Header>
        <Navbar />
      </Header>
      <Content style={{ padding: '20px 50px', minHeight: '100vh' }} className={"basic-layout"}>
        <Outlet />
      </Content>
      <Footer>The Game Bazaar 2022</Footer>
    </Layout>
  );
}
