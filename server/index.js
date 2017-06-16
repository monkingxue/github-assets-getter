/**
 * Created by xueyingchen.
 */
const express = require('express');
const {json, urlencoded} = require('body-parser');
const util = require('util');
const fetch = require('node-fetch');

const {ACCESS_TOKEN} = require('../token.js');
const {BaseXhr} = require('../github/service');
const issueService = require('../github/issue');

const xhr = new BaseXhr({
  baseUrl: 'https://api.github.com',
  token: ACCESS_TOKEN
}, issueService);

const PORT = 4567;

const app = express();
app.use(json());
app.use(urlencoded({
  extended: false
}));

//easy CORS plugin
function cors(_, res, next) {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');

  next();
}

app.use(cors);

app.get('/callback', (req, res) => {


  xhr.fetchIssues({owner: 'dt-fe', repository: 'weekly'})
    .then(data => pretty_obj(data));

});

function pretty_obj(obj) {
  console.log(util.inspect(obj, {depth: null, colors: true}));
}

app.listen(PORT, function () {
  console.log('Node app is running, port:', PORT, '\n\n\n\n\n\n');
});