import React, { useEffect } from 'react';
import { Layout, Row, Col, Menu, Breadcrumb } from 'antd';
import HeaderComponent from '../../components/Header'
import FooterComponent from '../../components/Footer'
import './index.scss';
import MainContainer from '../../containers/MainContainer';
const { Footer, Sider, Content } = Layout;


export default function Home(props) {
    return (
        <>
            <div>
                <HeaderComponent />
                <div>
                    {
                        <MainContainer />
                    }
                </div>
                <FooterComponent></FooterComponent>
            </div>
        </>
    );
}
