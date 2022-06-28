import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { Table } from 'antd';
import * as Interfaces from "../shared/interfaces";

export function Collection() {
  const { route, user } = useAuthenticator((context) => [context.route]);
  const [collection, setCollection] = useState([]);

  async function getCollection() {
    const apiName = 'GameAPI';
    const path = '/listGames'; 
    const init = {
        headers: {
          'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
        },
        response: true
    };

    await API
      .get(apiName, path, init)
      .then(response => {
        setCollection(response.data);
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
      <Heading level={1}>{message}</Heading>
      { collection &&
        <Table dataSource={collection} columns={columns} size="small" 
          rowKey={(record: Interfaces.Game) => record.gameID } className="collection-table" />
      }
    </>
  )
}