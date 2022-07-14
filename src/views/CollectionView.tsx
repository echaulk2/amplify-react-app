import { useAuthenticator } from '@aws-amplify/ui-react';
import { Row, Col, Card } from 'antd'
import React from 'react'
import { Collection } from '../components/Collection/Collection'

function CollectionView() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);
  return (
    <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card style={{ height: "100%" }}>
            <Collection />
          </Card>
        </Col>
    </Row> 
  )
}

export default CollectionView