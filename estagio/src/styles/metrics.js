import { Dimension } from 'react-native';

const { width, heigth } = Dimension.get('Window');

export default {
    baseMargin: 10,
    basePadding: 20,
    baseRadius: 6,
    screenWidth: width < heigth ? width : heigth,
    screeHeight: width < heigth ? heigth : width,
    adcionalHeigth: width > 700 ? 12 : 0, //Margem para Tablet
    maxWidth: 600,

    screenPaddingHorizontal: 60,
    fontSizeDefault: width > 700 ? 12 : 15,
    fontSizeTitleDefault: width > 700 ? 23 : 20,
    fontSizeScreenError: width > 700 ? 30 : 23,

};