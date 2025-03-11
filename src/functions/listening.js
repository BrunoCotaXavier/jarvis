const { clearTrash } = require("./clearTrash");
const { executeVision } = require("./molmo");
const { openLink } = require("./openLink");

const searchText = async (text, frase) => {
    console.log("### searchText in: ", text)
    const regex = new RegExp(frase, 'gi');
    return text.match(regex) || [];
};

const extracSearch  = async (text, keyText) => {
    console.log("### extracSearch in: ", text)
    const i = text.indexOf(keyText);

    if (i !== -1) {
        return text.substring(i + keyText.length).trim();
    }

    return null;
}


const listening = async (transcribe) => {
    console.log("### listening in: ", transcribe)
    const clearList = await searchText(transcribe, 'Limpar lixeira');
    if (clearList.length > 0) {
        const response = await clearTrash();
        console.log("### response clearTrash" + response)
        return response;
    }
    const openXbox = await searchText(transcribe, 'abrir Xbox');
    if (openXbox.length > 0) {
        const response = await openLink("https://www.xbox.com/pt-BR/play", "xbox");
        console.log("### response clearTrash" + response)
        return response;
    }
    const openXboxEso = await searchText(transcribe, 'abrir jogo Favorito');
    if (openXboxEso.length > 0) {
        const response = await openLink("https://www.xbox.com/pt-BR/play/launch/the-elder-scrolls-online/BRKX5CRMRTC2", "jogo favorito");
        console.log("### response clearTrash" + response)
        return response;
    }
   /*  const whatSee = await searchText(transcribe, 'o que eu estou vendo');
    if (whatSee.length > 0) {
        const response = await executeVision();
        console.log("### response executeVision" + response)
        return response;
    } */


    const searchGoogle = await extracSearch(transcribe, 'pesquisar no Google');
    if (searchGoogle) {
        const response = await openLink("https://www.google.com/search?q=" + searchGoogle, "pesquisa no Google");
        console.log("### response searchGoogle" + response)
        return response;
    }
    const searchYoutube = await extracSearch(transcribe, 'pesquisar no YouTube');
    if (searchYoutube) {
        const response = await openLink("https://www.youtube.com/results?search_query=" + searchYoutube, "pesquisa no YouTube");
        console.log("### response searchYoutube" + response)
        return response;
    }
    return transcribe;
}
module.exports = { listening }