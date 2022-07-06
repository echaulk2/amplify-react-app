import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuItemProps, MenuProps, Space } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { GamePriceMonitor } from '../models/GamePriceMonitor'
import {v4 as uuidv4} from 'uuid';
import * as Enums from "../shared/Enums";
import * as Maps from "../shared/Maps";

interface GamePriceMonitorViewProps {
    priceMonitorData: GamePriceMonitor;
}

function GamePriceMonitorView(props: GamePriceMonitorViewProps) {
    const menuItems = () => {
        let items: ItemType[] = [];
        for (let [key, value] of Object.entries(props.priceMonitorData.gamePriceData)) {
            if (!Object.keys(Enums.ExcludeGamePriceData).includes(key) ) {
                items.push({
                    key: uuidv4(),
                    label: (
                        key == "listedItemURL" ? <p><a href={value} target="_blank">Buy Here!</a></p>: <p>{Maps.gamePriceDataMap.get(key)}: {value}</p>
                    )
                })
            }
        }
        return items;
    }

    const menu = (
        <Menu items={menuItems()} />
    );

    return (
        <Dropdown overlay={menu}>
            <Button>
                <Space>
                    {props.priceMonitorData.desiredPrice} <DownOutlined />
                </Space>
            </Button>
        </Dropdown>
    )
}

export default GamePriceMonitorView