import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Button, Dropdown } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined
} from '@ant-design/icons';
import './index.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../../actions';
const Logo = require('../../../../src/assets/images/quiz-logo.png')

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;


const DashboardLayout = (props) => {


    const [state, setState] = useState({
        collapsed: false,
        auth: null,
        active: 1
    })
    useEffect(() => {

        setState({
            ...state,
            auth: props.auth
        })
    }, [])

    const toggle = () => {
        setState({
            ...state,
            collapsed: !state.collapsed,
        });
    };

    const handleLogout = () => {
        console.log(props)
        props.logout({})
        props.history.push("/")
    }

    const setActive = key => {
        setState({
            ...state,
            active: key
        });
    }

    const goToProfile = () => {
        props.history.push('/profile')
    }

    const menu = (
        <Menu>
            <Menu.Item
                onClick={goToProfile}
                key="1" icon={<UserOutlined />}>
                Profile
          </Menu.Item>
            <Menu.Item onClick={handleLogout} key="1" icon={<UserOutlined />}>
                Logout
          </Menu.Item>
        </Menu>
    );


    const { active } = state;
    const { children } = props

    return (<Layout >
        <Sider className="sidebar" trigger={null} collapsible collapsed={state.collapsed}>

            <Link to="/">
                <div className="my-logo">
                    <img src={Logo} />
                </div>
            </Link>
            {
                state.auth?.role === 'admin' &&
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['']}

                >
                    <Menu.Item key="1" icon={<PieChartOutlined />}
                        onClick={() => setActive(1)}
                    >
                        <Link to="/dashboard">
                            Dashboard
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}
                        onClick={() => setActive(2)}
                    >
                        <Link to="/dashboard/category">
                            Category
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}
                        onClick={() => setActive(3)}
                    >
                        <Link to="/dashboard/subCategory">
                            Sub Category
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}
                        onClick={() => setActive(4)}
                    >
                        <Link to="/dashboard/subject">
                            Subject
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="3">Add Category</Menu.Item> */}
                    <Menu.Item key="5" icon={<UserOutlined />}
                        onClick={() => setActive(5)}
                    >
                        <Link to="/dashboard/quiz">
                            Quiz
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="5">Add Quiz</Menu.Item> */}

                    <Menu.Item key="6" icon={<UserOutlined />}
                        onClick={() => setActive(6)}
                    >
                        <Link to="/dashboard/question">
                            Question
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="7">Add Question</Menu.Item> */}
                    <Menu.Item key="7" icon={<UserOutlined />}>
                        <Link to="/admin/user">
                            Users
                        </Link>
                    </Menu.Item>
                </Menu>
            }
            {
                state?.auth?.role !== 'admin'
                &&
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<PieChartOutlined />}>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>
                    </Menu.Item>
                </Menu>
            }
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background d-flex justify-content-between align-items-center" style={{ width: '100%', padding: 0 }}>
                {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                })}

                <Dropdown.Button className="mt-2 mr-5" overlay={menu} placement="bottomCenter" icon={<UserOutlined />}>
                </Dropdown.Button>

                {/* <Button
                    onClick={handleLogout}
                    className="mr-5" title="Logout">
                    <UserOutlined />
                </Button> */}
            </Header>
            <Content
                className="site-layout-background"
                style={{
                    margin: '2.4rem 1.6rem',
                    padding: 24,
                    minHeight: '50vh',
                }}
            >

                {
                    children
                }
            </Content>
        </Layout>
    </Layout>
    );
}

export default connect((state => ({ auth: state.auth })), { logout: logout })(withRouter(React.memo(DashboardLayout)));