const { Router } = require('express')
const router = Router()

const { 
  renderSensoresForm, 
  createNewSensores, 
  renderSensores, 
  renderEditForm,
  graficarSensores
 } = require('../controllers/sensores.controller');


//get optiene del servido, post envia

router.get('/sensores/add', renderSensoresForm);
router.post('/sensores/new-sensores', createNewSensores);
router.get('/sensores/datos-sensores', renderSensores);
router.get('/sensores/graficar-sensores', graficarSensores);

// para recibir los valroe por navegador
router.get('/sensores/edit/:valor', renderEditForm);
// router.put('/sensores/edit/:valor',updateSensores);

// router.delete('/sensores/delete/:valor',deletesensores);

module.exports = router
