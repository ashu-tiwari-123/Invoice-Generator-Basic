
export type InvoiceCopyType = "Original for Buyer" | "Duplicate for Transporter" | "Triplicate for Supplier";

export interface Party {
  name: string;
  logo?: string;
  address: string;
  pincode?: string;
  state: string;
  stateCode?: string;
  phone?: string;
  email?: string;
  gstin: string;
  pan?: string;
  mobNo?: string;
  bankName?: string;
  branchName?: string;
  accountNo?: string;
  ifscCode?: string;
}

export interface LineItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  per: string;
  discount: number; // Percentage
  taxRate: number;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  purchaseOrderNumber: string;
  placeOfDelivery: string;
  declaration: string;
  dueDate: string; // Kept for data model, not shown in new preview
}

export interface TaxTotals {
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
}

export interface AIGeneratedInvoice {
    seller?: Party;
    customer?: Party;
    consignee?: Party;
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    purchaseOrderNumber?: string;
    placeOfDelivery?: string;
    lineItems?: LineItem[];
}

export interface SavedInvoice {
  id: string;
  invoice: Invoice;
  seller: Party;
  customer: Party;
  consignee: Party;
  lineItems: LineItem[];
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}
