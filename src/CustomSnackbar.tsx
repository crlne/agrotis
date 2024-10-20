import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { AlertColor } from '@mui/material/Alert';
import Check from '@mui/icons-material/Check';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

interface CustomSnackbarProps {
  open: boolean;
  type: AlertColor;
  message: string;
  onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, type, message, onClose }) => {
  const getIcon = () => {
    if (type === 'success') return <Check style={{ color: '#fff' }} />;
    if (type === 'error') return <ReportProblemOutlinedIcon style={{ color: '#fff' }} />;
    return null;
  };

  const getStyle = () => {
    if (type === 'success') return { backgroundColor: '#4caf50', color: '#fff' };
    if (type === 'error') return { backgroundColor: '#d32f2f', color: '#fff' };
    return {};
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        icon={getIcon()}
        onClose={onClose}
        severity={type}
        style={getStyle()}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;