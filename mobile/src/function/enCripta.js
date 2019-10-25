
function boobleSort(chave, arrChave, arriChave) {
    var i, j, posicao, letra;

    for (i = 0; i < chave.length; i++) {
        arrChave[i] = chave.charAt(i);
        arriChave[i] = i;
    }

    for (i = 0; i < arrChave.length; i++) {
        for (j = i + 1; j < arrChave.length; j++) {
            if (arrChave[j] < arrChave[i]) {
                letra = arrChave[i];
                posicao = arriChave[i];

                arrChave[i] = arrChave[j];
                arriChave[i] = arriChave[j];

                arrChave[j] = letra;
                arriChave[j] = posicao;
            }
        }
    }
}


export const enCripta = texto => {

    let tamanho, lenChave, qLinhas, qResto,
        strTexto, i, j, contad, resto, result,
        chave, arrChave, arriChave;

    texto = String(texto);
    chave = "MB7308";

    tamanho = texto.length;
    lenChave = chave.length;

    if (!texto || tamanho == 0 || lenChave == 0) return "";

    if (lenChave >= tamanho) return texto;

    qLinhas = Math.floor(tamanho / lenChave);

    if (qLinhas == 0) qLinhas = 1;

    qResto = tamanho % lenChave;

    resto = "";
    if (qResto > 0) {
        resto = texto.substring(tamanho - qResto);
        texto = texto.substring(0, tamanho - qResto);
    }

    // Cria um array do tamanho do parametro texto
    strTexto = new Array(qLinhas);
    for (i = 0; i < qLinhas; i++) {
        strTexto[i] = [];
        for (j = 0; j < lenChave; j++) {
            strTexto[i][j] = ' ';
        }
    }

    // Distribui os caracteres de texto para o array de char
    contad = 0;
    for (i = 0; i < qLinhas; i++) {
        for (j = 0; j < lenChave; j++) {
            strTexto[i][j] = texto.charAt(contad);

            contad++;
        }
    }

    arrChave = new Array(chave.length);
    arriChave = new Array(chave.length);

    boobleSort(chave, arrChave, arriChave);

    result = "";

    for (i = 0; i < arrChave.length; i++) {
        if (qResto > 0) {
            qResto--;
            result += resto.substring(0, 1);
            resto = resto.substring(1, qResto + 1);
        }

        for (j = 0; j < qLinhas; j++) {
            result += strTexto[j][arriChave[i]];
        }
    }

    return result;
}
