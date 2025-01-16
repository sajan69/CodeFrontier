import { createContext, useContext, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const FormContext = createContext();

function Form({ onSubmit, children }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <FormContext.Provider value={{ values, setValues, errors, setErrors }}>
      <Box component="form" onSubmit={handleSubmit}>
        {children}
      </Box>
    </FormContext.Provider>
  );
}

Form.Field = function FormField({ name, children }) {
  return (
    <Box sx={{ mb: 2 }}>
      {children}
    </Box>
  );
};

Form.Label = function FormLabel({ children }) {
  return (
    <Typography component="label" sx={{ display: 'block', mb: 1 }}>
      {children}
    </Typography>
  );
};

Form.Input = function FormInput({ name }) {
  const { values, setValues, errors } = useContext(FormContext);

  return (
    <TextField
      fullWidth
      value={values[name] || ''}
      onChange={(e) => setValues(v => ({ ...v, [name]: e.target.value }))}
      error={!!errors[name]}
      helperText={errors[name]}
    />
  );
};

Form.Submit = function FormSubmit({ children }) {
  return (
    <Button type="submit" variant="contained" color="primary">
      {children}
    </Button>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Form.Field.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Form.Label.propTypes = {
  children: PropTypes.node.isRequired,
};

Form.Input.propTypes = {
  name: PropTypes.string.isRequired,
};

Form.Submit.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Form; 