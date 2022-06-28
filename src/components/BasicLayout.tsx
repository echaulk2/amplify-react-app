import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator, Heading, View } from '@aws-amplify/ui-react';
import { Navbar } from './Navbar';
import { Layout, Typography } from 'antd';
import Sider from 'antd/lib/layout/Sider';

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
      <Content style={{ padding: '20px 50px' }}>
          <Heading level={1}>Game API Demo</Heading>
          <View>
            {route !== 'authenticated' && <Text type="warning">Please Login!</Text>}
          </View>
          <Outlet />
      </Content>
      <Footer>Generic Footer @2022 Great Job!</Footer>
    </Layout>
  );
}
