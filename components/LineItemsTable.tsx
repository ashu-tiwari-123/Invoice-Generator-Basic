
import React from 'react';
import type { LineItem } from '../types';

interface LineItemsTableProps {
  lineItems: LineItem[];
  updateLineItem: (id: string, field: keyof LineItem, value: any) => void;
  removeLineItem: (id: string) => void;
  addLineItem: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
)

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  lineItems,
  updateLineItem,
  removeLineItem,
  addLineItem,
}) => {
  const handleInputChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['quantity', 'rate', 'taxRate', 'discount'].includes(name);
    updateLineItem(id, name as keyof LineItem, isNumeric ? parseFloat(value) || 0 : value);
  };
  
  return (
    <div className="space-y-4">
      {lineItems.map((item, index) => (
        <div key={item.id} className="relative rounded-lg border p-4 pt-8 space-y-4 bg-gray-50/50">
          <div className="absolute top-2 right-2">
            <button 
              onClick={() => removeLineItem(item.id)} 
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
              aria-label={`Remove item ${index + 1}`}
            >
              <TrashIcon/>
            </button>
          </div>
          <p className="absolute top-2 left-4 text-xs font-medium text-gray-500">Item #{index + 1}</p>
          
          <div>
            <label htmlFor={`description-${item.id}`} className="block text-sm font-medium text-gray-700 sr-only">Description</label>
            <input 
              type="text" 
              id={`description-${item.id}`} 
              name="description" 
              value={item.description} 
              onChange={e => handleInputChange(item.id, e)} 
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" 
              placeholder="Item description" 
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <label htmlFor={`hsn-${item.id}`} className="block text-sm font-medium text-gray-700">HSN</label>
              <input type="text" id={`hsn-${item.id}`} name="hsn" value={item.hsn} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700">Qty</label>
              <input type="number" id={`quantity-${item.id}`} name="quantity" value={item.quantity} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor={`rate-${item.id}`} className="block text-sm font-medium text-gray-700">Rate</label>
              <input type="number" id={`rate-${item.id}`} name="rate" value={item.rate} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor={`per-${item.id}`} className="block text-sm font-medium text-gray-700">Per</label>
              <input type="text" id={`per-${item.id}`} name="per" value={item.per} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor={`discount-${item.id}`} className="block text-sm font-medium text-gray-700">Disc(%)</label>
              <input type="number" id={`discount-${item.id}`} name="discount" value={item.discount} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor={`taxRate-${item.id}`} className="block text-sm font-medium text-gray-700">Tax(%)</label>
              <input type="number" id={`taxRate-${item.id}`} name="taxRate" value={item.taxRate} onChange={e => handleInputChange(item.id, e)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6">
        <button
          onClick={addLineItem}
          className="rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-100"
        >
          + Add Line Item
        </button>
      </div>
    </div>
  );
};