import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { Button } from 'antd';
import Game from './Game';
import * as Interfaces from "../shared/interfaces";

export function Protected() {
  const { route, user } = useAuthenticator((context) => [context.route]);
  const [collection, setCollection] = useState([]);

  async function getCollection() {
    const apiName = 'GameAPI';
    const path = '/collection/wishlist/'; 
    const init = {
        headers: {
          'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
        },
        response: true, 
        queryStringParameters: {  
            collectionID: 'Col-116746a9-c822-4ffe-a67d-946f8188e153',
        },
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
    route === 'authenticated' ? 'FIRST PROTECTED ROUTE!' : 'Loading...';
    
  let gameCollection = collection?.map((game: Interfaces.Game) => {
    return (
      <Game game={game} key={game.gameID}/>
    )
  })
  return <>
          <Heading level={1}>{message}</Heading>
          { gameCollection ? gameCollection : "No games found." }
        </>;
}