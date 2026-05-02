const strBaseurl = 'http://localhost:8001'
/**************** 
 * 
 * 
 * Showing/Hiding Navbar Links
 * Used ChatGPT for a help with understanding using a navbar for a single page application
 * Used ChatGPT for more efficient method to code showing/hiding divs when user uses navbar
 * Suggested adding the .page class
 * 
 * 
****************/ 
document.querySelector('#navHome').addEventListener("click", function(){ 
    document.querySelectorAll('.page').forEach(div => { 
        div.classList.add('d-none') })
    document.querySelector('#divMainPage').classList.remove("d-none") 
})
    
document.querySelector('#navCreate').addEventListener("click", function(){
    document.querySelectorAll('.page').forEach(div => {
        div.classList.add('d-none') 
    }) 
    document.querySelector('#divResume').classList.remove("d-none") 
}) 
document.querySelector('#navLogin').addEventListener("click", function(){
    document.querySelectorAll('.page').forEach(div => {
        div.classList.add('d-none') 
    }) 
    document.querySelector('#divLogin').classList.remove("d-none") 
}) 
document.querySelector('#navSignUp').addEventListener("click", function(){
    document.querySelectorAll('.page').forEach(div => {
        div.classList.add('d-none') 
    }) 
    document.querySelector('#divSignUp').classList.remove("d-none") 
})

/**************** 
 * 
 * 
 * Showing/Hiding Resume Form Steps
 * Validation of form elements
 * 
 * 
****************/ 

// Resume Page: Tell us about yourself
let userID = null // users have null ID until they log in
document.querySelector('#btnStart').addEventListener("click", async function(){

    userID = sessionStorage.getItem("userID")
    // User must login/sign up to begin resume
    if(userID != null){
        document.querySelector('#divMainPage').classList.add("d-none")
        document.querySelector('#divSecondStep').classList.remove("d-none")
    }
    else{
        document.querySelector('#divMainPage').classList.add("d-none")
        document.querySelector('#divSignUp').classList.remove("d-none")
    }
})
document.querySelector('#btnBack2').addEventListener("click", function(){
    document.querySelector('#divResume').classList.add("d-none")
    document.querySelector('#divMainPage').classList.remove("d-none")
})

