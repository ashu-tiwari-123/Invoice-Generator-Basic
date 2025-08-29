
import { v4 as uuidv4 } from 'uuid';
import type { SavedInvoice } from '../types';

const INVOICES_STORAGE_KEY = 'invoices';
const SIMULATED_DELAY = 500; // ms

// Utility function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getInvoicesFromStorage = (): SavedInvoice[] => {
    try {
        const invoicesJson = localStorage.getItem(INVOICES_STORAGE_KEY);
        if (!invoicesJson) return [];
        const invoices = JSON.parse(invoicesJson) as SavedInvoice[];
        // Sort by invoice number descending to easily find the latest one
        return invoices.sort((a, b) => b.invoice.invoiceNumber.localeCompare(a.invoice.invoiceNumber));
    } catch (error) {
        console.error("Failed to parse invoices from localStorage", error);
        return [];
    }
};

const saveInvoicesToStorage = (invoices: SavedInvoice[]): void => {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
};

export const fetchInvoices = async (): Promise<SavedInvoice[]> => {
    await delay(SIMULATED_DELAY);
    return getInvoicesFromStorage();
};

export const fetchInvoiceById = async (id: string): Promise<SavedInvoice | undefined> => {
    await delay(SIMULATED_DELAY / 2);
    const invoices = getInvoicesFromStorage();
    return invoices.find(inv => inv.id === id);
};

export const postInvoice = async (invoiceData: Omit<SavedInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedInvoice> => {
    await delay(SIMULATED_DELAY);
    const invoices = getInvoicesFromStorage();
    const now = new Date().toISOString();
    
    const newInvoice: SavedInvoice = {
        ...invoiceData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    saveInvoicesToStorage(updatedInvoices);
    return newInvoice;
};

export const putInvoice = async (id: string, invoiceData: Omit<SavedInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedInvoice> => {
    await delay(SIMULATED_DELAY);
    const invoices = getInvoicesFromStorage();
    const now = new Date().toISOString();

    const index = invoices.findIndex(inv => inv.id === id);
    if (index > -1) {
        const updatedInvoice = { ...invoices[index], ...invoiceData, id, updatedAt: now };
        invoices[index] = updatedInvoice;
        saveInvoicesToStorage(invoices);
        return updatedInvoice;
    }
    throw new Error(`Invoice with id ${id} not found.`);
};

export const fetchNextInvoiceNumber = async (): Promise<string> => {
    await delay(100); // Shorter delay for this common operation
    const invoices = getInvoicesFromStorage();
    
    if (invoices.length === 0) {
        return '0001-25-26'; // Default starting number for FY 25-26
    }
    
    const lastInvoiceNumber = invoices[0].invoice.invoiceNumber; // Already sorted, so the first one is the latest
    
    const parts = lastInvoiceNumber.split('-');
    if (parts.length === 3) {
        try {
            const numPart = parseInt(parts[0], 10);
            if (!isNaN(numPart)) {
                const nextNum = numPart + 1;
                const paddedNum = nextNum.toString().padStart(4, '0');
                // This logic assumes the financial year part of the string remains constant.
                // A more robust solution would check the current date against the financial year.
                return `${paddedNum}-${parts[1]}-${parts[2]}`;
            }
        } catch (e) {
            console.error("Error parsing invoice number:", e);
            // Fallback
        }
    }
    
    // Fallback if parsing fails or format is unexpected
    return `INV-${Date.now()}`;
};
