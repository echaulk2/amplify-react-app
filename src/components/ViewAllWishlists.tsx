import { useAuthenticator } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import * as Interfaces from "../shared/Interfaces";
import { Collection } from '../models/Collection';
import { Game } from "../models/Game";
import { Table } from 'antd';
import { GamePriceMonitor } from '../models/GamePriceMonitor';
import GamePriceMonitorView from './GamePriceMonitor';

function ViewAllWishlists() {
    const { route, user } = useAuthenticator((context) => [
        context.route, 
        context.user
    ]);
    const [tableLoading, setTableLoading] = useState(true);
    const [wishlistGames, setWishlistGames] = useState<Game[]>([]);

    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

    const handleGetWishlistsByUserID = async() => {
        let apiName = 'GameAPI';
        let path = '/collection/wishlist/getWishlists'; 
        let init = {
            headers: {
                'Authorization': userToken
            },
            response: true,
            queryStringParameters: {  
                userID: userToken
            }        
        };

        await API
        .get(apiName, path, init)
        .then((response: Interfaces.IHttpResponse) => {
            if (response.data) {
                let wishlists = response.data as Collection[];
                wishlists.forEach((wishlist: Collection) => {
                    handleGetWishlistByID(wishlist.collectionID);
                })
            }
        })
    }

    const handleGetWishlistByID = async(collectionID: string) => {
        let apiName = 'GameAPI';
        let path = '/collection/wishlist/'; 
        let init = {
            headers: {
                'Authorization': userToken
            },
            response: true,
            queryStringParameters: {  
                collectionID: collectionID
            }        
        };
        
        await API
        .get(apiName, path, init)
        .then((response: Interfaces.IHttpResponse) => {
            if (response.data as Game[]) {
                let games = response.data as Game[];
                console.log(games);
                setWishlistGames(games);
            }
        })
        setTableLoading(false);        
    }    
    
    useEffect(() => {
        handleGetWishlistsByUserID();
    }, [])

    const gameColumns = 
    [
        {
            title: "Game Name",
            dataIndex: "gameName",
            key: "gameName",
        },
        {
            title: "Developer",
            dataIndex: "developer",
            key: "developer",
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
        {
            title: "Price Monitors",
            dataIndex: "priceMonitorData",
            key: "priceMonitorData",
            render: (record: GamePriceMonitor[]) => 
            { 
                let monitors = [] as any;
                record.forEach((item: GamePriceMonitor) => {
                    monitors.push(<GamePriceMonitorView priceMonitorData={item} />);
                });
                return <ul>{monitors}</ul>
            }
        }
    ]

    return (
        <Table dataSource={wishlistGames} columns={gameColumns}/>
    )
}

export default ViewAllWishlists