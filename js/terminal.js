const app = {
    
    btnOpen: document.querySelector('#open'),
    btnSend: document.querySelector('#send'),
    btnClose: document.querySelector('#close'),
    btnDownload: document.querySelector('#download'),
    ws: null,
    terminal: null,
    fitAddon: null,
    result: [],

    openLogs: (e) => {

        e.preventDefault();

        app.ws = new WebSocket("ws:\/\/188.165.240.17:8080\/echo");
        app.terminal = new Terminal();
        app.fitAddon = new FitAddon.FitAddon();

        app.terminal.loadAddon(app.fitAddon);
        
        app.terminal.open(document.getElementById('terminal'));
       
        app.ws.onopen = (e) => {
            app.terminal.writeln("Welcome @Amiditex you can find your logs now : ");
        };

        app.ws.onmessage = (e) => {

            app.terminal.setOption('theme', {
                background: '#211616'
            });

            let completeLine = e.data;
            let selectDateString = completeLine.substring(0, 31);
            let logLine = "\x1B[1m\x1B[32m" + selectDateString + "\x1B[31m" + completeLine.slice(31);

            app.result.push(completeLine + "\n");

            app.terminal.writeln(logLine);
        };
        
        app.ws.onerror = (e) => {
            app.terminal.writeln("ERROR: " + e.data);
        };

        app.fitAddon.fit();
    },

    sendCmd : (e) => {

        e.preventDefault();

        if(app.terminal) {
            app.terminal.writeln("\x1B[1m\x1B[34m" + input.value);
            app.ws.send(input.value);
        } else {
            alert('Vous ne pouvez pas envoyer de cmd si votre terminal est fermé.');
        }
    },

    closeLogs: (e) => {

        e.preventDefault();

        if(app.terminal) {
            app.terminal.writeln("close");
            app.ws.close();
        } else {
            alert('Votre terminal est déjà fermé.');
        }
    },

    downloadLogs: (e) => {

        if (app.result.length) {
            const blob = new Blob(app.result, {type: "text/plain;charset=utf-8"});
            saveAs(blob, "hello world.txt");
            app.result = [];
        } else {
            alert("Il n'y a aucun log(s) à enregistrer");
        }
    },

    eventToAction: () => {

        app.btnOpen.addEventListener('click', app.openLogs);
        app.btnSend.addEventListener('click', app.sendCmd);
        app.btnClose.addEventListener('click', app.closeLogs);
        app.btnDownload.addEventListener('click', app.downloadLogs);
    },

    init: () => {

        app.eventToAction();
        console.log("Script started");
    },
};

document.addEventListener('DOMContentLoaded', app.init);

