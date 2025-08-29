
import React, { useState, useEffect } from 'react';
import * as invoiceService from '../services/invoiceService';
import type { SavedInvoice } from '../types';

interface InvoiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadInvoice: (id: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const InvoiceListModal: React.FC<InvoiceListModalProps> = ({ isOpen, onClose, onLoadInvoice }) => {
    const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchInvoices = async () => {
                setIsLoading(true);
                try {
                    const fetchedInvoices = await invoiceService.getInvoices();
                    setInvoices(fetchedInvoices);
                } catch (error) {
                    console.error("Failed to fetch invoices", error);
                    // Optionally set an error state here to show in the UI
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInvoices();
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const filteredInvoices = invoices.filter(inv => 
        inv.invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex justify-center items-start p-4 pt-16">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all flex flex-col" style={{maxHeight: '85vh'}}>
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">Load Saved Invoice</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search by Invoice No. or Customer Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Invoice #</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Load</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-500">Loading invoices...</td>
                                            </tr>
                                        ) : filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{inv.invoice.invoiceNumber}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{inv.customer.name}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(inv.invoice.invoiceDate).toLocaleDateString('en-IN')}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(inv.grandTotal)}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                    <button onClick={() => onLoadInvoice(inv.id)} className="text-primary-600 hover:text-primary-900">
                                                        Load<span className="sr-only">, {inv.invoice.invoiceNumber}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-500">No invoices found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
