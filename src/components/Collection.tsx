import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { message, Card, Col, Row, Table, Modal, Input, Form, Button } from 'antd';
import * as Interfaces from "../shared/interfaces";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import * as Enums from "../shared/enums";
import { Game } from '../models/Game';

export function Collection() {
  const { route, user } = useAuthenticator((context) => [context.route]);
  const [collection, setCollection] = useState<Interfaces.Game[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGame, setEditingGame] = useState<Interfaces.Game>(null as any);
  const [isAdding, setIsAdding] = useState(false);
  const [addingGame, setAddingGame] = useState<Game>({});  
  const [tableLoading, setTableLoading] = useState(true);
  
  const getCollection = async() => {
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
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
          setTableLoading(false);
        }
      })
      .catch(error => {
        console.log(error.response);
    });
  }

  const initModifyGame = (game: Interfaces.Game) => { 
    setIsEditing(true);
    setEditingGame(game);
  }
  
  const resetEditingGame = () => {
    setIsEditing(false);
    setEditingGame(null as any);
  }

  const onModifyGame = async () => {
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
    let apiName = 'GameAPI';
    let path = '/modifyGame'; 
    let body = {
      gameName: editingGame.gameName,
      gameID: editingGame.gameID,
      ...(editingGame.developer) && {developer: editingGame.developer},
      ...(editingGame.yearReleased) && {yearReleased: editingGame.yearReleased},
      ...(editingGame.genre) && {genre: editingGame.genre},
      ...(editingGame.console) && {console: editingGame.console}      
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
      .then(response => {
        console.log(response);
        if (response.data) {
          setCollection((previousState: Interfaces.Game[]) => {
            return previousState.map((game: Interfaces.Game) => {
              if (game.gameID === editingGame.gameID) {
                return editingGame;
              } else {
                return game;
              }
            })
          }); 
          //Not sure if I should be calling the API to get the updated list of games or just do this locally
          message.success(`${editingGame.gameName} has been modified.`);
        }
      })
      .catch(error => {
        message.error(`Unable to modify ${editingGame.gameName}.`);
        console.log(error.response);
    });
  }

  const initAddingGame = () => { 
    setIsAdding(true);
    setAddingGame(new Game("", ""));
  }
  
  const resetAddingGame = () => {
    setIsAdding(false);
    setAddingGame(new Game("", ""));
  }

  const onCreateGame = async () => {
    const apiName = 'GameAPI';
    const path = '/createGame'; 
    const init = {
        headers: {
          'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
        },
        body: {
            gameName: addingGame.gameName,
            developer: addingGame.developer,
            yearReleased: Number(addingGame.yearReleased),
            genre: addingGame.genre,
            console: addingGame.console
        },
        response: true
    };
    
    await API
      .post(apiName, path, init)
      .then(response => {
        if (response.data) {
            setCollection((previousState: Interfaces.Game[]) => {
              previousState.push(response.data);
              return previousState;
            });
            message.success(`${addingGame.gameName} has been added to your collection.`);
        }
      })
      .catch(error => {
        message.error(`Unable to add ${editingGame.gameName} to your collection.`);
        console.log(error.response);
    });
  }

  const onDeleteGame = async (game: Interfaces.Game) => {    
    let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
    let apiName = 'GameAPI';
    let path = '/deleteGame'; 
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
    
    await API
      .del(apiName, path, init)
      .then(response => {
        if (response.data) {
          setCollection(collection.filter((record: Interfaces.Game) => game.gameID !== record.gameID)); 
          //Not sure if I should be calling the API to get the updated list of games or just do this locally
          message.success(`${game.gameName} has been deleted from your collection.`);
        }
      })
      .catch(error => {
        message.error(`Unable to delete ${game.gameName} from your collection.`);
        console.log(error.response);
    });
  }
  const displayMessage =
  route === 'authenticated' ? `${user.getUsername()}'s Game Collection` : 'Loading...';

  const columns = 
  [
    {
      title: "Game Name",
      dataIndex: "gameName",
      key: "gameName"
    },
    {
      title: "Developer",
      dataIndex: "developer",
      key: "developer"
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
      render: (game: Interfaces.Game) => {
        return <>
          <EditOutlined onClick={() => initModifyGame(game)} title="Edit" />
          <DeleteOutlined onClick={() => onDeleteGame(game)} style={{color: "red", marginLeft: 12}} title="Delete" />
        </>
      }
    }
  ]

  let modifyInputFields = () => {
    let inputFields = [] as any;
    if (editingGame) {
      for (let [key, value] of Object.entries(editingGame)) {
        if (!Object.keys(Enums.ExcludedModifyKeys).includes(key)) {
          inputFields.push(
            <div>
              <Form.Item label={key}>
                <Input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let targetValue = e.target.value;
                    setEditingGame((previousValues: Interfaces.Game) => {
                      return {...previousValues, [key]: targetValue };
                    });
                  }} 
                />
              </Form.Item>
            </div>
          );  
        } 
      }
    }
    let modifyGameForm = <Form labelAlign="left" labelCol={{ span: 5, }} wrapperCol={{ span: 12, }}>{inputFields}</Form>
    return modifyGameForm;
  }

  let addGameInputFields = () => {
    let inputFields = [] as any;
    for (let [key, value] of Object.entries(addingGame)) {
      if (!Object.keys(Enums.ExcludedModifyKeys).includes(key)) {
        inputFields.push(
          <div>
            <Form.Item label={key}>
              <Input value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let targetValue = e.target.value;
                  setAddingGame((previousValues: Game) => {
                    return {...previousValues, [key]: targetValue };
                  });
                }} 
              />
            </Form.Item>
          </div>
        );  
      } 
    }
    let addGameForm = <Form labelAlign="left" labelCol={{ span: 5, }} wrapperCol={{ span: 12, }}>{inputFields}</Form>
    return addGameForm;
  }

  useEffect(() => {
    getCollection();
  }, [collection]) 

  return (
    <>
      { collection &&
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card style={{ height: "100%" }}>
              <Heading level={1}>{displayMessage}</Heading>
              <Table dataSource={collection} columns={columns} size="small" 
                rowKey={(record: Interfaces.Game) => record.gameID } className="collection-table" 
                loading={tableLoading} pagination={{ pageSize: 5 }}/> 
                <Modal title="Modify Game" visible={isEditing} okText="Save" 
                  onCancel={() => resetEditingGame() } 
                  onOk={() => {
                    onModifyGame();
                    resetEditingGame() } }>
                  { modifyInputFields() }
                </Modal>
                <Button onClick={() => initAddingGame()} type="primary">Add Game</Button>
                <Modal title="Add Game" visible={isAdding} okText="Save"
                  onCancel={() => resetAddingGame() }
                  onOk={() => {
                    onCreateGame();
                    resetAddingGame() } }>
                { addGameInputFields() }
                </Modal>
            </Card>
          </Col>
        </Row>            
      }
    </>
  )
}