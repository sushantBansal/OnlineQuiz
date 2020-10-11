import React, { useState, useEffect } from 'react';
import { Menu, Layout, Col, Row, Button, Dropdown, AutoComplete } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.scss';
import I18NWrapper from '../../i18n/i18n';
import { LOCALES } from '../../i18n/locale';
import EN from '../../i18n/messges/en-us.json';
import HI from '../../i18n/messges/hi-in.json';
import { connect } from 'react-redux';
import { toggleLanguage, logout, API_URL } from '../../actions';
import { withRouter } from 'react-router-dom';
import logo from '../../images/quiz-logo.png'

import { useStore } from 'react-redux';
import Axios from 'axios';
const { SubMenu } = Menu;

const { Header } = Layout;

const message = {
  [LOCALES.ENGLISH]: EN,
  [LOCALES.HINDI]: HI
}

function HeaderComponent(props) {

  const store = useStore()
  const [auth, setAuth] = useState(useStore().getState().auth);

  useEffect(() => {
    let isUnmounted = false;

    if (!isUnmounted) {
      store.subscribe(() => {
        setAuth(store.getState().auth)
      })
    }

    return () => {
      isUnmounted = true;
    }
  }, [])

  const changeLang = (lgn) => {
    props.toggleLanguage({
      locale: lgn,
      message: message[lgn]
    })
  }

  const handleLogin = () => {
    props.history.push('/login')
  }

  const handleRegister = () => {
    props.history.push('/register')
  }

  const handleLogout = () => {

    props.logout({})
    props.history.push("/")
  }

  const goToDashboard = () => {
    props.history.push("/dashboard")
  }

  const menu = (
    <Menu >
      {
        (auth?.role != 'guest') &&
        <Menu.Item onClick={goToDashboard} key="1" icon={<UserOutlined />}>
          Dashboard
      </Menu.Item>
      }
      <Menu.Item onClick={handleLogout} key="1" icon={<UserOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const languageMenu = (
    <Menu >
      <Menu.Item onClick={() => changeLang(LOCALES.ENGLISH)} key="1" >
        Eng
    </Menu.Item>
      <Menu.Item onClick={() => changeLang(LOCALES.HINDI)} key="1">
        Hindi
    </Menu.Item>
    </Menu>
  )


  const [options, setOptions] = useState([]);

  const handleKeyUp = event => {
    console.log(event.target, event.target.value)
    if (event.which === 13) {
      props.history.push(`/category?q=${event.target.value}`)
    }
    console.log(event.which, event.target.value)
  }

  const handleSelect = (data, option) => {
    console.log({ option })
    if (option.type)
      props.history.push(`/${option.type}/${option.id}`)
  }

  const handleSearch = async (value) => {

    setOptions(value ? await _searchResult(value) : []);
  };

  const _searchResult = async (query) => {

    const response = await Axios.get(`${API_URL}/categories/search/${query}`);
    const { categories, quizes } = response.data.data;

    const result1 = categories.map(category => {

      return {
        value: category.title,
        id: category._id,
        type: 'category',
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                // href={`https://s.taobao.com/search?q=${query}`}
                // target="_blank"
                rel="noopener noreferrer"
              >
                {category.title}
              </a>
            </span>
            {/* <span>{getRandomInt(1, 1)} results</span> */}
          </div>
        ),
      };

    })
    const result2 = quizes.map(category => {

      return {
        value: category.title,
        id: category._id,
        type: 'quiz',
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                // href={`https://s.taobao.com/search?q=${query}`}
                // target="_blank"
                rel="noopener noreferrer"
              >
                {category.title}
              </a>
            </span>
            <span>{getRandomInt(1, 1)} results</span>
          </div>
        ),
      };

    })
    // console.log({ result })
    return ![...result1, ...result2].length ? [{ value: `No result found for ${query}.` }] : [...result1, ...result2];
  }


  return (
    <>
      {/* header */}
      <div className="header">
        <div className="cust-container">
          <div className="header-flex">
            <div className="cust-logo">
              <a href="/">
                <img src={logo} />
              </a>
            </div>
            <div className="search-wrap">
              <ul>
                <li>
                  <a href="javascript:void(0)">Explore</a>
                </li>
                <li>
                  <AutoComplete dropdownMatchSelectWidth={252}
                    onSelect={handleSelect}
                    onKeyUp={handleKeyUp}
                    options={options} onSearch={handleSearch}
                  >
                    <input type="search" placeholder="Search for anything" />
                  </AutoComplete>
                  <span><i class="fa fa-search" aria-hidden="true"></i></span>
                </li>
              </ul>
            </div>
            <nav>
              <ul>
                {!auth?.token && <>
                  <li>
                    <a onClick={handleLogin}>Login</a>
                  </li>
                  <span>OR</span>
                  <li className="regs-btn">
                    <a onClick={handleRegister}>Sign Up</a>
                  </li>
                </>}

                {
                  auth?.token && auth?.role !== 'guest' &&
                  <li>
                    <Dropdown.Button className="mt-2" overlay={menu} placement="bottomCenter" icon={<UserOutlined />}>
                    </Dropdown.Button>
                  </li>
                }
                {
                  props?.match?.url === '/' && <li>
                    <Dropdown.Button overlay={languageMenu} placement="bottomCenter">
                      Language
                    </Dropdown.Button>
                  </li>
                }
                {/* <Button.Group>
                  <Button onClick={() => changeLang(LOCALES.ENGLISH)}>Eng</Button>
                  <Button onClick={() => changeLang(LOCALES.HINDI)}>Hindi</Button>
                </Button.Group> */}
              </ul>
            </nav>

          </div>
        </div>
      </div>
      <div className="empty-margin"></div>
    </>
  );
}

export default connect((state) => ({
  locale: state.locale
}), { toggleLanguage: toggleLanguage, logout: logout })(withRouter(HeaderComponent))


function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}
