const sensoresCtrl = {};

const Sensores = require('../models/Sensores');


sensoresCtrl.renderSensoresForm = (req,res) => {
  res.render('sensores/new-sensores')
}

sensoresCtrl.createNewSensores = async (req,res) => {
  const {title,tipo,valor}=req.body;
  const newSensores = new Sensores({title,tipo,valor});
  console.log(newSensores)
  await newSensores.save();
  res.send('nuevo sensores')
}

sensoresCtrl.renderSensores = async (req,res) => {
  const sensores = await Sensores.find();
  //console.log(sensores)
  res.render('sensores/datos-sensores', { sensores })
  
  
 // res.send('Render sensores aui se trae la lista de todoas las notas')
  //sirve para traerme los datos y graficar
  // tutorial https://www.youtube.com/watch?v=htlt7L8Yl1k
}

sensoresCtrl.graficarSensores = async (req,res) => {
  //const { tipo, valor } = req.body;
  const sensores = await Sensores.find();
  //console.log(sensores);

  res.render('sensores/grafica2-sensores', { sensores })
  
  
 // res.send('Render sensores aui se trae la lista de todoas las notas')
  //sirve para traerme los datos y graficar
  // tutorial https://www.youtube.com/watch?v=htlt7L8Yl1k
}

sensoresCtrl.dashboard1Sensores = async (req,res) => {

  const sensores = await Sensores.find();
  res.render('sensores/dashboard1', { sensores })

}

sensoresCtrl.renderEditForm = async (req,res) => {
  
  
  //CODIGO RECEPCIÓN DE MODULO ESP32 - CON SENSOR DHT11
  var valor = req.params.valor; 
  var arrSplit = valor.split(","); 
  var user = arrSplit[0];
  var Clave = arrSplit[1];
  var s_temperatura = arrSplit[2];
  var s_humedad = arrSplit[3];
  title = "Sensores Moto 1"
  tipo = "Temperatura y Humedad"

  //console.log(user);
  //console.log(Clave);
  console.log(s_temperatura);
  console.log(s_humedad);

  const nuevodato = new Sensores({title,tipo,valor,s_temperatura,s_humedad,user});
  //console.log(nuevodato);
  if (Clave == "emilio" && s_temperatura!="nan" && s_humedad!="nan") {
    //await nuevodato.save(); //Comando para activiar que si guarde en la Base de datos
    console.log("ok listo para guardar");
  }
  else {
    console.log("Dato incorrecto");
  }
 // await nuevodato.save();
  res.send('render edit form recibiendo valor')
}

// sensoresCtrl.updateSensores = (req,res) =>{
//   console.log(req.body)
//   console.log(req.params.valor)

//   // const { title, description } = req.body;
//   // await Note.findByIdAndUpdate(req.params.id, { title, description });
//   // req.flash("success_msg", "Note Updated Successfully");
//   // res.redirect("/notes");

//   res.send('Sensor actualizado')
// }

// sensoresCtrl.deletesensores = (req,res) =>{
//   res.send('Eliminando nota')
// }
module.exports = sensoresCtrl
