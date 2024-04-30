require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
const URL = require('url').URL

// Basic Configuration
const port = process.env.PORT || 3000;
const encoded_url_data = []

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req?.body?.url
  const urlObj = new URL(url)

  dns.lookup(urlObj.hostname, function(err, address, family){
    if(err) { 
      res.json({ error: 'invalid url' })
    } else {
      const new_data = {
        original_url: url,
        short_url: ((encoded_url_data.length + 1)).toString()
      }
  
      encoded_url_data.push(new_data)
      res.json(new_data)
    }
  })
})

app.get('/api/shorturl/:short_url', (req, res) => {
  let original_url;
  try{
    const found_data = encoded_url_data.find(data => data.short_url === req.params.short_url)
    if(found_data){
      const { original_url } = found_data
      res.redirect(original_url)
    } else {
      res.json({ error: 'invalid url'})
    }
  } catch(err){
    res.json({ error: 'invalid url'})
  }
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
