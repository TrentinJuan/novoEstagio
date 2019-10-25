import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import { View, Text, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';

class Header extends Component {
    static PropTypes = {
        title: PropTypes.string.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired
    }

    state = {
        showIconClose: false
    }

    showIconClose = async => {
        const showIconClose = await AsyncStorage.getItem('@TJHome:configurationCalledByMenu');

        this.setState({ showIconClose: showIconClose === 'true' });
    }

    async componentDidMount() {
        await this.showIconClose();
    }

    closeConfiguration = async () => {
        const { navigation } = this.props;

        await AsyncStorage.setItem('@TJHome:configurationCalledByMenu');

        navigation.navigate("Main");
    }

    render() {
        const { title, showIcon = true, showMenu } = this.props

        return (
            <View style={styles.container}>
                {
                    this.state.showIconClose
                        ? <TouchableOpacity style={styles.button} accessible={true} onAccessibilityTap={this.closeConfiguration} onPress={this.closeConfiguration}><Icon name="window-close" size={32} style={styles.iconClose} /></TouchableOpacity>
                        : <Icon name="menu" size={32} style={styles.iconHide} />
                }

                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.button} onPress={showMenu}>
                    {showIcon
                        ? <Icon name="menu" size={32} style={styles.icon} />
                        : <Icon name="menu" size={32} style={styles.iconHide} />
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

export default whitNavigation(Header);