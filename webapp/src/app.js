const config = require('./config');
const setup = require('./setup');
const winston = require('winston');

const ext = require('./external');


let app = setup.createExpressApp(config);
setup.setupDBConnection(config);

setup.createRoutes(app);
setup.handleExpressErrors(app);

ext.startSchedule();

app.listen(app.get('port'), () => {
    winston.debug(config.get('appname'), 'Node express server listening on: ' + app.get('port'));
});


