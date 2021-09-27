const express = require('express');
const routes = require('./routes/routes')


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get("/",(req,res) => res.send("Hello , Welcome "))
app.use(`/api`, routes.routes);




const ports = 8080
app.listen(ports, () => console.log("App Listening on url http://localhost:" + ports));


