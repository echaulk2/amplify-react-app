import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { API } from 'aws-amplify';
import { Button } from 'antd';

export function Protected() {
  const { route, user } = useAuthenticator((context) => [context.route]);
  const [collection, setCollection] = useState('');

  async function getCollection() {
    const apiName = 'Wishlist';
    const path = '/collection/wishlist/'; 
    const requestCollection = {
      'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken,
      'Access-Control-Allow-Origin': '*'
    }

    const myInit = {
        headers: {requestCollection}, 
        response: true, 
        queryStringParameters: {  
            collectionID: 'Col-116746a9-c822-4ffe-a67d-946f8188e153',
        },
    };
    API
      .get(apiName, path, myInit)
      .then(response => {
        // Todo...
      })
      .catch(error => {
        console.log(error.response);
    });
  }
  
  const message =
    route === 'authenticated' ? 'FIRST PROTECTED ROUTE!' : 'Loading...';
  return <>
          <Heading level={1}>{message}</Heading>
          <Button onClick={() => getCollection()}>Get Collection</Button>  
        </>;
}