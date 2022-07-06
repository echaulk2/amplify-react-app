import { useAuthenticator } from '@aws-amplify/ui-react';
import { Table } from 'antd';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react'
import { Collection } from '../models/Collection';
import { Game } from '../models/Game';
import { GamePriceMonitor } from '../models/GamePriceMonitor';
import * as Interfaces from "../shared/Interfaces";

function Wishlist() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);
    const [tableLoading, setTableLoading] = useState(true);
    const [wishlistGames, setWishlistGames] = useState<Game[]>([]);

    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
    let userID = user.getUsername();

    const handleGetWishlistsByUserID = async() => {
        let apiName = 'GameAPI';
        let path = '/collection/wishlist/getWishlists'; 
        let init = {
            headers: {
                'Authorization': userToken
            },
            response: true,
            queryStringParameters: {  
                userID: userID
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
                setWishlistGames(games);
            }
        })
        setTableLoading(false);        
    }
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
        }
    ]

    const gamePriceDataColumns = 
    [
        {
            title: "Desired Price",
            key: "desiredPrice",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.desiredPrice}</p> }
        },
        {
            title: "Lowest Price",
            key: "lowestPrice",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.lowestPrice}</p> }
        },
        {
            title: "Average Price",
            key: "averagePrice",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.averagePrice}</p> }
        },
        {
            title: "Last Checked",
            key: "lastChecked",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.lastChecked}</p> }
        },
        {
            title: "Listed Item Console",
            key: "listedItemConsole",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.listedItemConsole}</p> }
        },
        {
            title: "Listed Item Title",
            key: "listed Item Title",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.listedItemTitle}</p> }
        },
        {
            title: "Listed Item URL",
            key: "listedItemURL",
            render: (payload: GamePriceMonitor) => { return <a href={payload.gamePriceData?.listedItemURL}>Buy here!</a> }
        },
        {
            title: "Desired Condition",
            key: "desiredCondition",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.desiredCondition}</p> }
        },
        {
            title: "Desired Price Exists",
            key: "desiredPriceExists",
            render: (payload: GamePriceMonitor) => { return <p>{payload.gamePriceData?.desiredPriceExists }</p> }
        }
        

    ]
    useEffect(() => {
        handleGetWishlistsByUserID();
    }, [])

    return (
        <Table loading={tableLoading} dataSource={wishlistGames} 
        expandable={{expandedRowRender: (record: Game) => (
              <Table dataSource={record.priceMonitorData} columns={gamePriceDataColumns} pagination={false}/>
            )
          }} columns={gameColumns}/>
    )
}

export default Wishlist