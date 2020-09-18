const express = require("express");
const router = express.Router();

// Controller
const {
  renderMotoSensorForm,
  createNewMotoSensor,
  renderSensorMotos,
  updateMotoSensor,
  editarSensorMoto,
  addValorSensor,
  addValorWireless,
  postValorWireless
  
} = require("../controllers/motos.controller");

// Helpers
const { isAuthenticated } = require("../helpers/auth");


router.get("/motos/addsensor", renderMotoSensorForm);
router.post("/motos/new-sensor", createNewMotoSensor);
router.get("/motos", renderSensorMotos);
router.get("/motos/edit-sensor/:id", updateMotoSensor);
router.post("/motos/editar", editarSensorMoto);

router.post("/motos/postadd", postValorWireless);


// Recibir los valores por navegador
router.get('/motos/add/:valor', addValorSensor);
//recibir los valores desde equipo wireless
router.get('/motos/addwireless/:valor', addValorWireless);




module.exports = router;
