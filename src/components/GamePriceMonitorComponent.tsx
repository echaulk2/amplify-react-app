import { Link, useAuthenticator } from '@aws-amplify/ui-react';
import { Table } from 'antd';
import { API } from 'aws-amplify';
import { useState } from 'react';
import { GamePriceData } from '../models/GamePriceData';
import { GamePriceMonitor } from '../models/GamePriceMonitor';
import CreatePriceMonitor from './CreatePriceMonitor';
import * as Interfaces from "../shared/Interfaces";
import { Game } from '../models/Game';

interface GamePriceMonitorComponentProps {
    priceMonitorData?: GamePriceMonitor[];
    game: Game
}

let priceMonitorsColumns = 
[
    {
        title: "Price Monitor",
        dataIndex: "desiredPrice",
        key: "desiredPrice",
    },
    {
        title: "Average Price",
        dataIndex: "gamePriceData",
        key: "averagePrice",
        render: (gamePriceData: GamePriceData) => gamePriceData?.averagePrice
    },
    {
        title: "Lowest Price",
        dataIndex: "gamePriceData",
        key: "lowestPrice",
        render: (gamePriceData: GamePriceData) => gamePriceData?.lowestPrice
    },
    {
        title: "Lowest Price Listing URL",
        dataIndex: "gamePriceData",
        key: "listedItemTitle",
        render: (gamePriceData: GamePriceData) => gamePriceData.listedItemURL && <a href={gamePriceData?.listedItemURL} target="_blank">Buy Here!</a>
    },
    {
        title: "Lowest Price Listing Console",
        dataIndex: "gamePriceData",
        key: "listedItemConsole",
        render: (gamePriceData: GamePriceData) => gamePriceData?.listedItemTitle
    },
    {
        title: "Lowest Price Listing Title",
        dataIndex: "gamePriceData",
        key: "listedItemTitle",
        render: (gamePriceData: GamePriceData) => gamePriceData?.listedItemConsole
    },
    {
        title: "Last Checked",
        dataIndex: "gamePriceData",
        key: "lastChecked",
        render: (gamePriceData: GamePriceData) => gamePriceData?.lastChecked
    }
]

let priceMonitorData = 
[
    {
        priceMonitorID: "PM-8741d8d9-9f9f-4ee4-862e-f39e5d12f9fb",
        userID: "U-Google_113691429639784608037",
        collectionID: "Col-116746a9-c822-4ffe-a67d-946f8188e153",
        gameID: "G-23dcea24-7dfd-4005-bc47-fd580e4ba17c",
        desiredPrice: 50,
        gamePriceData: {
            gamePriceDataID: "PD-1657674032000",
            priceMonitorID: "PM-8741d8d9-9f9f-4ee4-862e-f39e5d12f9fb",
            desiredPrice: 50,
            desiredPriceExists: false,
            lastChecked: "7/13/2022, 1:00:32 AM",
            averagePrice: "$224.88"
        }
    },
    {
        priceMonitorID: "PM-8d64da44-b56a-4c7e-a381-2c1312e66486",
        userID: "U-Google_113691429639784608037",
        collectionID: "Col-116746a9-c822-4ffe-a67d-946f8188e153",
        gameID: "G-23dcea24-7dfd-4005-bc47-fd580e4ba17c",
        desiredPrice: 55,
        gamePriceData: {
            gamePriceDataID: "PD-1657674035000",
            priceMonitorID: "PM-8d64da44-b56a-4c7e-a381-2c1312e66486",
            desiredPrice: 55,
            desiredPriceExists: true,
            lastChecked: "7/13/2022, 1:00:35 AM",
            lowestPrice: "$51.30",
            avsdsdseragePrice: "$224.88",
            listedItemTitle: "Elden Ring [Launch Edition]",
            listedItemURL: "https://www.pricecharting.com/game/pal-playstation-5/elden-ring-launch-edition",
            listedItemConsole: "PAL Playstation 5"
        }
    }
]
function GamePriceMonitorComponent(props: GamePriceMonitorComponentProps) {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);   
    const [isCreating, setIsCreating] = useState(false);
    const [creatingPriceMonitor, setCreatingPriceMonitor] = useState({} as GamePriceMonitor);  

    const initializeCreatePriceMonitor = () => { 
      setIsCreating(true);
      setCreatingPriceMonitor(new GamePriceMonitor());
    }
    
    const resetCreatePriceMonitor = () => {
      setIsCreating(false);
      setCreatingPriceMonitor({} as GamePriceMonitor);
    }

    const handleCreatePriceMonitor = async () => {     
        const apiName = 'GameAPI';
        const path = '/collection/wishlist/addPriceMonitor'; 
        const init = {
            headers: {
              'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
            },
            body: {
                gameID: props.game.gameID,
                collectionID: props.game.collectionID,
                desiredPrice: Number(creatingPriceMonitor.desiredPrice),
                desiredCondition: creatingPriceMonitor.desiredCondition
            },
            response: true
        };

        await API
          .post(apiName, path, init)
          .then((response: Interfaces.IHttpResponse) => {
            console.log(response);
          })
          .catch(error => {
            console.log(error.response);
        });
    }    

    return (
        <>
            { props.priceMonitorData ? 
                <Table dataSource={props.priceMonitorData} columns={priceMonitorsColumns} /> : 
                <p>No Price Monitors exist on this game.</p>
            }
            <CreatePriceMonitor priceMonitor={creatingPriceMonitor} isCreating={isCreating} setCreatingPriceMonitor={setCreatingPriceMonitor} initializeCreatePriceMonitor={initializeCreatePriceMonitor} 
                handleCreatePriceMonitor={handleCreatePriceMonitor} resetCreatePriceMonitor={resetCreatePriceMonitor} />
        </>
    )
}

export default GamePriceMonitorComponent