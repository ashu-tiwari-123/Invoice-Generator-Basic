
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Invoice, Party, LineItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as invoiceService from '../services/invoiceService';

const getInitialInvoice = (): Invoice => ({
  invoiceNumber: '', // Will be set by createNewInvoice
  invoiceDate: new Date().toISOString().split('T')[0],
  purchaseOrderNumber: '',
  placeOfDelivery: '',
  declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
});

const getInitialSeller = (): Party => ({
  name: 'Gift Plus',
  logo: 'https://i.imgur.com/232DA8A.png',
  address: 'Ground Floor, 9TH MAIN, DWARAKANAGAR, Chikkabanavara, Bengaluru',
  pincode: '560090',
  email: 'giftplus0024@gmail.com',
  mobNo: '8920310249',
  gstin: '29BXCPT1687G1ZZ',
  pan: 'BXCPT1687G',
  state: 'Karnataka', // Assuming based on Bengaluru
  bankName: 'HDFC Bank',
  branchName: 'CHIKKABANAVARA',
  accountNo: '50200094338859',
  ifscCode: 'HDFC0007222',
});

const getInitialCustomer = (): Party => ({
  name: '',
  address: '',
  pincode: '',
  state: '',
  stateCode: '',
  phone: '',
  email: '',
  gstin: '',
  pan: '',
});

const getInitialLineItems = (): LineItem[] => ([
  {
    id: uuidv4(),
    description: '',
    hsn: '',
    quantity: 1,
    rate: 0,
    per: 'pcs',
    discount: 0,
    taxRate: 18,
  }
]);

export const useInvoice = () => {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice>(getInitialInvoice());
  const [seller, setSeller] = useState<Party>(getInitialSeller());
  const [customer, setCustomer] = useState<Party>(getInitialCustomer());
  const [consignee, setConsignee] = useState<Party>(getInitialCustomer());
  const [lineItems, setLineItems] = useState<LineItem[]>(getInitialLineItems());

  const addLineItem = useCallback(() => {
    setLineItems(prev => [
      ...prev,
      { id: uuidv4(), description: '', hsn: '', quantity: 1, rate: 0, per: 'pcs', discount: 0, taxRate: 18 }
    ]);
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const subTotal = useMemo(() => {
    return lineItems.reduce((acc, item) => {
        const amount = item.quantity * item.rate;
        const discountAmount = (amount * item.discount) / 100;
        return acc + (amount - discountAmount);
    }, 0);
  }, [lineItems]);

  const taxTotal = useMemo(() => {
    return lineItems.reduce((acc, item) => {
        const amount = item.quantity * item.rate;
        const discountAmount = (amount * item.discount) / 100;
        const taxableValue = amount - discountAmount;
        return acc + (taxableValue * item.taxRate) / 100;
    }, 0);
  }, [lineItems]);
  
  const grandTotal = useMemo(() => {
    return subTotal + taxTotal;
  }, [subTotal, taxTotal]);
  
  const createNewInvoice = useCallback(async () => {
    setInvoiceId(null);
    const nextInvoiceNumber = await invoiceService.getNextInvoiceNumber();
    setInvoice({ ...getInitialInvoice(), invoiceNumber: nextInvoiceNumber });
    setSeller(getInitialSeller());
    setCustomer(getInitialCustomer());
    setConsignee(getInitialCustomer());
    setLineItems(getInitialLineItems());
  }, []);

  const loadInvoice = useCallback(async (id: string) => {
    const savedInvoice = await invoiceService.getInvoice(id);
    if (savedInvoice) {
        setInvoiceId(savedInvoice.id);
        setInvoice(savedInvoice.invoice);
        setSeller(savedInvoice.seller);
        setCustomer(savedInvoice.customer);
        setConsignee(savedInvoice.consignee);
        setLineItems(savedInvoice.lineItems);
    }
  }, []);

  const saveInvoice = useCallback(async () => {
    const invoiceData = {
        invoice,
        seller,
        customer,
        consignee,
        lineItems,
        subTotal,
        taxTotal,
        grandTotal,
    };
    
    const saved = await invoiceService.saveInvoice({ id: invoiceId || undefined, ...invoiceData });
    setInvoiceId(saved.id);
    alert(`Invoice ${saved.invoice.invoiceNumber} saved successfully!`);
  }, [invoiceId, invoice, seller, customer, consignee, lineItems, subTotal, taxTotal, grandTotal]);
  
  useEffect(() => {
    createNewInvoice();
  }, [createNewInvoice]);

  return {
    invoice,
    setInvoice,
    seller,
    setSeller,
    customer,
    setCustomer,
    consignee,
    setConsignee,
    lineItems,
    setLineItems,
    addLineItem,
    updateLineItem,
    removeLineItem,
    subTotal,
    taxTotal,
    grandTotal,
    createNewInvoice,
    saveInvoice,
    loadInvoice,
  };
};
