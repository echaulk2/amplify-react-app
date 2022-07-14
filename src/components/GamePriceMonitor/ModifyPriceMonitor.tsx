import { Form, Input, Modal } from 'antd';
import React from 'react'
import * as Interfaces from "../../shared/Interfaces";
import * as Enums from "../../shared/Enums";
import * as Maps from "../../shared/Maps";
import { GamePriceMonitor } from '../../models/GamePriceMonitor';

interface ModifyPriceMonitorProps { 
    priceMonitor: GamePriceMonitor;
    isModifying: boolean;
    setModifyPriceMonitor: (priceMonitor: React.SetStateAction<GamePriceMonitor>) => void;
    handleModifyPriceMonitor: () => Promise<void>;
    resetModifyPriceMonitor: () => void;
}

function ModifyPriceMonitor(props: ModifyPriceMonitorProps) {
    let modifyInputFields = () => {
        let inputFields = [] as any;
        if (props.priceMonitor) {
            for (let property in Enums.GamePriceMonitor) {        
            if (!Object.keys(Enums.ExcludedGamePriceMonitorKeys).includes(property) && isNaN(Number(property))) {
                inputFields.push(
                <Form.Item label={Maps.priceMonitorMap.get(property)} key={`${props.priceMonitor.priceMonitorID}-${property}`}>
                    <Input value={props.priceMonitor[property as keyof Interfaces.IModifyPriceMonitorInputFields]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let targetValue = e.target.value;
                        props.setModifyPriceMonitor((previousValues: GamePriceMonitor) => {
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
    <Modal title="Modify Price Monitor" visible={props.isModifying} okText="Save" 
        onCancel={() => props.resetModifyPriceMonitor() } 
        onOk={() => { props.handleModifyPriceMonitor(); props.resetModifyPriceMonitor() } }>
        { modifyInputFields() }
    </Modal>
  )
}

export default ModifyPriceMonitor