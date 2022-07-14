import { useAuthenticator } from '@aws-amplify/ui-react';
import { Row, Col, Card } from 'antd'
import React from 'react';
import { useLocation } from 'react-router-dom';
import GameComponent from '../components/Game/GameComponent';

function GameView() {
    const { route, user } = useAuthenticator((context) => [
      context.route, 
      context.user
    ]);

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
            <Card style={{ height: "100%" }}>
                <GameComponent />
            </Card>
            </Col>
        </Row> 
    )
}

export default GameView