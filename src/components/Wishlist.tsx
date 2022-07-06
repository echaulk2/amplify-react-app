import { Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { Button, message, Modal, Table } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react'
import { Collection } from '../models/Collection';
import { Game } from '../models/Game';
import { GamePriceMonitor } from '../models/GamePriceMonitor';
import * as Interfaces from "../shared/Interfaces";
import CreateGame from './CreateGame';
import GamePriceMonitorView from './GamePriceMonitor';

interface WishlistProps {
    collectionID: string;
}
function Wishlist(props: WishlistProps) {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);
    const [tableLoading, setTableLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [wishlistGames, setWishlistGames] = useState<Game[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [creatingGame, setCreatingGame] = useState<Game>({});  

    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

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
      

    const initializeCreateGame = () => { 
        setIsCreating(true);
        setCreatingGame(new Game());
    }
      
    const resetCreateGame = () => {
        setIsCreating(false);
        setCreatingGame({});
    }
      
      const handleCreateGame = async () => {     
          setTableLoading(true);
          const apiName = 'GameAPI';
          const path = '/collection/wishlist/addGame'; 
          const init = {
              headers: {
                'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
              },
              body: {
                  gameName: creatingGame.gameName,
                  collectionID: props.collectionID,
                  developer: creatingGame.developer,
                  yearReleased: Number(creatingGame.yearReleased),
                  genre: creatingGame.genre,
                  console: creatingGame.console
              },
              response: true
          };
          console.log(init);
          await API
            .post(apiName, path, init)
            .then((response: Interfaces.IHttpResponse) => {
              if (response.status === 200 && response.data as Game[]) {
                  setWishlistGames((previousState: Game[]) => {
                    previousState.push(response.data as Game);
                    return previousState;
                  });
                  message.success(`${creatingGame.gameName} has been added to your collection.`);
              }
            })
            .catch(error => {
              message.error(`Unable to add ${creatingGame.gameName} to your collection.`);
              console.log(error.response);
          }); 
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
                return monitors && <ul>{monitors}</ul>
            }
        }
    ]

    useEffect(() => {
        handleGetWishlistByID(props.collectionID);
    }, [])

    return (
        <>
            <Button onClick={() => setIsVisible(true)}>View This Wishlist</Button>
            <Modal visible={isVisible} onCancel={() => setIsVisible(false)} width={1000}>
                <Heading level={1}>Games in Wishlist</Heading>
                <Table loading={tableLoading} dataSource={wishlistGames} columns={gameColumns}/>                
                <CreateGame game={creatingGame} isCreating={isCreating} setCreatingGame={setCreatingGame} initializeCreateGame={initializeCreateGame} 
                    handleCreateGame={handleCreateGame} resetCreateGame={resetCreateGame} />
            </Modal>        
        </>
    )
}

export default Wishlist