import { List } from 'antd'
import React from 'react'
import { Game } from '../../models/Game'

interface GameDetailsProps {
    game: Game;
}

function GameDetails(props: GameDetailsProps) {
  return (
    <>
        <List itemLayout="horizontal">
            <List.Item>
                <List.Item.Meta
                    title={"Genre"}
                    description={props.game.genre}
                />
            </List.Item>                            
            <List.Item>
                <List.Item.Meta
                    title={"Developer"}
                    description={props.game.developer}
                />
            </List.Item>                            
            <List.Item>
                <List.Item.Meta
                    title={"Year Released"}
                    description={props.game.yearReleased}
                />
            </List.Item>                            
            <List.Item>
                <List.Item.Meta
                    title={"Console"}
                    description={props.game.console}
                />
            </List.Item>
        </List>
    </>
  )
}

export default GameDetails