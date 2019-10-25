import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

const Routes = (_prHasConfiguration = false, _prUserLogged = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Main,
        Login,
      },
      {
        initialRouteName: _prUserLogged ? 'Main' : 'Login',
      },
    ),
  );

export default Routes;
