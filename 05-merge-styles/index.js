const path = require('path')
const fs  = require('fs')
const fsPromise = require('fs/promises')

const pathToStyles = path.resolve(__dirname,'styles')
const pathToBundle = path.resolve(__dirname,'project-dist','bundle.css')


const mergeStyles = async function (pathToStyles,pathToBundle) {
  try{
    const styleFiles = await fsPromise.readdir(pathToStyles,{withFileTypes:true})
    const bundle = fs.createWriteStream(pathToBundle);
    let readableStream;

    styleFiles.forEach(async (file) => {
      const filePath = path.join(pathToStyles,file.name)
      const ext = path.extname(filePath)

      if(file.isFile() && ext === '.css') {
        readableStream = fs.createReadStream(filePath)
        readableStream.pipe(bundle)
      }
    })
    readableStream.on('end',() => {
      bundle.end()
    })
  }catch(err) {
    console.log("ERORR =>",err)
  }
}

mergeStyles(pathToStyles,pathToBundle)
