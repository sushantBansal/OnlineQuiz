import React from 'react';
import { Row, Col, Input, Button, Checkbox, Card, message, Alert } from 'antd';
import { Form } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, API_URL } from '../../../actions';
import Axios from 'axios';
import './index.scss';

import { authHeader } from '../../../utils/auth-header'
import Modal from 'antd/lib/modal/Modal';

const LoginContainer = (props) => {

    const [state, setState] = React.useState({
        email: '',
        password: '',
        forgotPassword: false,
        errorMsg: ''
    });
    const [loginError, setLoginError] = React.useState('');
    const [emailMsg, setEmailMsg] = React.useState({
        type: '',
        msg: ''
    })
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        scrollToTop()
    }, [])

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const scrollToTop = () => {
        window.scrollTo({
            behavior: 'smooth',
            top: 200
        })
    }
    const handleLogin = async () => {
        setState({
            ...state,
            loading: true
        })
        if (!state.error) {
            try {
                const response = await Axios.post(`${API_URL}/auth/login`, state)

                const authMe = await getMe(response.data.token);
                dispatch(login({
                    ...response.data,
                    ...authMe.data.data
                }));
                setState({ ...state, loading: false })
                const role = authMe.data.data.role;
                if (role === 'admin' || 'user') {
                    props.history.push('/dashboard')
                } else if (role === 'guest') {
                    props.history.push('/')
                }
            } catch (error) {
                // alert('Invalid Credentials')
                setState({
                    ...state,
                    loading: false
                })
                setLoginError(error.response.data.error)
            }
        }
        setState({
            ...state, loading: false
        })
    }

    const getMe = async (token) => {
        return Axios.get(`${API_URL}/auth/me`, authHeader(token))
    }

    const handleFinish = values => {
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
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await Axios.post(`${API_URL}/auth/forgotpassword`, {
                email: email
            })

            // message.success(response.data.data)
            setEmailMsg({
                type: 'success',
                msg: 'Reset email has been sent to your mail id.'
            })
            setLoading(false)
            setState({
                ...state,
                email: ''
                //  forgotPassword: false
            })
        } catch (error) {
            setLoading(false)
            setState({
                ...state,
                email: ''
                //forgotPassword: false
            })
            setEmailMsg({
                type: 'error',
                msg: 'Invalid email'
            })
            // message.warning("some thing went wrong")
        }
    }

    const handleFinishForgotPassword = async ({ email }) => {

        setLoading(true)
        await forgotPassword(email)
    }

    const handleClose = () => {
        setState({
            ...state,
            forgotPassword: false,
            email: ''
        })
        setEmailMsg({
            type: '',
            msg: ''
        })
    }

    const loginErrorClose = () => {
        setLoginError('')
    }

    const { email, password } = state;

    return (
        <>
            <div className="login-baanner">
                <div className="banner-text">
                    <h2>Login</h2>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            Login
                    </li>
                    </ul>
                </div>
            </div>
            <div className="login-page">
                <div className="cust-container">
                    <div className="login-border">
                        <Form layout="vertical"
                            initialValues={{
                                email: email,
                                password: password
                            }}
                            onError={handleFinish}
                            onFinish={handleFinish}
                            onFieldsChange={handleFinish}
                        >
                            <h2>Login to Your Account!</h2>
                            {
                                loginError && <Alert showIcon type="error" message={loginError} closable={true} onClose={loginErrorClose} />
                            }
                            <div className="login-wrap">

                                <Col xs={24} className="login-fields">
                                    <Form.Item colon={false} name="email" label="Email" rules={[{
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },]}>
                                        <Input
                                            required
                                            name="email"
                                            placeholder="Email"
                                            size="large"
                                            onChange={handleChange}
                                            value={state.email}
                                        />
                                    </Form.Item>
                                </Col>
                                <div className="login-fields">
                                    <Form.Item colon={false} name="password" label="Password" rules={[{
                                        required: true,
                                        message: 'Please input your password!',
                                    }, {
                                        min: 6
                                    }]} hasFeedback>
                                        <Input
                                            required
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            size="large"
                                            onChange={handleChange}
                                            value={state.password}
                                        />
                                    </Form.Item>
                                </div>

                            </div>
                            <div className="forgot-pass">
                                <Button type="link" onClick={() => {
                                    setState({
                                        ...state,
                                        forgotPassword: true
                                    })
                                }}>
                                    Forgot my password?
                              </Button>
                            </div>
                            <div className="login-btn">
                                <Button
                                    loading={state.loading}
                                    onClick={handleLogin}
                                    type="primary"
                                    htmlType="button"
                                >
                                    Log In
                        </Button>
                            </div>
                            <div className="dont-accct">
                                Don't have an account? <a href="/register">Register</a>
                            </div>
                        </Form>
                    </div>
                    {/* Modal Input username */}
                    <Modal
                        visible={state.forgotPassword}
                        onCancel={handleClose}
                        footer={null}
                    >
                        <Row gutter={[16, 16]} justify="center">
                            <Col xs={20}>
                                <h1 className="text-center">Enter your email</h1>
                            </Col>
                            <Col>
                                {
                                    emailMsg.type && <Alert type={emailMsg.type} showIcon message={emailMsg.msg} />
                                }
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} justify="center">
                            <Col xs={12}>
                                <Form
                                    initialValues={{
                                        email: email
                                    }}
                                    onFinish={handleFinishForgotPassword}
                                >
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
                                        <Input className="w-100" value={email} size="large" placeholder="Enter your email here" />
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

                </div>
            </div>

        </>
    );
}

export default LoginContainer;
