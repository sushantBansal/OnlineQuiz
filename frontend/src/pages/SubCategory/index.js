import { Layout } from 'antd';
import React from 'react';
import HeaderComponent from '../../components/Header';
import SubCategoryContainer from '../../containers/SubCategory';
const { Footer, Content } = Layout;

const SubCategory = props => {
    return (
        <Layout>
            <HeaderComponent />
            <Content className="site-layout bg-aqua mt2" style={{ padding: '50px 50px', marginTop: 64, backgroundColor: '#fff' }}>
                {
                    <SubCategoryContainer />
                }
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}

export default SubCategory;