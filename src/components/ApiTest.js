import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const runTests = async () => {
      const results = [];
      
      // Test 1: Check base URL
      results.push({
        test: 'API Base URL',
        result: axios.defaults.baseURL,
        status: 'info'
      });
      
      // Test 2: Test auth profile endpoint
      try {
        const response = await axios.get('/auth/profile');
        results.push({
          test: 'Auth Profile',
          result: 'Success',
          status: 'success',
          data: response.data
        });
      } catch (error) {
        results.push({
          test: 'Auth Profile',
          result: `Error: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`,
          status: 'error',
          error: error.response?.data || error.message
        });
      }
      
      // Test 3: Test applications endpoint
      try {
        const response = await axios.get('/applications/');
        results.push({
          test: 'Applications',
          result: 'Success',
          status: 'success',
          data: response.data
        });
      } catch (error) {
        results.push({
          test: 'Applications',
          result: `Error: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`,
          status: 'error',
          error: error.response?.data || error.message
        });
      }
      
      // Test 4: Test employer jobs endpoint
      try {
        const response = await axios.get('/employer/jobs');
        results.push({
          test: 'Employer Jobs',
          result: 'Success',
          status: 'success',
          data: response.data
        });
      } catch (error) {
        results.push({
          test: 'Employer Jobs',
          result: `Error: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`,
          status: 'error',
          error: error.response?.data || error.message
        });
      }
      
      setTestResults(results);
    };
    
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
      <h2>API Test Results</h2>
      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
        {testResults.map((test, index) => (
          <div 
            key={index} 
            style={{ 
              padding: '10px', 
              margin: '10px 0', 
              borderRadius: '3px',
              backgroundColor: test.status === 'success' ? '#d4edda' : 
                             test.status === 'error' ? '#f8d7da' : 
                             '#d1ecf1',
              border: `1px solid ${
                test.status === 'success' ? '#c3e6cb' : 
                test.status === 'error' ? '#f5c6cb' : 
                '#bee5eb'
              }`
            }}
          >
            <strong>{test.test}:</strong> {test.result}
            {test.data && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Data: {JSON.stringify(test.data).substring(0, 100)}...
              </div>
            )}
            {test.error && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Error Details: {JSON.stringify(test.error).substring(0, 100)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;