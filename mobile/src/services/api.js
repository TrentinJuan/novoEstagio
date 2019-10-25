import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.31:9090/',
    timeout: 15000,
});

/*http://192.168.1.31:9090/?FUNCAO=2&TIPRET=JSON&VERSAO=20190508&USUARI=1*/

/*http://192.168.1.31:9090/?FUNCAO=102&TIPRET=JSON&VERSAO=20190508&USUARI=1&RQUERY=${_prCommand}*/

const formatResponse = _prResponse => {
    if (_prResponse.indexOf('[{') === -1 && (_prResponse.indexOf('[]') === 0)) return [];

    var inicioData = _prResponse.indexOf('[{');
    var finalData = _prResponse.length;

    return inicioData === -1 ?
        _prResponse.substring(inicioData, finalData) :
        eval(_prResponse.substring(inicioData, finalData));
}

export { api, formatResponse };