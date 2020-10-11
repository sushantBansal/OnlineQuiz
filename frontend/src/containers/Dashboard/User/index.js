import React, { useState, useEffect } from 'react';
import { Row, Col, Breadcrumb, Table, Button, Switch, Space, Popconfirm, message } from 'antd';
import { DownloadOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import DashboardLayout from '../Layout';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import AddUserContainer from './AddEdit';
import { useStore } from 'react-redux';
import { authHeader } from '../../../utils/auth-header';

export default function UserContainer(props) {

    const [Users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const store = useStore();
    const [token, setToken] = useState(store.getState().auth.token);

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled)
            getUsers()
        getCategories()
        return () => {
            isCancelled = true;
        };

    }, [])

    const getUsers = async () => {
        const response = await Axios.get(`${API_URL}/users`, authHeader(token))
        setUsers(response.data.data)
    }
    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/categories`)
        setCategories(response.data.data)
    }

    const deleteUser = async (id) => {
        try {
            await Axios.delete(`${API_URL}/users/${id}`, authHeader(token))
            await getUsers()
        } catch (error) {
            console.log(error)
            //message.error(error.response)
        }
    }

    const [visible, setState] = React.useState(false)
    const showDrawer = () => {
        setState(true);
        setData(null)
    };
    const onClose = () => {
        setState(false);
    };
    // Setting up data
    const [data, setData] = useState({})
    const columns = [

        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Firstname',
            dataIndex: 'firstName',
            key: 'firstName',
            render: text => <a>{text}</a>
        },
        {
            title: 'Lastname',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            render: active => <Switch checked={active} />
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">

                    <Button onClick={() => handleRecord(record, 'edit')} className="action-btn-edit" type="primary" icon={<EditFilled className="action-icon" size={28} />} size={"large"} />

                    {
                        record.userName !== 'admin' && <Popconfirm
                            title="Are you sure delete this user?"
                            okText="Delete"
                            onConfirm={() => handleRecord(record, 'delete')}
                        ><Button className="action-btn-delete" type="primary" icon={<DeleteFilled className="action-icon" size={28} />} size={"large"} />
                        </Popconfirm>
                    }

                </Space>
            ),
        },
    ];



    const handleRecord = (record, type) => {

        switch (type) {
            case 'edit':
                return (() => {
                    showDrawer()
                    setData(record)
                })()
            case 'delete':
                return (() => {
                    deleteUser(record._id)
                })()
            default:
                break;
        }
    }

    return (
        <>
            <DashboardLayout>
                <Row gutter={[16, 16]}>
                    <Col xs={24} className="d-flex justify-content-between align-items-center">
                        <Breadcrumb style={{ margin: '1.6rem 0' }}>
                            <Breadcrumb.Item><h2>Users</h2></Breadcrumb.Item>
                        </Breadcrumb>
                        <Button onClick={showDrawer}>Add User</Button>
                    </Col>
                    <Col xs={24}>
                        {
                            Users && <Table tableLayout="auto" columns={columns} dataSource={Users} />
                        }
                    </Col>
                </Row>
                {
                    visible && <AddUserContainer
                        token={token}
                        edit={data ? true : false}
                        data={data}
                        getUsers={getUsers} visible={visible} onClose={onClose} />
                }
            </DashboardLayout>
        </>
    );
}
