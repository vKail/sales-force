export interface Invoice {
  id?: number;
  date: Date;
  type: string;
  status?: string;
  total?: string;
  paymentMethodId: number;
  delegationId: number;
  items: Item[];
  createdAt?: Date;
  updateAt?: Date;
}

export interface Item {
  id?: number;
  discount: number;
  quantity: number;
  createdAt?: Date;
  updateAt?: Date;
  productId?: number;
  transactionId?: number;
}
