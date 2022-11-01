const fs = require('fs');
const path = require('path');

const dirPath = path.resolve(__dirname,'text.txt')

let readStream = fs.createReadStream(dirPath, "utf8");

readStream.on('data',(data) => console.log(data))
