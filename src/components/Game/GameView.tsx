import { Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { Card, Col, Empty, Image, List, message, Row, Space, Table } from 'antd';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Game } from '../../models/Game';
import GamePriceMonitorDetails from '../GamePriceMonitor/GamePriceMonitorDetails';
import GameDetails from './GameDetails';

function GameView() {
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
        <Row gutter={[1, 16]}>
          <Card style={{ marginBottom: 20 }}>
            { game.cover && <Image src={game.cover} alt={game.gameName} />}
            <Heading level={1} style={{ display: "inline-block", verticalAlign: "middle", paddingLeft: 20 }}>{game.gameName}</Heading>
          </Card>          
        </Row>
        <Row gutter={[16, 16]}>
            <Col span={4}>
                <Card title="Game Details" loading={isLoading}>
                    <GameDetails game={game} />
                </Card>
            </Col>
            <Col span={20}>
                <Card title="Price Monitors" loading={isLoading}>
                    <GamePriceMonitorDetails game={game} />
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default GameView;
