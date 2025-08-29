
import React, { useState, useCallback } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { Header } from './components/Header';
import { AIGenerateModal } from './components/AIGenerateModal';
import { InvoiceListModal } from './components/InvoiceListModal';
import { useInvoice } from './hooks/useInvoice';
import type { AIGeneratedInvoice } from './types';

export default function App() {
  const {
    invoice,
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
    setInvoice,
    setLineItems,
    subTotal,
    taxTotal,
    grandTotal,
    createNewInvoice,
    saveInvoice,
    loadInvoice
  } = useInvoice();

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isInvoiceListModalOpen, setIsInvoiceListModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAIGenerate = useCallback((data: AIGeneratedInvoice) => {
    if (data.customer) setCustomer(data.customer);
    if(data.seller) setSeller(data.seller);
    if(data.consignee) setConsignee(data.consignee);
    if (data.invoiceNumber) setInvoice(prev => ({ ...prev, invoiceNumber: data.invoiceNumber }));
    if (data.invoiceDate) setInvoice(prev => ({ ...prev, invoiceDate: data.invoiceDate }));
    if (data.dueDate) setInvoice(prev => ({ ...prev, dueDate: data.dueDate }));
    if (data.purchaseOrderNumber) setInvoice(prev => ({ ...prev, purchaseOrderNumber: data.purchaseOrderNumber }));
    if (data.placeOfDelivery) setInvoice(prev => ({ ...prev, placeOfDelivery: data.placeOfDelivery }));
    if (data.lineItems) setLineItems(data.lineItems);
    setIsAIModalOpen(false);
  }, [setCustomer, setSeller, setConsignee, setInvoice, setLineItems]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleLoadInvoice = async (id: string) => {
      await loadInvoice(id);
      setIsInvoiceListModalOpen(false);
  }
  
  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
        await saveInvoice();
    } catch (error) {
        console.error("Failed to save invoice:", error);
        alert("Error: Could not save the invoice. Please try again.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header 
        onGenerateWithAI={() => setIsAIModalOpen(true)} 
        onPrint={handlePrint} 
        onNew={createNewInvoice}
        onSave={handleSaveInvoice}
        onLoad={() => setIsInvoiceListModalOpen(true)}
        isSaving={isSaving}
      />
      
      <main className="p-4 sm:p-6 lg:p-8 print:p-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:max-w-none print:mx-0 print:gap-0">
          <div className="print:hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Invoice Details</h1>
            <InvoiceForm
              invoice={invoice}
              setInvoice={setInvoice}
              seller={seller}
              setSeller={setSeller}
              customer={customer}
              setCustomer={setCustomer}
              consignee={consignee}
              setConsignee={setConsignee}
              lineItems={lineItems}
              addLineItem={addLineItem}
              updateLineItem={updateLineItem}
              removeLineItem={removeLineItem}
              subTotal={subTotal}
              taxTotal={taxTotal}
              grandTotal={grandTotal}
            />
          </div>
          
          <div className="print:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 print:hidden">Live Preview</h1>
             <div className="sticky top-8 print:static">
              <InvoicePreview
                invoice={invoice}
                seller={seller}
                customer={customer}
                consignee={consignee}
                lineItems={lineItems}
                subTotal={subTotal}
                taxTotal={taxTotal}
                grandTotal={grandTotal}
              />
            </div>
          </div>
        </div>
      </main>

      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
      
      <InvoiceListModal
        isOpen={isInvoiceListModalOpen}
        onClose={() => setIsInvoiceListModalOpen(false)}
        onLoadInvoice={handleLoadInvoice}
      />
    </div>
  );
}
