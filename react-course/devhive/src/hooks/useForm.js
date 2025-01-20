import { useState, useCallback } from 'react';
import { validate } from '../services/validators';

export function useForm(initialValues = {}, validationSchema) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name] && validationSchema) {
      const fieldError = validate(name, value, validationSchema);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [touched, validationSchema]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validationSchema) {
      const fieldError = validate(name, values[name], validationSchema);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (validationSchema) {
        const formErrors = {};
        Object.keys(values).forEach(key => {
          const fieldError = validate(key, values[key], validationSchema);
          if (fieldError) formErrors[key] = fieldError;
        });
        
        setErrors(formErrors);
        if (Object.keys(formErrors).length > 0) {
          return;
        }
      }
      
      await onSubmit(values);
      setValues(initialValues);
      setTouched({});
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, initialValues]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
} 