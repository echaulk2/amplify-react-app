import { Form, Input, Modal } from 'antd';
import React from 'react'
import { Game } from '../models/Game';
import * as Interfaces from "../shared/Interfaces";
import * as Enums from "../shared/Enums";
import * as Maps from "../shared/Maps";

interface ModifyGameProps { 
    game: Game;
    isModifying: boolean;
    setModifyingGame: (game: React.SetStateAction<Game>) => void;
    handleModifyGame: () => Promise<void>;
    resetModifyGame: () => void;
}

function ModifyGame(props: ModifyGameProps) {
    let modifyInputFields = () => {
        let inputFields = [] as any;
        if (props.game) {
            for (let property in Enums.Game) {        
            if (!Object.keys(Enums.ExcludedModifyKeys).includes(property) && isNaN(Number(property))) {
                inputFields.push(
                <Form.Item label={Maps.gameMap.get(property)} key={`${props.game.gameID}-${property}`}>
                    <Input value={props.game[property as keyof Interfaces.IModifyGameInputFields]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let targetValue = e.target.value;
                        props.setModifyingGame((previousValues: Game) => {
                        return {...previousValues, [property]: targetValue };
                        });
                    }}                   
                    />
                </Form.Item>
                );  
            } 
            }
        } 
        let modifyGameForm = <Form labelAlign="left" labelCol={{ span: 5, }} wrapperCol={{ span: 12, }}>{inputFields}</Form>
        return modifyGameForm;
    }
  return (
    <Modal title="Modify Game" visible={props.isModifying} okText="Save" 
        onCancel={() => props.resetModifyGame() } 
        onOk={() => { props.handleModifyGame(); props.resetModifyGame() } }>
        { modifyInputFields() }
    </Modal>
  )
}

export default ModifyGame