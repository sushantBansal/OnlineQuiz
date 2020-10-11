import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Input, Select, Button, Divider, message, Tooltip, Form, Modal } from 'antd';
import './index.scss'
import Book from '../../images/book.png';
import Gear from '../../images/metal-gear.png';
import Plan from '../../images/strategic-plan.png';
import { injectIntl } from 'react-intl';
import banner from '../../images/banner.png'
import neet from '../../images/neet.png'
import upsc from '../../images/upsc.png'
import jee from '../../images/jee.png'
import Axios from 'axios';
import { useDispatch, useStore } from 'react-redux';
import { API_URL } from '../../utils/constants';
import { login } from '../../actions';
import { withRouter } from 'react-router-dom';
import { authHeader } from '../../utils/auth-header';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


function SearhComponent({ intl, history }) {

    const store = useStore()
    const dispatch = useDispatch();
    const [token, setToken] = useState(store.getState().auth.token)
    const [loading, setLoading] = useState(false);
    const submitRef = useRef(null);
    const [quizes, setQuizes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [state, setState] = useState({
        takeQuiz: false,
        firstName: '',
        email: ''
    })

    useEffect(() => {
        let isunmounted = false;

        if (!isunmounted) {


            (async () => {
                await getCategories();
                getQuizes()

                store.subscribe(() => {
                    setToken(store.getState().auth.token)
                })
            })()
        }
        return () => {
            isunmounted = true;
        };
    }, [store])



    const getQuizes = async () => {
        const response = await Axios.get(`${API_URL}/quizes`);
        setQuizes(response.data.data.filter(quiz => quiz.questions.length > 0))
    }

    const getCategories = async () => {
        const response = await Axios.get(`${API_URL}/categories`);
        setCategories(response.data.data.filter(category => category.subCategories.length > 0))
    }

    const handleTakeQuiz = (quiz) => {
        localStorage.setItem('timer', JSON.stringify({
            remaining: quiz.duration
        }))
        console.log(token)
        if (token) {
            return history.push(`/quiz/${quiz._id}`)
        }

        return history.push(`/register`);
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
            const response = await Axios.post(`${API_URL}/auth/check/user`, {
                ...data,
            })


            if (response.data.token) {
                dispatch(login({
                    ...data
                }));

                setTimeout(() => {
                    setLoading(false)
                    history.push(`/login`)
                }, 2000);
            }

            //  const authMe = await getMe(response.data.token);

        } catch (error) {

            dispatch(login({
                ...data
            }));

            setTimeout(() => {
                setLoading(false)
                history.push(`/register`)
            }, 2000);
            // console.log({ error });
            // try {
            //     const response = await guestLogin(data);
            //     dispatch(login({
            //         ...response.data
            //     }));
            //     setTimeout(() => {
            //         setLoading(false)
            //         history.push(`/quiz/${state.selectedQuiz}`)
            //     }, 2000);
            // } catch (error) {
            //     setLoading(false);
            //     message.error(error.response.data.error)
            // }
            // message.error('Already registered please login')
        }

    }

    const guestLogin = async (data) => {
        return Axios.post(`${API_URL}/auth/glogin`, data)
    }

    const getMe = async (token) => {
        return Axios.get(`${API_URL}/auth/me`, authHeader(token))
    }

    const explore = id => {
        history.push(`/category/${id}`)
    }

    return (
        <>
            <Row>
                <div className="banner">
                    <img src={banner} />
                </div>
                {/* banner */}
                <div className="categories pt-4 pb-4 m-auto">
                    <div className="cust-container">
                        <div className="cust-container">
                            <div className="cust-container">
                                <div class="mt-4">
                                    <div class="section-heading">
                                        <h5 class="section__meta">Categories</h5>
                                        <h2 class="section__title">Popular Categories</h2>
                                        <span class="section-divider">
                                            <div className="circle"></div>
                                        </span>
                                    </div>
                                </div>
                                <Row className="d-flex justify-content-center">
                                    {
                                        categories && !!categories.length &&
                                        <OwlCarousel
                                            className="owl-theme"
                                            loop="true"
                                            margin={10}
                                            items={3}
                                            responsiveClass="true"
                                            center="true"
                                            dotsEach="true"
                                            navText={["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"]}
                                            responsive={{
                                                0: {
                                                    items: 1,
                                                    dots: false,
                                                    center: true
                                                },
                                                600: {
                                                    items: 2,
                                                    center: true,
                                                    nav: true,
                                                    dots: false
                                                },
                                                1000: {
                                                    items: 4,
                                                    slideBy: 1,
                                                    center: false,
                                                    loop: true,
                                                    dots: true,
                                                    nav: true,
                                                    autoplay: true,
                                                    autoplayTimeout: 2000,
                                                    autoplayHoverPause: true,
                                                    lazyLoad: true,
                                                },
                                            }}
                                        >
                                            {
                                                categories.map((category, index) => {
                                                    if (category.display) {
                                                        return <div key="index" className="cat-colm">
                                                            <img alt="" src={category?.image ? category.image : jee} />
                                                            <div class="category-content">
                                                                <div class="category-inner">
                                                                    <h3 class="cat__title"><a href="#">{category.title}</a></h3>
                                                                    <p class="cat__meta">{category?.subCategories?.length} courses</p>
                                                                    <a href={`/category/${category._id}`} class="theme-btn"
                                                                        onClick={() => explore(category._id)}
                                                                    >Explore now</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                }
                                                )
                                            }
                                        </OwlCarousel>
                                    }
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
                {/* categories */}
                <div className="latestquiz">
                    <div className="cust-container">
                        <h2 className="text-center">Latest Quizes</h2>
                        <Row className="latest-quiz-wrap" gutter={[16, 16]}>
                            {
                                quizes.map(quiz => quiz.displayOnLeaderboard ? <div
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
                <div className="latestquiz popular">
                    <div className="cust-container">
                        <h2 className="text-center">Popular Quizes</h2>
                        <Row className="latest-quiz-wrap" gutter={[16, 16]}>
                            {
                                quizes.map(quiz => quiz.displayOnLeaderboard ? <div
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
        </>
    );
}


export default injectIntl(withRouter(SearhComponent))
