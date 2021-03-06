const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mysql = require('mysql');
const cors = require('cors');
const router = express.Router();
const { Connection, Request } = require("tedious");

router.use(express.json());

require('dotenv').config()

const config = {
    authentication: {
      options: {
        userName: process.env.username, // update me
        password: process.env.password // update me
      },
      type: "default"
    },
    server: process.env.server, // update me
    options: {
      database: "charitopia", //update me
      encrypt: true
    }
};

const connection = new Connection(config);

connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    }
  });
  
connection.connect();

router.use(cors({
    origin: [process.env.origin],
    methods: ["GET", "POST"],
    credentials: true
}));

router.post('/register', (req, res)=>{

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
  
    bcrypt.hash(password, saltRounds, (err, hash)=>{
  
        if (err){
            console.log(err)
        }

        console.log("Inserting into rows...");

        const request = new Request(
          `INSERT INTO dbo.userdb
          VALUES ('${name}', '${email}', '${hash}')`,
          (err, rowCount) => {
            if (err) {
              return res.status(500).json({ "message": "not ok", "error": err });
            } else {
              return res.status(201).json({ "message": `${rowCount} row(s) returned` });
            }
          }
        );
      
        connection.execSql(request);
      })
  
  })

module.exports = router;