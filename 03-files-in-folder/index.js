const path = require('path');
const fsPromise = require('fs/promises');


const pathToFolder = path.resolve(__dirname,'secret-folder')

fsPromise.readdir(pathToFolder,{withFileTypes: true}).then(result => {
  result.forEach(file => {
    if(file.isFile()){
      let filePath = path.join(pathToFolder,file.name)

      let fileExtension = path.extname(file.name)
      let fileName = path.basename(file.name,fileExtension)
      fileExtension = fileExtension.slice(1)
      
      fsPromise.stat(filePath).then(stats => {
        let fileSize = (stats.size /1024).toFixed(3)
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`)
      })
    }
  })
})