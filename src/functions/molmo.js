/* const { Client } = require('@gradio/client');
const axios = require('axios'); // Para fazer requisições HTTP
const fs = require('fs'); // Para manipulação de arquivos locais
const path = require('path');

const executeVision = async () => {
    try {
        // Carregar a imagem local ou de uma URL
        const imagePath = path.join(__dirname, 'path/to/your/image.png');
        const image = fs.readFileSync(imagePath);

        // Enviar a imagem e o texto para o backend Python
        const response = await axios.post('http://localhost:5000/predict', {
            image: image.toString('base64'), // Convertendo para base64 para enviar no JSON
            text: "Describe this image in detail."
        });

        const result = response.data.generated_text;
        console.log("### executeVision result: "+ result);

        return result;
    } catch (error) {
        console.error("Erro ao executar a visão:", error);
        return null;
    }
};

module.exports = { executeVision };
 */