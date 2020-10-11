import React from 'react';
import HeaderComponent from '../../components/Header'
import { Layout } from 'antd';
import WrapperLayout from '../../Layout';
import LoginContainer from '../../containers/Auth/Login';
const { Content, Footer } = Layout;
export default function AuthLogin(props) {
    return (
        <>
            <WrapperLayout>
                <LoginContainer {...props} />
            </WrapperLayout>
        </>
    );
}
