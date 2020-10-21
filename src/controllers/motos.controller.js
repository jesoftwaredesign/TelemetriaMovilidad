const motosCtrl = {};

// Models de datos usados en el controlador para guardar en MONGO
const Motos = require("../models/SensoresMoto");
const Sensores = require("../models/Sensores");
const Users = require("../models/User");
const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/dbMotos');

//PARA RESPUESTA A LOS POST
let respuesta = {
  error: false,
  codigo: 200,
  mensaje: ''
 };

//CONFIGURACIÓN DE ENVIO DE MAIL
var nodemailer = require('nodemailer'); // email sender 





//Lleva al formulario de nuevo sensor
motosCtrl.renderMotoSensorForm = (req, res) => {
    res.render("motos/new-motos");
};

//Guarda los datos del nuevo sensor
motosCtrl.createNewMotoSensor = async (req, res) => {
  
    const { name, ubicacion, info } = req.body;
    const errors = [];
    if (!name) {
      errors.push({ text: "Por favor indique un nombre para la interfaz" });
    }
    if (!ubicacion) {
      errors.push({ text: "Por favor indique donde está instalada la interfaz" });
    }
    if (!info) {
      errors.push({ text: "Por favor indique información de los sensores" });
    }

    if (errors.length > 0) {
      res.render("motos/new-motos", {
        errors,
        name,
        ubicacion,
        info
      });
    } else {


      //Aqui código de generación de TOKEN, por el momento igual a ID de creación de la interfaz
      var sensor_codigo = 0;

      //
      const newSensor = new Motos({ name, ubicacion, info, sensor_codigo });
      newSensor.user = req.user.id;
      newSensor.sensor_codigo = newSensor.id;
      await newSensor.save();
      
      var elmensaje = "Se ha creado la interfaz:"+" "+newSensor.name+" "+"con el TOKEN::"+" "+newSensor.id+". "+"En el link www.xxx.com encontrará las instrucciones de configuración de su interfaz.";
      //ENVIAR MAIL CON TOKEN
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'proyectoenergetica2030@gmail.com',
          pass: 'Chaparro2012'
        }
      });
      // Definimos el email
      var mailOptions = {
        from: '"Proyecto ENERGETICA2030" <proyectoenergetica2030@gmail.com>',
        to: req.user.email,
        subject: 'Energetica2030 Token Interfaz de adquisición',
        text: elmensaje,
       
      };
      // Enviamos el email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.send(500, err.message);
        } else {
          console.log("Email sent");
          res.status(200).jsonp(req.body);
        }
      });     




      req.flash("success_msg", "Interfaz adicionada, revisar su mail para obtener TOKEN ");
      res.redirect("/motos");
  }
  

};

//Redirecciona para mostrar todos los sensores creados
motosCtrl.renderSensorMotos = async (req, res) => {
  const motos = await Motos.find({ user: req.user.id }).sort({ date: "desc" });
  res.render("motos/all-sensores", { motos });
};

//Redirecciona a formulario de edición de datos de sensores
motosCtrl.updateMotoSensor = async (req, res) => {
    const sensor = await Motos.findById(req.params.id);
    console.log(sensor)
    res.render('motos/edit-sensores', sensor);
  };

//Guarda cambios de sensores en base de datos
motosCtrl.editarSensorMoto = async (req, res) => { 
  const idSensor = req.body.sensor_codigo;
  //console.log(idSensor);
  Motos.findByIdAndUpdate(idSensor, {
      name: req.body.name,
      ubicacion: req.body.ubicacion,
      info: req.body.info,
  }, (error, idSensor)=> {
        console.log(error,idSensor)
        res.redirect('/motos');
  })
    
}

