import React from 'react';
import CategoryContainer from '../../containers/Category'
import { Layout } from 'antd';
import HeaderComponent from '../../components/Header'
const { Footer, Content } = Layout;

const Category = props => {
    return (
        <Layout>
            <HeaderComponent />
            <Content className="site-layout bg-aqua mt2" style={{ padding: '50px 50px', marginTop: 64, backgroundColor: '#fff' }}>
                {
                    <CategoryContainer />
                }
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}

export default Category;