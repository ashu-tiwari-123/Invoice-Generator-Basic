
import type { SavedInvoice } from '../types';
import * as api from './apiService';

export const getInvoices = async (): Promise<SavedInvoice[]> => {
    return api.fetchInvoices();
};

export const getInvoice = async (id: string): Promise<SavedInvoice | undefined> => {
    return api.fetchInvoiceById(id);
};

export const saveInvoice = async (invoiceData: Omit<SavedInvoice, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<SavedInvoice> => {
    if (invoiceData.id) {
        return api.putInvoice(invoiceData.id, invoiceData);
    } else {
        return api.postInvoice(invoiceData);
    }
};

export const getNextInvoiceNumber = async (): Promise<string> => {
    return api.fetchNextInvoiceNumber();
};
