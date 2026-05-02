import express from 'express'
import sqlite3 from'sqlite3'
import sha256 from"sha256"

// Creating server
const HTTP_PORT = 8000
var app = express()

app.use(express.json())

// Connecting to sql database
const dbResume = new sqlite3.Database('dbResume.db', (err) => {
    if(err){
        console.error("Error opening database:",err.message)
    } else {
        console.log("Connected to dbResume.db")
    }
})

app.listen(HTTP_PORT,() => {
    console.log('Listening on',HTTP_PORT)
})