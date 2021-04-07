require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});
// catch errors
app.use((error, res, next) => {
    res.status(error.status || 500);
    res.statusMessage = "Erro Interno no Servidor";
    error.statusCode = res.statusCode;
    error.statusMessage = res.statusMessage;
	res.json({
        status: error.statusCode,
        message: error.statusMessage
    });
});

let port = 8080;

if (process.env.NODE_ENV === 'production') port = process.env.PORT || 3000;

app.listen(port, () => console.log(`\n->  @@ Likearns API is running on ${process.env.APP_URL}\n`));