//EJEMPLO 1 - REGISTRA DATOS RECIBIDOS DE SENSOR MEDIANTE HTTP
motosCtrl.addValorSensor = async (req,res) => {
    //CODIGO RECEPCIÓN DE MODULO ESP32 - CON SENSOR DHT11
    //String datos_a_enviar en arduino = "http://192.168.1.12:4000/motos/add/" + clavesensor + "," + valor;
    //ejemplo: /motos/add/5f302dba5f76e07174d65c40,35
    var datosrecibidos = req.params.valor; 

    var arrSplit = datosrecibidos.split(","); 
    var sensor_codigo = arrSplit[0];
    var valor_sensor = arrSplit[1];
   
    //console.log(sensor_codigo);
    //console.log(valor_sensor);
  
    const nuevodato = new Sensores({sensor_codigo,valor_sensor});
    //console.log(nuevodato);
    var Clave = "emilio"
    if (Clave == "emilio" && sensor_codigo!="nan" && valor_sensor!="nan") {
       await nuevodato.save(); //Comando para activar que si guarde en la Base de datos
       console.log("ok listo para guardar");
    }
    else {
       console.log("Dato incorrecto");
     }


//prueba influx
client.schema('motos', fieldSchema, tagSchema, {
  // default is false
  stripUnknown: true,
});
client.write('motos')
  .tag({
    funciona: 'Electrica',
    method: 'Energía',
    type: '2',  
  })
  .field({
    temperatura: tempe1,
    humedad: hum1,
    cargaB: cargaB1,
    distanciaR: distanciaR1,
    velocidad: velocidad1,
    peso: peso1,
    potencia: potencia1,
    combustible: combustible1,
    otro: ot1,
  })
  .then(() => console.info('write point success influx'))
  .catch(console.error);

 
    //res.send('render edit form recibiendo valor')
}

//EJEMPLO 2 - REGISTRA DATOS RECIBIDOS DE SENSOR MEDIANTE HTTP
motosCtrl.addValorWireless = async (req, res) => {
  //CODIGO RECEPCIÓN con MODULO GSM Y GPS
  //String datos_a_enviar en arduino = "http://192.168.1.12:4000/motos/add/" + clavesensor + "," + valor;
  //ejemplo: /motos/addwireless/5f302dba5f76e07174d65c40,35
  ///motos/addwireless/{"antlat":"1613.99","date":"2019-3-13","eorw":"W","hour":"18:32:11","latitude":"0614.700351","longitude":"07533.027631","nors":"N","uaam":"M"}
  ///http://201.232.243.242:4000/motos/addwireless/{"antlat":"1613.99","date":"2019-3-13","eorw":"W","hour":"18:32:11","latitude":"0614.700351","longitude":"07533.027631","nors":"N","uaam":"M"}
  //ejemplo: http://201.232.243.242:4000/motos/addwireless/5f302dba5f76e07174d65c40,35
  //para ver en influx:  select * from "motos"
  var datosrecibidos = req.params.valor;
  console.log(req);
  //console.log(req.params)

//VERIFICAR QUE EXISTA EL SENSOR



  var arrSplit = datosrecibidos.split(",");
  var sensor_codigo = arrSplit[0];
  var valor_sensor = arrSplit[1];


//PARA RECIBIR EL JSON DE SIM800  
  var recjson = JSON.parse(datosrecibidos)
  var altitud = recjson.antlat;
  var latitude = recjson.latitude;
  var longitude = recjson.longitude;
  console.log(recjson);
  console.log(altitud);
  console.log(latitude);
  console.log(longitude);
  
  
  var ppino = {
    "L_tNq41PpmQzpHov7Y3":{"antlat":"1618.22","date":"2019-3-13","eorw":"W","hour":"18:29:8","latitude":"0614.700393","longitude":"07533.027788","nors":"N","uaam":"M"}
    }

  var i; 
  for (i = 0; i < 100; i++) {
   task(i);
  }
  function task(i) { 
    setTimeout(function() { 
        // Add tasks to do 

    //prueba influx
    const Influx = require('influxdb-nodejs');
    const client = new Influx('http://localhost:8086/dbMotos');

    const fieldSchema = {
      temperatura: 'f',
      humedad: 'f',
      cargaB: 'f',
      distanciaR: 'f',
      velocidad: 'f',
      peso: 'f',
      potencia: 'f',
      combustible: 'f',
      otro: 'f',
      key: "SIN",
      latitude: 'f',
      longitude: 'f',
      };

    const tempe1 = Math.random() * 40;
    const hum1 = Math.random() * 100;
    const cargaB1 = Math.random() * 300;
    const distanciaR1 = Math.random() * 100;
    const velocidad1 = Math.random() * 80;
    const peso1 = Math.random() * 220;
    const potencia1 = Math.random() * 240;
    const combustible1 = Math.random() * 100;
      const ot1 = Math.random() * 1000;
      //const lat1 = 9.299346;
      //const lon1 = -75.395923;
      const lat1 = 61.4700393;
      const lon1 = -75.33027788;

    const tagSchema = {
      funciona: ['Electrica', 'Combustión', 'Hibrida'],
      method: '*',
      type: ['1', '2', '3', '4', '5'],
    };
      
      
    //console.log(nuevodato);
    var Clave = "emilio"
    if (Clave == "emilio" && sensor_codigo != "nan" && valor_sensor != "nan") {
      
      client.schema('motos', fieldSchema, tagSchema, {
        // default is false
        stripUnknown: true,
      });
      console.log("aquiiii")
      
      client.write('motos')
        .tag({
          funciona: 'Electrica',
          method: 'Energía',
          type: '2',
        })
        .field({
          temperatura: tempe1,
          humedad: hum1,
          cargaB: cargaB1,
          distanciaR: distanciaR1,
          velocidad: velocidad1,
          peso: peso1,
          potencia: potencia1,
          combustible: combustible1,
          otro: ot1,
          key: "Moto Electrica",
          latitude: lat1,
          longitude: lon1,
        })
        .then(() => console.info('write point success influx'))
        .catch(console.error);

    }
    else {
      console.log("Dato incorrecto");
      }
    }, 5000 * i); 
  }  //res.send('render edit form recibiendo valor')
  

  } 

