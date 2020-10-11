import React from 'react';
import HeaderComponent from '../components/Header';
import FooterComponent from '../components/Footer';

const WrapperLayout = (props) => {
    return (
        <div>
            <HeaderComponent />
            <div>
                {
                    props.children
                }
            </div>
            <FooterComponent></FooterComponent>
        </div>
    )
}

export default WrapperLayout;