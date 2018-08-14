const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
// const devmtnSession = require('./middlewares/devmtn-session');
const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');
const session = require('express-session');

const app = express();

app.use( bodyParser.json() );

app.use( express.static( `${__dirname}/../build` ) );
// app.use(devmtnSession);
app.use(session({
    secret: 'ertyuhgfr5678uy654edfghuyt',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14
    }
}))
app.use(createInitialSession);
app.use((req,res,next) => {
    if(req.method === 'POST' || req.method === 'PUT') {
        filter(req,res,next);
    } else {
        next();
    }
})


const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );