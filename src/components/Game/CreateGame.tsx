import { Button, Form, Input, Modal } from 'antd';
import React from 'react'
import { Game } from '../../models/Game';
import * as Enums from "../../shared/Enums";
import * as Maps from "../../shared/Maps";

interface CreateGameProps {
    game: Game;
    isCreating: boolean;
    setCreatingGame: (game: React.SetStateAction<Game>) => void;
    initializeCreateGame: () => void;
    handleCreateGame: () => Promise<void>;
    resetCreateGame: () => void;
}

function CreateGame(props: CreateGameProps) {
    let addGameInputFields = () => {
        let inputFields = [] as any;
        for (let [key, value] of Object.entries(props.game)) {
            if (!Object.keys(Enums.ExcludedModifyKeys).includes(key)) {
            console.log(key);
            inputFields.push(
                <Form.Item label={Maps.gameMap.get(key)} key={`${key}`}>
                <Input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let targetValue = e.target.value;
                    props.setCreatingGame((previousValues: Game) => {
                        return {...previousValues, [key]: targetValue };
                    });
                    }}
                />
                </Form.Item>
            );  
            } 
        }
        let addGameForm = <Form labelAlign="left" labelCol={{ span: 5, }} wrapperCol={{ span: 12, }}>{inputFields}</Form>
        return addGameForm;
    }

    return (
    <>  
        <Button onClick={() => props.initializeCreateGame()} type="primary">Add Game</Button>
            <Modal title="Add game to your collection" visible={props.isCreating} okText="Save"
            onCancel={() => props.resetCreateGame() }
            onOk={() => { props.handleCreateGame(); props.resetCreateGame(); } }>
            { addGameInputFields() }
        </Modal>
    </>
    )
}

export default CreateGame