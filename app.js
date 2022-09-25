var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json({
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

const cors = require('cors');
app.use(cors({credentials: true, origin: 'https://www.lctoken.net'}));


 var testusdt = require('./testUsdt');

 app.use('/web3', testusdt);

app.get('/', function (request, response) {

    response.contentType('application/json');
    response.end(JSON.stringify("Node is running"));

});

app.get('*', function (req, res) {
    return res.status(404).json({
        msg: 'Page Not Found'
    });
});

app.post('*', function (req, res) {
    return res.status(404).json({
        msg: 'Page Not Found'
    });
});

if (module === require.main) {

    var server = app.listen(process.env.PORT || 5000, function () {
        var port = server.address().port;
        console.log('App listening on port %s', port);
    });

}
