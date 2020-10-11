import React from 'react';
import { Layout } from 'antd';
import TestContainer from '../../containers/TestContainer';
import HeaderComponent from '../../components/Header'
const { Footer, Content } = Layout;


export default function Test() {
    return (
        <>
            <Layout>
                <HeaderComponent />
                <Content className="site-layout bg-aqua mt2" style={{ padding: '50px 50px', marginTop: 64, backgroundColor: '#fff' }}>
                    {
                        <TestContainer />
                    }
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </>
    );
}
