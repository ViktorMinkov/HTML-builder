const path = require('path')
const fs  = require('fs')
const fsPromise = require('fs/promises')



const pathToProjectDist = path.resolve(__dirname,'project-dist')
const pathToProjectDistAssets = path.resolve(__dirname,'project-dist','assets')
const pathToAssets = path.resolve(__dirname,'assets')
const pathToStyles = path.resolve(__dirname,'styles')
const pathToBundleCss = path.join(pathToProjectDist,'style.css')
const pathToMainHtml = path.join(pathToProjectDist,'index.html')
const pathToTemplate = path.resolve(__dirname,'template.html')
const pathToComponents = path.resolve(__dirname,'components')



const createDist = async function (pathToDist) {
  await fsPromise.rm(pathToDist,{ force: true, recursive: true });
  await fsPromise.mkdir(pathToDist)
}

//Create and fill HTML
const createHtml = async function (pathToTemplate,pathToComponents,pathToMainHtml) {
  try{
    let template = await fsPromise.readFile(pathToTemplate,'utf-8')
    const components = await fsPromise.readdir(pathToComponents,{withFileTypes: true})

    for await(let item of components) {
      let ext = path.extname(item.name)
      let itemName = path.basename(item.name,ext)
      let itemPath = path.join(pathToComponents,item.name)
      let itemContent = await fsPromise.readFile(itemPath,'utf-8')
    
      if(template.includes( `{{${itemName}}}`)) {
          template = template.replace(`{{${itemName}}}`,`${itemContent}`) 
      }
    }
    await fsPromise.writeFile(pathToMainHtml,template)
  }catch(err){
    console.log('ERROR =>',er)
  }
}

//Create assets in dist and copy files
const copyFolder = async function (pathToOriginal,pathToCopy) {
  try{
    const assetsItems =  await fsPromise.readdir(pathToOriginal,{withFileTypes: true})

    assetsItems.forEach( async (item) => {
     const itemPath = path.join(pathToOriginal,item.name)
     const copyItemPath = path.join(pathToCopy,item.name)

     if(item.isDirectory()) {
      const innerAssetsFolders = await fsPromise.mkdir(copyItemPath,{recursive: true})
  
        if(!innerAssetsFolders) {
          await fsPromise.rm(copyItemPath,{recursive: true})
          await fsPromise.mkdir(copyItemPath)
        }
      const files =  await fsPromise.readdir(itemPath,{withFileTypes: true})
  
      files.forEach(async (file) => {
        let srcPath = path.join(itemPath,file.name)
        let destPath = path.join(copyItemPath,file.name)
        await fsPromise.copyFile(srcPath,destPath)
      })
     }
  
    })
  }catch(err) {
    console.log('ERORR =>',err)
  }
}

//Merge styles in one file in dist
const mergeStyles = async function (pathToStyles,pathToBundleCss) {
  try{
    const styleFiles = await fsPromise.readdir(pathToStyles,{withFileTypes:true})
    const style = fs.createWriteStream(pathToBundleCss);
    let readableStream;

    styleFiles.forEach(async (file) => {
      const filePath = path.join(pathToStyles,file.name)
      const ext = path.extname(filePath)

      if(file.isFile() && ext === '.css') {
        readableStream = fs.createReadStream(filePath)
        readableStream.pipe(style)
      }
    })
    readableStream.on('end',() => {
      style.end()
    })
  }catch(err) {
    console.log("ERORR =>",err)
  }
}

async function buildPage () {
   await createDist(pathToProjectDist)
   await createHtml(pathToTemplate,pathToComponents,pathToMainHtml)
   await copyFolder(pathToAssets,pathToProjectDistAssets)
   await mergeStyles(pathToStyles,pathToBundleCss)
}
buildPage()