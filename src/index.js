//SE ARRANCA SERVIDOR CON npm run dev o npm start 

const app = require('./server');
require('./database');

// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
});