-- Used Codex to help me create the database design

-- Resume Builder Database Schema
-- Database Name: dbResume
--
-- This schema is designed for a resume builder application where:
-- 1. A user can sign up and log in to their account.
-- 2. A single user can save many resumes.
-- 3. Each resume can store many child records such as work experience,
--    skills, certifications, awards, and projects.
--
-- SQLite stores dates as TEXT very well, so date-related columns below use
-- ISO-style text values such as YYYY-MM-DD for simplicity and readability.

PRAGMA foreign_keys = ON;

-- tblUsers stores the account-level information for each registered user.
-- Email addresses are unique so the same login email cannot be used twice.
CREATE TABLE IF NOT EXISTS tblUsers (
    User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    First_Name TEXT NOT NULL CHECK (trim(First_Name) <> ''),
    Last_Name TEXT NOT NULL CHECK (trim(Last_Name) <> ''),
    Phone_Number TEXT NOT NULL CHECK (trim(Phone_Number) <> ''),
    Email_Address TEXT NOT NULL UNIQUE CHECK (trim(Email_Address) <> ''),
    Password_Hash TEXT NOT NULL CHECK (trim(Password_Hash) <> ''),
    Created_At TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_At TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- tblResumes stores the main resume record.
-- Personal contact information is stored here so a user can create
-- multiple resumes with different contact details if needed.
CREATE TABLE IF NOT EXISTS tblResumes (
    Resume_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    User_ID INTEGER NOT NULL,
    Resume_Title TEXT NOT NULL CHECK (trim(Resume_Title) <> ''),
    First_Name TEXT NOT NULL CHECK (trim(First_Name) <> ''),
    Last_Name TEXT NOT NULL CHECK (trim(Last_Name) <> ''),
    Email_Address TEXT NOT NULL CHECK (trim(Email_Address) <> ''),
    Phone_Number TEXT NOT NULL CHECK (trim(Phone_Number) <> ''),
    Created_At TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_At TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES tblUsers(User_ID) ON DELETE CASCADE
);

-- tblWorkExperiences stores zero-to-many work history records for a resume.
-- Display_Order helps the application preserve the order chosen by the user.
CREATE TABLE IF NOT EXISTS tblWorkExperiences (
    Work_Experience_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Resume_ID INTEGER NOT NULL,
    Job_Title TEXT NOT NULL CHECK (trim(Job_Title) <> ''),
    Job_Description TEXT,
    Start_Date TEXT,
    End_Date TEXT,
    Display_Order INTEGER NOT NULL DEFAULT 1 CHECK (Display_Order >= 1),
    FOREIGN KEY (Resume_ID) REFERENCES tblResumes(Resume_ID) ON DELETE CASCADE
);

-- tblSkills stores zero-to-many skill records for a resume.
CREATE TABLE IF NOT EXISTS tblSkills (
    Skill_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Resume_ID INTEGER NOT NULL,
    Skill_Name TEXT NOT NULL CHECK (trim(Skill_Name) <> ''),
    Display_Order INTEGER NOT NULL DEFAULT 1 CHECK (Display_Order >= 1),
    FOREIGN KEY (Resume_ID) REFERENCES tblResumes(Resume_ID) ON DELETE CASCADE
);

-- tblCertifications stores zero-to-many certification records for a resume.
CREATE TABLE IF NOT EXISTS tblCertifications (
    Certification_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Resume_ID INTEGER NOT NULL,
    Certification_Name TEXT NOT NULL CHECK (trim(Certification_Name) <> ''),
    Certification_Date TEXT,
    Display_Order INTEGER NOT NULL DEFAULT 1 CHECK (Display_Order >= 1),
    FOREIGN KEY (Resume_ID) REFERENCES tblResumes(Resume_ID) ON DELETE CASCADE
);

-- tblAwards stores zero-to-many award records for a resume.
CREATE TABLE IF NOT EXISTS tblAwards (
    Award_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Resume_ID INTEGER NOT NULL,
    Award_Name TEXT NOT NULL CHECK (trim(Award_Name) <> ''),
    Award_Date TEXT,
    Display_Order INTEGER NOT NULL DEFAULT 1 CHECK (Display_Order >= 1),
    FOREIGN KEY (Resume_ID) REFERENCES tblResumes(Resume_ID) ON DELETE CASCADE
);

-- tblProjects stores zero-to-many project records for a resume.
CREATE TABLE IF NOT EXISTS tblProjects (
    Project_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Resume_ID INTEGER NOT NULL,
    Project_Title TEXT NOT NULL CHECK (trim(Project_Title) <> ''),
    Project_Description TEXT,
    Start_Date TEXT,
    End_Date TEXT,
    Display_Order INTEGER NOT NULL DEFAULT 1 CHECK (Display_Order >= 1),
    FOREIGN KEY (Resume_ID) REFERENCES tblResumes(Resume_ID) ON DELETE CASCADE
);

-- Helpful indexes improve lookup speed when loading one user's resumes or
-- loading all child records that belong to a specific resume.
CREATE INDEX IF NOT EXISTS idxTblResumesUserId
    ON tblResumes (User_ID);

CREATE INDEX IF NOT EXISTS idxTblWorkExperiencesResumeId
    ON tblWorkExperiences (Resume_ID);

CREATE INDEX IF NOT EXISTS idxTblSkillsResumeId
    ON tblSkills (Resume_ID);

CREATE INDEX IF NOT EXISTS idxTblCertificationsResumeId
    ON tblCertifications (Resume_ID);

CREATE INDEX IF NOT EXISTS idxTblAwardsResumeId
    ON tblAwards (Resume_ID);

CREATE INDEX IF NOT EXISTS idxTblProjectsResumeId
    ON tblProjects (Resume_ID);
