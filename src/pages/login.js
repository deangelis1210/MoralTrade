import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import the login styles

function LoginPage() {
  const history = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const queryParams = new URLSearchParams(formData).toString();
        const response = await fetch(`/loginAttempt?${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log('User logged in successfully!');
            console.log('User data:', data);
            history('/');
        } else {
            console.error('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};

  return (
    <div className="login-container">
      <header>
        <h1 className="title">Login</h1>
      </header>
      <main>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" onChange={handleChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange}/>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          <br/>
          <div className='signup-prompt-container'>Don't have an account? <Link to = '/signup'>Sign Up</Link></div>
        </form>
      </main>
      <footer className="footer">
        <p>&copy; 2024 MVP Stock Trading. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;