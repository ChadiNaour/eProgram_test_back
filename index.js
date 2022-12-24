const PORT = 8001;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const Companies =  require("./companies");

const app = express();
app.use(express.json()); // parse request body as JSON
app.use(cors());

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/company-check', function (req, res) {
    const emailDom = req.body.email.split('@')[1];
    const found = Companies.filter((company) => {
        return company.emailDomain?.includes(emailDom);
    })
    if (found)
        res.send(found);
    else
        res.send(false)
})

app.post('/email-check', function (req, res) {
    if (req.body.email) {
        axios.get(`https://novdistyep.myshopify.com/admin/api/2022-04/customers/search.json?`, {
            params: {
                query: `email:${req.body.email}`,
            },
            headers: {
                'X-Shopify-Access-Token': `${process.env.ACCSESS_TOKEN}`,
                "Accept-Encoding": "gzip,deflate,compress"
            }
        })
            .then(response => {
                console.log(response.data);
                res.send(response.data);
            })
            .catch(error => {
                console.log(error);
                res.send(error);
            });
    }
})

app.listen(PORT, () => { console.log(`server running on port ${PORT}`) });