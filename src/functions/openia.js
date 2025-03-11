const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
    apiKey: process.env.OPENIA_TOKEN,
});

const clearAudioDirectory = () => {
    const audioDir = path.join(__dirname, "../assets/audios");

    if (fs.existsSync(audioDir)) {
        fs.readdirSync(audioDir).forEach((file) => {
            const filePath = path.join(audioDir, file);
            fs.unlinkSync(filePath);
        });
    }
};


// Função para gerar o áudio da resposta
const generateAudio = async (text) => {
    try {
        clearAudioDirectory();

        const response = await openai.audio.speech.create({
            model: "tts-1", 
            voice: "onyx", // Escolha entre: alloy, echo, fable, onyx, nova, shimmer
            input: text,
        });

        const timestamp = Date.now();
        const audioPath = path.join(__dirname, `../assets/audios/response_${timestamp}.mp3`);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(audioPath, buffer);

        return audioPath;
    } catch (error) {
        console.error("Erro ao gerar áudio:", error);
        return null;
    }
};

const chatGptRequest = async (text) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "Você é um assistente chamado Jarvis e sua personalidade é sarcastica e você fala de forma formal. mantenha a cordialidade chamando o cliente de senhor." 
                },
                { 
                    role: "system", 
                    content: "As vezes você deve sugerir dicas para seu cliente" 
                },
                { 
                    role: "system", 
                    content: "quando a mensagem vier assim 'message: alguma coisa', você deve considerar apenas o conteudo de messagem como pergunta. não precisa dar parabéns ao executar um comando com suceso, e lembre-se você deve responder como quem executou a tarefa." 
                },
                /* { 
                    role: "system", 
                    content: "Quando for perguntado qualquer coisa sobre codigo, não responda com codigos." 
                }, */
                { role: "user", content: text },
            ],
            temperature: 0.7,
        });

        const chatResponse = response.choices[0].message.content;
        const audioPath = await generateAudio(chatResponse); 

        return { text: chatResponse, audioPath };
    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        return { text: "Erro ao chamar a API.", audioPath: null };
    }
};

module.exports = { chatGptRequest };
