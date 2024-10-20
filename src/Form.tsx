import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { TextField, MenuItem } from '@mui/material';
import styled from 'styled-components';

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
  margin: auto;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledTextField = styled(TextField)`
  & .MuiInput-underline:before {
    border-bottom: 2px solid #000;
  }
  & .MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid #000;
  }
  & .MuiInput-underline:after {
    border-bottom: 2px solid #3f51b5;
  }
`;

const FullWidthField = styled(StyledTextField)`
  width: 100%;
`;

const Form: React.FC = () => {
  const { handleSubmit, control, setValue } = useForm<FormData>();
  const [propriedades, setPropriedades] = useState<{ id: number; nome: string }[]>([]);
  const [laboratorios, setLaboratorios] = useState<{ id: number; nome: string }[]>([]);


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
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Controller
            name="nome"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <StyledTextField {...field} label="Nome" fullWidth margin="normal" />
            )}
          />

          <Controller
            name="dataInicial"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <StyledTextField
                {...field}
                type="datetime-local"
                label="Data Inicial"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="dataFinal"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <StyledTextField
                {...field}
                type="datetime-local"
                label="Data Final"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Row>

        <Row>
          <Controller
            name="propriedade"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <FullWidthField
                {...field}
                select
                label="Propriedade"
                fullWidth
                margin="normal"
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


          <Controller
            name="laboratorio"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <FullWidthField
                {...field}
                select
                label="Laboratório"
                fullWidth
                margin="normal"
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

        </Row>

        <Controller
          name="observacoes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <StyledTextField
              {...field}
              label="Observações"
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
          )}
        />
      </form>
    </FormContainer>
  );
};

export default Form;