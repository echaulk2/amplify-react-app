import { Link, useAuthenticator } from '@aws-amplify/ui-react';
import { Modal, Table } from 'antd';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { GamePriceData } from '../../models/GamePriceData';
import { GamePriceMonitor } from '../../models/GamePriceMonitor';
import CreatePriceMonitor from './CreatePriceMonitor';
import * as Interfaces from "../../shared/Interfaces";
import { Game } from '../../models/Game';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModifyPriceMonitor from './ModifyPriceMonitor';

interface GamePriceMonitorComponentProps {
    priceMonitorData?: GamePriceMonitor[];
    game: Game
}
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
    const [priceMonitors, setPriceMonitors] = useState<GamePriceMonitor[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [creatingPriceMonitor, setCreatingPriceMonitor] = useState({} as GamePriceMonitor);  
    const [isModifying, setIsModifying] = useState(false);
    const [modifyingPriceMonitor, setModifyingPriceMonitor] = useState({} as GamePriceMonitor);

    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

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
              'Authorization': userToken
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


    const initializeModifyPriceMonitor = (gamePriceMonitor: GamePriceMonitor) => { 
        setIsModifying(true);
        setModifyingPriceMonitor({...gamePriceMonitor});
    }
      
    const resetModifyPriceMonitor = () => {
        setIsModifying(false);
        setModifyingPriceMonitor({});
    }
    
    const handleModifyPriceMonitor = async () => {
        let apiName = 'GameAPI';
        let path = '/colleciton/wishlist/modifyPriceMonitor'
        let body = {
          gameID: modifyingPriceMonitor.gameID,
          collectionID: modifyingPriceMonitor.collectionID,
          desiredCondition: modifyingPriceMonitor.desiredCondition    ,
          desiredPrice: modifyingPriceMonitor.desiredPrice
        };
        let init = {
            headers: {
              'Authorization': userToken
            },
            body: body,
            response: true
        };
    
        await API
          .put(apiName, path, init)
          .then((response: Interfaces.IHttpResponse)  => {
            if (response.data) {
                setPriceMonitors((previousState: GamePriceMonitor[]) => {
                  return previousState.map((gamePriceMonitor: GamePriceMonitor) => {
                    if (gamePriceMonitor.gameID === modifyingPriceMonitor.gameID) {
                      return modifyingPriceMonitor;
                    } else {
                      return gamePriceMonitor;
                    }
                  })
                }); 
              }          
          })
          .catch(error => {
        });     
      }
    
      const handleDeletePriceMonitor = async (gamePriceMonitor: GamePriceMonitor) => {
        Modal.confirm({
          title: "Are you sure you want to delete this game from your collection?",
          okText: "Yes",
          okType: "danger",
          onOk: async () => {
            let apiName = 'GameAPI';
            let path = '/collection/wishlist/deletePriceMonitor';
            let body = {
              priceMonitorID: gamePriceMonitor.priceMonitorID,
              gameID: gamePriceMonitor.gameID,
              collectionID: gamePriceMonitor.collectionID,
              desiredPrice: gamePriceMonitor.desiredPrice,
              desiredCondition: gamePriceMonitor.desiredCondition
            };
            let init = {
                headers: {
                  'Authorization': userToken
                },
                body: body,
                response: true
            };
            
            await API
              .del(apiName, path, init)
              .then(response => {
                if (response.data) {
                  setPriceMonitors((previousState: GamePriceMonitor[]) => { 
                    return previousState.filter((record: GamePriceMonitor) => gamePriceMonitor.priceMonitorID !== record.priceMonitorID) 
                  });
                }
              })
              .catch(error => {
                console.log(error.response);
            });     
          }
        });    
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
        },
        {
        title: "Actions",
        key: "action",
        render: (gamePriceData: GamePriceData) => {
            return <>
            <EditOutlined onClick={() => initializeModifyPriceMonitor(gamePriceData)} title="Edit" />
            <DeleteOutlined onClick={() => handleDeletePriceMonitor(gamePriceData)} style={{color: "red", marginLeft: 12}} title="Delete" />
            </>
        }
        }
    ]
    useEffect(() => {
    }, []) 
    return (
        <>
            { true ? 
                <Table dataSource={priceMonitorData} columns={priceMonitorsColumns} /> : 
                <p>No Price Monitors exist on this game.</p>
            }
            <CreatePriceMonitor priceMonitor={creatingPriceMonitor} isCreating={isCreating} setCreatingPriceMonitor={setCreatingPriceMonitor} initializeCreatePriceMonitor={initializeCreatePriceMonitor} 
                handleCreatePriceMonitor={handleCreatePriceMonitor} resetCreatePriceMonitor={resetCreatePriceMonitor} />
            <ModifyPriceMonitor priceMonitor={modifyingPriceMonitor} isModifying={isModifying} setModifyPriceMonitor={setModifyingPriceMonitor}
                handleModifyPriceMonitor={handleModifyPriceMonitor} resetModifyPriceMonitor={resetModifyPriceMonitor} />
        </>
    )
}

export default GamePriceMonitorComponent