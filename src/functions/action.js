const { ipcRenderer } = require("electron");

let mediaRecorder;
let audioChunks = [];

document.getElementById("action-transcribe-play").addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.start();
        document.getElementById("transcribe").innerText = "Gravando...";

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const buffer = await audioBlob.arrayBuffer();
            const filePath = `${__dirname}/audio.webm`;

            // Salva o arquivo WebM localmente
            require("fs").writeFileSync(filePath, Buffer.from(buffer));

            document.getElementById("transcribe").innerText = "Processando áudio...";

            // Envia para o processo principal para conversão e transcrição
            ipcRenderer.send("transcribe-audio", filePath);
        });
    } catch (error) {
        console.error("Erro ao capturar áudio:", error);
        document.getElementById("transcribe").innerText = "Erro ao iniciar a gravação.";
    }
});

document.getElementById("action-transcribe-stop").addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    }
});

// Recebe o resultado da transcrição
/* ipcRenderer.on("transcription-result", (event, transcription) => {
    document.getElementById("transcribe").innerText = transcription;
}); */


// Exibe a resposta do ChatGPT
/* ipcRenderer.on("chatgpt-response", (event, response) => {
    document.getElementById("transcribe").innerText = `${response}`;
}); */

ipcRenderer.on("chatgpt-response", (event, { text, audioPath }) => {
    document.getElementById("transcribe").innerText = text;

    if (audioPath) {
        const audio = new Audio(audioPath);
        audio.play();
    }
});

document.getElementById("alwaysOnTop").addEventListener("change", (event) => {
  ipcRenderer.send("toggle-always-on-top", event.target.checked);
});
