const fs = require('fs');
const path = require('path');

module.exports = {
    logToFile
}

function logToFile(filename, data, title='') {
    if (typeof data != 'string') {
        try {
            data = JSON.stringify(data);
        } catch {
            data = data;
        }
    }
    
    let log = fs.createWriteStream(path.join(process.cwd(), 'logs', filename), { flags: 'a' });

    log.on('open', function () {
        log.write(`${title}: ${data}`);
        log.end();
    })
}