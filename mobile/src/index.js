import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import createNavigator from './routes';

export default class App extends Component {
  state = {
    userChecked: true,
    userLogged: false,
    hasConfiguration: false,
  };

  render() {
    const {userChecked, userLogged, hasConfiguration} = this.state;

    if (!userChecked) return null;

    const Routes = createNavigator(hasConfiguration, userLogged);

    return (
      <View style={{flex: 1}}>
        <StatusBar translucent barStyle="dark-content" backgroundColor="#EEE" />
        <Routes />
      </View>
    );
  }
}
