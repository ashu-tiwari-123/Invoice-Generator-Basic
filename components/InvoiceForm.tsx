import React, { useState, useEffect } from 'react';
import type { Invoice, Party, LineItem } from '../types';
import { PartyDetails } from './PartyDetails';
import { LineItemsTable } from './LineItemsTable';
import { TotalsSection } from './TotalsSection';

interface InvoiceFormProps {
  invoice: Invoice;
  setInvoice: React.Dispatch<React.SetStateAction<Invoice>>;
  seller: Party;
  setSeller: React.Dispatch<React.SetStateAction<Party>>;
  customer: Party;
  setCustomer: React.Dispatch<React.SetStateAction<Party>>;
  consignee: Party;
  setConsignee: React.Dispatch<React.SetStateAction<Party>>;
  lineItems: LineItem[];
  addLineItem: () => void;
  updateLineItem: (id: string, field: keyof LineItem, value: any) => void;
  removeLineItem: (id: string) => void;
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  setInvoice,
  seller,
  setSeller,
  customer,
  setCustomer,
  consignee,
  setConsignee,
  lineItems,
  addLineItem,
  updateLineItem,
  removeLineItem,
  subTotal,
  taxTotal,
  grandTotal,
}) => {
  const [isConsigneeSameAsCustomer, setIsConsigneeSameAsCustomer] = useState(true);

  useEffect(() => {
    if (isConsigneeSameAsCustomer) {
      setConsignee(customer);
    }
  }, [customer, isConsigneeSameAsCustomer, setConsignee]);
  
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSeller(prev => ({...prev, [name]: value }));
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      
      <fieldset className="rounded-lg border p-4 space-y-4">
        <legend className="px-2 font-medium text-gray-800 text-lg">Invoice Details</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text" id="invoiceNumber" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleInvoiceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date" id="invoiceDate" name="invoiceDate" value={invoice.invoiceDate} onChange={handleInvoiceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="purchaseOrderNumber" className="block text-sm font-medium text-gray-700">P.O. Number</label>
            <input
              type="text" id="purchaseOrderNumber" name="purchaseOrderNumber" value={invoice.purchaseOrderNumber} onChange={handleInvoiceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="placeOfDelivery" className="block text-sm font-medium text-gray-700">Place of Delivery</label>
            <input
              type="text" id="placeOfDelivery" name="placeOfDelivery" value={invoice.placeOfDelivery} onChange={handleInvoiceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border p-4 space-y-4">
        <legend className="px-2 font-medium text-gray-800 text-lg">Bill From (Seller)</legend>
        <div className="space-y-4">
            <div>
              <label htmlFor="seller-logo" className="block text-sm font-medium text-gray-700">Company Logo URL</label>
              <input
                  type="text"
                  id="seller-logo"
                  name="logo"
                  value="https://res.cloudinary.com/djt9kbgzg/image/upload/v1752906916/Gift_Plus-removebg-preview_ccyhs8.png"
                  onChange={handleSellerChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="https://res.cloudinary.com/djt9kbgzg/image/upload/v1752906916/Gift_Plus-removebg-preview_ccyhs8.png"
              />
          </div>
          <PartyDetails party={seller} setParty={setSeller} partyType="seller" />
        </div>
      </fieldset>
      
      <fieldset className="rounded-lg border p-4">
         <legend className="px-2 font-medium text-gray-800 text-lg">Bill To (Buyer)</legend>
        <PartyDetails party={customer} setParty={setCustomer} partyType="customer" />
      </fieldset>
      
      <fieldset className="rounded-lg border p-4">
          <legend className="px-2 font-medium text-gray-800 text-lg">Ship To (Consignee)</legend>
           <div className="flex items-center">
              <input
                id="sameAsCustomer"
                name="sameAsCustomer"
                type="checkbox"
                checked={isConsigneeSameAsCustomer}
                onChange={(e) => setIsConsigneeSameAsCustomer(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="sameAsCustomer" className="ml-2 block text-sm text-gray-900">
                Same as Bill To address
              </label>
          </div>
          {!isConsigneeSameAsCustomer && (
               <div className="mt-4">
                  <PartyDetails party={consignee} setParty={setConsignee} partyType="consignee" />
               </div>
          )}
      </fieldset>

      <fieldset className="rounded-lg border p-4">
        <legend className="px-2 font-medium text-gray-800 text-lg">Line Items</legend>
        <LineItemsTable
          lineItems={lineItems}
          updateLineItem={updateLineItem}
          removeLineItem={removeLineItem}
          addLineItem={addLineItem}
        />
      </fieldset>
      
       <fieldset className="rounded-lg border p-4">
        <legend className="px-2 font-medium text-gray-800 text-lg">Bank Details</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
           <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input type="text" id="bankName" name="bankName" value={seller.bankName || ''} onChange={handleSellerChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">Branch</label>
              <input type="text" id="branchName" name="branchName" value={seller.branchName || ''} onChange={handleSellerChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700">Account No.</label>
              <input type="text" id="accountNo" name="accountNo" value={seller.accountNo || ''} onChange={handleSellerChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input type="text" id="ifscCode" name="ifscCode" value={seller.ifscCode || ''} onChange={handleSellerChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
        </div>
       </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
         <fieldset className="rounded-lg border p-4 h-full">
            <legend className="px-2 font-medium text-gray-800 text-lg">Declaration</legend>
            <textarea
                id="declaration" name="declaration" rows={3} value={invoice.declaration} onChange={handleInvoiceChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </fieldset>
        <TotalsSection subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />
      </div>
    </div>
  );
};