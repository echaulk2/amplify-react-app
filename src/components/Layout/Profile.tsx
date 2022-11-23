import { Row, Col } from 'antd'
import React from 'react'
import CollectionList from '../Collection/CollectionList'
import { CollectionTable } from '../Collection/CollectionTable'

function Profile() {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <CollectionTable />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <CollectionList />
        </Col>
      </Row>
    </>
  )
}

export default Profile