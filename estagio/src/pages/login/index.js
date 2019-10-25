import React, { Component } from 'React';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

import TJLogin from '../../components/TJLogin';

import styles from './styles';

import MD5 from '../../function/md5';
import { findAllUsers, checkUser, getData } from '../../database/utils';

export default class Login extends Component {
    static PropTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    }

    state = {
        users: [],
        currentUser: '',
        password: '',
        continueLogged: false,
        loadig: false,
        error: false,
        message: '',
    }

    saveUser = async () => {
        const { navigation } = this.props;

        if (this.state.continueLogged) {
            await AsyncStorage.setItem('@TJHome:continueLogged', 'true');
        }
        await AsyncStorage.setItem('@TJHome:user', String(this.state.currentUser));

        navigation.navigate('Main');
    };

    updateSetComponent = (_prComponent, _prValue) => {
        this.setState({ [_prComponent]: _prValue });
    }

    getUser = async () => {
        const user = await AsyncStorage.getItem('@TJHome:user');
        this.setState({ currentUser: user > 0 ? parseInt(user) : '' });
    };

    async componentDidMount() {
        findAllUsers()
            .then(response => {
                let result = getData(response);
                let users = [];
                result.map(user => {
                    users.push({
                        label: user.NOME01_USU,
                        value: user.CODIGO_USU,
                    });
                });
                this.setState({ users: [...users], currentUser: 1 });
                this.getUser();
            })
            .catch(err => {
                this.setState({ error: true, message: 'Não foi possível listas os usuários' });
            });
    }

    checkUserExists = async () => {
        const { currentUser, password } = this.state;

        this.setState({ loadig: true });

        checkUser(currentUser, MD5(password))
            .then(response => {
                const data = getData(response)

                if (data.length > 0) {
                    this.saveUser();
                } else {
                    this.setState({ error: true, password: '' });
                }
            })
            .catch(err => this.setState({ error: true }))
    };

    handlerCheckUser = () => {
        this.setState({ loadig: true });

        try {
            this.checkUserExists();
        } catch (error) {
            this.setState({ error: true });
        } finally {
            this.setState({ loadig: false });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TJLogin
                    users={this.state.users}
                    currentUser={this.state.currentUser}
                    password={this.state.password}
                    continueLogged={this.state.continueLogged}
                    loadig={this.state.loadig}
                    urlImage={require('../../assets/images/LogoTJ.png')}
                    checkUser={this.handlerCheckUser}
                    updateSetComponent={this.updateSetComponent}
                    error={this.state.error}
                    message={this.state.message}
                />
            </View>
        )
    }

}