import { useAuthenticator } from '@aws-amplify/ui-react';
import { Empty, Form, Input, InputNumber, message, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { GamePriceData } from '../../models/GamePriceData';
import { GamePriceMonitor } from '../../models/GamePriceMonitor';
import CreatePriceMonitor from './CreatePriceMonitor';
import * as Interfaces from "../../shared/Interfaces";
import { Game } from '../../models/Game';

interface GamePriceMonitorComponentProps {
    game: Game
}

function GamePriceMonitorDetails(props: GamePriceMonitorComponentProps) {
  const { route, user } = useAuthenticator((context) => [
    context.route, 
    context.user
  ]);   
  const [priceMonitors, setPriceMonitors] = useState<GamePriceMonitor[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingPriceMonitor, setCreatingPriceMonitor] = useState({} as GamePriceMonitor);  
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [editingPriceMonitor, setEditingPriceMonitor] = useState<GamePriceMonitor>({} as GamePriceMonitor);

  let userToken = user.getSignInUserSession()?.getIdToken().getJwtToken();

  const initializeCreatePriceMonitor = () => { 
    setIsCreating(true);
    setCreatingPriceMonitor(new GamePriceMonitor(""));
  }
  
  const resetCreatePriceMonitor = () => {
    setIsCreating(false);
    setCreatingPriceMonitor({} as GamePriceMonitor);
  }

  const creating = async () => {    
      setTableLoading(true); 
      const apiName = 'GameAPI';
      const path = '/collection/wishlist/addPriceMonitor'; 
      const init = {
          headers: {
            'Authorization': userToken
          },
          body: {
              gameID: props.game.gameID,
              collectionID: props.game.collectionID,
              desiredPrice: Number(creatingPriceMonitor.desiredPrice),
              desiredCondition: creatingPriceMonitor.desiredCondition
          },
          response: true
      };

      await API
        .post(apiName, path, init)
        .then((response: Interfaces.IHttpResponse) => {
          if (response.status === 200 && response.data) {
            setPriceMonitors([...priceMonitors, response.data as GamePriceMonitor]);
            message.success(`Price monitor has been added to your game.`);
          }            
        })
        .catch(error => {
          message.error(`Unable to add price monitor to your game.`);
      });
      setTableLoading(false);
  }   
  
  const deleteItem = async (gamePriceMonitor: GamePriceMonitor) => {
    Modal.confirm({
      title: "Are you sure you want to delete this price monitor from your game?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        setTableLoading(true);
        let apiName = 'GameAPI';
        let path = '/collection/wishlist/deletePriceMonitor';
        let body = {
          priceMonitorID: gamePriceMonitor.priceMonitorID,
          gameID: gamePriceMonitor.gameID,
          collectionID: gamePriceMonitor.collectionID,
          desiredPrice: gamePriceMonitor.desiredPrice,
          desiredCondition: gamePriceMonitor.desiredCondition
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
          .then((response: Interfaces.IHttpResponse) => {
            if (response.status === 200 && response.data) {
              setPriceMonitors((previousState: GamePriceMonitor[]) => { 
                return previousState.filter((record: GamePriceMonitor) => gamePriceMonitor.priceMonitorID !== record.priceMonitorID) 
              });
              message.success(`Price monitor has been deleted from your collection.`);
            }
          })
          .catch(error => {
            message.error(`Unable to delete price monitor from your collection.`);
          });     
        setTableLoading(false);
      }
    });    
  }
  
  const EditableCell: React.FC<Interfaces.EditablePriceMonitorCellProps> = ({
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
  
  const isEditing = (record: GamePriceMonitor) => record.priceMonitorID === editingKey;

  const edit = (record: Partial<GamePriceMonitor> & { priceMonitorID: React.Key }) => {
    form.setFieldsValue({ desiredPrice: '', desiredCondition: '', ...record });    
    setEditingKey(record.priceMonitorID);
    setEditingPriceMonitor({
      priceMonitorID: record.priceMonitorID,
      gameID: record.gameID,
      collectionID: record?.collectionID
    })
  };

  const cancel = () => {
    setEditingKey('');
    setEditingPriceMonitor({} as GamePriceMonitor);
  };

  const save = async (record: GamePriceMonitor) => {
    try {
      const row = (await form.validateFields()) as GamePriceMonitor;
      setTableLoading(true);
      let apiName = 'GameAPI';
      let path = '/collection/wishlist/modifyPriceMonitor'
      let body = {
        priceMonitorID: record.priceMonitorID,
        gameID: record.gameID,
        collectionID: record.collectionID,
        desiredCondition: row.desiredCondition,
        desiredPrice: row.desiredPrice
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
            const newData = [...priceMonitors];
            const index = newData.findIndex(item => record.priceMonitorID === item.priceMonitorID);
            if (index > -1) {
              const item = newData[index];
              newData.splice(index, 1, {
                ...item,
                ...row,
              });
              setPriceMonitors(newData);
              setEditingKey('');
            }
            message.success(`Price monitor has been modified.`);
          }
        })
        .catch(error => {
          message.error(`Unable to modify price monitor.`);
      });     
      setTableLoading(false);
    } catch (errInfo) {
      message.error(`Unable to modify price monitor.`);
      console.log('Validate Failed:', errInfo);
    }
  };
  
  let columns = 
  [
    {
        title: "Price Monitor",
        dataIndex: "desiredPrice",
        key: "desiredPrice",
        editable: true,
        render: (desiredPrice: number) => `$${desiredPrice}`
    },
    {
        title: "Condition",
        dataIndex: "desiredCondition",
        key: "desiredCondition",
        editable: true,
    },        
    {
        title: "Average Price",
        dataIndex: "gamePriceData",
        key: "averagePrice",
        render: (gamePriceData: GamePriceData) => gamePriceData?.averagePrice
    },
    {
        title: "Lowest Price",
        dataIndex: "gamePriceData",
        key: "lowestPrice",
        render: (gamePriceData: GamePriceData) => gamePriceData?.lowestPrice
    },
    {
        title: "Lowest Price Listing URL",
        dataIndex: "gamePriceData",
        key: "listedItemURL",
        render: (gamePriceData: GamePriceData) => gamePriceData.listedItemURL && <a href={gamePriceData?.listedItemURL} target="_blank">Buy Here!</a>
    },
    {
        title: "Lowest Price Listing Console",
        dataIndex: "gamePriceData",
        key: "listedItemConsole",
        render: (gamePriceData: GamePriceData) => gamePriceData?.listedItemConsole
    },
    {
        title: "Lowest Price Listing Title",
        dataIndex: "gamePriceData",
        key: "listedItemTitle",
        render: (gamePriceData: GamePriceData) => gamePriceData?.listedItemTitle
    },
    {
        title: "Last Checked",
        dataIndex: "gamePriceData",
        key: "lastChecked",
        render: (gamePriceData: GamePriceData) => gamePriceData?.lastChecked
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: GamePriceMonitor) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => record.priceMonitorID && save(record)} style={{ marginRight: 8 }}>
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
            <Typography.Link disabled={editingKey !== ''} onClick={() => deleteItem(record)}>
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
      onCell: (record: GamePriceMonitor) => ({
        record,
        inputType: col.dataIndex === 'desiredPrice' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    props.game.priceMonitorData && setPriceMonitors(props.game.priceMonitorData)
  }, []) 

  return (
    <>
      <Form form={form} component={false}>
        <Table dataSource={priceMonitors} columns={mergedColumns} loading={tableLoading} rowClassName="editable-row"
          pagination={{ pageSize: 5 }} rowKey={(record: GamePriceMonitor) => record.priceMonitorID }                  
          components={{
            body: {
              cell: EditableCell,
            },
          }} locale={{emptyText:<Empty description={!tableLoading && "No price monitors found." } />}} 
        />
      </Form>
      <CreatePriceMonitor priceMonitor={creatingPriceMonitor} isCreating={isCreating} setCreatingPriceMonitor={setCreatingPriceMonitor} initializeCreatePriceMonitor={initializeCreatePriceMonitor} 
          handleCreatePriceMonitor={creating} resetCreatePriceMonitor={resetCreatePriceMonitor} />
    </>
  )
}

export default GamePriceMonitorDetails;