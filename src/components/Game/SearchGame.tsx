import { Button, Card, Col, Empty, Form, Image, Input, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Game } from '../../models/Game';
import { Heading, useAuthenticator } from '@aws-amplify/ui-react';

interface IGDB_Game {
    name: string;
    id: number;
    genres: number[];
    first_release_date: number;
    platforms: number[];
    summary: string;
    storyline: string;  
    developer: string;  
    cover: number;
}

interface GameRecord {
    gameID: string;
    gameName: string;
    platforms?: string[]
    console?: string;
    genre?: string;
    developer?: string;
    summary?: string;
    yearReleased?: number;
    cover?: string;    
}

interface IGDB_Platform {
    id: number;
    name: string;
}

interface IGDB_Developer {
    id: number;
    name: string;
    developed: number[];
}

interface IGDB_Genre {
    id: number;
    name: string;
}

interface IGDB_Cover {
    id: number;
    url: string;
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
    const { user } = useAuthenticator((context) => [context.user]);
    const [form] = Form.useForm();
    const [games, setGames] = useState<GameRecord[]>([]);
    const [platform, setPlatform] = useState('');
    const [gameName, setGameName] = useState('');
    const [tableLoading, setTableLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
    
    const onFinish = async () => {
        setShowTable(true);
        setTableLoading(true);
        let platformData = await getPlatform();

        if (!platformData.length) {
            setGames([]);
            setTableLoading(false);
            message.error(`Unable to find platform data for ${platform}.`);
            return;
        }

        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': userToken
            },
            data: `fields name, summary, id, platforms, first_release_date, genres, cover; 
                    search "${gameName}"; 
                    limit 25; 
                    where platforms = (${platformData.map((platform: IGDB_Platform) => { return platform.id; })});`
          })
            .then(async (response: any) => {
                console.log(response.data);
                if (response.data.length) {
                    let developerData = await getDevelopers(response.data);
                    let genreData = await getGenres(response.data);
                    let imageData = await getImage(response.data);
                    let results = formatData(response.data, platformData, developerData, genreData, imageData);
                    setGames(results);
                    console.log(results);
                } else {
                    setGames([]);
                }                    
            })
            .catch((err: any) => {
                message.error("Error fetching game data.");
                console.error(err);
        });
        setTableLoading(false);
    }
    
    const getPlatform = async (): Promise<any> => {
        let platformData: IGDB_Platform[] = [];
        
        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/platforms",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': userToken
            },
            data: `fields id, name; search "${platform}";`
          })
            .then((response: any) => {
                platformData = response.data;         
            })
            .catch((err: any) => {
                message.error("Error fetching platform data.");
                console.error(err);
        });
        return platformData;
    }

    const getDevelopers = async (data: IGDB_Game[]): Promise<IGDB_Developer[]> => {
        let developerData: IGDB_Developer[] = [];
        
        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/companies",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': userToken
            },
            data: `fields id, name, developed; where developed = (${data.map((game: IGDB_Game) => { return game.id })});`
          })
            .then((response: any) => {
                developerData = response.data;         
            })
            .catch((err: any) => {
                message.error("Error fetching developer data.");
                console.error(err);
        });
        return developerData;
    }

    const getGenres = async (data: IGDB_Game[]): Promise<IGDB_Genre[]> => {
        let genreData: IGDB_Genre[] = [];
        let genreIDs = data.map((game: IGDB_Game) => { return game?.genres?.[0] }).filter((element) => element !== undefined);

        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/genres",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': userToken
            },
            data: `fields id, name; where id = (${genreIDs});`
          })
            .then((response: any) => {
                genreData = response.data;         
            })
            .catch((err: any) => {
                message.error("Error fetching genre data.");
                console.error(err);
        });
        return genreData;
    }

    const getImage = async (data: IGDB_Game[]): Promise<IGDB_Cover[]> => {
        let coverData: IGDB_Cover[] = [];
        let coverIDs = data.map((game: IGDB_Game) => { return game.cover }).filter((element) => element !== undefined);
        let query = `fields *; where id = (${coverIDs});`;
        console.log(query);
        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/covers",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': userToken
            },
            data: query
          })
            .then((response: any) => {
                coverData = response.data;       
                console.log(response.data);
            })
            .catch((err: any) => {
                message.error("Error fetching genre data.");
                console.error(err);
        });
        return coverData;
    }

    // Formats IGDB Relational Data from API calls to game format
        // -  Map platform IDs to platform names, and then separate games with multiple platforms into separate records
        // -  Convert UNIX time to just the year
        // -  Map developer IDs to developer names
        // -  Map the first genre associated with the game to the genre name            
    const formatData = (data: IGDB_Game[], platformData: IGDB_Game[], developerData: IGDB_Developer[], genreData: IGDB_Genre[],
        imageData: IGDB_Cover[]): GameRecord[] => {
        let results = data.map((element:IGDB_Game): GameRecord => {
            let platformNames: string[] = [];
            element.platforms.forEach((platformID: number) => {
                 let name = platformData.filter((item: IGDB_Platform) => {
                    return item.id == platformID;
                });
                name[0] && platformNames.push(name[0]?.name);
            });                        
            console.log(imageData.find((image: IGDB_Cover) => image.id == element.cover));
            return {
                gameID: element.id.toString(),
                gameName: element.name, 
                yearReleased: new Date(element.first_release_date * 1000).getFullYear() || undefined, 
                console: (platformNames.length == 1) ? platformNames[0] : undefined,
                platforms: platformNames || undefined,
                developer: developerData.find((developer: IGDB_Developer) => developer.developed.find((id: number) => id == element.id))?.name || undefined, 
                genre: genreData.find((genre: IGDB_Genre) => genre.id == element?.genres?.[0])?.name || undefined,
                summary: element.summary || undefined,
                cover: imageData.find((image: IGDB_Cover) => image.id == element.cover)?.url || undefined
            } as GameRecord
        });

        //Separate games with multiple platforms into separate records
        let gamesWithMultiplePlatforms = results.filter((game: GameRecord) => {
            return game.platforms && game.platforms.length > 1;
        });

        gamesWithMultiplePlatforms.forEach((game: GameRecord) => {
            let index = results.findIndex((object: GameRecord) => object.gameID == game.gameID );
            
            results = results.filter((oldGame: GameRecord) => { return game.gameID != oldGame.gameID });

            game.platforms && game.platforms.forEach((platform: any) => {
                results.splice(index, 0, {...game, gameID: `${game.gameID}-${platform}`, console: platform });
                index++;
            });
        });

        return results;
    }

    const columns = 
    [   
        {
        title: "Cover",
        dataIndex: "cover",
        key: "cover",
        align: "center" as const,
        render: (cover: string, row: GameRecord) => cover && <Image src={cover} alt={row.gameName}></Image>
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
          render: (gameID: string, row: GameRecord) => 
          <>
            <Typography.Link onClick={ () => { handleAddGameToCollection(row); } }>
              Add Game
            </Typography.Link>
          </>
        },
    ]
    
    const handleAddGameToCollection = (row: GameRecord) => {
        Modal.confirm({
            title: "Are you sure you want to add this game to your collection?",
            okText: "Yes",
            okType: "danger",
            onOk: async () => {
                let newGame = new Game(row.gameID, undefined, row.gameName, row.yearReleased, row.genre, row.console, row.developer);
                props.handleCreateGame(newGame);              
            }
        });   
    }
    
    const resetForm = () => {
        setGames([]);
        setTableLoading(false);
        setShowTable(false);
    }

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
                            rowKey={(record: GameRecord) => record.gameID } dataSource={[...games]} 
                            columns={columns} loading={tableLoading} pagination={{ pageSize: 5 }} />
                    </Card>
                </Col>
            </Row>
            }
        </>
    )
}

export default SearchGame