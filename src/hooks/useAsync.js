import { useState, useCallback } from 'react';

/**
 * Custom hook for handling async operations with loading and error states
 * @param {Function} asyncFunction - The async function to execute
 */
const useAsync = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...params);
        setData(result);
        return result;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { execute, loading, error, data, reset };
};

export default useAsync;
