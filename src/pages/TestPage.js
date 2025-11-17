import React from 'react';
import ApiTest from '../components/ApiTest';

const TestPage = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f0f8ff' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
        API Test Page
      </h1>
      <ApiTest />
    </div>
  );
};

export default TestPage;