import { Box, Button, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { projectSchema } from '../../services/validators';
import { FormField } from './FormFields';

export default function ProjectForm({ onSubmit }) {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm({
    title: '',
    description: '',
    tags: '',
  }, projectSchema);

  const handleFormSubmit = async (formData) => {
    try {
      // Ensure all values are strings
      const processedData = {
        title: String(formData.title || ''),
        description: String(formData.description || ''),
        tags: String(formData.tags || ''),
      };
      await onSubmit(processedData);
      resetForm();
    } catch (error) {
      // Error is handled by parent component
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ maxWidth: 600 }}>
      <FormField
        name="title"
        label="Project Title"
        value={values.title}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.title && errors.title}
      />

      <FormField
        name="description"
        label="Project Description"
        multiline
        rows={4}
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.description && errors.description}
      />

      <FormField
        name="tags"
        label="Tags (comma-separated)"
        value={values.tags}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.tags && errors.tags}
        helperText="Enter tags separated by commas (e.g., React, TypeScript, API)"
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}

ProjectForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}; 