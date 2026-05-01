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
        console.log("Connected to dbCrop.db")
    }
})

app.listen(HTTP_PORT,() => {
    console.log('Listening on',HTTP_PORT)
})
/******************************* 

User will be able to create multiple resumes and save them to the database

*******************************/
const resumeObjArray = 
    [
        {
            title:"",
            resume: addResume(resume, title)
        }
    ]

function pushResume(resume, title){
    const newResume = {
        title: title,
        resume: resume
    }
    resumeObjArray.push(newResume)
}

/******************************* 

Creating Resume object
!!!!!!!!!!!!!!!!! Unsure if date will be a string

*******************************/
const Resume = {

    firstName:"",
    lastName:"",
    phoneNum:"",
    email:"",
    workExp: [
        {
            jobTitle:"",
             description:""
        }
    ],
    skills: [
        {
            skillTitle:""
        }
    ],
    certifications: [
        {
            certTitle:"",
            certDate:""
        }
    ],
    awards: [
        {
            awardTitle:"",
            awardDate:""
        }
    ],
    projects: [
        {
            projectTitle:"",
            projectDescr:"",
            projectStart:"",
            projectEnd:""
        }
    ]
}

// Creates new resume object and pushes object to array 
// Stores  resume in database
function createNewResume(firstName, lastName, phoneNum, email, workExp, skills, certifications, awards, projects, title){
    const newResume = Resume(firstName, lastName, phoneNum, email, workExp, skills, certifications, awards, projects)
    pushResume(newResume, title)
}
