import React from 'react'
import { Button, Form, Input, Modal } from 'antd';
import { Game } from '../../models/Game';
import { GamePriceMonitor } from '../../models/GamePriceMonitor';
import * as Enums from "../../shared/Enums";
import * as Maps from "../../shared/Maps";

interface CreateGameProps {
    priceMonitor: GamePriceMonitor;
    isCreating: boolean;
    setCreatingPriceMonitor: (game: React.SetStateAction<GamePriceMonitor>) => void;
    initializeCreatePriceMonitor: () => void;
    handleCreatePriceMonitor: () => Promise<void>;
    resetCreatePriceMonitor: () => void;
}
function CreatePriceMonitor(props: CreateGameProps) {
    let addPriceMonitorInputFields = () => {
        let inputFields = [] as any;
        for (let [key, value] of Object.entries(props.priceMonitor)) {
            if (!Object.keys(Enums.ExcludedGamePriceMonitorKeys).includes(key)) {
            inputFields.push(
                <Form.Item label={Maps.priceMonitorMap.get(key)} key={`${key}`}>
                <Input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let targetValue = e.target.value;
                    props.setCreatingPriceMonitor((previousValues: GamePriceMonitor) => {
                        return {...previousValues, [key]: targetValue };
                    });
                }}
                />
                </Form.Item>
            );  
            } 
        }
        let addPriceMonitorForm = <Form labelAlign="left" labelCol={{ span: 7, }} wrapperCol={{ span: 12, }}>{inputFields}</Form>
        return addPriceMonitorForm;
    }
    return (
        <>
            <Button onClick={() => props.initializeCreatePriceMonitor()} type="primary">Add Price Monitor</Button>
            <Modal title="Create Price Monitor" visible={props.isCreating} okText="Save" width={500}
                onCancel={() => props.resetCreatePriceMonitor() }
                onOk={() => { props.handleCreatePriceMonitor(); props.resetCreatePriceMonitor(); } }>
                { addPriceMonitorInputFields() }
            </Modal>
        </>
    )
}

export default CreatePriceMonitor