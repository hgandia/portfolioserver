const cors = require('cors');

const whitelist = [
    'http://localhost:3000', 
    'https://localhost:3443',
    'http://localhost:8080',
    'https:localhost:8080',
    'http://herbertgandia.com',
    'https://herbertgandia.com',
    'http://www.herbertgandia.com'
];

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
