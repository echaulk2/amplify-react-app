import { Heading, Table, useAuthenticator } from '@aws-amplify/ui-react';
import { Card, Col, message, Row } from 'antd';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Game } from '../models/Game';

function GameComponent() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);    
    const [game, setGetGame] = useState<Game>({});
    const [isLoading, setisLoading] = useState(true);
    
    let params = useParams();
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

    const handleGetGame = async() => {
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
            message.error(`Unable to load game.`)
            console.log(error.response);
        });
    }
    
    useEffect(() => {
      handleGetGame();
    }, []) 

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card title={`${game.gameName} Details`} loading={isLoading}>
                        <p>Genre: {game.genre}</p>
                        <p>Developer: {game.developer}</p>
                        <p>Year Released: {game.yearReleased}</p>
                        <p>Console: {game.console}</p>
                    </Card>
                </Col>
            </Row>
            { game.priceMonitorData && 
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card title={`${game.gameName} Price Monitors`}>
                        <Table />
                    </Card>
                </Col>
            </Row>
            }
        </>
    )
}

export default GameComponent;
