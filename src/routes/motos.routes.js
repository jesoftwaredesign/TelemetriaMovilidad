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
  iraDashboard1,
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

//ir a dashboard 1
router.get("/motos/dashboard1", iraDashboard1);


module.exports = router;
