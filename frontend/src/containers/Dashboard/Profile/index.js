import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout';
import { Row, Col, Breadcrumb, Button, message, Input, Select, Form } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import { useStore, useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import { authHeader } from '../../../utils/auth-header';
import { login } from '../../../actions';
const NoImage = require('../../../images/no-image.png');
const { Option } = Select;

const Profile = props => {

    const store = useStore();
    const dispatch = useDispatch();

    const [state, setState] = useState(store.getState().auth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isUnmounted = false;
        if (!isUnmounted) {

            store.subscribe(() => {
                setState(store.getState().auth)
            })

        }
        return () => {
            isUnmounted = true;
        }
    }, []);

    const updateUser = async (data) => {
        try {
            let url = state.role === 'admin' ? `${API_URL}/users/${state._id}`
                :
                `${API_URL}/auth/updateprofile`
            const response = await Axios.put(url, data, authHeader(state.token))
            const authMe = await getMe(response.data.token ? response.data.token : state.token)
            console.log(response.data)
            dispatch(login({
                ...response.data.data,
                ...authMe.data.data
            }))
            message.success('Record updated')
            setLoading(false);

        } catch (error) {
            setLoading(false)
            message.error(error.response.data.error)
        }
    }
    const getMe = async (token) => {
        return Axios.get(`${API_URL}/auth/me`, authHeader(token))
    }

    const handleFinish = data => {

        return updateUser({
            ...data,
            image: state.image
        })

    }
    const handleFieldsChange = data => {
        console.log(data)
    }

    const userUploadProps = {
        action: `${API_URL}/users/photo`,
        headers: authHeader(state.token).headers,
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
        <DashboardLayout>
            <Row gutter={[16, 16]}>
                <Col xs={24} className="d-flex justify-content-between align-items-center">
                    <Row>
                        <Breadcrumb style={{ margin: '1.6rem 0' }}>
                            <Breadcrumb.Item><h2>Profile</h2></Breadcrumb.Item>
                        </Breadcrumb>
                    </Row>
                </Col>
                <Col>
                    <Form layout="vertical" hideRequiredMark={false}
                        initialValues={{
                            userName,
                            firstName, lastName, email, active, language, image
                        }}
                        onFinish={handleFinish}
                        onFieldsChange={handleFieldsChange}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={8} lg={8}>
                                <Form.Item
                                    name="userName"
                                    label="Username"
                                    rules={[{ required: true, message: 'Username cannot be blank' }]}
                                >
                                    <Input name="userName"
                                        size="large" placeholder="Please enter username" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} lg={8}>
                                <Form.Item
                                    name="firstName"
                                    label="Firstname"
                                    rules={[{ required: true, message: 'Firstname cannot be blank' }]}
                                >
                                    <Input name="firstName"
                                        size="large" placeholder="Please enter firstname" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8} lg={8}>
                                <Form.Item
                                    name="lastName"
                                    label="Lastname"
                                    rules={[{ required: true, message: 'Lastname cannot be blank' }]}
                                >
                                    <Input name="lastName"
                                        size="large" placeholder="Please enter lastname" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, message: 'Email cannot be blank' }]}
                                >
                                    <Input name="email"
                                        readOnly
                                        size="large" placeholder="Please enter email" />
                                </Form.Item>
                            </Col>
                            {/* <Col xs={24}  md={8} lg={8}>
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
                            </Col> */}
                            <Col xs={24} md={12} lg={6}>
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
                            <Col xs={24} md={12} lg={6}>
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
                            <Col xs={24} md={12} lg={6}>
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

                        <Row className="mt-3 position-relative">
                            <Col>
                                <Form.Item className="mb-3">

                                    <Button size="large" loading={loading} type="primary" htmlType="submit">
                                        Update
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </DashboardLayout>
    )
}

export default Profile;