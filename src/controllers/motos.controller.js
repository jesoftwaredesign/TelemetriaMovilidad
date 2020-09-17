const motosCtrl = {};

// Models
const Motos = require("../models/SensoresMoto");
const Sensores = require("../models/Sensores");

motosCtrl.renderMotoSensorForm = (req, res) => {
    res.render("motos/new-motos");
};

motosCtrl.createNewMotoSensor = async (req, res) => {
    const { title, tipo, moto_codigo } = req.body;
    const errors = [];
    if (!title) {
      errors.push({ text: "Por favor indique un nombre" });
    }
    if (!tipo) {
      errors.push({ text: "Por favor indique un tipo" });
    }
    if (!moto_codigo) {
      errors.push({ text: "Por favor indique  moto_codigo" });
    }

    if (errors.length > 0) {
      res.render("motos/new-motos", {
        errors,
        title,
        tipo,
        ubicacion
      });
    } else {
      const newSensor = new Motos({ title, tipo, moto_codigo });
      newSensor.user = req.user.id;
      await newSensor.save();
      req.flash("success_msg", "Sensor adicionado correctamente");
      res.redirect("/motos");
  }
  

};

motosCtrl.renderSensorMotos = async (req, res) => {
  const motos = await Motos.find({ user: req.user.id }).sort({ date: "desc" });
  res.render("motos/all-sensores", { motos });
};

motosCtrl.updateMotoSensor = async (req, res) => {
    const sensor = await Motos.findById(req.params.id);
    console.log(sensor)
    res.render('motos/edit-sensores', sensor);
  };


motosCtrl.editarSensorMoto = async (req, res) => { 
  const idSensor = req.body.moto_codigo;
  console.log(req);
      Motos.findByIdAndUpdate(idSensor, {
      title: req.body.title,
      tipo: req.body.tipo,
      
    }, (error, idSensor)=> {
        console.log(error,idSensor)
        res.redirect('/motos');
    })
    
}


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
  const Influx = require('influxdb-nodejs');
  const client = new Influx('http://127.0.0.1:8086/dbMotos');

const fieldSchema = {
  temperatura: 'i',
  humedad: 'i',
  cargaB: 'i',
  distanciaR: 'i',
  velocidad: 'i',
  peso: 'i',
  potencia: 'i',
  combustible: 'i',
  otro: 'i',
  };

  const tempe1 = Math.floor(Math.random() * 40);
  const hum1 = Math.floor(Math.random() * 100);
  const cargaB1 = Math.floor(Math.random() * 300);
  const distanciaR1 = Math.floor(Math.random() * 100);
  const velocidad1 = Math.floor(Math.random() * 80);
  const peso1 = Math.floor(Math.random() * 220);
  const potencia1 = Math.floor(Math.random() * 240);
  const combustible1 = Math.floor(Math.random() * 100);
  const ot1 = Math.floor(Math.random() * 1000);

const tagSchema = {
  funciona: ['Electrica', 'Combustión', 'Hibrida'],
  method: '*',
  type: ['1', '2', '3', '4', '5'],
};
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


motosCtrl.postValorWireless = async (req, res) => {
    //CODIGO RECEPCIÓN con MODULO GSM Y GPS
    ///http://201.232.243.242:4000/motos/postadd/{"antlat":"1613.99","date":"2019-3-13","eorw":"W","hour":"18:32:11","latitude":"0614.700351","longitude":"07533.027631","nors":"N","uaam":"M"}
    //ejemplo: http://201.232.243.242:4000/motos/addwireless/5f302dba5f76e07174d65c40,35
    //para ver en influx:  select * from "motos"
  //console.log(req.body);
  var GSMprueba = req.body.Sensorito;
  console.log(GSMprueba);

  //PARA RECIBIR EL JSON DE SIM800
  var recjson = JSON.parse(GSMprueba)
  var altitud = recjson.antlat; //altitud
  var latitude = recjson.latitude;
  var longitude = recjson.longitude;
  
  console.log(recjson);
  console.log("ALTITUD:")
  console.log(altitud);
  console.log("LATITUD:")
  console.log(latitude);
  console.log("LONGITUD:")
  console.log(longitude);

  //console.log(req);
  
    //console.log(req.params)
    res.send('<html><body>'
      + '</html>recibi información</body>'
    );
  
} 


motosCtrl.iraDashboard1 = async (req, res) => {
    const motos = await Motos.find({ user: req.user.id }).sort({ date: "desc" });
    res.render("motos/dashboard1", { motos });
};



module.exports = motosCtrl;