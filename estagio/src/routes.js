import { creatAppContainer, createSwitchNavigator, createAppContainer } from 'react-navigation';

import Configuration from './pages/Configuration';
import Login from './pages/Login';
import Main from './pages/Main';
import ResetPassword from './pages/ResetPassword';
import UpdateApp from './pages/UpdateApp';

const Routes = (_prHasConfiguration = false, _prUserLogged = false) => createAppContainer(
    createSwitchNavigator({
        UpdateApp,
        ResetPassword,
        Configuration,
        Main,
        Login
    }, {
        initialRouteName: _prHasConfiguration
            ? _prUserLogged ? 'Main' : 'Login'
            : 'Configuration'

    })
);

export default Routes;