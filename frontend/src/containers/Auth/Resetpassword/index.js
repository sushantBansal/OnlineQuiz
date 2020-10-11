import React from 'react';
import { Row, Col, Input, Button, Checkbox, Card, message } from 'antd';
import { Form } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, API_URL } from '../../../actions';
import Axios from 'axios';
import './index.scss';

import { authHeader } from '../../../utils/auth-header'

const ResetPasswordContainer = (props) => {

    const [state, setState] = React.useState({
        rePassword: '',
        password: ''
    })
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const handleResetPassword = async () => {
        let id = props?.match?.params?.resettoken;
        setState({
            ...state,
            loading: true
        })
        if (!state.error && id) {
            try {
                const response = await Axios.put(`${API_URL}/auth/resetpassword/${id}`, state)

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
                message.error('Invalid Token')
                setState({ ...state, loading: false })
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

    const { rePassword, password } = state;

    return (
        <>
            <div className="login-baanner">
                <div className="banner-text">
                    <h2>Reset Password</h2>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            Reset Password
                    </li>
                    </ul>
                </div>
            </div>
            <div className="login-page">
                <div className="cust-container">
                    <div className="login-border">
                        <Form layout="vertical"
                            initialValues={{
                                password: password,
                                rePassword: rePassword
                            }}
                            onError={handleFinish}
                            onFinish={handleFinish}
                            onFieldsChange={handleFinish}
                        >
                            <h2>Reset Your Password!</h2>
                            <div className="login-fields half">
                                <Form.Item label="Password" name="password"
                                    rules={[{ required: false, message: 'Password cannot be blank' },
                                    {
                                        min: 6,
                                    }]}
                                    hasFeedback
                                >
                                    <Input
                                        required
                                        type="password"
                                        name="password"
                                        placeholder="Enter New Password"
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

                            <div className="login-btn">
                                <Button
                                    loading={state.loading}
                                    onClick={handleResetPassword}
                                    type="primary"
                                    htmlType="button"
                                >
                                    Submit
                        </Button>
                            </div>
                        </Form>
                    </div>


                </div>

            </div>

        </>
    );
}

export default ResetPasswordContainer;
