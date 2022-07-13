import React from 'react';
import { Outlet } from 'react-router-dom';
import { Heading } from '@aws-amplify/ui-react';
import { Navbar } from './Navbar';
import { Layout } from 'antd';

export function BasicLayout() {
  const { Header, Content, Footer } = Layout;
  
  return (
    <Layout>
      <Header>
        <Navbar />
      </Header>
      <Content style={{ padding: '20px 50px', minHeight: '100vh' }}>
          <Heading level={1}>Game API</Heading>
          <Outlet />
      </Content>
      <Footer>Generic Footer @2022 Great Job!</Footer>
    </Layout>
  );
}
