// import chalk from 'chalk'
// import figlet from 'figlet'
// import shell from 'shelljs'
// import inquirer from 'inquirer'
// El IDE tambien nos indica que se puede hacer import en vez de require, pero si lo hacemos rompe por las propiedades
import {trendsByPlace, findTweets} from './twitterApi'
const download = require('image-downloader')
const imageToAscii = require('image-to-ascii')
const inquirer = require("inquirer")
const chalk = require ( "chalk" )
const figlet = require ( "figlet" )
const geoip = require('geoip-lite') 
const woeid = require('woeid')
const fs = require('fs')
const glob = require("glob")
const zip = require('adm-zip')
const Jimp = require ('jimp')
const read = require('read-directory')
const publicIp = require('public-ip');

// const printPath = () => {
  
// }

const titulo = () => {
  console.log(
    chalk.green(
      figlet.textSync("App Friki!", {
        // font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default"
      })
    )
  )
}

async function geoLocalize () {
  var response = ''
  await publicIp.v4().then(ip => {
      // console.log(ip)
      var geo = geoip.lookup(ip)
      var WOEID = woeid.getWoeid(geo.country)
      // console.log( WOEID.woeid) --> Correcto
      response = WOEID.woeid
     
  }).catch (()=>{
    console.log('Error de localización')
  })
  // console.log(response)
 return response
}

function validateIfNotEmpty(name){
  return name !== '';
}

const askQuestions = async () => {
  var preguntasFrikis = ['¿Que superheroe de marvel te gusta mas?, si es de DC cierra la app y desinstala..', 'Menciona un pokemon legendario de tipo Hielo', '¿Que campeón de League of legends es hermana de Kayle?', '¿Cómo muere Loki en Avengers 4?', '¿Quién es el mejor jugador de LoL del mundo?','¿Que arma es más efectiva en Fornite?', '¿Cuantas gemas del infinito existen?']
  var pregunta = preguntasFrikis[Math.floor(Math.random() * preguntasFrikis.length)] + ': '
  var id = await geoLocalize()
  // console.log(id)
  var trends = []
  await trendsByPlace(id).then(tweets => {
    var i
    for ( i = 0; i < tweets[0].trends.length; i ++){
      trends.push(tweets[0].trends[i].name)
    }
  }).catch(()=>{
    console.log('Error localizado')
  })

  const questions = [
    {
      name: "Name",
      type: "input",
      message: "Nombre",
      validate: validateIfNotEmpty,
      prefix: 'Cómeme un huevo:'
    },
    {
      name: "Apellido",
      type: "input",
      message: "Apellido",
      validate: validateIfNotEmpty
    },
    {
      name: "Sexo",
      type: "input",
      message: "Sexo",
      validate: validateIfNotEmpty
    },
    {
      name: "Pregunta",
      type: "input",
      message: pregunta,
      validate: validateIfNotEmpty
    },
    {
      type: "rawlist",
      pageSize: 11,
      name: "Trend",
      message: "Selecciona un trendding toppic", // --> SE SUPONE: que esta opcion deja seleccionar con las flechas
      choices: trends,
      validate: validateIfNotEmpty 
    }
  ]
  
  return inquirer.prompt(questions);
  
}

const deleteImgs = async () =>{
   glob("./src/imgs/*", function (er, files) {
    if (!er) {
      for (let img of files){
      fs.unlink(img, err=>{
          if (err){
            console.log(err)
          } else {
            console.log('Imágen borrada'+ img)
          }
    })
    }
    }
})
}

const printImg = () => {
  var images = [
    'https://octodex.github.com/images/jetpacktocat.png',
    'https://octodex.github.com/images/octofez.png',
    'https://octodex.github.com/images/privateinvestocat.jpg',
    'https://octodex.github.com/images/dinotocat.png',
    'https://octodex.github.com/images/inflatocat.png',
    'https://octodex.github.com/images/gracehoppertocat.jpg',
    'https://octodex.github.com/images/mountietocat.png',
    'https://octodex.github.com/images/luchadortocat.png',
    'https://octodex.github.com/images/grinchtocat.gif',
    'https://octodex.github.com/images/yaktocat.png',
    'https://octodex.github.com/images/octoliberty.png',
    'https://octodex.github.com/images/dunetocat.png'
  ]
  var img = images[Math.floor(Math.random() * images.length)]

  var imagen = new Promise(
    function (resolve, reject) {
      imageToAscii(img, (err, converted) => {
          if(!err){
            console.log(converted)
            resolve(true)
          } 
          else{
            console.log('Error con pintar imagen' + err)
            var reason = new Error('Se ha producido un error');
            reject(reason)
          } 
      }) 
    }
  )
  return imagen
}

