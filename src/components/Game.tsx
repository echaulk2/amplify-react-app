import React from 'react'
import * as Interfaces from "../shared/interfaces";

function Game(props: Interfaces.GameProps) {
  return (
    <div>
        <h1>{props.game.gameName}</h1>
        <p>{props.game.developer}</p>
        <p>{props.game.console}</p>
    </div>
  )
}

export default Game