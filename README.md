# Login System Project

The Login System Project is a web application that provides user authentication and login functionality. It allows users to create an account, log in with their credentials, and access their profile page.

## Features

- User registration: Users can sign up by providing their name, email, and password.
- User login: Registered users can log in using their email and password.
- Password reset: Users can reset their password by requesting a password reset link via email.
- Profile page: Upon successful login, users can access their profile page to view and manage their account details.
- Security: User passwords are securely hashed and stored in the database.
- Integration with Google: Users can also choose to create an account or log in using their Google account.

## Technologies Used

- Node.js: JavaScript runtime environment for server-side development.
- Express.js: Web application framework for Node.js.
- Handlebars: Templating engine for generating dynamic HTML pages.
- MongoDB: NoSQL database for storing user information.
- Passport.js: Authentication middleware for Node.js.


## Installation

1. Clone the repository
2. npm install

# Set up environment variables:

Create a .env file in the project root directory.

Add the following environment variables and replace the values with your own:

PORT=3000
DBurl = MongoDB Url for connect DataBase
your_secret_key = your_secret_key_for_verify_cookie_or_token

GOOGLE_CLIENT_ID = Google api Client ID 
GOOGLE_CLIENT_SECRET = Google api Client Secret we need this for authenticate with google function

GMAIL_USER = From which gmail you wan to send mail
GMAIL_PASSWORD = this email "APP Password" for creating APP Password you go to manage your account -> security -> Search "APP password" -> create new -> then you get a 16 digit password

# Start the application:

npm start
Open your web browser and visit http://localhost:3000 to access the login system.
