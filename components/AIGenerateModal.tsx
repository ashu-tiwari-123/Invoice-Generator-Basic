
import React, { useState, useCallback } from 'react';
import { generateInvoiceFromText } from '../services/geminiService';
import type { AIGeneratedInvoice } from '../types';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: AIGeneratedInvoice) => void;
}

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
      <path d="M9.93 2.07a1 1 0 0 0-1.86 0L6.93 6.2a1 1 0 0 1-.93.94l-4.13 1.14a1 1 0 0 0 0 1.86l4.13 1.14a1 1 0 0 1 .93.94l1.14 4.13a1 1 0 0 0 1.86 0l1.14-4.13a1 1 0 0 1 .93-.94l4.13-1.14a1 1 0 0 0 0-1.86l-4.13-1.14a1 1 0 0 1-.93-.94zM18 14l-1-4-4-1 4-1 1-4 1 4 4 1-4 1z"/>
    </svg>
  );

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateInvoiceFromText(prompt);
      onGenerate(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-900">Generate Invoice with AI</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
          
            <p className="mt-2 text-sm text-gray-600">
                Describe the invoice in plain English. Include customer details, items, quantities, and rates. The AI will do the rest.
            </p>
            <p className="mt-2 text-xs text-gray-500">
                Example: "Invoice Innovate Corp for 10 hours of consulting at $150/hr and a design fee of $500. GST is 18%. Due in 15 days."
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <textarea
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your invoice description here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    disabled={isLoading}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Spinner /> : <SparklesIcon />}
                        {isLoading ? 'Generating...' : 'Generate Invoice'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
