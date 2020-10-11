import React from 'react';
import { RouteWrapper } from './router';
import './App.scss';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';


const App = (props) => {

  return (
    <React.Fragment>
      <IntlProvider locale={props.locale.locale} messages={props.locale.message}>
        <RouteWrapper />
      </IntlProvider>
    </React.Fragment>
  );
}

export default connect(state => ({
  locale: state.locale
}), {})(App);
