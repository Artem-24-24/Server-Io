const app = require('express')()
const http = require('http').Server(app)

const hostname = '127.0.0.1'
const port = 3000;

app.get('/', (req, res) =>
    res.sendFile(__dirname + '/sample.html')
);

app.get('/text/', (req, res) => {
    res.send('Plain text/n');
});
http.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});