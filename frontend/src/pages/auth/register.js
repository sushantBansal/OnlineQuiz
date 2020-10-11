import React from 'react';
import HeaderComponent from '../../components/Header';
import { Layout } from 'antd';
import WrapperLayout from '../../Layout';
import RegisterContainer from '../../containers/Auth/Register';
const { Content, Footer } = Layout;

export default function AuthRegister() {
    return (
        <>
            <WrapperLayout>
                <RegisterContainer />
            </WrapperLayout>
        </>
    );
}
