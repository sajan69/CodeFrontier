import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const mutate = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post(endpoint, data);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    fetchData,
    mutate,
  };
} 