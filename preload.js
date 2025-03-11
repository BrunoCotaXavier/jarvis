const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api',{
    title: "Jarvis"
});

console.log("### preload")

