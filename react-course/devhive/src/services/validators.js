export const validate = (field, value, schema) => {
  if (!schema[field]) return null;

  const rules = schema[field];
  
  // Convert value to string if it exists
  const stringValue = value != null ? String(value) : '';
  
  if (rules.required && !stringValue) {
    return 'This field is required';
  }

  if (rules.minLength && stringValue.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return rules.message || 'Invalid format';
  }

  if (rules.validate) {
    return rules.validate(stringValue);
  }

  return null;
};

export const projectSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  tags: {
    validate: (value) => {
      // Ensure value is a string and handle empty cases
      const stringValue = value != null ? String(value) : '';
      if (!stringValue || stringValue.trim() === '') return null;
      
      const tags = stringValue.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      if (tags.some(tag => tag.length < 2)) {
        return 'Each tag must be at least 2 characters long';
      }
      if (tags.length > 5) {
        return 'Maximum 5 tags allowed';
      }
      return null;
    },
  },
}; 