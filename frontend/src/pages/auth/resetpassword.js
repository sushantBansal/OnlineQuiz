import React from 'react';
import HeaderComponent from '../../components/Header'
import { Layout } from 'antd';
import WrapperLayout from '../../Layout';
import ResetpasswordContainer from '../../containers/Auth/Resetpassword';
export default function AuthResetPassword(props) {
    return (
        <>
            <WrapperLayout>
                <ResetpasswordContainer {...props} />
            </WrapperLayout>
        </>
    );
}
