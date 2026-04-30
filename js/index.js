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
// Resume Page: Work Experience
document.querySelector('#btnNextStep1').addEventListener("click", function(){
    document.querySelector('#divFirstStep').classList.add("d-none")
    document.querySelector('#divSecondStep').classList.remove("d-none")
})
document.querySelector('#btnBack2').addEventListener("click", function(){
    document.querySelector('#divSecondStep').classList.add("d-none")
    document.querySelector('#divFirstStep').classList.remove("d-none")
})
// Resume Page: Skills
document.querySelector('#btnNextStep2').addEventListener("click", function(){
    document.querySelector('#divSecondStep').classList.add("d-none")
    document.querySelector('#divThirdStep').classList.remove("d-none")
})
document.querySelector('#btnBack3').addEventListener("click", function(){
    document.querySelector('#divThirdStep').classList.add("d-none")
    document.querySelector('#divSecondStep').classList.remove("d-none")
})
// Resume Page: Certifications
document.querySelector('#btnNextStep3').addEventListener("click", function(){
    document.querySelector('#divThirdStep').classList.add("d-none")
    document.querySelector('#divFourthStep').classList.remove("d-none")
})
document.querySelector('#btnBack4').addEventListener("click", function(){
    document.querySelector('#divFourthStep').classList.add("d-none")
    document.querySelector('#divThirdStep').classList.remove("d-none")
})
// Resume Page: Awards
document.querySelector('#btnNextStep4').addEventListener("click", function(){
    document.querySelector('#divFourthStep').classList.add("d-none")
    document.querySelector('#divFifthStep').classList.remove("d-none")
})
document.querySelector('#btnBack5').addEventListener("click", function(){
    document.querySelector('#divFifthStep').classList.add("d-none")
    document.querySelector('#divFourthStep').classList.remove("d-none")
})
// Resume Page: Projects
document.querySelector('#btnNextStep5').addEventListener("click", function(){
    document.querySelector('#divFifthStep').classList.add("d-none")
    document.querySelector('#divSixthStep').classList.remove("d-none")
})
document.querySelector('#btnBack6').addEventListener("click", function(){
    document.querySelector('#divSixthStep').classList.add("d-none")
    document.querySelector('#divFifthStep').classList.remove("d-none")
})
// Resume Page: Submit Resume
document.querySelector('#btnNextStep6').addEventListener("click", function(){
    document.querySelector('#divSixthStep').classList.add("d-none")
    document.querySelector('#divSeventhStep').classList.remove("d-none")
})
document.querySelector('#btnBack7').addEventListener("click", function(){
    document.querySelector('#divSeventhStep').classList.add("d-none")
    document.querySelector('#divSixthStep').classList.remove("d-none")
})

/**************** 
 * 
 * 
 * Resume Form Validation
 * Personal information is required
 * To add another item for certifications, awards, projects, etc, user must input something prior
 * Using Sweet Alert pop-ups to notify user of required fields
 * 
 * 
****************/
document.querySelector('#btnNextStep1').addEventListener("click", function(){
    const firstName = document.querySelector('#inputFirstName').value.trim()
    const lastName = document.querySelector('#inputLastName').value.trim()
    const email = document.querySelector('#inputEmail').value.trim()
    const phoneNo = document.querySelector('#inputPhone').value.trim()

    let strErrorMessage = ""
    let blnError = false

    if(!firstName){
        strErrorMessage += "<p>You must enter a first name.</p>"
        blnError = true
    }
    if(!lastName){
        strErrorMessage += "<p>You must enter a last name.</p>"
        blnError = true
    }
    if(!email){
        strErrorMessage += "<p>You must enter a valid email.</p>"
        blnError = true
    }
    if(!phoneNo){
        strErrorMessage += "<p>You must enter a valid phone number.</p>"
        blnError = true
    }

    if(blnError){

    }
    
})