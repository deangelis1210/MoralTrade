// frontend/src/App.js

import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/companies')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>I love balls</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