// Resume Page: Work Experience
document.querySelector('#btnBack2').addEventListener("click", function(){
    document.querySelector('#divSecondStep').classList.add("d-none")
    document.querySelector('#divFirstStep').classList.remove("d-none")
})
document.querySelector('#btnAddJob').addEventListener("click", async function(){
    const jobTitle = document.querySelector('#inputJobTitle').value.trim()
    const description = document.querySelector('#inputDescription').value.trim()
    const startDateJob = document.querySelector('#inputStartDateJob').value
    const endDateJob = document.querySelector('#inputEndDateJob').value

    let strErrorMessage = "You must enter a job title to add a new job."

    if(!jobTitle){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{

        // Creating object storing personal info
        // Asked ChatGPT how I would create an API request where not all values are required
        // || null
        const objWorkExp = {
            jobTitle: jobTitle,
            description: description || null,
            startDateJob: startDateJob || null,
            endDateJob: endDateJob|| null
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/work-experience", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objWorkExp)
            })
            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Job Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                // Clear input fields
                // https://www.w3schools.com/howto/howto_html_clear_input.asp
                document.querySelector('#inputJobTitle').value = ""
                document.querySelector('#inputDescription').value = ""
                document.querySelector('#inputStartDateJob').value = ""
                document.querySelector('#inputEndDateJob').value = ""
            }
            else{
                    Swal.fire({
                        title:"Oh no, something went wrong!",
                        icon:"error",
                        text:objData.Error
                    })
                }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })

            return
        }
    }
})
document.querySelector('#btnNextStep2').addEventListener("click", async function(){
    const jobTitle = document.querySelector('#inputJobTitle').value.trim()
    const description = document.querySelector('#inputDescription').value.trim()
    const startDateJob = document.querySelector('#inputStartDateJob').value
    const endDateJob = document.querySelector('#inputEndDateJob').value

    if(jobTitle){

        const objWorkExp = {
            jobTitle: jobTitle,
            description: description || null,
            startDateJob: startDateJob || null,
            endDateJob: endDateJob|| null
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/work-experience", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objWorkExp)
            })
            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Job Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })
                
            }
            else{
                    Swal.fire({
                        title:"Oh no, something went wrong!",
                        icon:"error",
                        text:objData.Error
                    })
                    return
                }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })

            return
        }
    }

    document.querySelector('#inputJobTitle').value = ""
    document.querySelector('#inputDescription').value = ""
    document.querySelector('#inputStartDateJob').value = ""
    document.querySelector('#inputEndDateJob').value = ""

    document.querySelector('#divSecondStep').classList.add("d-none")
    document.querySelector('#divThirdStep').classList.remove("d-none")
})
// Resume Page: Skills
document.querySelector('#btnBack3').addEventListener("click", function(){
    document.querySelector('#divThirdStep').classList.add("d-none")
    document.querySelector('#divSecondStep').classList.remove("d-none")
})
document.querySelector('#btnAddSkill').addEventListener("click", async function(){
    const skill = document.querySelector('#inputSkill').value.trim()

    let strErrorMessage = "You must enter a skill to add a new skill."

    if(!skill){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // API request
        try{
            const response = await fetch(strBaseurl + "/skill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({skill:skill})
            })
            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Skill Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                // Clear input fields
                // https://www.w3schools.com/howto/howto_html_clear_input.asp
                document.querySelector('#inputSkill').value = ""
            }
            else{
                    Swal.fire({
                        title:"Oh no, something went wrong!",
                        icon:"error",
                        text:objData.Error
                    })
                }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })

            return
        }
    }
})
document.querySelector('#btnNextStep3').addEventListener("click", async function(){
    const skill = document.querySelector('#inputSkill').value.trim()
    if(skill){
        // API request
        try{
            const response = await fetch(strBaseurl + "/skill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({skill:skill})
            })
            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Skill Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })
            }
            else{
                    Swal.fire({
                        title: "Save Failed",
                        icon: "error",
                        text: objData.Error
                    })
                    return
                }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })
            return
        }
    }
    document.querySelector('#inputSkill').value = ""

    document.querySelector('#divThirdStep').classList.add("d-none")
    document.querySelector('#divFourthStep').classList.remove("d-none")
})
// Resume Page: Certifications
document.querySelector('#btnBack4').addEventListener("click", function(){
    document.querySelector('#divFourthStep').classList.add("d-none")
    document.querySelector('#divThirdStep').classList.remove("d-none")
})
document.querySelector('#btnAddCertification').addEventListener("click", async function(){
    const certification = document.querySelector('#inputCertification').value
    const certificationDate = document.querySelector('#inputDateCertification').value

    let strErrorMessage = "You must enter a certification to add a new certification."

    if(!certification){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // Certification object
        const objCert = {
            certification:certification,
            certificationDate: certificationDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/certification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objCert)
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Certification Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                document.querySelector('#inputCertification').value = ""
                document.querySelector('#inputDateCertification').value = ""
            }
            else{
                Swal.fire({
                    title: "Certification Save Failed",
                    icon: "error",
                    text: objData.Error
                })
                return
            }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })
            return
        }
    }
})
document.querySelector('#btnNextStep4').addEventListener("click", async function(){
    const certification = document.querySelector('#inputCertification').value.trim()
    const certificationDate = document.querySelector('#inputDateCertification').value

    if(certification){
        // Certification object
        const objCert = {
            certification:certification,
            certificationDate: certificationDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/certification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objCert)
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Certification Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })
            }
            else{
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text:objData.Error
                })
                return
            }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })
            return
        }
    }
    document.querySelector('#inputCertification').value = ""
    document.querySelector('#inputDateCertification').value = ""

    document.querySelector('#divFourthStep').classList.add("d-none")
    document.querySelector('#divFifthStep').classList.remove("d-none")
})
// Resume Page: Awards
document.querySelector('#btnBack5').addEventListener("click", function(){
    document.querySelector('#divFifthStep').classList.add("d-none")
    document.querySelector('#divFourthStep').classList.remove("d-none")
})
document.querySelector('#btnAddAward').addEventListener("click", async function(){
    const award = document.querySelector('#inputAward').value.trim()
    const awardDate = document.querySelector('#inputDateAward').value

    let strErrorMessage = "You must enter an award to add a new award."

    if(!award){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // Award object
        const objAward = {
            award:award,
            awardDate: awardDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/award", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objAward)
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Award Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                document.querySelector('#inputAward').value = ""
                document.querySelector('#inputDateAward').value = ""
            }
            else{
                Swal.fire({
                    title: "Award Save Failed",
                    icon: "error",
                    text: objData.Error
                })

                return
            }
        } catch (error){
            Swal.fire({
                title: "Oh no, something went wrong!",
                icon: "error",
                text: "Could not connect to the server."
            })
            return
        }
    }
})
document.querySelector('#btnNextStep5').addEventListener("click", async function(){
    const award = document.querySelector('#inputAward').value
    const awardDate = document.querySelector('#inputDateAward').value

    if(award){
        // Award object
        const objAward = {
            award:award,
            awardDate: awardDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/award", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objAward)
            })
            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Award Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })
            }
            else{
                Swal.fire({
                    title: "Award Save Failed",
                    icon: "error",
                    text: objData.Error
                })
                return
            }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
    document.querySelector('#inputAward').value = ""
    document.querySelector('#inputDateAward').value = ""

    document.querySelector('#divFifthStep').classList.add("d-none")
    document.querySelector('#divSixthStep').classList.remove("d-none")
})
// Resume Page: Projects
document.querySelector('#btnBack6').addEventListener("click", function(){
    document.querySelector('#divSixthStep').classList.add("d-none")
    document.querySelector('#divFifthStep').classList.remove("d-none")
})
document.querySelector('#btnAddProject').addEventListener("click", async function(){
    const project = document.querySelector('#inputProject').value.trim()
    const projectDescription = document.querySelector('#inputProjectDescription').value.trim()
    const projectStartDate = document.querySelector('#inputStartDateProject').value
    const projectEndDate = document.querySelector('#inputEndDateProject').value

    let strErrorMessage = "You must enter a project to add a new project."

    if(!project){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // Project object
        const objProject = {
            project:project,
            description: projectDescription || null,
            startDate: projectStartDate || null,
            endDate: projectEndDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objProject)
            })

            const objData = await response.json()

            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Project Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                document.querySelector('#inputProject').value = ""
                document.querySelector('#inputProjectDescription').value = ""
                document.querySelector('#inputStartDateProject').value = ""
                document.querySelector('#inputEndDateProject').value = ""
            }
            else{
                    Swal.fire({
                        title:"Oh no, something went wrong!",
                        icon:"error",
                        text:objData.Error
                    })
                    return
                }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
})
document.querySelector('#btnNextStep6').addEventListener("click", async function(){
    const project = document.querySelector('#inputProject').value.trim()
    const projectDescription = document.querySelector('#inputProjectDescription').value.trim()
    const projectStartDate = document.querySelector('#inputStartDateProject').value
    const projectEndDate = document.querySelector('#inputEndDateProject').value

    if(project){
        // Project object
        const objProject = {
            project:project,
            description: projectDescription || null,
            startDate: projectStartDate || null,
            endDate: projectEndDate || null,
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objProject)
            })

            const objData = await response.json()

            if(response.ok && objData.Outcome){
                if(objData.Outcome){
                    let timerInterval;
                    Swal.fire({
                    title: "Project Submitted!",
                    html: "Closing in <b></b> milliseconds.",
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                    })
                }
                else{
                    Swal.fire({
                            title:"Oh no, something went wrong!",
                            icon:"error",
                            text: objData.Error
                        })
                        return
                }
                
            }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
    document.querySelector('#inputProject').value = ""
    document.querySelector('#inputProjectDescription').value = ""
    document.querySelector('#inputStartDateProject').value = ""
    document.querySelector('#inputEndDateProject').value = ""

    document.querySelector('#divSixthStep').classList.add("d-none")
    document.querySelector('#divSeventhStep').classList.remove("d-none")
})
// Resume Page: Submit Resume
document.querySelector('#btnBack7').addEventListener("click", function(){
    document.querySelector('#divSeventhStep').classList.add("d-none")
    document.querySelector('#divSixthStep').classList.remove("d-none")
})
document.querySelector('#btnSubmit').addEventListener("click", async function(){
    const title = document.querySelector('#inputTitle').value.trim()
    let strErrorMessage = "You must enter a title to create resume"

    if(!title){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // API request
        try{
            const response = await fetch(strBaseurl + "/title", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title:title})
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                let timerInterval;
                Swal.fire({
                title: "Resume Submitted!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })

                document.querySelector('#inputTitle').value = ""
            }
            else{
                    Swal.fire({
                            title:"Oh no, something went wrong!",
                            icon:"error",
                            text: objData.Error
                        })
                        return
                }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
})

/**************** 
 * 
 * 
 * Login Form
 * Validation of form elements
 * 
 * 
****************/
document.querySelector('#btnSignIn').addEventListener("click", function(){
    document.querySelector('#divLogin').classList.remove('d-none')
    document.querySelector('#divMainPage').classList.add('d-none')
})
document.querySelector('#btnLogin').addEventListener("click", async function(){
    const email = document.querySelector('#inputLoginEmail').value.trim()
    const password = document.querySelector('#inputLoginPassword').value.trim()
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let strErrorMessage = ""
    let blnError = false

    if(!email || !regexEmail.test(email)){
        blnError = true
        strErrorMessage += "You must enter a valid email.<br>"
    }
    if(!password){
        blnError = true
        strErrorMessage += "You must enter a password.<br>"
    }

    if(blnError){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // Creating object storing login info
        const objLoginInfo = {
            email: email,
            password: password
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objLoginInfo)
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                sessionStorage.setItem("userID", objData.User_ID)
                userID = objData.User_ID

                let timerInterval;
                Swal.fire({
                title: "Welcome Back!",
                html: "Closing in <b></b> milliseconds.",
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
                })
                document.querySelector('#divLogin').classList.add("d-none")
                document.querySelector('#divResume').classList.remove("d-none")
                document.querySelector('#divSecondStep').classList.remove("d-none")
            } 
            else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: objData.Error
                })
                return
            }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
})
document.querySelector('#btnLoginToSignUp').addEventListener("click", function(){
    document.querySelector('#divSignUp').classList.remove('d-none')
    document.querySelector('#divLogin').classList.add('d-none')
})