//EJEMPLO 1 - REGISTRA DATOS RECIBIDOS DE SENSOR MEDIANTE HTTP
motosCtrl.postValorWireless = async (req, res) => {
  //CODIGO RECEPCIÓN con MODULO
  ///Codigo ESP32: "EspPostJson.io"
  //para ver en influx:  select * from "motos"

  var GSMprueba = req.body;
  console.log(req.body);
  console.log("Funciona Recibido");
  //var recjson = JSON.parse(req.body);

  var token = GSMprueba.token;
  token = "5f69058fc365836a3c7a6492";
  const idSensor = token; //se podría habilitar otro token diferente al Id MongodB
  const sensor = await Motos.findById(idSensor);//se obtienen los datos de la interfaz con el IdSensor

  if (sensor) { //si existe la interfaz en MongoDb

    const datuser = await Users.findById(sensor.user);//busca los datos de usuario para guardar en influx esos datos
    var interfaz = sensor.name; //nombre de la interfaz dada en la App
    var nameUser = datuser.email; //mail registrado en la App

    var temperatura1 = GSMprueba.value1;
    var humedad1 = GSMprueba.value2;

        //variables temporales de prueba alaeatoria
        var altitud1 = Math.floor(Math.random() * 300);
        var longitud1 = -75.395923; 
        var latitud1 = 9.299346; 
        var distanciaR1 = Math.floor(Math.random() * 300);
        const velocidad1 = Math.floor(Math.random() * 300);
        //const temperatura1 = Math.floor(Math.random() * 100);
        //const humedad1 = Math.floor(Math.random() * 80);
        var peso1 = Math.floor(Math.random() * 220);
        var potencia1 = Math.floor(Math.random() * 240);
        var combustible1 = Math.floor(Math.random() * 100);
        var ot1 = Math.floor(Math.random() * 1000);


    //Inicialización
    //DATOS PARA CREACIÓN DE VARIABLES EN INFLUX
    const fieldSchema = {
      altitud: 'f',
      longitud: 'f',
      latitud: 'f',
      distanciaR: 'f',
      velocidad: 'f',
      temperatura: 'f',
      humedad: 'f',
      peso: 'f',
      potencia: 'f',
      combustible: 'f',
      otro: 'f',
    };
    const tagSchema = {
      interfaz: [interfaz],
      method: 'Sensor',
      type: ['Electrica', 'Combustión', 'Hibrida'],
    };





    //prueba influx
    client.schema(nameUser, fieldSchema, tagSchema, {
      // default is false
      stripUnknown: true,
    });
    client.write(nameUser)
      .tag({
        interfaz: interfaz,
        method: 'Sensor',
        type: 'Electrica',
      })
      .field({
        altitud: altitud1,
        longitud: longitud1,
        latitud: latitud1,
        distanciaR: distanciaR1,
        velocidad: velocidad1,
        temperatura: temperatura1,
        humedad: humedad1,
        peso: peso1,
        potencia: potencia1,
        combustible: combustible1,
        otro: ot1,
      })
      .then(() => console.info('write point success influx'))
      .catch(console.error);



    respuesta = {
      error: true,
      codigo: 200,
      mensaje: 'Dato recibido'
    };
    res.send(respuesta);




  } else {
    respuesta = {
      error: true,
      codigo: 501,
      mensaje: 'No existe el TOKEN->Interfaz no creada'
    };
    res.send(respuesta);
  }






} 


motosCtrl.iraDashboard1 = async (req, res) => {
    const motos = await Motos.find({ user: req.user.id }).sort({ date: "desc" });
    res.render("motos/dashboard1", { motos });
};



module.exports = motosCtrl;