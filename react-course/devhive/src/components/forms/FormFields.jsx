import { TextField, FormHelperText, Box } from '@mui/material';
import PropTypes from 'prop-types';

export function FormField({
  name,
  label,
  type = 'text',
  error,
  helperText,
  multiline,
  rows,
  ...props
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        name={name}
        label={label}
        type={type}
        error={!!error}
        multiline={multiline}
        rows={rows}
        {...props}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error}>
          {error || helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
}; 