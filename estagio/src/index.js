import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';

import createNavigator from './routes';

import { findConfigurationSync, getData } from './database/utils';

export default class App extends Component {
    state = {
        userChecked: false,
        userLogged: false,
        hasConfiguration: false,
    };

    async clearStoreProps() {
        await AsyncStorage.setItem('@TJHome:configurationCallByMenu', 'false');
    }

    setEnv = () => {
        process.env.VERSION_APP = 20190508;
    }

    //Onde Monta o componente.
    async componentDidMount() {
        this.setEnv();
        try {
            await this.clearStoreProps();
            const resp = await findConfigurationSync();
            const userLogged = await AsyncStorage.getItem('@TJHome:continueLogged');
            this.setState({
                hasConfiguration: getData(resp[0]).length > 0,
                userChecked: true,
                userLogged: userLogged === 'true'
            });
        } catch (err) {
            this.setState({ userChecked: true });
        }
    }

    screeError = () => {
        return (
            <View style={styles.containerError}>
                <Icon name="emoticon-cry-outline" size={220} style={styles.iconError} />
                <Text style={styles.textError}>Erro ao carregar a aplicação</Text>
            </View>
        );
    }

    render() {
        const { userChecked, userLogged, hasConfiguration } = this.state;

        if (!userChecked) return null;

        const Routes = createNavigator(hasConfiguration, userLogged);

        return (
            <View style={styles.container}>
                <StatusBar translucent barStyle="dark-content" backgroundColor="#EEE"/>
            </View>
        );
    }
}
