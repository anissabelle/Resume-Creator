/**************** 
 * 
 * 
 * Showing/Hiding Navbar Links
 * Used ChatGPT for a help with understanding using a navbar for a single page application
 * Used ChatGPT for more efficient method to code showing/hiding divs when user uses navbar
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
document.querySelector('#btnStart').addEventListener("click", function(){
    document.querySelector('#divMainPage').classList.add("d-none")
    document.querySelector('#divResume').classList.remove("d-none")
})
document.querySelector('#btnBack1').addEventListener("click", function(){
    document.querySelector('#divResume').classList.add("d-none")
    document.querySelector('#divMainPage').classList.remove("d-none")
})
document.querySelector('#btnNextStep1').addEventListener("click", function(){
    const firstName = document.querySelector('#inputFirstName').value.trim()
    const lastName = document.querySelector('#inputLastName').value.trim()
    const email = document.querySelector('#inputEmail').value.trim()
    const phoneNo = document.querySelector('#inputPhone').value.trim()

    // Used ChatGPT to help me remember how to use regex to validate email/phone
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^(\+1\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/

    let strErrorMessage = ""
    let blnError = false

    if(!firstName){
        strErrorMessage += "You must enter a first name.<br>"
        blnError = true
    }
    if(!lastName){
        strErrorMessage += "You must enter a last name.<br>"
        blnError = true
    }
    if(!email || !regexEmail.test(email)){
        strErrorMessage += "You must enter a valid email.<br>"
        blnError = true
    }
    if(!phoneNo || !regexPhone.test(phoneNo)){
        strErrorMessage += "You must enter a valid phone number."
        blnError = true
    }

    if(blnError){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Personal Information Submitted!",
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

        // If all form elements are filled then user can move onto next step
        document.querySelector('#divFirstStep').classList.add("d-none")
        document.querySelector('#divSecondStep').classList.remove("d-none")
    }
})
// Resume Page: Work Experience
document.querySelector('#btnBack2').addEventListener("click", function(){
    document.querySelector('#divSecondStep').classList.add("d-none")
    document.querySelector('#divFirstStep').classList.remove("d-none")
})
document.querySelector('#btnAddJob').addEventListener("click", function(){
    const jobTitle = document.querySelector('#inputJobTitle').value

    strErrorMessage = "You must enter a job title to add a new job."

    if(!jobTitle){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Job Submitted!",
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
})
document.querySelector('#btnNextStep2').addEventListener("click", function(){
    const jobTitle = document.querySelector('#inputJobTitle').value
    if(jobTitle){
        let timerInterval;
        Swal.fire({
        title: "Job Submitted!",
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
document.querySelector('#btnAddSkill').addEventListener("click", function(){
    const skill = document.querySelector('#inputSkill').value

    strErrorMessage = "You must enter a skill to add a new skill."

    if(!skill){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Skill Submitted!",
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
})
document.querySelector('#btnNextStep3').addEventListener("click", function(){
    const skill = document.querySelector('#inputSkill').value
    if(skill){
        let timerInterval;
        Swal.fire({
        title: "Skill Submitted!",
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
    document.querySelector('#inputSkill').value = ""

    document.querySelector('#divThirdStep').classList.add("d-none")
    document.querySelector('#divFourthStep').classList.remove("d-none")
})
// Resume Page: Certifications
document.querySelector('#btnBack4').addEventListener("click", function(){
    document.querySelector('#divFourthStep').classList.add("d-none")
    document.querySelector('#divThirdStep').classList.remove("d-none")
})
document.querySelector('#btnAddCertification').addEventListener("click", function(){
    const certification = document.querySelector('#inputCertification').value

    strErrorMessage = "You must enter a certification to add a new certification."

    if(!certification){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Certification Submitted!",
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
})
document.querySelector('#btnNextStep4').addEventListener("click", function(){
    const certification = document.querySelector('#inputCertification').value
    if(certification){
        let timerInterval;
        Swal.fire({
        title: "Certification Submitted!",
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
document.querySelector('#btnAddAward').addEventListener("click", function(){
    const award = document.querySelector('#inputAward').value

    strErrorMessage = "You must enter an award to add a new award."

    if(!award){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Award Submitted!",
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
})
document.querySelector('#btnNextStep5').addEventListener("click", function(){
    const award = document.querySelector('#inputAward').value
    if(award){
        let timerInterval;
        Swal.fire({
        title: "Award Submitted!",
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
document.querySelector('#btnAddProject').addEventListener("click", function(){
    const project = document.querySelector('#inputProject').value

    strErrorMessage = "You must enter a project to add a new project."

    if(!project){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Project Submitted!",
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
})
document.querySelector('#btnNextStep6').addEventListener("click", function(){
    const project = document.querySelector('#inputProject').value
    if(project){
        let timerInterval;
        Swal.fire({
        title: "Project Submitted!",
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
document.querySelector('#btnSubmit').addEventListener("click", function(){
    const title = document.querySelector('#inputTitle').value.trim()
    strErrorMessage = "You must enter a title to create resume"

    if(!title){
        Swal.fire({
            title: "Uh Oh...",
            html: `<p>${strErrorMessage}</p>`,
            icon: "error"
        });
    }
    else{
        let timerInterval;
        Swal.fire({
        title: "Resume Submitted!",
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
})

/**************** 
 * 
 * 
 * Login Form
 * Validation of form elements
 * 
 * 
****************/
document.querySelector('#btnLogin').addEventListener("click", function(){
    const email = document.querySelector('#inputLoginEmail').value.trim()
    const password = document.querySelector('#inputLoginPassword').value.trim()
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    strErrorMessage = ""
    blnError = false

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
        let timerInterval;
        Swal.fire({
        title: "Welcome back!",
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
        document.querySelector('#divFirstStep').classList.remove("d-none")
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
document.querySelector('#btnSignUp').addEventListener("click", function(){
    const firstName = document.querySelector('#inputSignUpFirstName').value.trim()
    const lastName = document.querySelector('#inputSignUpLastName').value.trim()
    const phoneNo = document.querySelector('#inputSignUpPhone').value.trim()
    const email = document.querySelector('#inputSignUpEmail').value.trim()
    const password = document.querySelector('#inputSignUpPassword').value.trim()
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^(\+1\s?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/
    strErrorMessage = ""
    blnError = false

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
        let timerInterval;
        Swal.fire({
        title: "Account Created!",
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
        document.querySelector('#divResume').classList.remove("d-none")
    }
})
document.querySelector('#btnSignUpToLogin').addEventListener("click", function(){
    document.querySelector('#divSignUp').classList.add('d-none')
    document.querySelector('#divLogin').classList.remove('d-none')
})
