import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Breadcrumb, Table, Button, Switch, Space, Tooltip, Upload, message, Popconfirm } from 'antd';
import { DownloadOutlined, EditFilled, DeleteFilled, ImportOutlined, CopyOutlined } from '@ant-design/icons';
import DashboardLayout from '../Layout';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import AddSubCategoryContainer from './AddEdit';
import { useStore } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const NoImage = require('../../../images/no-image.png');

export default function SubCategoryContainer(props) {

    const [subCategories, setSubCategories] = useState([])
    const [categories, setCategories] = useState([])
    const [token] = useState(useStore().getState().auth.token);
    const copyRef = useRef(null);

    useEffect(() => {
        let isUnmounted = false;
        if (!isUnmounted)
            getSubCategories()
        getCategories()
        return () => {
            isUnmounted = true;
        };
    }, [])

    const getSubCategories = async () => {
        const response = await Axios.get(`${API_URL}/subCategories`)
        setSubCategories(response.data.data)
    }
    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/categories`)
        setCategories(response.data.data)
    }
    const deleteSubCategory = async (id) => {
        try {
            await Axios.delete(`${API_URL}/subCategories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getSubCategories()
        } catch (error) {
            message.error(error.response.data.error)
        }


    }

    const [visible, setState] = React.useState(false)
    const showDrawer = () => {
        setState(true);
        setData(null);
    };
    const onClose = () => {
        setState(false);
    };

    const copyToCLipBoard = id => {
        message.success(`${id} copied successfully`)
    }
    // Setting up data for edit
    const [data, setData] = useState({})

    const columns = [
        {
            title: 'SubCategory Id',
            dataIndex: '_id',
            key: '_id',
            render: id => <a>id</a>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: category => <CopyToClipboard text={category._id}>
                <Tooltip title="Copy to clip board" type="link" onClick={() => copyToCLipBoard(category._id)} >
                    <Button
                        type="ghost"
                        icon={
                            <CopyOutlined />
                        }
                    >
                        {category.title}
                    </Button>
                </Tooltip>
            </CopyToClipboard>
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: image => <img width={50} src={!image ? NoImage : image} alt="no-image" />
        },
        // {
        //     title: 'Description',
        //     dataIndex: 'description',
        //     key: 'description',
        // },
        // {
        //     title: 'Status',
        //     dataIndex: 'display',
        //     key: 'display',
        //     render: display => <Switch checked={display} />
        // },
        // {
        //     title: 'Icon',
        //     dataIndex: 'icon',
        //     key: 'icon',
        //     render: icon => <i className={icon} />
        // },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleRecord(record, 'edit')} className="action-btn-edit" type="primary" icon={<EditFilled className="action-icon" size={28} />} size={"large"} />
                    <Popconfirm
                        title="Are you sure delete this category?"
                        okText="Delete"
                        onConfirm={() => handleRecord(record, 'delete')}
                    >
                        <Button className="action-btn-delete" type="primary" icon={<DeleteFilled className="action-icon" size={28} />} size={"large"} />
                    </Popconfirm>
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
                    deleteSubCategory(record._id)
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
                        <Row>
                            <Breadcrumb style={{ margin: '1.6rem 0' }}>
                                <Breadcrumb.Item><h2>Sub Category</h2></Breadcrumb.Item>
                            </Breadcrumb>
                        </Row>
                        <Row>
                            <Col>

                                <Button className="ml-2" onClick={showDrawer}>Add SubCategory</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24}>
                        {
                            subCategories && <Table tableLayout="auto" columns={columns} dataSource={subCategories} />
                        }
                    </Col>
                </Row>
                {
                    visible && <AddSubCategoryContainer
                        token={token}
                        edit={data ? true : false} data={data} getSubCategories={getSubCategories}
                        subCategories={categories}
                        visible={visible} onClose={onClose} />
                }
            </DashboardLayout>
        </>
    );
}
