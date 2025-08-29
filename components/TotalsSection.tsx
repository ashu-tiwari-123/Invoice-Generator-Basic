
import React from 'react';

interface TotalsSectionProps {
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({ subTotal, taxTotal, grandTotal }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  
  return (
    <div className="space-y-3 pt-4 border-t-2 md:border-t-0 md:pt-0">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>₹{formatCurrency(subTotal)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Total Tax</span>
        <span>₹{formatCurrency(taxTotal)}</span>
      </div>
      <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
        <span>Grand Total</span>
        <span>₹{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  );
};
