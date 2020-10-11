import React, { useState, useEffect } from 'react';
import { Row, Col, Breadcrumb, Table, Button, Switch, Space, Tooltip, message, Popconfirm } from 'antd';
import { DownloadOutlined, EditFilled, DeleteFilled, CopyOutlined } from '@ant-design/icons';
import DashboardLayout from '../Layout';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import AddQuizContainer from './AddEdit';
import { useStore } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function QuizContainer(props) {

    const [quizes, setQuizes] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [token, setToken] = useState(useStore().getState().auth.token);

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled)
            getQuizes()
        getSubjects()
        return () => {
            isCancelled = true;
        };

    }, [])

    const getQuizes = async () => {
        const response = await Axios.get(`${API_URL}/quizes`)
        setQuizes(response.data.data)
    }

    const getSubjects = async () => {
        const response = await Axios.get(`${API_URL}/subjects`)
        setSubjects(response.data.data)
    }

    const deleteQuiz = async (id) => {
        try {
            await Axios.delete(`${API_URL}/quizes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getSubjects()
        } catch (error) {
            message.error(error.response.data.error)
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

    const copyToCLipBoard = id => {
        message.success(`${id} copied successfully`)
    }

    // Setting up data
    const [data, setData] = useState({})
    const columns = [

        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: subject => subject && <CopyToClipboard text={subject._id}>
                <Tooltip title="Copy to clip board" type="link" onClick={() => copyToCLipBoard(subject._id)} >
                    <Button
                        type="ghost"
                        icon={
                            <CopyOutlined />
                        }
                    >
                        {subject.title}
                    </Button>
                </Tooltip>
            </CopyToClipboard>
        },
        {
            title: 'No of question',
            dataIndex: 'questions',
            key: 'questions',
            render: questions => <a>{questions?.length}</a>
        },
        {
            title: 'Duration in minutes',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Instruction',
            dataIndex: 'instruction',
            key: 'instruction',
        },
        {
            title: 'Display on board',
            dataIndex: 'displayOnLeaderboard',
            key: 'diaplayOnLeaderboard',
            render: displayOnLeaderboard => <Switch checked={displayOnLeaderboard} />
        },
        {
            title: 'Is Random',
            dataIndex: 'isRandom',
            key: 'isRandom',
            render: isRandom => <Switch checked={isRandom} />
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleRecord(record, 'edit')} className="action-btn-edit" type="primary" icon={<EditFilled className="action-icon" size={28} />} size={"large"} />

                    <Popconfirm
                        title="Are you sure delete this Quiz?"
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
                    deleteQuiz(record._id)
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
                            <Breadcrumb.Item><h2>Quizes</h2></Breadcrumb.Item>
                        </Breadcrumb>
                        <Button onClick={showDrawer}>Add Quiz</Button>
                    </Col>
                    <Col xs={24}>
                        {
                            quizes && <Table tableLayout="auto" columns={columns} dataSource={quizes} />
                        }
                    </Col>
                </Row>
                {
                    visible && <AddQuizContainer
                        token={token}
                        edit={data ? true : false}
                        subjects={subjects}
                        data={data}
                        getQuizes={getQuizes} visible={visible} onClose={onClose} />
                }
            </DashboardLayout>
        </>
    );
}
