const fs = require('fs');
const path = require('path');
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathToTxtFile = path.resolve(__dirname,'text.txt') 
let writeableStream = fs.createWriteStream(pathToTxtFile);

function sendExitMessage () {
  console.log('Goodbye')
  rl.close()
}
const greetingPhrase = 'Hello!\nEnter your message:\n'
//fill the txt file
rl.question(greetingPhrase,(answer) => {
  if(answer.toLowerCase() === 'exit') {
    sendExitMessage()
  }else {
    writeableStream.write(`${answer}\n`)
  }

})
rl.on('line', (data) => {
  if(data.toLowerCase() === 'exit') {
    sendExitMessage() 
  }else{
    writeableStream.write(`${data}\n`)
  }
})
rl.on('SIGINT', () => {
  sendExitMessage ()
})
