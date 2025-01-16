import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import withLogging from './withLogging';
import Select from '../compound/Select';
import Form from '../compound/Form';

// Example component to demonstrate patterns
function DemoComponent({ title, children }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </Paper>
  );
}

DemoComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Base component before HOC
function PatternsShowcase() {
  const [selectValue, setSelectValue] = useState('');
  
  const handleFormSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        React Patterns Showcase
      </Typography>
      
      {/* HOC Pattern */}
      <DemoComponent title="Higher-Order Component Pattern">
        <Typography>
          This component is wrapped with withLogging HOC.
          Check the console for mount/unmount logs.
        </Typography>
      </DemoComponent>

      {/* Compound Component Pattern */}
      <DemoComponent title="Compound Component Pattern">
        <Select value={selectValue} onChange={setSelectValue}>
          <Select.Trigger />
          <Select.Options>
            <Select.Option value="option1">Option 1</Select.Option>
            <Select.Option value="option2">Option 2</Select.Option>
          </Select.Options>
        </Select>
      </DemoComponent>

      {/* Compound Form Pattern */}
      <DemoComponent title="Compound Form Pattern">
        <Form onSubmit={handleFormSubmit}>
          <Form.Field name="name">
            <Form.Label>Name</Form.Label>
            <Form.Input name="name" />
          </Form.Field>
          <Form.Submit>Submit</Form.Submit>
        </Form>
      </DemoComponent>
    </Box>
  );
}

// Apply HOC
export default withLogging(PatternsShowcase); 