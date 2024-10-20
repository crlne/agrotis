import styled from 'styled-components';
import { TextField, Button, Typography } from '@mui/material';

export const FormContainer = styled.div`
  max-width: 90%;
  margin: 40px auto 0;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  & > div:first-child {
    flex: 2; 
  }

  & > div {
    flex: 1;
  }
`;

export const EqualRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  & > div {
    flex: 1;
  }
`;

export const StyledTextField = styled(TextField).attrs({
  variant: 'standard',
}) <{ error?: boolean }>`
  & .MuiInput-root {
    &:before {
      border-bottom: 1px solid ${({ error }) => (error ? 'red' : '#adb5bd')};
    }
    &:hover:not(.Mui-disabled):before {
      border-bottom: 2px solid ${({ error }) => (error ? 'red' : '#007661')};
    }
    &:after {
      border-bottom: 2px solid ${({ error }) => (error ? 'red' : '#007661')};
    }
  }

  & .MuiInputLabel-root {
    color: ${({ error }) => (error ? 'red' : '#adb5bd')};
  }

  & .MuiInputLabel-root.Mui-focused {
    color: ${({ error }) => (error ? 'red' : '#adb5bd')};
  }
`;

export const FullWidthField = styled(StyledTextField)`
  width: 100%;
`;

export const GreenRow = styled.div`
  width: calc(100% + 7px);
  margin-left: -19px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007661;
  padding: 8px 16px;
  margin-bottom: 16px;
  color: #fff;
  font-size: 20px;
  margin-top: -20px;
`;

export const GreenButton = styled(Button).attrs({
  variant: 'text',
})`
  color: #fff !important;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 118, 97, 0.2) !important;
  }
`;

export const CharacterCount = styled(Typography)`
  font-size: 12px;
  color: #7a7a7a;
  text-align: right;
  margin-top: 4px;
`;