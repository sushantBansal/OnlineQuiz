import React from 'react';
import { Row, Col, Card, Input, Button, Select, Form, Alert } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './index.scss';
import { useStore, useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL, login } from '../../../actions';
import { authHeader } from '../../../utils/auth-header';

const RegisterContainer = (props) => {
    const store = useStore();
    const dispatch = useDispatch();
    const [auth, setAuth] = React.useState(store.getState().auth)

    const [state, setState] = React.useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        rePassword: '',
        language: 'en-us'
    })

    const [registerError, setRegisterError] = React.useState('')

    React.useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted) {
            scrollToTop();
            setState({
                ...state,
                userName: auth.userName,
                email: auth.email,
                firstName: auth.firstName
            })
        }
        return () => {
            isUnmounted = true;
        };
    }, [auth])

    const handleChange = (e) => {

        if (auth.email && e.target.name == 'email') {
            return
        }
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const handleLanguage = e => {
        setState({
            ...state,
            language: e
        })
    }

    const handleRegister = async (data) => {

        console.log(data)
        const { userName, firstName, lastName, email, password, rePassword, language } = data;

        if (!userName || !firstName || !lastName || !email || !password || !rePassword || !language) {
            return setState({
                ...state,
                error: true
            })
        }

        setState({
            ...state,
            loading: true,
            error: false
        })
        try {
            if ((userName && firstName && lastName && email && password && rePassword && language)) {
                if (auth && auth.role === 'guest') {
                    const token = auth.token ? auth.token : auth.tempToken;
                    const response = await Axios.put(`${API_URL}/auth/updatedetails`, {
                        ...data,
                        role: 'user'
                    }, authHeader(token))

                    const authMe = await getMe(token);
                    dispatch(login({
                        ...response.data,
                        ...authMe.data.data
                    }));
                    return props.history.push('/dashboard')
                }

                const response = await Axios.post(`${API_URL}/auth/register`, data)
                const authMe = await getMe(response.data.token);
                dispatch(login({
                    ...response.data,
                    ...authMe.data.data
                }));
                return props.history.push('/')
            }
        } catch (error) {
            setState({
                ...state,
                loading: false
            })
            scrollToTop();
            setRegisterError(error.response.data.error)
        }

        setState({
            ...state,
            loading: false
        })
    }

    const scrollToTop = () => {
        window.scrollTo({
            behavior: 'smooth',
            top: 200
        })
    }

    const getMe = async (token) => {
        return Axios.get(`${API_URL}/auth/me`, authHeader(token))
    }

    const handleFinish = async values => {
        if (values[0]?.errors?.length > 0) {
            setState({
                ...state,
                error: true
            })
        } else {
            setState({
                ...state,
                error: false
            })
            await handleRegister(values)
        }
    };

    const closeAlert = () => {
        setRegisterError("")
    }

    const { userName, firstName, lastName, email, password, rePassword, language } = state;

    return (
        <>
            <div className="login-baanner">
                <div className="banner-text">
                    <h2>Register</h2>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            Register
                    </li>
                    </ul>
                </div>
            </div>
            <div className="login-page">
                <div className="cust-container">
                    <div className="login-border">
                        <Row>
                            <Form layout="vertical" colon={false}
                                initialValues={{
                                    userName,
                                    firstName,
                                    lastName,
                                    email,
                                    password,
                                    language,
                                    rePassword
                                }}
                                onError={handleFinish}
                                onFinish={handleFinish}
                                onFieldsChange={handleFinish}
                            >
                                <h2>Register Yourself!</h2>
                                {
                                    registerError && <Alert className="text-capitalize" type="error" message={registerError} showIcon closable onClose={closeAlert} />
                                }
                                <div className="login-wrap">

                                    <div className="login-fields half">
                                        <Form.Item name="userName" label="Username" rules={[
                                            {
                                                required: true,
                                                message: 'Username cannot be blank'
                                            },
                                            {
                                                min: 4
                                            }
                                        ]}>
                                            <Input
                                                required
                                                name="userName"
                                                placeholder="Username"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.userName}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item label="First Name" name="firstName"
                                            rules={[{ required: true, message: 'Firstname cannot be blank' }]}
                                        >
                                            <Input
                                                required
                                                name="firstName"
                                                placeholder="First Name"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.firstName}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item name="lastName" label="Last Name"
                                            rules={[{ required: true, message: 'Lastname cannot be blank' }]}
                                        >
                                            <Input
                                                required
                                                name="lastName"
                                                placeholder="Last Name"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.lastName}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item name="email" label="Email"
                                            rules={[{
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            }, {
                                                required: true,
                                                message: 'Please input your E-mail!',
                                            },]}
                                        >
                                            <Input
                                                required
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.email}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item label="Choose Language" name="language"
                                            rules={[{ required: true, message: 'Select language' }]}
                                        >
                                            <select
                                                required
                                            // value={state.language}
                                            // name="language"
                                            // placeholder="Choose Language"
                                            // onChange={handleLanguage}
                                            >
                                                <option value="en-us">English</option>
                                                <option value="hi-in">Hindi</option>
                                            </select>
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item label="Password" name="password"
                                            rules={[{ required: false, message: 'Password cannot be blank' }]}
                                            hasFeedback
                                        >
                                            <Input
                                                required
                                                type="password"
                                                name="password"
                                                placeholder="Enter Password"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.password}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="login-fields half">
                                        <Form.Item label="Confirm Password" name="rePassword"
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
                                            <Input
                                                required
                                                type="password"
                                                name="rePassword"
                                                placeholder="Confirm Password"
                                                size="large"
                                                onChange={handleChange}
                                                value={state.rePassword}
                                            />
                                        </Form.Item>
                                    </div>

                                </div>
                                <div className="login-btn">
                                    <Button
                                        loading={state.loading}
                                        //onClick={handleRegister}
                                        htmlType="submit"
                                    >
                                        Sign Up
                        </Button>
                                </div>
                                <div className="dont-accct">
                                    Already have an account?  <a href="/login">Login</a>
                                </div>
                            </Form>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withRouter(RegisterContainer);