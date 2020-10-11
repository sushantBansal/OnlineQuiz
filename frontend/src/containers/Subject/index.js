import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../../utils/constants';
import { Row, Col, Tooltip, Modal, Form, Button, message, Input, Divider, Card } from 'antd';
import PlaceHolderImage from '../../images/jee.png'
import QueryString from 'query-string';
import { List, Avatar } from 'antd';
import { login } from '../../actions';
import { useDispatch, useStore } from 'react-redux';
import { authHeader } from '../../utils/auth-header';
import Meta from 'antd/lib/card/Meta';

const SubjectContainer = props => {

    const store = useStore();
    const dispatch = useDispatch();
    const [token, setToken] = useState(store.getState().auth.token)
    const [category, subSubject] = useState({})
    const [subjects, setCategories] = useState([])
    const [query, setQuery] = useState({ q: '' })
    const [quizes, setQuizes] = useState([])
    const [state, setState] = useState({
        takeQuiz: false,
        firstName: '',
        email: ''
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        let isUnmounted = false;
        let id = props?.match?.params?.id;
        let query = QueryString.parse(props.location.search).q
        if (!isUnmounted) {

            store.subscribe(() => {
                setToken(store.getState().auth.token)
            })

            if (id) {
                getSubjectById(id)
            }
        }

        return () => {
            isUnmounted = true;
        };
    }, [props.match.params.id, props.location.search])

    const getSubjectById = async id => {
        const response = await Axios.get(`${API_URL}/subjects/${id}`)
        subSubject(response.data.data)
        setQuizes(response.data.data.quizes)
    }

    const guestLogin = async (data) => {
        return Axios.post(`${API_URL}/auth/glogin`, data)
    }

    const getMe = async (token) => {
        return Axios.get(`${API_URL}/auth/me`, authHeader(token))
    }

    const handleTakeQuiz = (quiz) => {
        localStorage.setItem('timer', JSON.stringify({
            remaining: quiz.duration
        }))
        if (token) {
            return props.history.push(`/quiz/${quiz._id}`)
        }

        return props.history.push(`/register`)
        // setState({
        //     ...state,
        //     takeQuiz: true,
        //     selectedQuiz: quiz._id
        // });
    }

    const handleClose = () => {
        setState({
            ...state,
            takeQuiz: false
        })
    }

    const handleFinish = async (data) => {
        setLoading(true)
        try {
            const response = await Axios.post(`${API_URL}/auth/register`, {
                ...data,
                role: 'guest'
            })

            const authMe = await getMe(response.data.token);
            dispatch(login({
                ...response.data,
                ...authMe.data.data
            }));

            setTimeout(() => {
                setLoading(false)
                props.history.push(`/quiz/${state.selectedQuiz}`)
            }, 2000);
        } catch (error) {

            console.log({ error });
            try {
                const response = await guestLogin(data);
                dispatch(login({
                    ...response.data
                }));
                setTimeout(() => {
                    setLoading(false)
                    props.history.push(`/quiz/${state.selectedQuiz}`)
                }, 2000);
            } catch (error) {
                setLoading(false);
                message.error(error.response.data.error)
            }
            // message.error('Already registered please login')
        }

    }
    return (
        <Row>
            {
                subjects.length === 0 &&
                <React.Fragment>
                    <Col className="cat-colm m-0" style={{
                        height: 200,
                    }} xs={24}>
                        <img alt="Category image" src={category.image ? category.image : PlaceHolderImage} />
                        <div className="category-content">
                            <div className="category-inner">
                                <h3 className="cat__title text-white">{category?.title}</h3>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24}>
                        <div className="latestquiz">
                            <div className="cust-container">
                                <h2 className="text-center">Quizes</h2>
                                <Row className="latest-quiz-wrap" gutter={[16, 16]}>
                                    {
                                        quizes?.map(quiz => quiz.displayOnLeaderboard ? <div
                                            onClick={() => quiz.duration > 0 ? handleTakeQuiz(quiz) : ''}
                                            className="latest-quiz-list" xs={24} md={8} lg={6}>
                                            <Tooltip title="Take this quiz">
                                                <h3 >{quiz.title}</h3>

                                                <ul>
                                                    <li>
                                                        <span className="ques-icon">
                                                            <i class="fa fa-question-circle"></i>
                                                        </span>
                                                        <span className="ques-no">
                                                            {quiz?.questions?.length}
                                                        </span>
                                                        <span className="ques">
                                                            Questions
                                </span>
                                                    </li>
                                                    <li>
                                                        <span className="ques-icon">
                                                            <i class="fa fa-clock-o"></i>
                                                        </span>
                                                        <span className="ques-no">
                                                            {quiz.duration}
                                                        </span>
                                                        <span className="ques">
                                                            Minute
                                </span>
                                                    </li>
                                                </ul>
                                            </Tooltip>
                                        </div> : '')
                                    }
                                </Row>
                            </div>
                        </div>
                    </Col>
                </React.Fragment>
            }

            {/* Modal Input username */}
            <Modal
                visible={state.takeQuiz}
                onCancel={handleClose}
                footer={null}
            >
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={20}>
                        <h1 className="text-center">Enter your details</h1>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={12}>
                        <Form
                            initialValues={{
                                firstName: state.firstName,
                                email: state.email
                            }}
                            onFinish={handleFinish}
                        >
                            <Form.Item
                                label=""
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your name.'
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
                                        message: 'Please enter your email.'
                                    }
                                ]}
                            >
                                <Input className="w-100" size="large" placeholder="Enter your email here" />
                            </Form.Item>
                            <Form.Item>
                                <Button loading={loading} className="w-100" size="large" id="submit" className="display-none" type="primary" htmlType="submit">
                                    Submit
                                    </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        </Row>
    )
}


export default withRouter(SubjectContainer);