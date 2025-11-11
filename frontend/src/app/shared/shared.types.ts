export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'P',
  },
  display: {
    dateInput: 'P',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'MMMM yyyy',
  },
}
export interface ViaCepResponse {
  cep: string,
  logradouro: string,
  complemento: string,
  unidade: string,
  bairro: string,
  localidade: string,
  uf: string,
  estado: string,
  regiao: string,
  ibge: number,
  gia: number,
  ddd: number,
  siafi: number,
  erro?: boolean
}
export interface ValidationErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  violations: Violation[];
}

export interface Violation {
  propertyPath: string;
  title: string;
  template: string;
  parameters: Record<string, string>;
  type: string;
}