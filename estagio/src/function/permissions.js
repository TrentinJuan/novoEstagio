import { PermissionAndroid } from 'react-native'

const hasPermission = async _prPermission => {
    //console.log('PERMITTT', PermissionAndroid.PERMISSION);
    const granted = await PermissionAndroid.check(
        PermissionAndroid.PERMISSION[_prPermission]
    );

    return granted;
}

const requestPermission = async (_prPermission, _prTitle, _prMessage, _prBtnPositive) => {
    const granted = await PermissionAndroid.request(
        PermissionAndroid.PERMISSION[_prPermission]
    );
    return granted
}

export { hasPermission, requestPermission };