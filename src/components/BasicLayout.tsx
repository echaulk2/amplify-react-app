import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Heading, View } from '@aws-amplify/ui-react';
import { Navbar } from './Navbar';
import { Layout, Typography, Alert } from 'antd';

export function BasicLayout() {
  const { Header, Content, Footer } = Layout;
  const { Text } = Typography;
  const { route } = useAuthenticator((context) => [
    context.route
  ]);
  
  return (
    <Layout>
      <Header>
        <Navbar />
      </Header>
      <Content style={{ padding: '20px 50px', height: "100vh"  }}>
          <Heading level={1}>Game API</Heading>
          <Outlet />
      </Content>
      <Footer>Generic Footer @2022 Great Job!</Footer>
    </Layout>
  );
}
