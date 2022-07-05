import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { message, Card, Col, Row, Table, Modal, Input, Form, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Interfaces from "../shared/Interfaces";
import * as Enums from "../shared/Enums";
import * as Maps from "../shared/Maps";
import { Game } from '../models/Game';
import {v4 as uuidv4} from 'uuid';
import { DefaultRecordType } from 'rc-table/lib/interface';
import Wishlist from './Wishlist';
import { GamePriceMonitor } from '../models/GamePriceMonitor';

export function Collection() {
  const { route, user } = useAuthenticator((context) => [
    context.route, 
    context.user
  ]);
  const [collection, setCollection] = useState<Game[]>([]);
  const [isModifying, setIsModifying] = useState(false);
  const [modifyingGame, setModifyingGame] = useState<Game>({});
  const [isCreating, setIsCreating] = useState(false);
  const [creatingGame, setCreatingGame] = useState<Game>({});  
  const [tableLoading, setTableLoading] = useState(true);
  
  let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
  const handleGetCollection = async() => {
    let apiName = 'GameAPI';
    let path = '/listGames'; 
    let init = {
        headers: {
          'Authorization': userToken
        },
        response: true
    };

    await API
      .get(apiName, path, init)
      .then(response => {
        if (response.data) {
          setCollection(response.data);
        }
      })
      .catch(error => {
        console.log(error.response);
    });
    setTableLoading(false);
  }

  const initializeCreateGame = () => { 
    setIsCreating(true);
    setCreatingGame(new Game());
  }
  
  const resetCreateGame = () => {
    setIsCreating(false);
    setCreatingGame({});
  }

  const handleCreateGame = async () => {     
    setTableLoading(true);
    const apiName = 'GameAPI';
    const path = '/createGame'; 
    const init = {
        headers: {
          'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
        },
        body: {
            gameName: creatingGame.gameName,
            developer: creatingGame.developer,
            yearReleased: Number(creatingGame.yearReleased),
            genre: creatingGame.genre,
            console: creatingGame.console
        },
        response: true
    };
    await API
      .post(apiName, path, init)
      .then((response: Interfaces.IHttpResponse) => {
        if (response.status === 200 && response.data as Game[]) {
            setCollection((previousState: Game[]) => {
              previousState.push(response.data as Game);
              return previousState;
            });
            message.success(`${creatingGame.gameName} has been added to your collection.`);
        }
      })
      .catch(error => {
        message.error(`Unable to add ${modifyingGame.gameName} to your collection.`);
        console.log(error.response);
    }); 
    setTableLoading(false);
  }

  const initializeModifyGame = (game: Game) => { 
    setIsModifying(true);
    setModifyingGame({...game});
  }
  
  const resetModifyingGame = () => {
    setIsModifying(false);
    setModifyingGame({});
  }

  const handleModifyGame = async () => {
    setTableLoading(true);
    let apiName = 'GameAPI';
    let path = (modifyingGame.collectionID) ? '/colleciton/wishlist/modifyGame' : '/modifyGame'; 
    let body = {
      gameName: modifyingGame.gameName,
      gameID: modifyingGame.gameID,
      developer: modifyingGame.developer,
      yearReleased: Number(modifyingGame.yearReleased),
      genre: modifyingGame.genre,
      console: modifyingGame.console    
    };
    let init = {
        headers: {
          'Authorization': userToken
        },
        body: body,
        response: true
    };

    await API
      .put(apiName, path, init)
      .then((response: Interfaces.IHttpResponse)  => {
        if (response.data) {
          setCollection((previousState: Game[]) => {
            return previousState.map((game: Game) => {
              if (game.gameID === modifyingGame.gameID) {
                return modifyingGame;
              } else {
                return game;
              }
            })
          }); 
          message.success(`${modifyingGame.gameName} has been modified.`);
        }
      })
      .catch(error => {
        message.error(`Unable to modify ${modifyingGame.gameName}.`);
        console.log(error.response);
    });     
    setTableLoading(false);
  }

  const handleDeleteGame = async (game: Game) => {
    Modal.confirm({
      title: "Are you sure you want to delete this game from your collection?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        let apiName = 'GameAPI';
        let path = (modifyingGame.collectionID) ? '/collection/wishlist/removeGame' : '/deleteGame'; 
        let body = {
          gameName: game.gameName,
          gameID: game.gameID   
        };
        let init = {
            headers: {
              'Authorization': userToken
            },
            body: body,
            response: true
        };
        
        setTableLoading(true);
        await API
          .del(apiName, path, init)
          .then(response => {
            if (response.data) {
              setCollection((previousState: Game[]) => { 
                return previousState.filter((record: Game) => game.gameID !== record.gameID) 
              });
              message.success(`${game.gameName} has been deleted from your collection.`);
            }
          })
          .catch(error => {
            message.error(`Unable to delete ${game.gameName} from your collection.`);
            console.log(error.response);
        });     
        setTableLoading(false);
      }
    });    
  }
  const displayMessage =
    route === 'authenticated' ? `${user.getUsername()}'s Game Collection` : 'Loading...';

  const columns = 
  [
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName",
      sorter: (a: DefaultRecordType, b: DefaultRecordType) => a.gameName.localeCompare(b.gameName)
    },
    {
      title: "Developer",
      dataIndex: "developer",
      key: "developer",
    },
    {
      title: "Year Released",
      dataIndex: "yearReleased",
      key: "yearReleased"
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre"
    },
    {
      title: "Console",
      dataIndex: "console",
      key: "console"
    },
    {
      title: "Actions",
      key: "action",
      render: (game: Game) => {
        return <>
          <EditOutlined onClick={() => initializeModifyGame(game)} title="Edit" />
          <DeleteOutlined onClick={() => handleDeleteGame(game)} style={{color: "red", marginLeft: 12}} title="Delete" />
        </>
      }
    }
  ]

  let modifyInputFields = () => {
    let inputFields = [] as any;
    if (modifyingGame) {
      for (let property in Enums.Game) {        
        if (!Object.keys(Enums.ExcludedModifyKeys).includes(property) && isNaN(Number(property))) {
          inputFields.push(
            <Form.Item label={Maps.gameMap.get(property)} key={`${modifyingGame.gameID}-${property}`}>
              <Input value={modifyingGame[property as keyof Interfaces.IModifyGameInputFields]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let targetValue = e.target.value;
                  setModifyingGame((previousValues: Game) => {
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

  let addGameInputFields = () => {
    let inputFields = [] as any;
    for (let [key, value] of Object.entries(creatingGame)) {
      if (!Object.keys(Enums.ExcludedModifyKeys).includes(key)) {
        inputFields.push(
          <Form.Item label={Maps.gameMap.get(key)} key={`${key}`}>
            <Input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let targetValue = e.target.value;
                setCreatingGame((previousValues: Game) => {
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

  useEffect(() => {
    handleGetCollection();
  }, []) 

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card style={{ height: "100%" }}>
            <Heading level={1}>{displayMessage}</Heading>
            <Table dataSource={collection} columns={columns} size="small" 
              rowKey={(record: Game) => record.gameID || uuidv4() } className="collection-table" 
              loading={tableLoading} pagination={{ pageSize: 5 }}/> 
              <Modal title="Modify Game" visible={isModifying} okText="Save" 
                onCancel={() => resetModifyingGame() } 
                onOk={() => { handleModifyGame(); resetModifyingGame() } }>
                { modifyInputFields() }
              </Modal>
              <Button onClick={() => initializeCreateGame()} type="primary">Add Game</Button>
              <Modal title="Add game to your collection" visible={isCreating} okText="Save"
                onCancel={() => resetCreateGame() }
                onOk={() => { handleCreateGame(); resetCreateGame() } }>
                { addGameInputFields() }
              </Modal>
          </Card>
        </Col>
      </Row>  
      <Row>    
        <Col>
          <Card style={{ height: "100%" }}>
              <Heading level={1}>Wishlist</Heading>
              <Wishlist />
          </Card>
        </Col>
      </Row>    
    </>
  )
}