async function splitTweets(tweets){

  var urls = []
    for (let tweet of tweets) {

      if(tweet.entities.media !== undefined){

        let medias = tweet.entities.media
        for (let media of medias) {

          await urls.push(media.media_url_https)
        }
      }
  }
  if(urls.length == 0)console.log('No hay imágenes, lo sentimos')
  else {
    var imgNames = []
    for (let url of urls) {
      await saveImg(url).then(response =>{
        imgNames.push(response)
        // console.log(imgNames) // aqui tiene valores
        // imgToZip(imgNames)
      })
    }
  }
// console.log(imgNames) // aqui ya no....
}

function freakQuestion (q) {
  var cadena = q.split(" ")
  if (q.length > 17){
    return 0
  } else if (q.includes("isto")) {
    return 1 //Cambiar cosas
  } else if (cadena[1]) {
    return 2 //Cambiar cosas
  } else if(q.length < 7) {
    return 3 //Cambiar cosas
  } else {
    return 4
  }
}

async function imgTreatmen(algoritm){
  var contents = read.sync('./src/imgs')
  console.log('Cambiando imágenes, esto puede tardar unos segundos......')
  // console.log(contents)
  const url = []
  for (let imgName of (Object.keys(contents))){
    // console.log(imgName)
    await Jimp.read('./src/imgs/' + imgName)
      .then(image => {
        // Do stuff with the image.
        switch (algoritm) {
          case 0:
            image.rotate(90, false);
            break;
          case 1:
            image.blur(5);
            break;
          case 2:
            image.sepia();
            break;
          case 3:
            image.invert();
            break;
          case 4:
            image.mirror(true, true);
            break;
          default:
            image.greyscale();
        }
        
        image.clone()
        image.write('./src/imgs/copyOf'+ imgName)
        url.push('src\\imgs\\copyOf' + imgName)
      })
      .catch(err => {
        // Handle an exception.
        console.log('Error al mocificar, '+ err)
        return false
      });
      
  }
 console.log(url)
 imgToZip(url)
 return true
}

async function saveImg(imageUrl){
  
  const options = {
    url: imageUrl,
    dest: './src/imgs'
  }

  return await download.image(options)
    .then(({ filename}) => {
      return filename
    })
    .catch((err) => {
      console.error(err)
    })

}
function imgToZip(url){
    var zimImg = new zip()
    // add file directly
    var content = "Aqui están tus imagenes comprimidas";
    zimImg.addFile("readme.txt", Buffer.alloc(content.length, content), "Aqui están tus imagenes comprimidas");
    // add local file
    for (let img of url)zimImg.addLocalFile(img);
    
    // zimImg.addFile(url);
    // get everything as a buffer
    zimImg.toBuffer();
    // or write everything to disk
    zimImg.writeZip("./src/zip/files.zip");

}

export const run = async () => {
  console.log(chalk.yellow.bgBlue.bold('BIENVENIDO A LA APP FRIKI!!'))
  titulo()
  // const finalizado = false
  await printImg().then(resolve =>{
        if(resolve){
          askQuestions().then(answers =>{

            console.log(answers)
            var algoritmNumber = freakQuestion(answers['Pregunta'])
            findTweets(answers.Trend).then(response => {
              splitTweets(response.statuses).then(() =>{
                console.log('Imágenes comprimidas y almacenadas')
                // console.log(algoritmNumber)
                imgTreatmen(algoritmNumber).then(response => {
                  if (response){
                    
                    deleteImgs().then(()=>{
                      console.log(chalk.yellow.bgBlue.bold('Imágenes almacenadas en: C:/Users/julen.castro/Documents/proyectos/FreakApp/src/zip/files.zip'))
                    }) // -->msg de confirm o esperar a final d ejecución
                  }
                })
                
              })
            
            
            })
            
          })
          
          return resolve
        }
        else{
          console.log(resolve)
          console.log('error')
          return resolve
        }
    })
    console.log("Esta es una aplicación para buscar twits en tu zona derivados de los trending topic,\n alamacena las imágenes en local y las muestra en la carpeta")
    
  }
  