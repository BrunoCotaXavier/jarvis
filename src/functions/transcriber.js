const fs = require("fs");
const { exec } = require("child_process");
const speech = require("@google-cloud/speech");

const client = new speech.SpeechClient();

async function transcribeAudio(audioPath) {
    return new Promise((resolve, reject) => {
        const wavPath = audioPath.replace(".webm", ".wav");

        // Converte WebM para WAV usando FFmpeg
        exec(`ffmpeg -i "${audioPath}" -acodec pcm_s16le -ar 16000 "${wavPath}"`, async (err) => {
            if (err) {
                console.error("Erro ao converter áudio:", err);
                return reject("Erro ao converter áudio.");
            }

            try {
                const audioBytes = fs.readFileSync(wavPath).toString("base64");

                const request = {
                    audio: { content: audioBytes },
                    config: {
                        encoding: "LINEAR16",
                        sampleRateHertz: 16000,
                        languageCode: "pt-BR",
                    },
                };

                const [response] = await client.recognize(request);
                const transcription = response.results
                    .map((result) => result.alternatives[0].transcript)
                    .join("\n");

                // Exclui os arquivos após a transcrição
                fs.unlinkSync(audioPath);
                fs.unlinkSync(wavPath);

                resolve(transcription);
            } catch (error) {
                console.error("Erro na transcrição:", error);
                reject("Erro ao processar áudio.");
            }
        });
    });
}

module.exports = { transcribeAudio };
