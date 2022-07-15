import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { message, Card, Col, Row, Table, Modal, InputNumber, Input, Form, Typography, Popconfirm, Space } from 'antd';
import * as Interfaces from "../../shared/Interfaces";
import { Game } from '../../models/Game';
import { DefaultRecordType } from 'rc-table/lib/interface';
import CreateGame from '../Game/CreateGame';
import { NavLink } from 'react-router-dom';

export function CollectionView() {
  const { route, user } = useAuthenticator((context) => [
    context.route, 
    context.user
  ]);
  const [collection, setCollection] = useState<Game[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingGame, setCreatingGame] = useState<Game>({} as Game);  
  const [tableLoading, setTableLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [editingGame, setEditingGame] = useState<Game>({} as Game);

  let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
  
  const handleGetCollection = async() => {
    setTableLoading(true);
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
          console.log(response.data);
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
    setCreatingGame(new Game(""));
  }
  
  const resetCreateGame = () => {
    setIsCreating(false);
    setCreatingGame({} as Game);
  }

  const handleCreateGame = async () => {     
    setTableLoading(true);
    const apiName = 'GameAPI';
    const path = '/createGame'; 
    const init = {
        headers: {
          'Authorization': userToken
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
        if (response.status === 200 && response.data) {
            setCollection([...collection, response.data as Game]);
            message.success(`${creatingGame.gameName} has been added to your collection.`);
        }
      })
      .catch(error => {
        message.error(`Unable to add ${creatingGame.gameName} to your collection.`);
    }); 
    setTableLoading(false);
  }

  const handleDeleteGame = async (game: Game) => {
    Modal.confirm({
      title: "Are you sure you want to delete this game?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        let apiName = 'GameAPI';
        let path = (game.collectionID === `Col-${game.userID}-Default`) ? '/deleteGame' : '/collection/wishlist/removeGame'; 
        let body = {
          gameName: game.gameName,
          gameID: game.gameID,
          collectionID: game.collectionID
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
          .then((response: Interfaces.IHttpResponse) => {
            if (response.status === 200 && response.data) {
              setCollection((previousState: Game[]) => { 
                return previousState.filter((record: Game) => game.gameID !== record.gameID) 
              });
              message.success(`${game.gameName} has been deleted from your collection.`);
            }
          })
          .catch(error => {
            message.error(`Unable to delete ${game.gameName} from your collection.`);
        });     
        setTableLoading(false);
      }
    });    
  }    
  const EditableCell: React.FC<Interfaces.EditableGameCellProps> = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record: Game) => record.gameID === editingKey;

  const edit = (record: Partial<Game> & { gameID: React.Key }) => {
    form.setFieldsValue({ gameName: '', yearReleased: '', genre: '', console: '', ...record });    
    setEditingKey(record.gameID);
    setEditingGame({
      gameID: record.gameID,
      gameName: record.gameName,
      collectionID: record?.collectionID
    })
  };

  const cancel = () => {
    setEditingKey('');
    setEditingGame({} as Game);
  };

  const save = async (record: Game) => {
    try {
      const row = (await form.validateFields()) as Game;
      setTableLoading(true);
      let apiName = 'GameAPI';
      let path = (record.collectionID === `Col-${record.userID}-Default`) ? '/modifyGame' : '/collection/wishlist/modifyGame'; 
      let body = {
        gameName: record.gameName,
        gameID: record.gameID,
        developer: row.developer,
        yearReleased: Number(row.yearReleased),
        genre: row.genre,
        console: row.console,
        collectionID: record.collectionID
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
          if (response.data && response.status === 200) {
            const newData = [...collection];
            const index = newData.findIndex(item => record.gameID === item.gameID);
            if (index > -1) {
              const item = newData[index];
              newData.splice(index, 1, {
                ...item,
                ...row,
              });
              setCollection(newData);
              setEditingKey('');
            }
            message.success(`${editingGame.gameName} has been modified.`);
          }
        })
        .catch(error => {
          message.error(`Unable to modify ${editingGame.gameName}.`);
      });     
      setTableLoading(false);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

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
      editable: true,
    },
    {
      title: "Year Released",
      dataIndex: "yearReleased",
      key: "yearReleased",      
      editable: true,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",      
      editable: true,
    },
    {
      title: "Console",
      dataIndex: "console",
      key: "console",      
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "collectionID",
      key: "collectionID",
      render: (collectionID: string, row: Game) => (collectionID === `Col-${row.userID}-Default`) ? "Owned" : "Wishlist"
    },
    {
      title: "Details",
      dataIndex: "gameID",
      key: "gameID",
      render: (gameID: string, row: any) => <NavLink to={`/game/${gameID}`}>Details</NavLink>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Game) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => record.gameID && save(record)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ''} onClick={() => handleDeleteGame(record)}>
              Delete
            </Typography.Link>
          </Space>
        );
      },
    }
  ]

  const mergedColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Game) => ({
        record,
        inputType: col.dataIndex === 'yearReleased' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    handleGetCollection();
  }, []) 

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card style={{ height: "100%" }}>
            <Heading level={1}>{user.getUsername()}'s Game Collection</Heading>
            <Form form={form} component={false}>
              <Table dataSource={collection} columns={mergedColumns} size="small" 
                rowKey={(record: Game) => record.gameID } className="collection-table" 
                loading={tableLoading} pagination={{ pageSize: 5 }}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }} rowClassName="editable-row"
              /> 
            </Form>
            <CreateGame game={creatingGame} isCreating={isCreating} setCreatingGame={setCreatingGame} initializeCreateGame={initializeCreateGame} 
              handleCreateGame={handleCreateGame} resetCreateGame={resetCreateGame} />
          </Card>
        </Col>
      </Row> 
    </>
  )
}
