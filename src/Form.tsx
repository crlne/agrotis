import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { TextField, MenuItem, Button, Typography } from '@mui/material';
import styled from 'styled-components';
import CustomSnackbar from './CustomSnackbar';

interface FormData {
  nome: string;
  dataInicial: string;
  dataFinal: string;
  propriedade: { id: number; nome: string } | undefined;
  cnpj: string;
  laboratorio: { id: number; nome: string } | undefined;
  observacoes: string;
}

const FormContainer = styled.div`
  max-width: 90%;
  margin: 40px auto 0;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
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

const EqualRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  & > div {
    flex: 1;
  }
`;

const StyledTextField = styled(TextField).attrs({
  variant: 'standard',
}) <{ error?: boolean }>`
  & .MuiInput-root {
    &:before {
      border-bottom: 2px solid ${({ error }) => (error ? 'red' : '#000')};
    }
    &:hover:not(.Mui-disabled):before {
      border-bottom: 2px solid ${({ error }) => (error ? 'red' : '#007661')};
    }
    &:after {
      border-bottom: 2px solid ${({ error }) => (error ? 'red' : '#007661')};
    }
  }

  & .MuiInputLabel-root {
    color: ${({ error }) => (error ? 'red' : '#7a7a7a')};
  }

  & .MuiInputLabel-root.Mui-focused {
    color: ${({ error }) => (error ? 'red' : '#7a7a7a')};
  }
`;

const FullWidthField = styled(StyledTextField)`
  width: 100%;
`;

const GreenRow = styled.div`
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

const GreenButton = styled(Button).attrs({
  variant: 'text',
})`
  color: #fff !important;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 118, 97, 0.2) !important;
  }
`;

const CharacterCount = styled(Typography)`
  font-size: 12px;
  color: #7a7a7a;
  text-align: right;
  margin-top: 4px;
`;

const Form: React.FC = () => {
  const { handleSubmit, control, setValue, watch, formState: { errors }, clearErrors } = useForm<FormData>({
    mode: 'onChange',
  });
  const [propriedades, setPropriedades] = useState<{ id: number; nome: string }[]>([]);
  const [laboratorios, setLaboratorios] = useState<{ id: number; nome: string }[]>([]);
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'error',
    message: '',
  });

  const nomeValue = watch('nome', '');
  const observacoesValue = watch('observacoes', '');

  useEffect(() => {
    axios.get('https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/propriedades.json')
      .then((response) => {
        setPropriedades(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar propriedades:', error);
      });

    axios.get('https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/laboratorios.json')
      .then((response) => {
        setLaboratorios(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar laboratórios:', error);
      });
  }, []);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSnackbarState({
      open: true,
      type: 'success',
      message: 'Cadastro realizado com sucesso!',
    });
  };

  const onError = () => {
    setSnackbarState({
      open: true,
      type: 'error',
      message: 'Preencher os campos obrigatórios',
    });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <GreenRow>
          <div style={{ flex: 1 }}>Teste front-end</div>
          <GreenButton type="submit">
            Salvar
          </GreenButton>
        </GreenRow>

        <Row>
          <div>
            <Controller
              name="nome"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <StyledTextField {...field} label="Nome *" fullWidth margin="normal" error={!!errors.nome}
                    helperText={errors.nome ? "Erro" : ""} inputProps={{ maxLength: 40 }} />
                  <CharacterCount>
                    {nomeValue.length}/40
                  </CharacterCount>
                </>
              )}
            />
          </div>

          <Controller
            name="dataInicial"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <StyledTextField
                {...field}
                type="date"
                label="Data Inicial *"
                fullWidth
                margin="normal"
                error={!!errors.dataInicial}
                helperText={errors.dataInicial ? "Erro" : ""}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="dataFinal"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <StyledTextField
                {...field}
                type="date"
                label="Data Final *"
                fullWidth
                margin="normal"
                error={!!errors.dataFinal}
                helperText={errors.dataFinal ? "Erro" : ""}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

        </Row>

        <EqualRow>
          <div>
            <Controller
              name="propriedade"
              control={control}
              defaultValue={undefined}
              rules={{ required: true }}
              render={({ field }) => (
                <FullWidthField
                  {...field}
                  select
                  label="Propriedade *"
                  fullWidth
                  margin="normal"
                  error={!!errors.propriedade}
                  helperText={errors.propriedade ? "Erro" : ""}
                  value={field.value ? JSON.stringify(field.value) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                    const value = JSON.parse(e.target.value);
                    setValue('propriedade', value);
                  }}
                >
                  {propriedades.map((prop) => (
                    <MenuItem key={prop.id} value={JSON.stringify(prop)}>
                      {prop.nome}
                    </MenuItem>
                  ))}
                </FullWidthField>
              )}
            />
          </div>

          <div>
            <Controller
              name="laboratorio"
              control={control}
              defaultValue={undefined}
              rules={{ required: true }}
              render={({ field }) => (
                <FullWidthField
                  {...field}
                  select
                  label="Laboratório *"
                  fullWidth
                  margin="normal"
                  error={!!errors.laboratorio}
                  helperText={errors.laboratorio ? "Erro" : ""}
                  value={field.value ? JSON.stringify(field.value) : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                    const value = JSON.parse(e.target.value);
                    setValue('laboratorio', value);
                  }}
                >
                  {laboratorios.map((lab) => (
                    <MenuItem key={lab.id} value={JSON.stringify(lab)}>
                      {lab.nome}
                    </MenuItem>
                  ))}
                </FullWidthField>
              )}
            />
          </div>
        </EqualRow>

        <Controller
          name="observacoes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <StyledTextField
                {...field}
                label="Observações"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 1000 }}
              />
              <CharacterCount>
                {observacoesValue.length}/1000
              </CharacterCount>
            </>
          )}
        />

        <CustomSnackbar
          open={snackbarState.open}
          type={snackbarState.type}
          message={snackbarState.message}
          onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        />

      </form>
    </FormContainer>
  );
};

export default Form;