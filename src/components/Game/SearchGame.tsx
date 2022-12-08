import { Button, Card, Col, Empty, Form, Image, Input, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Game } from '../../models/Game';
import { Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { useParams } from 'react-router-dom';
import { IGDB_API } from '../../api/IGDB_API/IGDB_API';
import * as Interfaces from "../../shared/Interfaces";

function SearchGame(props: Interfaces.searchGameProps) {  
    const { user } = useAuthenticator((context) => [context.user]);
    const [form] = Form.useForm();
    const [games, setGames] = useState<Interfaces.GameRecord[]>([]);
    const [platform, setPlatform] = useState('');
    const [gameName, setGameName] = useState('');
    const [tableLoading, setTableLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    
    let params = useParams();

    const onFinish = async () => {
        setShowTable(true);
        setTableLoading(true);
        let API = new IGDB_API(user, gameName, platform);
        await API.getGames()
        .then((response: Interfaces.GameRecord[]) => {
            setGames(response);
        })
        .catch((error: any) => {
            setGames([]);
            message.error(error);
        })
        setTableLoading(false);
    }

    const handleAddGameToCollection = (row: Interfaces.GameRecord) => {
        Modal.confirm({
            title: "Are you sure you want to add this game to your collection?",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                let newGame = new Game(row.gameID, undefined, row.gameName, row.yearReleased, row.genre, row.console, row.developer, row.cover, params.collectionID);
                props.handleCreateGame(newGame);              
            }
        });   
    }
    
    const resetForm = () => {
        setGames([]);
        setTableLoading(false);
        setShowTable(false);
    }

    const columns = 
    [   
        {
        title: "Cover",
        dataIndex: "cover",
        key: "cover",
        align: "center" as const,
        render: (cover: string, row: Interfaces.GameRecord) => cover && <Image src={cover} alt={row.gameName}></Image>
        },
        {
        title: "Game Name",
        dataIndex: "gameName",
        key: "gameName",
        },
        {
        title: "Console",
        dataIndex: "console",
        key: "console"
        },
        {
        title: "Developer",
        dataIndex: "developer",
        key: "developer"
        },
        {
        title: "Genre",
        dataIndex: "genre",
        key: "genre"
        },
        {
        title: "Year Released",
        dataIndex: "yearReleased",
        key: "yearReleased"
        },
        {
        title: "Summary",
        dataIndex: "summary",
        key: "summary",
        ellipsis: {
            showTitle: false,
        },
        render: (summary: any) => (
            <Tooltip placement="topLeft" title={summary}>
              {summary}
            </Tooltip>
          ),
        },
        {
          title: "Action",
          dataIndex: "gameID",
          key: "gameID",
          render: (gameID: string, row: Interfaces.GameRecord) => 
          <>
            <Typography.Link onClick={ () => { handleAddGameToCollection(row); } }>
              Add Game
            </Typography.Link>
          </>
        },
    ]
       
    return (
        <> 
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card style={{ height: "100%" }}>            
                        <Heading level={4} style={{ paddingBottom: 20 }}>Search for a game to add to your collection</Heading>
                        <Form
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 10 }}
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
                    </Card>
                </Col>    
            </Row>
            {
            showTable &&
            <Row gutter={[16, 16]}>
                <Col>
                    <Card>
                        <Heading level={5} style={{ paddingBottom: 20 }} display={!tableLoading ? "inline-block" : "none"}>Your search found {games.length} results.</Heading>
                        <Table locale={{emptyText:<Empty description={!tableLoading && "No games found." } />}} 
                            rowKey={(record: Interfaces.GameRecord) => record.gameID } dataSource={[...games]} 
                            columns={columns} loading={tableLoading} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>
            </Row>
            }
        </>
    )
}

export default SearchGame