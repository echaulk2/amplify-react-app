import { useAuthenticator, Heading } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { message, Card, Col, Row, Table, Modal, InputNumber, Input, Form, Typography, Popconfirm, Space } from 'antd';
import * as Interfaces from "../../shared/Interfaces";
import { Game } from '../../models/Game';
import { DefaultRecordType } from 'rc-table/lib/interface';
import { NavLink, useParams } from 'react-router-dom';
import SearchGame from '../Game/SearchGame';

interface CollectionTableProps {
  collectionID?: string;
}

export function CollectionTable(props: CollectionTableProps) {
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

  let params = useParams();
  let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();
  
  const handleGetCollection = async() => {
    setTableLoading(true);
    let apiName = 'GameAPI';
    let path = "";
    let init = {};
    if (params.collectionID) {
      path = '/collection/wishlist/'; 
      init = {
          headers: {
            'Authorization': userToken
          },
          response: true,
          queryStringParameters: {
            collectionID: params.collectionID
          }
      }
    } else {
      path = '/listGames'; 
      init = {
        headers: {
          'Authorization': userToken
        },
      response: true
      }
    }    

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
    setCreatingGame(new Game(""));
  }
  
  const resetCreateGame = () => {
    setIsCreating(false);
    setCreatingGame({} as Game);
  }

  const handleCreateGame = async (game: Game) => {     
    setTableLoading(true);
    const apiName = 'GameAPI';
    const path = (game.collectionID === `Col-${game.userID}-Default` || !game.collectionID) ? '/createGame' : '/collection/wishlist/addGame';
    const init = {
        headers: {
          'Authorization': userToken
        },
        body: {
            gameName: game.gameName,
            developer: game.developer,
            yearReleased: (game.yearReleased) ? Number(game.yearReleased) : undefined,
            genre: game.genre,
            console: game.console,
            cover: game.cover,
            collectionID: game.collectionID
        },
        response: true
    };

    await API
      .post(apiName, path, init)
      .then((response: Interfaces.IHttpResponse) => {
        if (response.status === 200 && response.data) {
            (game.collectionID === `Col-${game.userID}-Default` || !game.collectionID) ? setCollection([...collection, response.data as Game]) : setCollection(response.data as Game[]);
            message.success(`${game.gameName} has been added to your collection.`);
        }
      })
      .catch(error => {
        message.error(`Unable to add ${game.gameName} to your collection.`);
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
        let path = (game.collectionID === `Col-${game.userID}-Default` || !game.collectionID) ? '/deleteGame' : '/collection/wishlist/removeGame'; 
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
      let path = (record.collectionID === `Col-${record.userID}-Default` || !record.collectionID) ? '/modifyGame' : '/collection/wishlist/modifyGame'; 
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
      title: "Console",
      dataIndex: "console",
      key: "console",      
      editable: true,
    },
    {
      title: "Developer",
      dataIndex: "developer",
      key: "developer",      
      editable: true,
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",      
      editable: true,
    },
    {
      title: "Year Released",
      dataIndex: "yearReleased",
      key: "yearReleased",      
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "collectionID",
      key: "collectionID",
      render: (collectionID: string, row: Game) => (collectionID === `Col-${row.userID}-Default`) ? "Owned" : <NavLink to={`/collection/${collectionID}`}>Wishlist</NavLink>
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
          <Heading level={2} style={{ paddingBottom: 20 }}>{user.getUsername()}'s games</Heading>
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
        </Card>
      </Col>
    </Row>    
    <SearchGame creatingGame={creatingGame} handleCreateGame={ handleCreateGame } 
      setCreatingGame={setCreatingGame} resetCreateGame={resetCreateGame} initializeCreateGame={initializeCreateGame} 
      isCreating={isCreating}
    />
    </>
  )
}
