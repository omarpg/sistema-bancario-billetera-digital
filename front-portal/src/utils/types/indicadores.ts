export interface IndicadorData {
  codigo: string;
  nombre: string;
  unidad_medida: string;
  fecha: string;
  valor: number;
}

export interface MindicadorResponse {
  version: string;
  autor: string;
  fecha: string;
  uf?: IndicadorData;
  dolar?: IndicadorData;
  euro?: IndicadorData;
}