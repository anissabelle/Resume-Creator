/**********************************************************************
 *
 * Code created from Codex
 * Looked over each line/code pattern to ensure I understand
 * Single line comments are created by me to show my understanding
 *
 **********************************************************************/

import path from 'path';    // path helps create file paths safely - path.join()
import { fileURLToPath } from 'url';    // creates __dirname to be able to locate database file
import { DatabaseSync } from 'node:sqlite'; // imports Node's build-in SQLite database tool
import sha256 from "sha256"
import 'dotenv/config' // loads API key from a .env file
import { GoogleGenAI } from "@google/genai"
import PDFDocument from "pdfkit";

/**********************************************************************
 *
 * Preview Express Routes For The Current js/index.js File
 *
 * This file is intentionally separate so you can review it before
 * copying any parts into your real server setup.
 *
 * Important design note:
 * Your current js/index.js sends separate POST requests for each
 * resume step. Since users must sign up or log in before saving a
 * resume, the route file stores only the in-progress resume sections
 * in memory and reads personal information directly from tblUsers
 * when the resume is finally created.
 *
 **********************************************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// builds path to sqlLite database file in a way that works better across operating systems
const strDatabasePath = path.join(__dirname, '..', '..', 'database', 'dbResume.db');

// creates database object
// DatabaseSync allows you to run SQL statements synchronously, so Node waits for each database command to finish before moving on.
// .prepare prepares sql statements before running
// .run runs the prepared statement with parameters
// .exec means run sql command against the database. Used when you want to run command and do not need returned values
// .transaction means if any part fails then the whole transaction will fail
// .get returns one row from the database where the parameters match
const objDatabase = new DatabaseSync(strDatabasePath);

/*
    Foreign keys are enabled to preserve relational integrity any time
    a future route is expanded to write resumes and child records.
*/
//  turns on foreign key reinforcement
// ensures that we return correct data for a given user with User_ID and correct resume with Resume_ID
objDatabase.exec('PRAGMA foreign_keys = ON;');

/*
    This small migration keeps the existing local database in sync with the
    current signup requirement. Older copies of dbResume may not have the
    Gemini_API_Key column yet, so we add it during startup if needed.
*/
const ensureUserApiKeyColumn = () => {
    const arrUserColumns = objDatabase.prepare(`
        PRAGMA table_info('tblUsers')
    `).all();

    const blnHasGeminiApiKeyColumn = arrUserColumns.some((objColumn) => {
        return objColumn.name === 'Gemini_API_Key';
    });

    if (!blnHasGeminiApiKeyColumn) {
        objDatabase.exec(`
            ALTER TABLE tblUsers
            ADD COLUMN Gemini_API_Key TEXT NOT NULL DEFAULT ''
        `);
    }
};

ensureUserApiKeyColumn();

/*
    This object is a temporary draft store that mirrors how your current
    frontend submits one resume section at a time. It is simple on purpose,
    but it only safely supports one draft per running server process.
*/
const objResumeDraft = {
    workExperience: [],
    skills: [],
    certifications: [],
    awards: [],
    projects: [],
    title: null
};

/*
    After a resume is saved or the user clears the preview, we need to
    empty the in-memory draft so the next resume starts fresh.
*/
const resetResumeDraft = () => {
    objResumeDraft.workExperience = [];
    objResumeDraft.skills = [];
    objResumeDraft.certifications = [];
    objResumeDraft.awards = [];
    objResumeDraft.projects = [];
    objResumeDraft.title = null;
};
/*
    Because the current frontend does not send User_ID with each request,
    this preview router keeps track of the most recently authenticated user.
    That lets the final title step save the full resume into dbResume.
*/
let intCurrentUserId = null;

// normalizeString safely cleans up input values with .trim()
// it protects the database from backend crash
const normalizeString = (strValue) => {
    // returns trimmed string if value is a string else return "" empty string
    // same as:
    // if(typeof strValue === 'string'){
    //     return strValue.trim()
    // }
    // else{
    //     return ''
    // }
    return typeof strValue === 'string' ? strValue.trim() : '';
};
// Hashes password
const getPasswordHash = (strPassword) => {
    return sha256(strPassword);
};

