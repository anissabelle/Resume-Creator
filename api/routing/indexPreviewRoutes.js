/**********************************************************************
 *
 * Code created from Codex
 * Looked over each line/code pattern to ensure I understand
 *
 **********************************************************************/

import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'crypto';

/**********************************************************************
 *
 * Preview Express Routes For The Current js/index.js File
 *
 * This file is intentionally separate so you can review it before
 * copying any parts into your real server setup.
 *
 * Important design note:
 * Your current js/index.js sends separate POST requests for each
 * resume step, but those requests do not include a User_ID, Resume_ID,
 * or draft token. Because of that, the routes below store the
 * in-progress resume in memory so they can still match the existing
 * frontend requests exactly.
 *
 * The sign up and login routes do use the SQLite database because
 * those requests contain enough information to work with tblUsers.
 *
 **********************************************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const strDatabasePath = path.join(__dirname, '..', '..', 'database', 'dbResume.db');
const objDatabase = new DatabaseSync(strDatabasePath);

/*
    Foreign keys are enabled to preserve relational integrity any time
    a future route is expanded to write resumes and child records.
*/
objDatabase.exec('PRAGMA foreign_keys = ON;');

/*
    This object is a temporary draft store that mirrors how your current
    frontend submits one resume section at a time. It is simple on purpose,
    but it only safely supports one draft per running server process.
*/
const objResumeDraft = {
    personalInfo: null,
    workExperience: [],
    skills: [],
    certifications: [],
    awards: [],
    projects: [],
    title: null
};

/*
    Because the current frontend does not send User_ID with each request,
    this preview router keeps track of the most recently authenticated user.
    That lets the final title step save the full resume into dbResume.
*/
let intCurrentUserId = null;

const normalizeString = (strValue) => {
    return typeof strValue === 'string' ? strValue.trim() : '';
};

const getPasswordHash = (strPassword) => {
    return createHash('sha256').update(strPassword).digest('hex');
};

const resetResumeDraft = () => {
    objResumeDraft.personalInfo = null;
    objResumeDraft.workExperience = [];
    objResumeDraft.skills = [];
    objResumeDraft.certifications = [];
    objResumeDraft.awards = [];
    objResumeDraft.projects = [];
    objResumeDraft.title = null;
};

const saveResumeDraftToDatabase = () => {
    const fnSaveTransaction = objDatabase.transaction(() => {
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

        const objResumeResult = objInsertResumeStatement.run(
            intCurrentUserId,
            objResumeDraft.title,
            objResumeDraft.personalInfo.firstName,
            objResumeDraft.personalInfo.lastName,
            objResumeDraft.personalInfo.email,
            objResumeDraft.personalInfo.phoneNo
        );

        const intResumeId = objResumeResult.lastInsertRowid;

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

        return intResumeId;
    });

    return fnSaveTransaction();
};

const handlePersonalInfoRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method === 'GET') {
        const strEmail = normalizeString(objRequest.query.email).toLowerCase();
        const intUserId = objRequest.query.userId ? Number(objRequest.query.userId) : null;

        if (intUserId) {
            const objUserStatement = objDatabase.prepare(`
                SELECT
                    User_ID,
                    First_Name,
                    Last_Name,
                    Phone_Number,
                    Email_Address,
                    Created_At,
                    Updated_At
                FROM tblUsers
                WHERE User_ID = ?
            `);

            const arrUserRows = objUserStatement.all(intUserId);
            return objResponse.status(200).json(arrUserRows);
        }

        if (strEmail) {
            const objUserStatement = objDatabase.prepare(`
                SELECT
                    User_ID,
                    First_Name,
                    Last_Name,
                    Phone_Number,
                    Email_Address,
                    Created_At,
                    Updated_At
                FROM tblUsers
                WHERE Email_Address = ?
            `);

            const arrUserRows = objUserStatement.all(strEmail);
            return objResponse.status(200).json(arrUserRows);
        }

        return objResponse.status(400).json({
            Outcome: false,
            Error: 'Provide userId or email in the query string.'
        });
    }

    if (objRequest.method === 'POST') {
        const strFirstName = normalizeString(objRequest.body.firstName);
        const strLastName = normalizeString(objRequest.body.lastName);
        const strEmail = normalizeString(objRequest.body.email);
        const strPhoneNo = normalizeString(objRequest.body.phoneNo);

        objResumeDraft.personalInfo = {
            firstName: strFirstName,
            lastName: strLastName,
            email: strEmail,
            phoneNo: strPhoneNo
        };

        return objResponse.status(200).json({
            Outcome: true
        });
    }

    return fnNext();
};

const handleWorkExperienceRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strJobTitle = normalizeString(objRequest.body.jobTitle);
    const strDescription = normalizeString(objRequest.body.description);
    const strStartDateJob = objRequest.body.startDateJob ?? null;
    const strEndDateJob = objRequest.body.endDateJob ?? null;

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

const handleTitleRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strTitle = normalizeString(objRequest.body.title);

    if (!objResumeDraft.personalInfo) {
        return objResponse.status(400).json({
            Outcome: false,
            Error: 'Personal information must be submitted before the title step.'
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
        const intResumeId = saveResumeDraftToDatabase();
        resetResumeDraft();

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

const handleLoginRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strEmail = normalizeString(objRequest.body.email).toLowerCase();
    const strPassword = normalizeString(objRequest.body.password);
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

const handleSignUpRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method !== 'POST') {
        return fnNext();
    }

    const strFirstName = normalizeString(objRequest.body.firstName);
    const strLastName = normalizeString(objRequest.body.lastName);
    const strEmail = normalizeString(objRequest.body.email).toLowerCase();
    const strPhoneNo = normalizeString(objRequest.body.phoneNo);
    const strPassword = normalizeString(objRequest.body.password);
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
            Password_Hash
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    const objInsertResult = objInsertUserStatement.run(
        strFirstName,
        strLastName,
        strPhoneNo,
        strEmail,
        strPasswordHash
    );

    intCurrentUserId = objInsertResult.lastInsertRowid;

    return objResponse.status(201).json({
        Outcome: true,
        User_ID: objInsertResult.lastInsertRowid
    });
};

const handlePreviewDraftRoute = (objRequest, objResponse, fnNext) => {
    if (objRequest.method === 'GET') {
        return objResponse.status(200).json([objResumeDraft]);
    }

    if (objRequest.method === 'DELETE') {
        resetResumeDraft();

        return objResponse.status(200).json({
            Outcome: true
        });
    }

    return fnNext();
};

const registerIndexPreviewRoutes = (app) => {
    app.use('/personal-info', handlePersonalInfoRoute);
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

export default registerIndexPreviewRoutes;
