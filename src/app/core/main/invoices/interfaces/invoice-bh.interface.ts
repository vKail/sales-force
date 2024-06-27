export interface Invoice {
  date: Date;
  type: string;
  paymentMethodId: number;
  delegationId: number;
  items: Item[];
}

export interface Item {
  discount: number;
  quantity: number;
  productId: number;
}
