const { shell } = require('electron');

const openLink = async (url, title) => {
    try {

        shell.openExternal(url);
        const text = "message: " + title + " aberto com sucesso!"
        return text;
    } catch (error) {
        const text = "message: não foi possivel abrir o " + title + "erro: " + error;
        return text;
    }
}

module.exports = { openLink };