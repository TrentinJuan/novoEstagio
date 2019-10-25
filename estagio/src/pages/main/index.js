import React, { Component } from 'react';

import {
    View,
    Dimensio,
    AcitivityIndicator,
    StatusBar,
    FlaList,
    Text,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Dimensions,
    FlatList
} from 'react-native';

import { OverLay, Divider } from 'react-native-elements';
import Icon from 'react-native-community/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';

import Header from '../../components/Header';
import Item from './Item';
import Mensagem from '../../components/Mensagem';

import { formatResponse, api } from '../../services/api';
import enCripta from '../../function/enCripta';
import { getData, fundConfiguration, findUserByIdSync, findConfigurationTeste, findConfiguration } from '../../database/utils';
import { hasPermision, requestPermission } from '../../function/permissions';

import styles from './styles';
import { number } from 'prop-types';

export default class Main extends Component {
    constructor() {
        super();

        this.state = {
            data: [],
            loading: true,
            configuration: '',
            refreshing: false,
            intervalRequest: null,
            overlayIsVisible: false,
            error: false,
            message: true,
            width: Dimensions.get('window').width,
            paramSeparetor: '<#>',
            isExecutionOperation: false,
            hasData: true,
            latestVersionApp: true,
            user: [],
        }

        Dimensions.addEventListener('change', dimensions => {
            this.setState({ width: dimensions.screen.width })
            this.renderList();
        });

        toogleButtonLoading = _prCodigo => {
            buttons = [...this.state.data];
            buttons.map(btn => {
                if (btn.codigo == _prCodigo) {
                    btn.loadingButton = !btn.loadingButton;
                }
                return btn;
            });
            this.setState({ data: [...buttons] });
        }

        handlerSaveLog = _prLog => {
            _prLog = enCripta(JSON.stringify([_prLog]));

            api.get(`${this.getUrl()}?FUNCAO=104&RQUERY=${_prLog}`)
                .then(response => { })
                .catch(err => { });
        }

        //conversor de data/tempo
        getDate() = () => {
            const currentDate = new Date();

            const hours = (currentDate.getHours() * 60 + currentDate.getMinutes()) * 60;
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1 >= 10 ? currentDate.getMonth() + 1 : '0' + (currentDate.getMonth() + 1);
            const day = currentDate.getDate() >= 10 ? currentDate.getDate : '0' + currentDate.getDate();

            return {
                hours: hours,
                date: `${year}-${month}-${day}`
            }
        }

        saveEventLog = async _prButton => {
            const { user } = this.state;
            const currentData = this.getDate();

            const log = {
                usuari_evt: user.CODIGO_USU,
                codigo_evt: parseInt(_prButton.codigo),
                descri_evt: _prButton.title,
                hora01_evt: currentData.hours,
                latitu_evt: 0.0,
                longit_evt: 0.0,
                dtaevt_evt: currentData.date
            };

            const granted = await hasPermision('ACESS_FINE_LOCATION');

            //Verifica onde esta o usuario atraves da sua posivcao geografica
            if (granted) {
                navigator.geolocation.getCurrentPosition(
                    response => {
                        if (response.coords) {
                            log.latitu_evt = response.coords.latitude;
                            log.longit_evt = response.coords.longitude;
                        }
                        this.handlerSaveLog(log)
                    },
                    err => this.handlerSaveLog(log),
                    { enableHighAccuracy: true, timeout: 5000 }
                );
            } else {
                this.handlerSaveLog(log);
            }
        }

        //Metodo responsavel por realizar a acao sobre o botao
        handlerExecuteAction = _prButton => {
            const { paramSeparetor, isExecutionOperation, user } = this.state;

            if (isExecutionOperation) return;

            this.setState({ isExecutionOperation: true, error: false });
            this.toogleButtonLoading(_prButton.codigo);

            let command = _prButton.codigo;
            command += paramSeparetor;

            if (user) {
                //foi enviado o codigo do usuario no parametro
                //para que possa ser usado tambem nos scripts, no server ele manda USUARI, porem como houve essa mudandaca
                //ficara da seguinte forma
                command += user.CODIGO_USU;
                command += paramSeparetor;
                command += user.SENHA1_USU;
            } else {
                command += paramSeparetor;
            }

            command += paramSeparetor;
            command = enCripta(command);
            command = command.replace(/#/g, '%23');

            const app_version = process.env.VERSION_APP;
            try {
                api.get(`${this.getUrl()}?FUNCAO=102&TIPRET=JSON&VERSAO=${app_version}&USUARI=${user.CODIGO_USU}&RQUERY=${command}`)
                    .then(response => {
                        if (response.data === 'OK') {
                            let buttons = [...this.state.data];
                            buttons.map(btn => {
                                if (btn.codigo = _prButton.codigo) {
                                    btn.active = !btn.active;
                                }
                                return btn;
                            });
                            this.saveEventLog(_prButton);
                        } else {
                            this.setState({ error: true, message: 'Não foi possível realizar a ação!' });
                        }
                        this.toogleButtonLoading(_prButton.codigo);
                        this.setState({ message: 'Erro ao se comunicar com o servidor', error: true });
                    });
            } catch (error) {
                this.setState({ error: true, message: 'Não foi possível realizar a ação' });
            } finally {
                this.setState({ isExecutionOperation: false });
            }
        }

        renderListItem = ({ Item }) => {
            return <Item width={this.state.width} button={item} handlerExecuteAction={this.handlerExecuteAction} />
        }

        rednerList = () => {
            const { data, refreshing, width } = this.state;

            //FlatList = Lista Plana
            return (
                <FlatList
                    data={[...data]}
                    keyExtractor={item => String(item.codigo)}
                    renderItem={this.renderListItem}
                    onRefresh={this.handlerExecuteAction}
                    numColumns={width > 700 ? 2 : 1}
                    columnWrapperStyle={width > 700 ? styles.columnWrapper : null}
                    contentContainerStyle={styles.contentWrapper}
                    refreshing={refreshing}
                />
            );
        }

        getUrl = () => {
            let url = `http://${this.state.configuration.ENDERE_CFG}`;
            if (this.state.configuration.PORTA_CFG > 0) {
                url += `:${this.state.configuration.PORTA_CFG}`;
            }
            return url;
        }

        handlerSearchActions = async () => {
            this.setState({ error: false, loading: true });

            try {
                const user = await AsyncStorage.getItem('@TJHome:user');

                const app_version = process.env.VERSION_APP;

                api.get(`${this.getUrl()}?FUNCAO=2&TIPRET=JSON&VERSAO=${app_version}&USUARI=${user}`)
                    .then(response => {
                        if (response.data === 'UPDATEAPP') {
                            this.setState({ latestVersionApp: false, loading: false });
                        } else {
                            const data = formatResponse(response.data.length === 0 ? '[]' : response.data);
                            let buttons = [];
                            data.map(btn => {
                                buttons.push({
                                    codigo: btn.BOTOES_LIB,
                                    title: btn.DESCRI_LIB,
                                    active: number(btn.ENABLE_LIB) === 0 ? false : true,
                                    loadingButton: false
                                });
                            });
                            this.setState({ loading: false, data: buttons, hasData: buttons.length > 0 });
                        }
                    })
                    .catch(err => this.setState({ loading: false, error: true, message: 'Erro ao se comunicar com o servidor' }));
            } catch (error) {
                this.setState({ loading: false, error: true, message: 'Erro ao se comunicar com o servidor' })
            }
        }

        findUser = async () => {
            const currentUser = await AsyncStorage.getItem('@TJHome:user');
            let user = await findUserByIdSync(currentUser)

            const data = getData(user[0]);
            this.setState({ user: data[0] });
        }

        componentDidMount = () => {
            requestPermission('ACESS_FINE_LOCATION')
                .then(granted => { });

            findConfiguration()
                .then(response => {
                    let data = getData(response);
                    if (data.length > 0) {
                        this.setState({ configuration: data[0] });

                        if (data[0].SYNCRO_CFG === "true") {
                            let interval = Number(data[0].INTERV_CFG) > 0 ? Number(data[0].INTERV_CFG) * 1000 : 5000;
                            const intervalRequest = setInterval(() => this.handlerExecuteAction(), interval);
                            this.setState({ intervalRequest: intervalRequest });
                        }
                        this.findUser();
                        this.handlerSearchActions();
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, error: true, message: 'Não foi possível listar as configurações' });
                });
        }

        //metodo pra sair do sistema 
        signOut = async () => {
            const { navigation } = this.props;

            await AsyncStorage.clear();

            if (this.state.intervalRequest) {
                clearInterval(this.state.intervalRequest);
            }

            navigation.navigate('Login');
        }

        showMenu = () => {
            this.setState({ overlayIsVisible: true });
        }

        changeSettings = async () => {
            const { navigation } = thi.props;

            await AsyncStorage.setItem('@TJHome:configurationCalledByMenu', 'true');

            navigation.navigate("Configuration");
        }

        changePassoword = async () => {
            const { navigation } = this.props;

            await AsyncStorage.setItem('@TJHome:configurationCalledByMenu', 'true');

            navigation.navigate("ResetPassword");
        }

        overlay = () => {
            const { overlayIsVisible, user } = this.state;

            return (
                <View>
                    {overlayIsVisible && <StatusBar translucent backgroundColor="rgba(0,0,0,.4)" barStyle="dark-content" />}
                    <OverLay
                        overlayStyle={styles.containerOverlay}
                        onBackDropPress={() => this.setState({ overlayIsVisible: false })}
                        isVisible={overlayIsVisible}>
                        <View>
                            <View style={styles.contentContainerTitleOverlay}>
                                <icon style={styles.iconTitle} size={45} name="home-account" />
                                <View style={styles.containerUser}>
                                    <Text style={styles.textWelcomeTitle}>Bem Vindo</Text>
                                    <Text style={styles.textUsernameTitle}>{user.NOME01_USU}</Text>
                                </View>

                            </View>
                            <View style={styles.conteinerSettingsOverlay}>
                                <View style={styles.containerDefineSettings}>
                                    <TouchableOpacity style={styles.containerTouchDefineSettings} onPress={this.changeSettings}>
                                        <Icon style={styles.iconDefineSettings} size={30} name="settings-outline" />
                                        <Text style={styles.textDefineSettings}>Alterar Configuracao</Text>
                                    </TouchableOpacity>
                                </View>

                                <Divider style={styles.dividerDefineSettings} />
                                <View style={styles.containerDefineSettings}>
                                    <TouchableOpacity style={styles.containerTouchDefineSettings} onPress={this.changePassoword}>
                                        <Icon style={styles.iconDefineSettings} size={30} name="lock-reset" />
                                        <Text style={styles.textDefineSettings}>Redefinir Senha</Text>
                                    </TouchableOpacity>
                                </View>

                                <Divider style={styles.dividerDefineSettings} />
                                <View style={styles.containerDefineSettings}>
                                    <TouchableOpacity style={styles.containerTouchDefineSettings} onPress={this.signOut}>
                                        <Icon style={styles.iconDefineSettings} size={30} name="lock-reset" />
                                        <Text style={styles.textDefineSettings}>Deslogar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.containerButtonsSairOverlay}>
                                <TouchableOpacity style={styles.buttonSairOverlay} onPress={() => this.setState({ overlayIsVisible: false })}>
                                    <Text style={styles.textButtonSairOverlay}>Sair</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </OverLay>
                </View>
            )
        }

        screeNoPermission = () => {

            return (
                <ScrollView refreshControl={<RefreshControl onRefresh={this.handlerSearchActions} refreshing={this.state.loading} />}>
                    <View style={styles.containerNoPermission}>
                        <Icon name="emoticon-cry-outline" size={220} style={styles.iconNoPermission} />
                        <Text style={styles.textNoPermissions}>Nenhuma acao configurada</Text>
                    </View>
                </ScrollView>
            );
        }

        render = () => {
            const { loading, error, message, hasData, latestVersionApp } = this.state;

            return (
                <View style={styles.container}>
                    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                    <Header title='TJ Home' showIconClose={false} showMenu={this.showMenu} />
                    {error && <Mensagem
                        container={styles.containerMessage}
                        textMessage={styles.textMessage}
                        message={{ message }} />
                    }
                    {this.overlay()}
                    {loading ?
                        <AcitivityIndicator size={55} color="#0000ff" style={styles.loading} /> :
                        latestVersionApp
                            ? hasData ? this.renderList() : this.screeNoPermission()
                            : this.props.navigation.navigate('UpdateApp')
                    }
                </View>
            );
        }
    }
}