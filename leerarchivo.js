const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'leeme.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    console.log('Contenido del archivo:\n', data);
});
