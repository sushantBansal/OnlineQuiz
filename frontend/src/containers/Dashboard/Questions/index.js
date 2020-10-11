import React, { useState, useEffect } from 'react';
import { Row, Col, Breadcrumb, Table, Button, Switch, Space, Popconfirm, message } from 'antd';
import { DownloadOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import DashboardLayout from '../Layout';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import AddQuestionContainer from './AddEdit';
import { useStore } from 'react-redux';

export default function QuestionContainer(props) {


    const [quizes, setQuizes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [token, setToken] = useState(useStore().getState().auth.token);

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled)
            getQuestions()
        getQuizes()
        return () => {
            isCancelled = true;
        };

    }, [])

    const getQuestions = async () => {
        const response = await Axios.get(`${API_URL}/questions`)
        setQuestions(response.data.data)
    }
    const getQuizes = async () => {
        const response = await Axios.get(`${API_URL}/quizes`)
        setQuizes(response.data.data)
    }

    const deleteQuestion = async (id) => {
        try {
            await Axios.delete(`${API_URL}/questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            getQuestions()
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
    // Setting up data
    const [data, setData] = useState({})
    const columns = [
        {
            title: 'Quiz Name',
            dataIndex: 'quiz',
            key: 'quiz',
            render: quiz => <a>{quiz?.title}</a>
        },
        {
            title: 'Question',
            dataIndex: 'title',
            key: 'title',
            render: text => <a>{text}</a>,
        },
        {
            title: `Is MCQ's`,
            dataIndex: 'isMultipleChoice',
            key: 'isMultipleChoice',
            render: isMultipleChoice => <Switch checked={isMultipleChoice} />
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleRecord(record, 'edit')} className="action-btn-edit" type="primary" icon={<EditFilled className="action-icon" size={28} />} size={"large"} />
                    <Popconfirm
                        title="Are you sure delete this Question?"
                        okText="Delete"
                        onConfirm={() => handleRecord(record, 'delete')}
                    ><Button className="action-btn-delete" type="primary" icon={<DeleteFilled className="action-icon" size={28} />} size={"large"} />
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
                    deleteQuestion(record._id)
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
                            <Breadcrumb.Item><h2>Question</h2></Breadcrumb.Item>
                        </Breadcrumb>
                        <Button onClick={showDrawer}>Add Question</Button>
                    </Col>
                    <Col xs={24}>
                        {
                            questions && <Table tableLayout="auto" columns={columns} dataSource={questions} />
                        }
                    </Col>
                </Row>
                {
                    visible && <AddQuestionContainer
                        token={token}
                        edit={data ? true : false}
                        questions={questions}
                        quizes={quizes}
                        data={data}
                        getQuestions={getQuestions} visible={visible} onClose={onClose} />
                }
            </DashboardLayout>
        </>
    );
}
