import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { Row, Col, Divider, Tooltip, Input, Button, message } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import { QuestionCircleOutlined, FieldTimeOutlined, UnlockOutlined, UserOutlined, HeartFilled, EyeFilled } from '@ant-design/icons'
import { t } from '../../i18n/translate';
import { injectIntl } from 'react-intl';
import Axios from 'axios';
import { truncate } from 'lodash';
import Modal from 'antd/lib/modal/Modal';
import { Form } from 'antd';
import { withRouter } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux';
import { login, API_URL } from '../../actions';

function Quizes(props) {

    const dispatch = useDispatch();
    const [token] = useState(useStore().getState().auth.token)
    const submitRef = useRef(null);
    const [quizes, setQuizes] = useState([]);
    const [state, setState] = useState({
        takeQuiz: false,
        userName: '',
        email: ''
    })

    useEffect(() => {
        let isunmounted = false;

        if (!isunmounted) {
            getQuizes()
        }
        return () => {
            isunmounted = true;
        };
    }, [])


    const getQuizes = async () => {
        const response = await Axios.get(`${API_URL}/quizes`);
        setQuizes(response.data.data)
    }

    const handleTakeQuiz = (id) => {
        if (token) {
            return props.history.push(`/quiz/${id}`)
        }
        setState({
            ...state,
            takeQuiz: true,
            selectedQuiz: id
        });
    }

    const handleClose = () => {
        setState({
            ...state,
            takeQuiz: false
        })
    }

    const handleFinish = async (data) => {
        try {
            const response = await Axios.post(`${API_URL}/auth/register`, {
                ...data,
                password: 'password',
                role: 'guest'
            })
            dispatch(login(response.data));
            props.history.push(`/quiz/${state.selectedQuiz}`)
        } catch (error) {
            console.log({ error })
            message.error('Already registered please login')
        }

    }

    return (

        <React.Fragment>
            <Row gutter={[16, 8]}>
                <Col xs={24} >
                    <h1 className="text-center mb-n3 title-quiz">{props.intl.formatMessage({ id: `home.${props.id}` })}</h1>
                </Col>
                <Col xs={24}>
                    <Divider type="horizontal" />
                </Col>
                <Col>
                    <Row gutter={[16, 20]} justify="space-around" >
                        {
                            quizes.map((quiz, index) =>
                                <Col xs={20} md={10} lg={5} className={`quiz-cards quiz-cards-${index}`}>
                                    <Row gutter={[16, 10]} justify="space-between">
                                        <Col xs={24}>
                                            <Row justify="space-between" align="middle">
                                                <Col xs={4}>
                                                    <Row justify="space-between" align="middle">
                                                        <Col>
                                                            <EyeFilled style={{ color: '#fff', fontSize: '1.5rem' }} />
                                                        </Col>
                                                        <Col>
                                                            <p className="quiz-view-count">5</p>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col xs={2}>
                                                    <HeartFilled style={{ color: '#fff', fontSize: '1.5rem' }} />
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24}>
                                            <Row justify="center">
                                                <Tooltip
                                                    className="cursor-pointer" title="Take this Quiz">
                                                    <Col onClick={() => handleTakeQuiz(quiz._id)} style={{ height: '10rem' }} xs={24}>
                                                        <p className="quiz-title text-center">
                                                            {truncate(quiz.title, {
                                                                length: 58
                                                            })}
                                                        </p>
                                                    </Col>
                                                </Tooltip>
                                            </Row>
                                        </Col>
                                        <Col>
                                            <Row gutter={[16, 8]} justify="center">
                                                <Col xs={8}><Row gutter={[16]} justify="center" align="middle"
                                                    style={{ textAlign: 'center' }}
                                                >
                                                    <Col flex xs={24}>
                                                        <QuestionCircleOutlined style={{ color: '#fff', fontWeight: 600, fontSize: '3rem' }} />
                                                    </Col>
                                                    <Col xs={24}>
                                                        <h1 className="quiz-stats-number mt-2">{quiz.noOfQuestion}</h1>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <p className="quiz-stats-text mt-n2">
                                                            Questions
                                                        </p>
                                                    </Col>
                                                </Row></Col>
                                                <Col xs={8}><Row gutter={[16]}
                                                    style={{ textAlign: 'center' }}
                                                    justify="center">
                                                    <Col xs={24}> <FieldTimeOutlined style={{ color: '#fff', fontWeight: 600, fontSize: '3.4rem', marginTop: '-0.35rem' }} /></Col>
                                                    <Col xs={24}>
                                                        <h1 className="quiz-stats-number mt-2">{quiz.duration}</h1>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <p className="quiz-stats-text mt-n2">
                                                            Minute
                                                        </p>
                                                    </Col>
                                                </Row></Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24}>
                                            <Row style={{ position: 'relative', top: '1rem' }} justify="space-between" align="middle" >
                                                <Col xs={2}><UserOutlined style={{ color: '#fff', fontSize: '1.5rem' }} /></Col>
                                                <Col xs={20}>
                                                    <p className="quiz-stats-text">Site Administor</p>
                                                </Col>
                                                <Col xs={2}><UnlockOutlined style={{ color: '#fff', fontSize: '1.5rem' }} /></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        }
                    </Row>
                </Col>

                {/* Modal Input username */}
                <Modal
                    visible={state.takeQuiz}
                    onCancel={handleClose}
                    footer={null}
                >
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={20}>
                            <h1 className="text-center">Enter your name</h1>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={12}>
                            <Form
                                initialValues={{
                                    userName: state.userName,
                                    email: state.email
                                }}
                                onFinish={handleFinish}
                            >
                                <Form.Item
                                    label=""
                                    name="userName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your name before proceed'
                                        }
                                    ]}
                                >
                                    <Input className="w-100" size="large" placeholder="Enter your name here" />
                                </Form.Item>
                                <Form.Item
                                    label=""
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter your email before proceed'
                                        }
                                    ]}
                                >
                                    <Input className="w-100" size="large" placeholder="Enter your name here" />
                                </Form.Item>
                                <Form.Item>
                                    <Button className="w-100" size="large" ref={submitRef} id="submit" className="display-none" type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </Row>
        </React.Fragment>

    );
}

export default injectIntl(withRouter(Quizes))