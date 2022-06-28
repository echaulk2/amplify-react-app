import { useAuthenticator, Heading, Icon } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { Card, Col, Row, Table } from 'antd';
import * as Interfaces from "../shared/interfaces";
import AddGameToCollection from './AddGameToCollection';

export function Collection() {
  const { route, user } = useAuthenticator((context) => [context.route]);
  const [collection, setCollection] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  async function getCollection() {
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
    let apiName = 'GameAPI';
    let path = '/listGames'; 
    let init = {
        headers: {
          'Authorization': userToken
        },
        response: true
    };

    await API
      .get(apiName, path, init)
      .then(response => {
        if (response.data) {
          setCollection(response.data);
          setTableLoading(false);
        }
      })
      .catch(error => {
        console.log(error.response);
    });
  }

  useEffect(() => {
    getCollection();
  }, [])

  const message =
    route === 'authenticated' ? `${user.getUsername()}\'s Game Collection` : 'Loading...';

  const columns = 
  [
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName"
    },
    {
      title: "Developer",
      dataIndex: "developer",
      key: "developer"
    },
    {
      title: "Year Released",
      dataIndex: "yearReleased",
      key: "yearReleased"
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre"
    },
    {
      title: "Console",
      dataIndex: "console",
      key: "console"
    },
  ]

  return (
    <>
      { collection &&
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card>
              <Heading level={1}>{message}</Heading>
              <Table dataSource={collection} columns={columns} size="small" 
                rowKey={(record: Interfaces.Game) => record.gameID } className="collection-table" 
                loading={tableLoading} pagination={{ pageSize: 5 }}/> 
            </Card>
          </Col>
          <AddGameToCollection getCollection={getCollection} />
        </Row>            
      }
    </>
  )
}