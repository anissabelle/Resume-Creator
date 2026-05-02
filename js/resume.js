
// Creates new resume object and pushes object to array 
// Stores  resume in database
function createNewResume(firstName, lastName, phoneNum, email, workExp, skills, certifications, awards, projects, title){
    const newResume = Resume(firstName, lastName, phoneNum, email, workExp, skills, certifications, awards, projects)
    pushResume(newResume, title)
}

/******************************* 

User will be able to create multiple resumes and save them to the database

*******************************/
const resumeObjArray = 
    [
        {
            title:"",
            resume: createNewResume(resume, title)
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
