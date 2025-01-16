import { createContext, useContext, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const SelectContext = createContext();

function Select({ children, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onChange, isOpen, setIsOpen }}>
      <Box sx={{ position: 'relative' }}>
        {children}
      </Box>
    </SelectContext.Provider>
  );
}

Select.Trigger = function SelectTrigger() {
  const { value, isOpen, setIsOpen } = useContext(SelectContext);
  
  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={() => setIsOpen(!isOpen)}
      sx={{ justifyContent: 'space-between' }}
    >
      {value || 'Select...'}
    </Button>
  );
};

Select.Options = function SelectOptions({ children }) {
  const { isOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <Paper
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 1,
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 1000,
      }}
    >
      {children}
    </Paper>
  );
};

Select.Option = function SelectOption({ value, children }) {
  const { onChange, setIsOpen } = useContext(SelectContext);
  
  return (
    <Typography
      sx={{
        p: 1,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      onClick={() => {
        onChange(value);
        setIsOpen(false);
      }}
    >
      {children}
    </Typography>
  );
};

Select.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

Select.Option.propTypes = {
  value: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

Select.Options.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Select; 