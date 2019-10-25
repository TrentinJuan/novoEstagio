import { StyleSheet } from 'react-native';
import { getStatusBarHeigth } from 'react-native-status-bar-height';

import { colors, metrics } from '../../styles';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height: 54 + getStatusBarHeigth(),
        paddingTop: getStatusBarHeigth(),
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    buttons: {
        width: 50,
        alignItems: 'center',
    },

    title: {
        fontSize: metrics.fontSizeDefault,
        fontWeight: 'bold',
        color: colors.darker,
    },

    icon: {
        width: 30,
        color: color.darker,
    },
    

    iconClose: {
        color: colors.darkTransparent,
    },

    iconHide: {
        width: 50,
        color: colors.transparent,
    },
});

export default styles;