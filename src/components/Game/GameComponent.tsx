import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, Col, List, message, Row, Table } from 'antd';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Game } from '../../models/Game';
import GamePriceMonitorComponent from '../GamePriceMonitor/GamePriceMonitorComponent';

function GameComponent() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);    
    const [game, setGetGame] = useState({} as Game);
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
      handleGetGame();
    }, []) 
    
    let params = useParams();
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

    const handleGetGame = async() => {
        setisLoading(true);
        let apiName = 'GameAPI';
        let path = '/getGame'; 
        let init = {
            headers: {
              'Authorization': userToken
            },
            response: true,
            queryStringParameters: {  
                gameID: params.gameID
            }        
        };
    
        await API
          .get(apiName, path, init)
          .then(response => {
            if (response.data) {
              setGetGame(response.data);
              setisLoading(false);
            }
          })
          .catch(error => {
            message.error(`Unable to load game.`); 
        });
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Card title={game.gameName && `${game.gameName} Game Details`} loading={isLoading}>
                        <List itemLayout="horizontal">
                            <List.Item>
                                <List.Item.Meta
                                    title={"Genre"}
                                    description={game.genre}
                                />
                            </List.Item>                            
                            <List.Item>
                                <List.Item.Meta
                                    title={"Developer"}
                                    description={game.developer}
                                />
                            </List.Item>                            
                            <List.Item>
                                <List.Item.Meta
                                    title={"Year Released"}
                                    description={game.yearReleased}
                                />
                            </List.Item>                            
                            <List.Item>
                                <List.Item.Meta
                                    title={"Console"}
                                    description={game.console}
                                />
                            </List.Item>
                        </List>
                    </Card>
                </Col>
                <Col>
                    <Card title={game.gameName && `${game.gameName} Price Monitors`} loading={isLoading}>
                        <GamePriceMonitorComponent priceMonitorData={game.priceMonitorData} game={game} />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default GameComponent;
