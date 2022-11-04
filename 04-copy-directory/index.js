const path = require('path');
const fsPromise = require('fs/promises');


const pathToOriginal = path.resolve(__dirname,'files')
const pathToCopy = path.resolve(__dirname,'files-copy')
// console.log(pathToOriginalFolder)

const makeAndFillDir = async function (pathToOriginal,pathToCopy) {
   const dir = await fsPromise.mkdir(pathToCopy,{recursive: true})
   const files =  await fsPromise.readdir(pathToOriginal,{withFileTypes: true})

   if(!dir) {
      await fsPromise.rm(pathToCopy,{recursive: true})
      await fsPromise.mkdir(pathToCopy)
   }

   files.forEach(file => {
    let srcPath = path.join(pathToOriginal,file.name)
    let destPath = path.join(pathToCopy,file.name)

    fsPromise.copyFile(srcPath,destPath)
   })
}
 makeAndFillDir(pathToOriginal,pathToCopy)