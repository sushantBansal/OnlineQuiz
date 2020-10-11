import React from 'react';
import { IntlProvider } from 'react-intl';

export default function I18NWrapper(props) {
    return (
        <>
            <IntlProvider locale={props.locale} messages={props.message}>
                {props.children}
            </IntlProvider>
        </>
    );
}
