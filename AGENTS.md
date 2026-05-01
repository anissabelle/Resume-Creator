## Coding Conventions
  - **Hungarian Notation**: Use Hungarian Notation for variable naming.
  - **camelCase**: Use camelCase when naming all varaiables.
  - **Async Javascript**: Prefer to use async await rather than .then when performing asynchronous javascript functions.
  - **No Build Tools**: Avoid build tools such as Babel, Webpack, or Vite unless it is explicitly required. Code must run either directly in the browser or via nodeJS.
  - **Dependencies**: Do not add external libraries such as JQuery without approval. Prefer native Web APIs.
  - **ECMAScript Version**: Target ES6+ features including arrow functions and template literals as well as promises.
  - **External Libraries Local**: All external libraries that are included must not use a CDN but rather be included in project source files.
  - **Comments**: Provide verbose comments to explain the flow of the code, and anything that would be difficult for a beginner developer to understand.

## Project Structure
  - **Entry Point**: All nodeJS applications must use server.js for entry point.
  - **API Routes**: All API routes must be included in the /api/routing. Use descriptive name for routes.

## API Requirements
  - **RESTful**: All API Routes should be restful in design.
  - **UPDATE**: all UPDATE routes should use PUT rather than PATCH.
  - **DELETE**: DELETE routes should use URL parameters for primary key indicators.
  - **SELECT**: All user inputs for SELECT should be passed via URL query strings.
  - **CREATE**: All user inputs for CREATES should be passed as JSON body data.
  - **Input Validation**: All user-passed inputs should be validated.
  - **SELECT RETURN**: All SELECT should return JSON arrays.
  - **Status Codes**: Every route should return appropriate status codes for both success and error.

## DO NOT
  - Do not hardcode credentials.
  - Do not intermix user inputs in queries, require prepared statements.
  - Do not skip input validation.

## Decision Guidelines
  - Prefer simpler, less complex and maintainable code.
  - Ask for clarification if uncertain

## Testing
  - Ensure all GET API routes return JSON arrays
  - Handle any missing input data with proper error messaging
  - POST and PUT routes should validate all required fields.

## Database Design
  - **Database Name**: should be named dbResume to describe the website
  - **Hungarian Notation**: Tables should be titled with hungarian notation. Example: tblResumes, tblUsers
  - **Column Names**: Column names should describe the variable it represents. Example: Project Title represented as Project_Title
  - **Database Design**: I am building a website that creates resumes for users. A user can login/sign up in order to save resumes to their account. A user will be able to create as many resumes as they would like. Therefore, there should be a user table and a resume table. Then, each resume should link to multiple tables that hold the values which create the resume, such as work experience, skills, awards, etc.
  - **Database Software**: Use DB Browser to create database