import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Import the signup styles

function SignupPage() {
  const history = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams(formData).toString();
      const response = await fetch(`/insertInfo?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        console.log('User signed up successfully!');
        history('/');
      } else {
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="signup-container">
      <header>
        <h1 className="title">Sign Up</h1>
      </header>
      <main>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" placeholder="Enter your first name" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" placeholder="Enter your last name" onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
          <br/>
          <div className='signup-prompt-container'>Already have an account? <Link to = '/login'>Log In</Link></div>
        </form>
      </main>
      <footer className="footer">
        <p>&copy; 2024 MVP Stock Trading. All rights reserved.</p>
      </footer>
  </div>
  );
}

export default SignupPage;
