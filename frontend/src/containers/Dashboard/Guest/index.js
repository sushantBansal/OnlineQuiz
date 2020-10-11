import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../../../utils/constants';
import { authHeader } from '../../../utils/auth-header';
import { Table, Switch, Tooltip, Space, Popconfirm, Button, Progress } from 'antd';
import { DeleteFilled, BookOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { getCountDownTime } from '../../../utils/momet-calculation';

const GuestDashBoard = (props) => {
    const store = useStore();
    const [auth, setAuth] = useState(store.getState().auth);
    const [test, setTest] = useState([]);

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted) {

            store.subscribe(() => {
                setAuth(store.getState().auth)
            })

            getTestsByUser()
        }

        return () => {
            isUnmounted = true;
        }
    }, [])

    const getTestsByUser = async () => {
        const response = await Axios.get(`${API_URL}/users/${auth?._id}/tests`, authHeader(auth?.token));;
        setTest(response.data.data)
    }

    const handleRecord = (record) => {
        props.history.push(`/quiz/${record.quiz}`)
    }


    const column = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: 'id',
            render: id => <a>{id}</a>,
        },
        {
            title: 'Time Remaining',
            dataIndex: 'remainingDuration',
            key: 'remainingDuration',
            render: duration => <a>{getCountDownTime(duration)}</a>,
        },
        {
            title: 'Completed',
            dataIndex: 'completed',
            key: 'completed',
            render: completed => <Tooltip title={completed ? '' : "You can still complete this test"}>
                <Switch checked={completed} />
            </Tooltip>,
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            render: result => <a>{result?.score}</a>,
        },
        {
            title: 'Percentage',
            dataIndex: 'result',
            key: 'result',
            render: result => <Progress type="circle" percent={result?.percentage} />
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Resume this Quiz?"
                        okText="Take test"
                        onConfirm={() => handleRecord(record, 'retake')}
                    >
                        {
                            !record.completed
                            &&
                            <Button className="action-btn-delete" type="primary" icon={<BookOutlined className="action-icon" size={28} />} size={"large"}>
                                Complete test
                        </Button>
                        }
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <>
            <Table columns={column} dataSource={test} />
        </>
    );
}

export default withRouter(GuestDashBoard);

