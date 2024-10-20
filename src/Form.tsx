import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { MenuItem, Typography } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import { 
  FormContainer, 
  Row, 
  EqualRow, 
  StyledTextField, 
  FullWidthField, 
  GreenRow, 
  GreenButton, 
  CharacterCount 
} from './styles/FormStyles';

interface FormData {
  nome: string;
  dataInicial: string;
  dataFinal: string;
  infosPropriedade:  { id: number; nome: string; cnpj: string } | undefined;
  cnpj: string;
  laboratorio: { id: number; nome: string } | undefined;
  observacoes: string;
}

const Form: React.FC = () => {
  const { handleSubmit, control, setValue, watch, formState: { errors }, clearErrors, reset } = useForm<FormData>({
    mode: 'onChange',
  });
  const [propriedades, setPropriedades] = useState<{ id: number; nome: string; cnpj: string }[]>([]);
  const [laboratorios, setLaboratorios] = useState<{ id: number; nome: string }[]>([]);
  const [selectedCnpj, setSelectedCnpj] = useState<string | null>(null);
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
    open: false,
    type: 'error',
    message: '',
  });

  const [showDateInputInicial, setShowDateInputInicial] = useState(false);
  const [showDateInputFinal, setShowDateInputFinal] = useState(false);

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
    const formattedData = {
      ...data,
      dataInicial: data.dataInicial ? new Date(data.dataInicial).toISOString() : '',
      dataFinal: data.dataFinal ? new Date(data.dataFinal).toISOString() : '',
      observacoes: data.observacoes || '',
    };

    console.log(formattedData);
    setSnackbarState({
      open: true,
      type: 'success',
      message: 'Cadastro realizado com sucesso!',
    });
    reset();
    setSelectedCnpj(null);
  };

  const onError = () => {
    setSnackbarState({
      open: true,
      type: 'error',
      message: 'Preencher os campos obrigatórios',
    });
  };

  const handleFieldChange = (fieldName: keyof FormData) => {
    if (errors[fieldName]) {
      clearErrors(fieldName);
    }
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
                type={showDateInputInicial ? 'date' : 'text'}
                label="Data Inicial *"
                placeholder={showDateInputInicial ? '' : 'Data Inicial'}
                fullWidth
                margin="normal"
                error={!!errors.dataInicial}
                helperText={errors.dataInicial ? "Erro" : ""}
                InputLabelProps={{
                  shrink: Boolean(field.value) || showDateInputInicial,
                }}
                onFocus={() => setShowDateInputInicial(true)}
                onBlur={(e) => {
                  if (!field.value) {
                    setShowDateInputInicial(false);
                  }
                }}
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
                type={showDateInputFinal ? 'date' : 'text'}
                label="Data Final *"
                placeholder={showDateInputFinal ? '' : 'Data Final'}
                fullWidth
                margin="normal"
                error={!!errors.dataFinal}
                helperText={errors.dataFinal ? "Erro" : ""}
                InputLabelProps={{
                  shrink: Boolean(field.value) || showDateInputFinal,
                }}
                onFocus={() => setShowDateInputFinal(true)}
                onBlur={(e) => {
                  if (!field.value) {
                    setShowDateInputFinal(false);
                  }
                }}
              />
            )}
          />

        </Row>

        <EqualRow>
          <div>
            <Controller
              name="infosPropriedade"
              control={control}
              defaultValue={undefined}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <FullWidthField
                    {...field}
                    select
                    label="Propriedade *"
                    fullWidth
                    margin="normal"
                    error={!!errors.infosPropriedade}
                    helperText={errors.infosPropriedade ? "Erro" : ""}
                    value={field.value?.id || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                      const value = JSON.parse(e.target.value);
                      setSelectedCnpj(value.cnpj);
                      setValue('infosPropriedade', value);
                      handleFieldChange('infosPropriedade');
                    }}
                    SelectProps={{
                      renderValue: (selected) => {
                        if (!selected) return '';
                        const selectedId = selected as number;
                        const selectedPropriedade = propriedades.find((prop) => prop.id === selectedId);
                        return selectedPropriedade ? selectedPropriedade.nome : '';
                      },
                    }}
                  >
                    {propriedades.map((prop) => (
                      <MenuItem key={prop.id} value={JSON.stringify(prop)}>
                        <div>
                          <Typography variant="body1">{prop.nome}</Typography>
                          <Typography variant="body2" style={{ color: '#b0b0b0' }}>
                            CNPJ: {prop.cnpj}
                          </Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </FullWidthField>

                  {selectedCnpj && (
                    <Typography variant="body2" style={{ marginTop: '8px', color: '#7a7a7a' }}>
                      CNPJ: {selectedCnpj}
                    </Typography>
                  )}
                </>
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
                    handleFieldChange('laboratorio');
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