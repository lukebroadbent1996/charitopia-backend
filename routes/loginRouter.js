const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const router = express.Router();
const cors = require('cors');
const { Connection, Request } = require("tedious");
require('dotenv').config()

router.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

const config = {
    authentication: {
      options: {
        userName: "master", // update me
        password: "Charitopia23" // update me
      },
      type: "default"
    },
    server: "quizsql.database.windows.net", // update me
    options: {
      database: "charitopia", //update me
      encrypt: true,
      rowCollectionOnRequestCompletion: true
    }
};

const connection = new Connection(config);

connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    }
  });
  
connection.connect();

router.get('/login',(req, res)=>{
    if (req.session.user){
        res.send({ loggedIn: true, user: req.session.user })
    }else{
        res.send({ loggedIn: false })
    }
})

router.post('/login',(req, res)=>{

    const email = req.body.email
    const password = req.body.password

    const request = new Request(
        `SELECT * FROM dbo.userdb
        WHERE email = '${email}'`,
        (err, rowCount, rows) => {
            if (err) {
                return res.status(500).json({ "message": "not ok", "error": err });
            }

            if (!rows.length > 0) return res.status(500).json({ "message": "User does not exist!" });

            const results = rows[0][2].value;

            bcrypt.compare(password, results, (error, response)=>{
                if (response){
                    req.session.user = results
                    res.status(200).json({ "message": "ok", "user": { "name": rows[0][0].value, "email": rows[0][1].value } });
                }else{
                    res.status(500).json({ "message": "Wrong email/password combination" });
                }
            })
        }
    );
    
    connection.execSql(request);
  
  })

  module.exports = router