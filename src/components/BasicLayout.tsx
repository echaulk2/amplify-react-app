import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Heading, View } from '@aws-amplify/ui-react';
import { Navbar } from './Navbar';
import { Layout } from 'antd';
import Sider from 'antd/lib/layout/Sider';

export function BasicLayout() {
  const { Header, Content, Footer } = Layout;
  const { route } = useAuthenticator((context) => [
    context.route
  ]);
  
  return (
    <Layout>
      <Header>
        <Navbar />
      </Header>
      <Content>
          <Heading level={1}>Example Auth Routes App</Heading>
          <View>
            {route === 'authenticated' ? 'You are logged in!' : 'Please Login!'}
          </View>
          <Outlet />
      </Content>
      <Footer>Generic Footer @2022 Great Job!</Footer>
    </Layout>
  );
}
