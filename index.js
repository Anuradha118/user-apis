const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const passport = require('passport');

require('dotenv').config();

const {cors} = require('./middlewares/index')
// Bring in defined Passport Strategy
require('./config/passport')
// app
const app = express()

// port
const port = process.env.PORT || 8000;
// cors
app.use(cors)

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: '100mb', extended: false }))
app.use(express.json({ limit: '100mb' }))
app.use(cookieParser());

// Initialize passport for use
app.use(passport.initialize())

//db connnection
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useCreateIndex:true,
  useUnifiedTopology: true
})
.then(() => {console.log('db connected ')})


process.on('unhandledRejection', function (e) {
  console.log('unhandledRejection',e)
  process.exit(-1)
})

process.on('uncaughtException', function (e, req, res) {
  console.log('uncaughtException',e)
  process.exit(-10)
})

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

//route
app.use('/v1',require('./routes'));

app.get('/', (req, res) => {
    res.send('Hello World!')
  });
  
module.exports = app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});