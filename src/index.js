//SE ARRANCA SERVIDOR CON npm run dev o npm start 

const app = require('./server');
require('./database');

// Server is listening 2
app.listen(app.get('port'), "0.0.0.0", () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
});