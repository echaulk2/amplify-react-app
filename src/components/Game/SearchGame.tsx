import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography } from 'antd'
import Search from 'antd/lib/input/Search';
import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Game } from '../../models/Game';
import { setTimeout } from 'timers';
import { Heading } from '@aws-amplify/ui-react';

interface IGDB {
    name: string;
    id: number;
    genres: number;
    first_release_date: number;
    involved_companies: string;
    platforms: string;
    summary: string;
    storyline: string;    
}

interface IGDB_Platform {
    id: number;
    name: string;
}

interface IGDB_InvolvedCompany {
    id: number;
    company: number;
}

interface IGDB_Developer {
    name: string;
    developed: [number];
}

interface IFormValues {
    name: string;
    platform: string;
    developer: string;
}

interface searchGameProps {
    setCreatingGame: (game: React.SetStateAction<Game>) => void;
    isCreating: boolean;
    initializeCreateGame: () => void;
    handleCreateGame: (game: Game) => Promise<void>;
    resetCreateGame: () => void;
    creatingGame: Game;
}

function SearchGame(props: searchGameProps) {  
    const [form] = Form.useForm();
    const [games, setGames] = useState<IGDB[]>([]);
    const [platform, setPlatform] = useState('');
    const [gameName, setGameName] = useState('');
    
    const onFinish = async () => {
        let platformData = await getPlatform()
        let ids = platformData.map((platform: IGDB_Platform) => {
            return platform.id;
        })
        console.log(ids);
        await axios({
            url: "https://aol7dnm2n0.execute-api.us-west-2.amazonaws.com/production/v4/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-api-key': 'eDnXYfrtHz6gerFFxbZXD5VqNj1q9k594OHoV0iH'
            },
            data: `fields name, summary, id, platforms; 
                    search "${gameName}"; 
                    limit 10; 
                    where platforms = (${ids});`
          })
            .then((response: any) => {
                console.log(response);
                let results = response.data.map((element:IGDB) => { return {...element, platforms: platformData[0].name } } );
                setGames(results);
            })
            .catch((err: any) => {
                console.error(err);
            });
    }
    
    const getPlatform = async (): Promise<any> => {
        let platformData: IGDB_Platform[] = [] as IGDB_Platform[];
        await axios({
            url: "https://aol7dnm2n0.execute-api.us-west-2.amazonaws.com/production/v4/platforms",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-api-key': 'eDnXYfrtHz6gerFFxbZXD5VqNj1q9k594OHoV0iH'
            },
            data: `fields id, name; search "${platform}";`
          })
            .then((response: any) => {
                console.log(response);
                platformData = response.data as IGDB_Platform[];
            })
            .catch((err: any) => {
                console.error(err);
            });
        return platformData;
    }

    const columns = 
    [   
        {
        title: "Game Name",
        dataIndex: "name",
        key: "name",
        },
        {
        title: "Platform",
        dataIndex: "platforms",
        key: "platforms"
        },
        {
        title: "Developer",
        dataIndex: "developer",
        key: "developer"
        },
        {
        title: "Summary",
        dataIndex: "summary",
        key: "summary",
        ellipsis: true
        },
        {
          title: "Action",
          dataIndex: "id",
          key: "id",
          render: (gameID: string, row: IGDB) => 
          <>
            <Typography.Link onClick={ () => { handleAddGameToCollection(gameID, row); } }>
              Add Game
            </Typography.Link>
          </>
        },
        
    ]
    
    const handleAddGameToCollection = (gameID: string, row: IGDB) => {
        Modal.confirm({
            title: "Are you sure you want to add this game to your collection?",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                let newGame = new Game(gameID, undefined, row.name);
                props.handleCreateGame(newGame);              
            }
        });   
    }
    
    const resetForm = () => {
        setGames([]);
    }

    return (
        <>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                form={form}
                name="Game Search"
                onFinish={onFinish}
                scrollToFirstError
                labelAlign='left'
                >
                <Form.Item
                    name="name"
                    label="Game Name"
                    rules={[
                    {
                        required: true,
                        message: 'Please input a game name',
                    },
                    ]}
                >
                    <Input value={gameName} onChange={e => setGameName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="platform"
                    label="Platform"
                    rules={[
                    {
                        required: true,
                        message: 'Please input a platform',
                    },
                    ]}
                >
                    <Input value={platform} onChange={e => setPlatform(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Space wrap>
                        <Button type="primary" htmlType="submit">
                        Search
                        </Button>
                        <Button type="primary" htmlType="reset" onClick={ () => resetForm() }>
                        Clear
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            { games.length > 0 && 
                <Table dataSource={[...games]} columns={columns} 
                pagination={{ pageSize: 5 }} /> }            
        </>
    )
}

export default SearchGame