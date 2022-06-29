import { Heading, useAuthenticator } from '@aws-amplify/ui-react';
import { Form, Input, Button, message, Card, Col, Row } from 'antd'
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import * as Interfaces from "../shared/interfaces";

function AddGameToCollection(props: Interfaces.IAddGameToCollectionProps) {
    const { user } = useAuthenticator((context) => [context.user]);
    const [gameName, setGameName] = useState('');
    const [developer, setDeveloper] = useState('');
    const [yearReleased, setYearReleased] = useState('');
    const [genre, setGenre] = useState('');
    const [gameConsole, setConsole] = useState('');    
    

    async function onFinish() {
        const apiName = 'GameAPI';
        const path = '/createGame'; 
        const init = {
            headers: {
              'Authorization': user.getSignInUserSession()?.getIdToken().getJwtToken()
            },
            body: {
                gameName: gameName,
                developer: developer,
                yearReleased: Number(yearReleased),
                genre: genre,
                console: gameConsole
            },
            response: true
        };

        await API
          .post(apiName, path, init)
          .then(response => {
            if (response.status == 200) {
                console.log(response);
                success();
                props.getCollection();
            } else {
                error();
            }
          })
          .catch(error => {
            error();
            console.log(error.response);
        });
    }

    const success = () => {
        message.success(`${gameName} has been added to your collection.`);
    };

    const error = () => {
        message.error(`Unable to add ${gameName} to your collection.`);
    }
    return (
    <>
        <Col span={12}>
            <Card style={{ height: "100%" }}>
                <Heading level={1}>Add game to your collection</Heading>
                <Form layout="horizontal" onFinish={onFinish} title="Add game to your collection" labelAlign="left"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 12,
                    }}>
                    <Form.Item label="Game Name"
                        rules={[
                            {
                            required: true,
                            message: 'Game Name field is required.',
                            }
                        ]}
                        >
                        <Input value={gameName} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setGameName(event.target.value)} 
                            required={true} />
                    </Form.Item>
                    <Form.Item label="Developer">
                        <Input value={developer} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setDeveloper(event.target.value)} />
                    </Form.Item>
                    <Form.Item label="Year Released" 
                        rules={[
                        {
                            pattern: /^[0-9]+$/,
                            message: 'Year Released can only include numbers.',
                        },
                        ]}>
                        <Input value={yearReleased} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setYearReleased(event.target.value)} type="number"/>
                    </Form.Item>
                        <Form.Item label="Genre">
                    <Input value={genre} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setGenre(event.target.value)} />
                        </Form.Item>
                    <Form.Item label="Console"
                        rules={[
                            {
                            required: true,
                            message: 'Game name is required.',
                            }
                        ]}>
                        <Input value={gameConsole} onChange={(event:React.ChangeEvent<HTMLInputElement>) => setConsole(event.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Col>
    </>
    )
}

export default AddGameToCollection