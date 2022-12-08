import { Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { Card, Col, Image, message, Row } from 'antd';
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { GameAPI } from '../../api/GameAPI/GameAPI';
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

  let params = useParams();

  useEffect(() => {
    getGame();
  }, []) 
  
  let getGame = async() => {
    setisLoading(true);
    let API = new GameAPI(user, params.gameID);
    await API.handleGetGame()
    .then((response: Game) => {
      setGetGame(response);
    })
    .catch((error: any) => {
      message.error(`Unable to load game.`);       
    });
    setisLoading(false);
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