// Function is called when user gets to the final title step and they are ready to create resume
const saveResumeDraftToDatabase = () => {
    /*
        node:sqlite DatabaseSync does not provide a .transaction() helper.
        We create the transaction manually so the resume row and all child
        rows either save together or roll back together.
    */
    objDatabase.exec('BEGIN TRANSACTION');

    try {
        const objUserStatement = objDatabase.prepare(`
            SELECT
                First_Name,
                Last_Name,
                Email_Address,
                Phone_Number
            FROM tblUsers
            WHERE User_ID = ?
        `);

        const objUserRow = objUserStatement.get(intCurrentUserId);

        if (!objUserRow) {
            throw new Error('User account could not be found.');
        }

        // Saving Personal Info from the signed-in user's account
        const objInsertResumeStatement = objDatabase.prepare(`
            INSERT INTO tblResumes (
                User_ID,
                Resume_Title,
                First_Name,
                Last_Name,
                Email_Address,
                Phone_Number
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        // Run personal info sql command and save values created in objResumeResult
        const objResumeResult = objInsertResumeStatement.run(
            intCurrentUserId,   
            objResumeDraft.title,
            objUserRow.First_Name,
            objUserRow.Last_Name,
            objUserRow.Email_Address,
            objUserRow.Phone_Number
        );

        //  grabs resumeID - the last created id in the resume
        // lastInsertRowid means give me the primary key ID of the row that was just inserted
        // Primary key is the resumeID
        const intResumeId = objResumeResult.lastInsertRowid;

        // sql commands create prepared statements for inserting work experience, skills, certifications, awards, projects 
        const objInsertWorkExperienceStatement = objDatabase.prepare(`
            INSERT INTO tblWorkExperiences (
                Resume_ID,
                Job_Title,
                Job_Description,
                Start_Date,
                End_Date,
                Display_Order
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const objInsertSkillStatement = objDatabase.prepare(`
            INSERT INTO tblSkills (
                Resume_ID,
                Skill_Name,
                Display_Order
            )
            VALUES (?, ?, ?)
        `);

        const objInsertCertificationStatement = objDatabase.prepare(`
            INSERT INTO tblCertifications (
                Resume_ID,
                Certification_Name,
                Certification_Date,
                Display_Order
            )
            VALUES (?, ?, ?, ?)
        `);

        const objInsertAwardStatement = objDatabase.prepare(`
            INSERT INTO tblAwards (
                Resume_ID,
                Award_Name,
                Award_Date,
                Display_Order
            )
            VALUES (?, ?, ?, ?)
        `);

        const objInsertProjectStatement = objDatabase.prepare(`
            INSERT INTO tblProjects (
                Resume_ID,
                Project_Title,
                Project_Description,
                Start_Date,
                End_Date,
                Display_Order
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        // Loops create every resume value that user adds
        // User can add several work experience, skills, awards, projects, certifications
        // These must be indexed to be able to grab specific user input (like a specific award) in order to edit//delete
        objResumeDraft.workExperience.forEach((objWorkExperience, intIndex) => {
            objInsertWorkExperienceStatement.run(
                intResumeId,
                objWorkExperience.jobTitle,
                objWorkExperience.description,
                objWorkExperience.startDateJob,
                objWorkExperience.endDateJob,
                intIndex + 1
            );
        });

        objResumeDraft.skills.forEach((objSkill, intIndex) => {
            objInsertSkillStatement.run(
                intResumeId,
                objSkill.skill,
                intIndex + 1
            );
        });

        objResumeDraft.certifications.forEach((objCertification, intIndex) => {
            objInsertCertificationStatement.run(
                intResumeId,
                objCertification.certification,
                objCertification.certificationDate,
                intIndex + 1
            );
        });

        objResumeDraft.awards.forEach((objAward, intIndex) => {
            objInsertAwardStatement.run(
                intResumeId,
                objAward.award,
                objAward.awardDate,
                intIndex + 1
            );
        });

        objResumeDraft.projects.forEach((objProject, intIndex) => {
            objInsertProjectStatement.run(
                intResumeId,
                objProject.project,
                objProject.description,
                objProject.startDate,
                objProject.endDate,
                intIndex + 1
            );
        });

        objDatabase.exec('COMMIT');

        // Return the saved resume ID after the whole transaction succeeds.
        return intResumeId;
    } catch (objError) {
        objDatabase.exec('ROLLBACK');
        throw objError;
    }
};

// For each route (my own commenting):
/*

normalizeString function does the same as .trim() on the frontend but this will protect backend
Returns objResponse with either an error status and error message OR with a good status and Outcome:true
objResponse is used in the try catch of each API request
Each route pushes values to the objResumeDraft
Some of these values are allowed to be null
Once user gets to the title section of the resume builder, our objResumeDraft gets sent to the database

return fnNext(); tells Express to look for another matching route
If express cannot find another route, it returns 404 Not Found

*/

const handleWorkExperienceRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strJobTitle = normalizeString(objRequest.body.jobTitle);
    const strDescription = normalizeString(objRequest.body.description);
    const strStartDateJob = objRequest.body.startDateJob ?? null;
    const strEndDateJob = objRequest.body.endDateJob ?? null;

    if(!strJobTitle){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Job title is required."
        });
    }

    objResumeDraft.workExperience.push({
        jobTitle: strJobTitle,
        description: strDescription || null,
        startDateJob: strStartDateJob || null,
        endDateJob: strEndDateJob || null
    });

    return objResponse.status(201).json({
        Outcome: true
    });
};

const handleSkillRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strSkill = normalizeString(objRequest.body.skill);

    if(!strSkill){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Skill is required."
        });
    }

    objResumeDraft.skills.push({
        skill: strSkill
    });

    return objResponse.status(201).json({
        Outcome: true
    });
};

const handleCertificationRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strCertification = normalizeString(objRequest.body.certification);
    const strCertificationDate = objRequest.body.certificationDate ?? null;

    if(!strCertification){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Certification is required."
        });
    }

    objResumeDraft.certifications.push({
        certification: strCertification,
        certificationDate: strCertificationDate || null
    });

    return objResponse.status(201).json({
        Outcome: true
    });
};

const handleAwardRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strAward = normalizeString(objRequest.body.award);
    const strAwardDate = objRequest.body.awardDate ?? null;

    if(!strAward){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Award is required."
        });
    }

    objResumeDraft.awards.push({
        award: strAward,
        awardDate: strAwardDate || null
    });

    return objResponse.status(201).json({
        Outcome: true
    });
};

const handleProjectRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strProject = normalizeString(objRequest.body.project);
    const strDescription = normalizeString(objRequest.body.description);
    const strStartDate = objRequest.body.startDate ?? null;
    const strEndDate = objRequest.body.endDate ?? null;

    if(!strProject){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Project title is required."
        });
    }

    objResumeDraft.projects.push({
        project: strProject,
        description: strDescription || null,
        startDate: strStartDate || null,
        endDate: strEndDate || null
    });

    return objResponse.status(201).json({
        Outcome: true
    });
};

// Route handles if user is not signed in, but frontend requires users to sign in to create resume
// Good for code maintenance
const handleTitleRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strTitle = normalizeString(objRequest.body.title);

    if(!strTitle){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Resume title is required."
        });
    }

    if (!intCurrentUserId) {
        return objResponse.status(400).json({
            Outcome: false,
            Error: 'A user must sign up or log in before saving a resume.'
        });
    }

    objResumeDraft.title = strTitle;

    try {
        // when saveResumeDraftToDatabase is called it returns the resumeID with this line: return fnSaveTransaction();
        const intResumeId = saveResumeDraftToDatabase();
        resetResumeDraft();

        // Sends Resume_ID to frontend
        return objResponse.status(200).json({
            Outcome: true,
            Resume_ID: intResumeId
        });
    } catch (objError) {
        return objResponse.status(500).json({
            Outcome: false,
            Error: objError.message
        });
    }
};

// User inputs username and password and handleLoginRoute finds the matching row in tblUser (users table
// hashes user password with the getPasswordHash() function to find matches hashed password in database
// saves user row from database in objUserRow
// returns User_ID to frontend if successful
const handleLoginRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strEmail = normalizeString(objRequest.body.email).toLowerCase();
    const strPassword = normalizeString(objRequest.body.password);

    if(!strEmail){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Email is required."
        });
    }

    if(!strPassword){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Password is required."
        });
    }

    const strPasswordHash = getPasswordHash(strPassword);
    const objLoginStatement = objDatabase.prepare(`
        SELECT User_ID
        FROM tblUsers
        WHERE Email_Address = ?
            AND Password_Hash = ?
    `);

    const objUserRow = objLoginStatement.get(strEmail, strPasswordHash);

    if (!objUserRow) {
        return objResponse.status(401).json({
            Outcome: false,
            Error: 'Invalid email or password.'
        });
    }

    intCurrentUserId = objUserRow.User_ID;

    return objResponse.status(200).json({
        Outcome: true,
        User_ID: objUserRow.User_ID
    });
};

// 
const handleSignUpRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strFirstName = normalizeString(objRequest.body.firstName);
    const strLastName = normalizeString(objRequest.body.lastName);
    const strEmail = normalizeString(objRequest.body.email).toLowerCase();
    const strPhoneNo = normalizeString(objRequest.body.phoneNo);
    const strGeminiApiKey = normalizeString(objRequest.body.apiKey);
    const strPassword = normalizeString(objRequest.body.password);

    if(!strFirstName){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "First name is required."
        });
    }

    if(!strLastName){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Last name is required."
        });
    }

    if(!strPhoneNo){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Phone number is required."
        });
    }

    if(!strEmail){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Email is required."
        });
    }

    if(!strPassword){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Password is required."
        });
    }

    if(!strGeminiApiKey){
        return objResponse.status(400).json({
            Outcome: false,
            Error: "Google Gemini API key is required."
        });
    }

    const objExistingUserStatement = objDatabase.prepare(`
        SELECT User_ID
        FROM tblUsers
        WHERE Email_Address = ?
    `);

    const objExistingUser = objExistingUserStatement.get(strEmail);

    if (objExistingUser) {
        return objResponse.status(409).json({
            Outcome: false,
            Error: 'An account with that email already exists.'
        });
    }

    const strPasswordHash = getPasswordHash(strPassword);
    const objInsertUserStatement = objDatabase.prepare(`
        INSERT INTO tblUsers (
            First_Name,
            Last_Name,
            Phone_Number,
            Email_Address,
            Gemini_API_Key,
            Password_Hash
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const objInsertResult = objInsertUserStatement.run(
        strFirstName,
        strLastName,
        strPhoneNo,
        strEmail,
        strGeminiApiKey,
        strPasswordHash
    );

    intCurrentUserId = objInsertResult.lastInsertRowid;

    return objResponse.status(201).json({
        Outcome: true,
        User_ID: objInsertResult.lastInsertRowid
    });
};

// Clearing the resume draft after the user submits the resume and it gets saved to the database
// Asked ChatGPT to help with SQL and how to return a PDF to my frontend
// Suggested installing the pdfkit library and returning it to my frontend that way
const handlePreviewDraftRoute = async (objRequest, objResponse, fnNext) => {
    
    // When using get method, sends objResumeDraft as PDF resume file
    // SQL database holds resume
    if (objRequest.method === 'GET') {
        
        if(!intCurrentUserId){
            return objResponse.status(400).json({
                Outcome: false,
                Error: "A user must be logged in to load a resume."
            });
        }

        /*
            The signed-in user now supplies their own Gemini API key when
            creating an account, so we load that key from tblUsers before
            requesting the AI-generated resume draft.
        */
        const objApiKeyStatement = objDatabase.prepare(`
            SELECT Gemini_API_Key
            FROM tblUsers
            WHERE User_ID = ?
        `);

        const objApiKeyRow = objApiKeyStatement.get(intCurrentUserId);

        if (!objApiKeyRow || !normalizeString(objApiKeyRow.Gemini_API_Key)) {
            return objResponse.status(400).json({
                Outcome: false,
                Error: "A Google Gemini API key is required for this account."
            });
        }

        // Creates the Gemini client using that specific user's stored API Key
        const genAI = new GoogleGenAI({
            apiKey: objApiKeyRow.Gemini_API_Key
        });

        // identify the model we want to use for story generation
        const model = "gemini-3-flash-preview";

        // Grabs last inserted resume row with matching User_ID
        // Need the Resume_ID since it is the foreign key for other tables with the resume data 
        const objUserStatement = objDatabase.prepare(`
            SELECT
                User_ID,
                First_Name,
                Last_Name,
                Email_Address,
                Phone_Number,
                Resume_Title,
                Resume_ID
            FROM tblResumes
            WHERE User_ID = ?
            ORDER BY Resume_ID DESC
            LIMIT 1
        `);
        // Grab existing user and recently added resume
        const objResumeRow = objUserStatement.get(intCurrentUserId);

         if(!objResumeRow){
            return objResponse.status(404).json({
                Outcome: false,
                Error: "No resume found for this user."
            });
        }

        const intResumeId = objResumeRow.Resume_ID;

        // Grab work experience rows for this resume
        const objWorkExperienceStatement = objDatabase.prepare(`
            SELECT
                Work_Experience_ID,
                Job_Title,
                Job_Description,
                Start_Date,
                End_Date,
                Display_Order
            FROM tblWorkExperiences
            WHERE Resume_ID = ?
            ORDER BY Display_Order ASC
        `);

        const arrWorkExperience = objWorkExperienceStatement.all(intResumeId);

        // Grab skills for this resume
        const objSkillStatement = objDatabase.prepare(`
            SELECT
                Skill_ID,
                Skill_Name,
                Display_Order
            FROM tblSkills
            WHERE Resume_ID = ?
            ORDER BY Display_Order ASC
        `);

        const arrSkills = objSkillStatement.all(intResumeId);

        // Grab certifications for this resume
        const objCertificationStatement = objDatabase.prepare(`
            SELECT
                Certification_ID,
                Certification_Name,
                Certification_Date,
                Display_Order
            FROM tblCertifications
            WHERE Resume_ID = ?
            ORDER BY Display_Order ASC
        `);

        const arrCertifications = objCertificationStatement.all(intResumeId);

        // Grab awards for this resume
        const objAwardStatement = objDatabase.prepare(`
            SELECT
                Award_ID,
                Award_Name,
                Award_Date,
                Display_Order
            FROM tblAwards
            WHERE Resume_ID = ?
            ORDER BY Display_Order ASC
        `);

        const arrAwards = objAwardStatement.all(intResumeId);

        // Grab projects for this resume
        const objProjectStatement = objDatabase.prepare(`
            SELECT
                Project_ID,
                Project_Title,
                Project_Description,
                Start_Date,
                End_Date,
                Display_Order
            FROM tblProjects
            WHERE Resume_ID = ?
            ORDER BY Display_Order ASC
        `);

        const arrProjects = objProjectStatement.all(intResumeId);

        // Create one object with all resume data
        const objResumeForAI = {
            resumeID: objResumeRow.Resume_ID,
            userID: objResumeRow.User_ID,
            title: objResumeRow.Resume_Title,
            personalInfo: {
                firstName: objResumeRow.First_Name,
                lastName: objResumeRow.Last_Name,
                email: objResumeRow.Email_Address,
                phoneNo: objResumeRow.Phone_Number
            },
            workExperience: arrWorkExperience,
            skills: arrSkills,
            certifications: arrCertifications,
            awards: arrAwards,
            projects: arrProjects
        };

        // AI Resume Creation
        try {
            const prompt = 
            `
                Can you create a resume with this resume JSON data and return only text. Do not include markdown formatting.
                Resume JSON: ${JSON.stringify(objResumeForAI, null, 2)}           
            `;
            // null = no special filtering or replacing
            // 2 = indent the JSON with 2 spaces so it is easier to read
            const objGemini = await genAI.models.generateContent({
                model: model,
                contents: prompt,
            });

            const strResumeText = objGemini.text;

            // creates a PDF on the server to be sent back to the browser as the response
            const objPDF = new PDFDocument({
                size: "LETTER",
                margin: 50
            });

            // tells browser the response being sent back is a pdf
            objResponse.setHeader("Content-Type", "application/pdf");
            // tells browser how to display the pdf
            // inline -- tries to display the pdf in the browser instead of forcing a download
            objResponse.setHeader(
                "Content-Disposition",
                `inline; filename="${objResumeForAI.title || "Resume"}.pdf"`
            );

            // connects the pdf to the express response
            // Whatever PDFKit creates, send it directly back to the browser.
            objPDF.pipe(objResponse);

            // sets text size and alignment
            objPDF.fontSize(11).text(strResumeText, {
                align: "left"
            });

            // finishes pdf; tells PDFKit that we're done adding content to the pdf
            // sends the completed resume
            objPDF.end();
        } 
        catch(error){
            console.error(error);

            if (error?.status === 400 && error?.message?.includes('API key not valid')) {
                return objResponse.status(400).json({
                    Outcome: false,
                    Error: "The Google Gemini API key for this account is invalid."
                });
            }

            return objResponse.status(500).json({
                Outcome: false,
                Error: "Could not generate resume PDF."
            });
        }

        return;
    }

    if (objRequest.method === 'DELETE') {
        resetResumeDraft();

        return objResponse.status(200).json({
            Outcome: true
        });
    }

    return fnNext();
};

// This connects route handler functions to Express app
// takes app, the server object, as the parameter
const registerIndexPreviewRoutes = (app) => {
    app.use('/work-experience', handleWorkExperienceRoute);
    app.use('/skill', handleSkillRoute);
    app.use('/certification', handleCertificationRoute);
    app.use('/award', handleAwardRoute);
    app.use('/project', handleProjectRoute);
    app.use('/title', handleTitleRoute);
    app.use('/login', handleLoginRoute);
    app.use('/signUp', handleSignUpRoute);
    app.use('/preview-draft', handlePreviewDraftRoute);
};

// exports to server.js
// Use "export default" when your file has one main thing it is meant to provide
// if you don't use "export default," use "export { registerIndexPreviewRoutes };"
// This would require your import statement to look like: "import { registerIndexPreviewRoutes } from './api/routing/indexPreviewRoutes.js';"
export default registerIndexPreviewRoutes;
