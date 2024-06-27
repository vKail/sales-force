import { IProduct } from '../../products/interfaces/product-interface';

export interface ItemResponse {
  id: number;
  cantidad: number;
  descuento: number;
  product: IProduct;
  saved?: boolean;
}
