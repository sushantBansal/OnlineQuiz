import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, notification, message } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import Axios from 'axios';
import { API_URL } from '../../../../utils/constants'
import { authHeader } from '../../../../utils/auth-header';
const NoImage = require('../../../../images/no-image.png');
const { Option } = Select;


const _props = {
    action: 'https://run.mocky.io/v3/77303da6-66b6-4d0c-81c9-0bdacf0837ab',
    listType: 'picture',
    onChange: (file) => {
        console.log(file)
    },
    multiple: true,
};

const AddUserContainer = (props) => {

    const [state, setState] = useState({
        title: "Hello world",
        display: "",
        description: "",
        visible: false,
        image: ''
    })

    useEffect(() => {
        let isUnmounted = false;
        if (!isUnmounted) {
            console.log(props)
            setState({
                ...props,
                ...props.data,
                category: props.data?.category?._id,
                categories: props.categories,
                visible: props.visible
            })
            // getCategories()
        }
        return () => {
            isUnmounted = true;
        }
    }, [props]);


    const addUser = async (data) => {
        try {
            const response = await Axios.post(`${API_URL}/users`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            console.log(response.data)
            props.onClose()
            props.getUsers()
        } catch (error) {
            message.error(error.response.data.error)
            props.onClose()
        }
    }

    const updateUser = async (data) => {
        try {
            const response = await Axios.put(`${API_URL}/users/${state._id}`, data, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            console.log(response.data)
            message.success('Record updated')
            props.onClose()
            props.getUsers()

        } catch (error) {
            console.log({ error })
            props.onClose()
            message.error(error.response.data.error)
        }
    }

    const handleFinish = data => {
        if (props.edit) {
            return updateUser({
                ...data,
                image: state.image
            })
        } else {
            return addUser({
                ...data,
                image: state.image
            })
        }
    }
    const handleFieldsChange = data => {
        console.log(data)
    }

    const userUploadProps = {
        action: `${API_URL}/users/photo`,
        headers: authHeader(props.token).headers,
        listType: 'picture',
        onChange(info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} uploaded successfully`);
                setState({
                    ...state,
                    image: info.file.response.url
                })
            } else if (info.file.status === 'error') {
                message.error(`${info.file.response.error}.`);
            }
        },
        multiple: true,
    };

    const { userName, firstName, lastName, email, active, image, language } = state;

    return (
        <Drawer
            title={props.edit ? "Edit user" : "Add new user"}
            width={650}
            style={{
                maxWidth: '100%'
            }}
            onClose={props.onClose}
            visible={props.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                        height: 30
                    }}
                >

                </div>
            }
        > <Form layout="vertical" hideRequiredMark={false}
            initialValues={{
                userName,
                firstName, lastName, email, active, language, image
            }}
            onFinish={handleFinish}
            onFieldsChange={handleFieldsChange}
        >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="userName"
                            label="Username"
                            rules={[{ required: true, message: 'Username cannot be blank' }]}
                        >
                            <Input name="userName"
                                size="large" placeholder="Please enter username" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="firstName"
                            label="Firstname"
                            rules={[{ required: true, message: 'Firstname cannot be blank' }]}
                        >
                            <Input name="firstName"
                                size="large" placeholder="Please enter firstname" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="lastName"
                            label="Lastname"
                            rules={[{ required: true, message: 'Lastname cannot be blank' }]}
                        >
                            <Input name="lastName"
                                size="large" placeholder="Please enter lastname" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Email cannot be blank' }]}
                        >
                            <Input name="email"
                                size="large" placeholder="Please enter email" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="active"
                            label="Status"
                            rules={[{ required: true, message: 'Please choose the status' }]}
                        >
                            <Select
                                name="active"
                                size="large" placeholder="Select status">
                                <Option value={true}>Active</Option>
                                <Option value={false}>Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="language"
                            label="Language"
                            rules={[{ required: true, message: 'Select language' }]}
                        >
                            <Select
                                name="language"
                                size="large" placeholder="Select language">
                                <Option value={'en-us'}>English</Option>
                                <Option value={'hi-in'}>Hindi</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: false, message: 'Password cannot be blank' }]}
                            hasFeedback
                        >
                            <Input name="password"
                                type="password"
                                size="large" placeholder="Please input your password!" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            rules={[{ required: false, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                            ]}
                            dependencies={['password']}
                            hasFeedback
                        >
                            <Input name="password"
                                type="password"
                                size="large" placeholder="Please enter password" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <img style={{ width: '30%' }} src={!image ? NoImage : image} />
                    </Col>
                    <Col xs={24}>
                        <Dragger {...userUploadProps
                        }
                            progress
                            method="post"
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                                </p>
                        </Dragger>
                    </Col>
                </Row>

                <Row style={{ bottom: 0, right: 10 }} className="position-absolute">
                    <Col>
                        <Form.Item className="mb-3">
                            <Button onClick={props.onClose} style={{ marginRight: 8 }}>
                                Cancel
                        </Button>
                            <Button type="primary" htmlType="submit">
                                {
                                    props.edit ? 'Update' : 'Submit'
                                }
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
}

export default AddUserContainer;