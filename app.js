var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/js'));
app.get('/', function (req, res) {
    console.log('Loading the index.html')
    console.log(__dirname);
	res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(process.env.PORT || 3022, function () {
  console.log('Example app listening on port '+(process.env.PORT == null ?'3022':'3000')+'!' );
})
