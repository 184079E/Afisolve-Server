const express = require('express')
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');

const app1 = express();

app1.use(bodyParser.json());
app1.use(logger('dev'));
app1.use(cors());

const PORT1 = 3000;

const authentication = require('./routes/authentication');
const customer = require('./routes/customer');
const admin = require('./routes/admin');
const ceo = require('./routes/ceo');
const accountCoordinator = require('./routes/accountCoordinator');
const developer = require('./routes/developer');
const projectManager = require('./routes/projectManager');
const users = require('./routes/users');

//=============================================
app1.use('/authentication', authentication);
app1.use('/customer', customer);
app1.use('/admin', admin);
app1.use('/ceo', ceo);
app1.use('/accountCoordinator', accountCoordinator);
app1.use('/developer', developer);
app1.use('/projectManager', projectManager);
app1.use('/users', users);

//=============================================
app1.get('/', function (req, res) {
    res.send('Hello from server(1) ');
})

//======================  =======================
app1.listen(PORT1, function () {
    console.log('Server running on localhost:' + PORT1 );
});

