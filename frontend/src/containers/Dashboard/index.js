import React, { useEffect, useState } from 'react';
import DashboardLayout from './Layout';
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useStore } from 'react-redux';
import GuestDashBoard from './Guest';
import Axios from 'axios';
import { API_URL } from '../../actions';
import { authHeader } from '../../utils/auth-header';
import { Link } from 'react-router-dom';


export default function DashBoardContainer() {

    const store = useStore();
    const [auth, setAuth] = useState(store.getState().auth);
    const [users, setUsers] = useState(0);
    const [categories, setCategories] = useState(0);
    const [quizes, setQuizes] = useState(0);
    const [questions, setQuestions] = useState(0);
    const [subCategories, setSubCategories] = useState(0);
    const [subjects, setSubjects] = useState(0);

    useEffect(() => {
        let unMounted = false;

        if (!unMounted) {
            (async () => {
                await getUsers();
                await getCategories();
                await getQuestions();
                await getQuizes();
                await getSubCategories();
                await getSubjects();
            })()
        }

        return () => {
            unMounted = true;
        };
    }, [])

    const getUsers = async () => {
        const response = await Axios.get(`${API_URL}/users`, authHeader(auth?.token))
        setUsers(response.data.count)
    }
    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/categories`, authHeader(auth?.token))
        setCategories(response.data.count)
    }
    const getSubCategories = async () => {
        const response = await Axios.get(`${API_URL}/subCategories`, authHeader(auth?.token))
        setSubCategories(response.data.count)
    }
    const getSubjects = async () => {
        const response = await Axios.get(`${API_URL}/subjects`, authHeader(auth?.token))
        setSubjects(response.data.count)
    }
    const getQuizes = async () => {
        const response = await Axios.get(`${API_URL}/quizes`, authHeader(auth?.token))
        console.log(response.data.count)
        setQuizes(response.data.count)
    }

    const getQuestions = async () => {
        const response = await Axios.get(`${API_URL}/questions`, authHeader(auth?.token))
        setQuestions(response.data.count)
    }






    return (
        <>
            <DashboardLayout>
                {
                    auth && auth.role === 'admin' && <Row gutter={16, 16}>
                        <Col xs={12}>
                            <Card>
                                <Link to="/admin/user">
                                    <Statistic
                                        title="Users"
                                        value={users}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>

                        </Col>
                        <Col xs={12}>
                            <Card>
                                <Link to="/dashboard/category">
                                    <Statistic
                                        title="Categories"
                                        value={categories}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card>
                                <Link to="/dashboard/subCategory">
                                    <Statistic
                                        title="Sub Categories"
                                        value={subCategories}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card>
                                <Link to="/dashboard/subject">
                                    <Statistic
                                        title="Subjects"
                                        value={subjects}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card>
                                <Link to="/dashboard/quiz">
                                    <Statistic
                                        title="Quizes"
                                        value={quizes}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card>
                                <Link to="/dashboard/question">
                                    <Statistic
                                        title="Questions"
                                        value={questions}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<ArrowUpOutlined />}
                                    />
                                </Link>
                            </Card>
                        </Col>
                    </Row>
                }
                {
                    auth && (auth.role !== 'admin') &&
                    <GuestDashBoard />
                }
            </DashboardLayout>
        </>
    );
}
