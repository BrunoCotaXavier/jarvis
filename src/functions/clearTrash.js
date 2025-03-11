const { exec } = require("child_process");

const clearTrash = async () => {
    console.log('### clearTrash');

    return new Promise((resolve, reject) => {
        exec("rm -rf ~/.Trash/*", (error, stdout, stderr) => {
            if (error) {
                console.log('### Erro ao limpar a lixeira: ' + error.message);
                return reject("Erro ao limpar a lixeira: " + error.message);
            }
            if (stderr) {
                console.log('### Erro: ' + stderr);
                return reject("Erro: " + stderr);
            }
            const text = "message: Lixeira limpa com sucesso";
            console.log('### ' + text);
            resolve(text);
        });
    });
};

module.exports = { clearTrash };
