import { Layout } from 'antd';
import React from 'react';
import HeaderComponent from '../../components/Header';
import SubjectContainer from '../../containers/Subject';
const { Footer, Content } = Layout;

const Subject = props => {
    return (
        <Layout>
            <HeaderComponent />
            <Content className="site-layout bg-aqua mt2" style={{ padding: '50px 50px', marginTop: 64, backgroundColor: '#fff' }}>
                {
                    <SubjectContainer />
                }
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}

export default Subject;