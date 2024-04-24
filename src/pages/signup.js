import React from 'react';
import './signup.css'; // Import the login styles

function SignupPage() {
  return (
    <div className="login-container">
      <header>
        <h1 className="title">Sign Up</h1>
      </header>
      <main>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Email:</label>
            <input type="password" id="password" name="password" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">First Name:</label>
            <input type="password" id="password" name="password" placeholder="Enter your first name" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Last Name:</label>
            <input type="password" id="password" name="password" placeholder="Enter your last name" />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </main>
      <footer className="footer">
        <p>&copy; 2024 MVP Stock Trading. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SignupPage;