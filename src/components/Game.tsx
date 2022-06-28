import { Card, Col, Row } from "antd";
import * as Interfaces from "../shared/interfaces";

function Game(props: Interfaces.GameProps) {
  return (
    <div className="site-card-wrapper">
    <Row gutter={16}>
      <Col span={3}>
        <Card title={props.game.gameName}>
          <p>{props.game.developer}</p>
          <p>{props.game.console}</p>
        </Card>
      </Col>
    </Row>
  </div>
  )
}

export default Game