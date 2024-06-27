import { IProduct } from '../../products/interfaces/product-interface';

export interface InvoiceResponseInterface {
  id: number;
  fechaEmision: Date;
  codDoc: string;
  claveAcceso: string;
  secuencial: string;
  totalSinImpuestos: number;
  totalDescuento: number;
  propina: number;
  importeTotal: number;
  moneda: string;
  establecimiento: EstablishmentResponseInterface;
  items: ItemResponseInterface[];
  totalImpuestos: TaxResponseInterface[];
  pagos: PaymentResponseInterface[];
  estado: string;
}

export interface EstablishmentResponseInterface {
  id: number;
  ruc: string;
  razonSocial: string;
  dirMatriz: string;
  dirEstablecimiento: string;
  estab: string;
  ptoEmi: string;
  obligadoContabilidad: string;
  ambiente: string;
  activo: boolean;
}

export interface ItemResponseInterface {
  id: number;
  cantidad: number;
  descuento: number;
  precioTotalSinImpuesto: number;
  precioUnitario: number;
  producto: IProduct;
  impuesto: TaxResponseInterface[];
}

export interface TaxResponseInterface {
  id: number;
  codigo: string;
  codigoPorcentaje: string;
  tarifa: string;
  baseImponible: number;
  valor: number;
}

export interface PaymentResponseInterface {
  id: number;
  formaPago: string;
  total: number;
}
