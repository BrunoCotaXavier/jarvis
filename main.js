const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");
const { transcribeAudio } = require("./src/functions/transcriber.js");
const { chatGptRequest } = require("./src/functions/openia.js");
const { listening } = require("./src/functions/listening.js");

let win;

const createWindow = () => {
    win = new BrowserWindow({
        title: 'J.A.R.V.I.S',
        width: 370,
        height: 500,
        icon: __dirname + "src/assets/img/jarvis-logo.png",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile("./src/html/index.html");
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on("transcribe-audio", async (event, audioPath) => {
    try {
        // Transcreve o áudio para texto
        const transcription = await transcribeAudio(audioPath);
        console.log('### transcription: ', transcription)

        event.reply("transcription-result", transcription);
        const listen = await listening(transcription);
        console.log('### result for listen: ', listen)

        // Chama o ChatGPT com o texto transcrito
        const { text, audioPath: generatedAudioPath } = await chatGptRequest(listen);

        // Retorna o texto e o áudio para o frontend
        event.reply("chatgpt-response", { text, audioPath: generatedAudioPath });
    } catch (error) {
        console.error("Erro na transcrição/chat:", error);
        event.reply("chatgpt-response", { text: "Erro ao processar resposta.", audioPath: null });
    }
});

ipcMain.on("toggle-always-on-top", (event, isAlwaysOnTop) => {
    win.setAlwaysOnTop(isAlwaysOnTop);
});

ipcMain.on("toggle-always-on-top", (event, isChecked) => {
    if (win) {
        win.setAlwaysOnTop(isChecked);
    }
});


