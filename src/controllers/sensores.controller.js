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
  console.log(sensores);

  // res.render('sensores/grafica1-sensores', { 
  //    title: 'Express' ,
  //    chartT:"title",
  //    lab:tipo,
  //    dat:valor
  // }); 

  res.render('sensores/grafica2-sensores', { sensores })
  
  
 // res.send('Render sensores aui se trae la lista de todoas las notas')
  //sirve para traerme los datos y graficar
  // tutorial https://www.youtube.com/watch?v=htlt7L8Yl1k
}

sensoresCtrl.renderEditForm = async (req,res) => {
  const valor=req.params.valor; 
  const title="Javier Sierra"; 
  const tipo="Temperatura"; 
  //const pvalor=req.params.valor; 
  //console.log(req.params.valor);
  //console.log(req.body);
  //console.log(title);
  //console.log(tipo);
  //console.log(valor);
  const nuevodato = new Sensores({title,tipo,valor});
  console.log(nuevodato);
  
  await nuevodato.save();
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
