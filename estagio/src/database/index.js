import { openDatabase, enablePromise } from 'react-native-sqlite-storage';

const databsae = openDatabase({ name: 'TJHome', location: '~/src/database/TJHome.sqlite' });

enablePromise(true);

export default databsae;