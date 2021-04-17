const cors = require('cors')

const whiteListedOrigins = [
    // local
    'http://localhost:8000',
]

module.exports = cors({
    origin: function (origin, callback) {
      if (whiteListedOrigins.includes(origin) || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    //  'X-Requested-With', 'x-xsrf-token' can prevent CSRF attacks
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'x-xsrf-token', 'x-auth', 'x-token'],
    exposedHeaders: ['x-auth'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    credentials: false,
  })