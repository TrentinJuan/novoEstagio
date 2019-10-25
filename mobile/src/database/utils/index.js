import database from '../../database';


//Metodo responsavel por pegar as informacoes do banco.
export const getData = (_prResponse) => {
    let data = [];

    for (let i = 0; i < _prResponse.rows.length; i++) {
        let resp = _prResponse.rows.items(i);
        data.push(resp)
    }

    return data;
}

//Metodo responsavel por salvar os ususarios no banco de dados.
export const saveUsers = _prUsers => {
    return new Promise((resolve, reject) => {
        database.transaction(
            socket => {
                _prUsers.map((user, key) => {
                    let query = `INSERT INTO Au_Usuarios VALUES(${user.CODIGO_USU}, '${user.NOME01_USU}', '${user.SENHA1_USU}')`;

                    if (key < _prUsers.length - 1) {
                        socket.executeSql(query, [], null, err => reject(err));
                    } else {
                        socket.executeSql(
                            query, [],
                            (socket, response) => (response),
                            err => reject(err)
                        );
                    }
                });
            }
        )
    });
}

//Metodo resposavel por encontrar/listar todos os usuarios no banco de dados.
export const findAllUsers = () => {
    return new Promise((resolve, reject) => {
        database.transaction(socket =>
            socket.executeSql(`SELECT * FROM Au_Usuarios, []`), (socket, response) => resolve(response), err => reject(err))
    })
}

//Metodo responsavel por encontrar/listar usuarios atraves de seu ID.
export const findUsersByIdSycn = async _prID => {
    return new Promise((resolve, reject) => {
        database.executeSql('SELECT * FROM Au_Usuarios WHERE CODIGO_USU = ?', [_prID])
            .then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            });
    });
}

//Metodo responsavel por alterar a senha do usuario.
export const updatePasswordUser = (_prID, _prPassword) => {
    return new Promise((resolve, reject) => {
        database.transaction(socket => socket.executeSql(
            'UPDATE Au_Usuarios SET SENHA_USU = ? WHERE CODIGO_USU = ?',
            [_prPassword, _prID],
            (socket, response) => resolve(response),
            err => reject(err)
        ))
    });
}

//Metodo responsavel por checar o usuario que foi selecionado
export const checkUser = (_prID, _prPassword) => {
    return new Promise((resolv, reject) => {
        database.transaction(socket = socket.executeSql(
            `SELECT * FROM Au_Usuarios WHERE CODIGO_USU = ? ${_prID} AND SENHA1_USU = '${_prPassword}'`,
            [],
            (socket, respose) => resolve(response),
            err => reject(err)
        ))
    });
}


//Metodo responsavel por criar e deletar as tabelas no banco de dados.
export const createTables = () => {
    return new Promise((resolv, reject) => {
        database.transaction(
            socket => {
                socket.executeSql(
                    'DROP TABLE IF EXISTS Au_Configuracao',
                    [],
                    null,
                    err => reject(err)
                );
                socket.executeSql(
                    'DROP TABLE IF EXISTS Au_Usuarios',
                    [],
                    null,
                    err => reject(err)
                );
                socket.executeSql(
                    'CREATE TABLE Au_Usuarios (CODIGO_USU INTEGER NOT NULL, NOME01_USU VARCHAR NOT NULL, SENHA1_USU VARHCAR NOT NULL)',
                    [],
                    null,
                    err => reject(err)
                );
                socket.executeSql(
                    'CREATE TABLE Au_Configuracao (CODIGO_CFG INTEGER PRIMARY KEY AUTOINCREMENT, ENDERE_CFG VARCHAR NOT NULL, PORTA_CFG INTEGER NOT NULL, SYNCRO_CFG BOOLEAN NOT NULL, INTERV_CFG INTEGER, CADAST_CFG DATETIME DEFAULT DATETIME)',
                    [],
                    null,
                    err => reject(err)
                );
            }
        )
    });
}


//Metodo responsavel por salvar as configuracoes.
export const saveConfiguration = _prConfiguration => {
    return new Promise((resolve, reject) => {
        let intervalSync = _prConfiguration.autoSync
            ? _prConfiguration.intervalSync > 0 ? _prConfiguration : '0'
            : '0';
        database.transaction(socket => socket.executeSql(
            `INSERT INTO Au_Configuration(ENDERE_CFG, PORTA_CFG, SYNCRO_CFG, INTERV_CFG) VALUES ("${_prConfiguration.address}", ${_prConfiguration.port}, "${_prConfiguration.autoSync}", ${intervalSync})`,
            [],
            null,
            (socket, response) => resolve(response),
            err => reject(err)
        ))
    });
}


//Metodo resposavel por encontrar/listar as configuracoes que estao no banco de dados.
export const findConfigurationSync = async () => {
    return new Promise((resolve, reject) => {
        database.executeSql('SELECT * FROM Au_Configuracao',
            []).then(data => {
                resolve(data)
            }).catch(error => {
                reject(error);
            });
    });
}


//Requisicao para SQLite assincrona
export const findConfiguration = () => {
    return new Promise((resolve, reject) => {
        database.transaction(socket => socket.executeSql(
            'SELECT * FROM Au_Configuracao',
            [],
            (socket, response) => resolve(response),
            err => reject(err)
        ))
    });
}

//Funcao teste 
export function findConfigurationTeste() {
    return database.transaction(
        tx => {
            tx.executeSql('SELECT * FROM Au_Configuracao', [], (socket, {
                rows
            }) => {
                return rows;
            });
        },
        null,
        null
    )
}

export const checkUser