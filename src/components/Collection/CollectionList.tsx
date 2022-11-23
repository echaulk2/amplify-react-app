import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Card, message, Table } from 'antd';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { Collection } from '../../models/Collection';
import * as Interfaces from "../../shared/Interfaces";

function CollectionList() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
  
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

    const handleGetCollections = async() => {
        setTableLoading(true);
        let apiName = 'GameAPI';
        let path = '/collection/wishlist/getWishlists'; 
        let init = {
            headers: {
              'Authorization': userToken
            },
            response: true,
            queryStringParameters: {
                userID: user.getUsername()
            }
        };
    
        await API
          .get(apiName, path, init)
          .then((response: Interfaces.IHttpResponse) => {
            if (response.data) {
              setCollections(response.data as Collection[]);
            }
          })
          .catch(error => {
            console.log(error.response);
        });
        setTableLoading(false);
    }
    
    const handleCreateCollection = async () => {     
        setTableLoading(true);
        const apiName = 'GameAPI';
        const path = '/collection/wishlist/createWishlist'; 
        const init = {
            headers: {
              'Authorization': userToken
            },
            response: true
        };
        await API
          .post(apiName, path, init)
          .then((response: Interfaces.IHttpResponse) => {
            if (response.status === 200 && response.data) {
                setCollections([...collections, response.data as Collection]);
                message.success(`Collection has been created.`);
            }
          })
          .catch(error => {
            message.error(`Unable to create collection.`);
        }); 
        setTableLoading(false);
    }

    const columns = 
    [
        {
            title: "Collection ID",
            dataIndex: "collectionID",
            key: "collectionID",
        },
        {
            
            title: "Details",
            dataIndex: "collectionID",
            key: "details",
            render: (collectionID: string, row: any) => <NavLink to={`/collection/${collectionID}`}>Details</NavLink>
        }
    ]

    useEffect(() => {
        handleGetCollections();
    }, [])
    
    return (
        <Card title="Collections">
            <Table dataSource={collections} columns={columns} loading={tableLoading} />
            <Button onClick={handleCreateCollection} type="primary">Create Collection</Button>
        </Card>
    )
}

export default CollectionList