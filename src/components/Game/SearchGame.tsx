import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Game } from '../../models/Game';

interface IGDB_Game {
    name: string;
    id: number;
    genres: number;
    first_release_date: number;
    involved_companies: string;
    platforms: number[];
    summary: string;
    storyline: string;    
}

interface IGDB_Platform {
    id: number;
    name: string;
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
    const [games, setGames] = useState<IGDB_Game[]>([]);
    const [platform, setPlatform] = useState('');
    const [gameName, setGameName] = useState('');
    
    const onFinish = async () => {
        let platformData = await getPlatform()
        let ids = platformData.map((platform: IGDB_Platform) => {
            return platform.id;
        })

        await axios({
            url: "https://aol7dnm2n0.execute-api.us-west-2.amazonaws.com/production/v4/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-api-key': 'eDnXYfrtHz6gerFFxbZXD5VqNj1q9k594OHoV0iH'
            },
            data: `fields name, summary, id, platforms, first_release_date; 
                    search "${gameName}"; 
                    limit 25; 
                    where platforms = (${ids});`
          })
            .then((response: any) => {
                let results = formatData(response.data, platformData);
                setGames(results);
            })
            .catch((err: any) => {
                console.error(err);
            });
    }
    
    const getPlatform = async (): Promise<any> => {
        let platformData;
        
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
                platformData = response.data;         
            })
            .catch((err: any) => {
                console.error(err);
        });
        return platformData;
    }

    const formatData = (data: IGDB_Game[], platformData: IGDB_Game[]): any => {
        let results = data.map((element:IGDB_Game) => {
            let platformNames: string[] = [];
            element.platforms.forEach((platformID: number) => {
                 let name = platformData.filter((item: IGDB_Platform) => {
                    return item.id == platformID;
                });
                name[0] && platformNames.push(name[0]?.name);
            });                    
            return {...element, first_release_date: new Date(element.first_release_date * 1000).getFullYear() || undefined, platforms: platformNames.join(', ') || undefined } } 
        );
        return results;
    }

    const columns = 
    [   
        {
        title: "Game Name",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        width: '25%'
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
        title: "Year Released",
        dataIndex: "first_release_date",
        key: "first_release_date"
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
          render: (gameID: string, row: IGDB_Game) => 
          <>
            <Typography.Link onClick={ () => { handleAddGameToCollection(gameID, row); } }>
              Add Game
            </Typography.Link>
          </>
        },
        
    ]
    
    const handleAddGameToCollection = (gameID: string, row: IGDB_Game) => {
        Modal.confirm({
            title: "Are you sure you want to add this game to your collection?",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                let newGame = new Game(gameID, undefined, row.name, row.first_release_date, row.platforms.toString());
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