/**************** 
 * 
 * 
 * Sign Up Form
 * Validation of form elements
 * 
 * 
****************/ 

document.querySelector('#btnSignUp').addEventListener("click", async function(){
    const firstName = document.querySelector('#inputSignUpFirstName').value.trim()
    const lastName = document.querySelector('#inputSignUpLastName').value.trim()
    const phoneNo = document.querySelector('#inputSignUpPhone').value.trim()
    const email = document.querySelector('#inputSignUpEmail').value.trim()
    const password = document.querySelector('#inputSignUpPassword').value.trim()
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^(\+1\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/
    let strErrorMessage = ""
    let blnError = false

    if(!firstName){
        blnError = true
        strErrorMessage += "You must enter a first name.<br>"
    }

    if(!lastName){
        blnError = true
        strErrorMessage += "You must enter a last name.<br>"
    }

    if(!phoneNo || !regexPhone.test(phoneNo)){
        blnError = true
        strErrorMessage += "You must enter a valid phone number.<br>"
    }

    if(!email || !regexEmail.test(email)){
        blnError = true
        strErrorMessage += "You must enter a valid email.<br>"
    }
    if(!password){
        blnError = true
        strErrorMessage += "You must enter a password.<br>"
    }

    if(blnError){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        // Creating object storing personal info
        const objPersonalInfo = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNo: phoneNo,
            password: password
        }
        // API request
        try{
            const response = await fetch(strBaseurl + "/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(objPersonalInfo)
            })
            const objData = await response.json()
            if(response.ok && objData.Outcome){
                    sessionStorage.setItem("userID", objData.User_ID)
                    userID = objData.User_ID
                    let timerInterval;
                    Swal.fire({
                    title: "Account Created!",
                    html: "Closing in <b></b> milliseconds.",
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                    })
                    document.querySelector('#divSignUp').classList.add("d-none")
                    document.querySelector('#divSecondStep').classList.remove("d-none")
                }
                else {
                        Swal.fire({
                            title:"Oh no, something went wrong!",
                            icon:"error",
                            text:objData.Error
                        })
                        return
                    }
        } catch (error){
            Swal.fire({
                title:"Oh no, something went wrong!",
                icon:"error",
                text:"Could not connect to the server."
            })
            return
        }
    }
})
document.querySelector('#btnSignUpToLogin').addEventListener("click", function(){
    document.querySelector('#divSignUp').classList.add('d-none')
    document.querySelector('#divLogin').classList.remove('d-none')
})
