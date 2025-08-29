
import React, { useMemo, useState } from 'react';
import type { Invoice, Party, LineItem, TaxTotals, InvoiceCopyType } from '../types';

interface InvoicePreviewProps {
    invoice: Invoice;
    seller: Party;
    customer: Party;
    consignee: Party;
    lineItems: LineItem[];
    subTotal: number;
    taxTotal: number;
    grandTotal: number;
}

const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numAsString = Math.round(num).toString();
    if (numAsString.length > 9) return 'overflow';
    const n = ('000000000' + numAsString).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (parseInt(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (parseInt(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (parseInt(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (parseInt(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (parseInt(n[5]) !== 0) ? ((str !== '') ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

const PartyInfo: React.FC<{ title: string; party: Party }> = ({ title, party }) => (
    <div className="text-xs">
        <p className="font-bold text-gray-800 uppercase tracking-wider mb-2">{title}</p>
        <div className="text-gray-900 space-y-1">
            <p className="font-bold text-base text-gray-900">{party.name}</p>
            <p>{party.address}, {party.pincode}</p>
            <p>{party.state}</p>
            {party.phone && <p>Phone: {party.phone}</p>}
            <p>GSTIN: <span className="font-mono font-semibold">{party.gstin}</span></p>
            {party.pan && <p>PAN: <span className="font-mono font-semibold">{party.pan}</span></p>}
        </div>
    </div>
);

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    invoice,
    seller,
    customer,
    consignee,
    lineItems,
    subTotal,
    taxTotal,
    grandTotal,
}) => {
    const [copyType, setCopyType] = useState<InvoiceCopyType>('Original for Buyer');

    const taxBreakup = useMemo<TaxTotals>(() => {
        const isInterState = seller.state !== customer.state;
        let cgst = 0, sgst = 0, igst = 0;

        lineItems.forEach(item => {
            const amount = item.quantity * item.rate;
            const discountAmount = (amount * item.discount) / 100;
            const taxableValue = amount - discountAmount;
            const itemTax = (taxableValue * item.taxRate) / 100;
            if (isInterState) {
                igst += itemTax;
            } else {
                cgst += itemTax / 2;
                sgst += itemTax / 2;
            }
        });

        return { cgst, sgst, igst, total: cgst + sgst + igst };
    }, [lineItems, seller.state, customer.state]);

    const taxSummary = useMemo(() => {
        const isInterState = seller.state !== customer.state;
        const summary: { [rate: number]: { taxableValue: number; cgst: number; sgst: number; igst: number } } = {};

        lineItems.forEach(item => {
            const taxableValue = (item.quantity * item.rate) * (1 - (item.discount || 0) / 100);
            const taxRate = item.taxRate || 0;

            if (!summary[taxRate]) {
                summary[taxRate] = { taxableValue: 0, cgst: 0, sgst: 0, igst: 0 };
            }

            const itemTax = (taxableValue * taxRate) / 100;

            summary[taxRate].taxableValue += taxableValue;

            if (isInterState) {
                summary[taxRate].igst += itemTax;
            } else {
                summary[taxRate].cgst += itemTax / 2;
                summary[taxRate].sgst += itemTax / 2;
            }
        });

        return Object.entries(summary).map(([rate, values]) => ({
            rate: parseFloat(rate),
            ...values,
        }));
    }, [lineItems, seller.state, customer.state]);

    const totalTaxableValue = taxSummary.reduce((acc, item) => acc + item.taxableValue, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    const roundedGrandTotal = Math.round(grandTotal);
    const roundOff = roundedGrandTotal - grandTotal;

    return (
        <>
            <div className="print:hidden mb-4 flex items-center space-x-2">
                <label htmlFor="copyType" className="text-sm font-medium text-gray-700">Copy Type for Print:</label>
                <select
                    id="copyType"
                    value={copyType}
                    onChange={(e) => setCopyType(e.target.value as InvoiceCopyType)}
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                    <option>Original for Buyer</option>
                    <option>Office Copy</option>
                    <option>Delivery Challan</option>
                </select>
            </div>
            <div id="invoice-preview" data-copy-type={copyType} className="invoice bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-[210mm] min-h-[297mm] mx-auto text-gray-900 text-xs font-sans relative flex flex-col">
                <header className="flex justify-between items-start pb-6 border-b border-gray-100">
                    <div className="w-1/4">
                        <img src="" alt="Company Logo" className="max-w-full h-auto max-h-0 object-contain" />
                    </div>
                    <div className="text-center w-1/2">
                        <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                        <p className="text-gray-700">{seller.address}</p>
                        <p className="text-gray-700">Email: {seller.email} | Mob: {seller.mobNo}</p>
                        <p>GSTIN: <span className="font-mono font-semibold">{seller.gstin}</span></p>
                    </div>
                    <div className="w-1/4 text-right">
                        <p className="text-sm font-semibold text-gray-600 mb-1">{copyType}</p>
                        <h2 className="text-3xl font-bold uppercase text-gray-900">Invoice</h2>
                    </div>
                </header>

                <section className="py-4">
                    <div className="grid grid-cols-4 divide-x divide-gray-200 text-xs">
                        <div className="px-2 text-center">
                            <p className="text-gray-500 uppercase tracking-wider text-[10px]">Invoice No.</p>
                            <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="px-2 text-center">
                            <p className="text-gray-500 uppercase tracking-wider text-[10px]">Invoice Date</p>
                            <p className="font-semibold text-gray-900">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</p>
                        </div>
                        <div className="px-2 text-center">
                            <p className="text-gray-500 uppercase tracking-wider text-[10px]">P.O. Number</p>
                            <p className="font-semibold text-gray-900">{invoice.purchaseOrderNumber}</p>
                        </div>
                        <div className="px-2 text-center">
                            <p className="text-gray-500 uppercase tracking-wider text-[10px]">Place of Delivery</p>
                            <p className="font-semibold text-gray-900">{invoice.placeOfDelivery}</p>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-8 mt-6">
                    <PartyInfo title="Bill To" party={customer} />
                    <PartyInfo title="Ship To" party={consignee} />
                </section>

                <section className="mt-4 flex-grow">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 text-gray-800 uppercase tracking-wider">
                            <tr>
                                <th className="p-2 w-[5%] font-semibold">S.No</th>
                                <th className="p-2 w-[35%] font-semibold">Description</th>
                                <th className="p-2 text-center font-semibold">HSN/SAC</th>
                                <th className="p-2 text-center font-semibold">Qty</th>
                                <th className="p-2 text-center font-semibold">Unit</th>
                                <th className="p-2 text-right font-semibold">Rate</th>
                                <th className="p-2 text-right font-semibold">Discount(%)</th>
                                <th className="p-2 text-right font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {lineItems.map((item, index) => {
                                const amount = item.quantity * item.rate;
                                const discountAmt = (amount * item.discount) / 100;
                                const finalAmount = amount - discountAmt;
                                return (
                                    <tr className="text-gray-900" key={item.id}>
                                        <td className="p-2 text-center">{index + 1}.</td>
                                        <td className="p-2 text-gray-900 font-medium">{item.description}</td>
                                        <td className="p-2 text-center font-mono">{item.hsn}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-center">{item.per}</td>
                                        <td className="p-2 text-right">{item.rate.toFixed(2)}</td>
                                        <td className="p-2 text-right">{item.discount > 0 ? `${item.discount.toFixed(2)}%` : '-'}</td>
                                        <td className="p-2 text-right font-semibold text-gray-900">{finalAmount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                <section className="mt-6 border-t text-gray-900 border-gray-200 pt-4">
                    <div className="grid grid-cols-2">
                        <div className="pr-4">
                            <h3 className="font-semibold text-center text-xs mb-2 uppercase text-gray-700 tracking-wider">Tax Summary</h3>
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-100 text-gray-800">
                                    <tr>
                                        <th className="p-1 font-semibold">Taxable Value</th>
                                        {taxBreakup.igst > 0 ? (
                                            <>
                                                <th className="p-1 text-center font-semibold">IGST Rate</th>
                                                <th className="p-1 text-right font-semibold">IGST Amount</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="p-1 text-center font-semibold">CGST</th>
                                                <th className="p-1 text-right font-semibold">Amount</th>
                                                <th className="p-1 text-center font-semibold">SGST</th>
                                                <th className="p-1 text-right font-semibold">Amount</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxSummary.map(({ rate, taxableValue, cgst, sgst, igst }) => (
                                        <tr key={rate} className="border-b text-gray-900 border-gray-100">
                                            <td className="p-1">{taxableValue.toFixed(2)}</td>
                                            {taxBreakup.igst > 0 ? (
                                                <>
                                                    <td className="p-1 text-center">{rate}%</td>
                                                    <td className="p-1 text-right">{igst.toFixed(2)}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="p-1 text-center">{rate / 2}%</td>
                                                    <td className="p-1 text-right">{cgst.toFixed(2)}</td>
                                                    <td className="p-1 text-center">{rate / 2}%</td>
                                                    <td className="p-1 text-right">{sgst.toFixed(2)}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="font-bold bg-gray-100 text-gray-800">
                                    <tr>
                                        <td className="p-1">{totalTaxableValue.toFixed(2)}</td>
                                        {taxBreakup.igst > 0 ? (
                                            <>
                                                <td className="p-1"></td>
                                                <td className="p-1 text-right">{taxBreakup.igst.toFixed(2)}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-1"></td>
                                                <td className="p-1 text-right">{taxBreakup.cgst.toFixed(2)}</td>
                                                <td className="p-1"></td>
                                                <td className="p-1 text-right">{taxBreakup.sgst.toFixed(2)}</td>
                                            </>
                                        )}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="pl-4 space-y-1 text-xs self-end text-gray-800">
                            <div className="flex justify-between">
                                <span>Taxable Value</span>
                                <span className="font-semibold text-right w-28">{subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Tax</span>
                                <span className="font-semibold text-right w-28">{taxTotal.toFixed(2)}</span>
                            </div>
                            {roundOff !== 0 && (
                                <div className="flex justify-between">
                                    <span>Round Off</span>
                                    <span className="font-semibold text-right w-28">{roundOff.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300 mt-2">
                                <span className="text-gray-900">Grand Total</span>
                                <span className="text-right w-32 text-gray-900">{formatCurrency(roundedGrandTotal)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-4 text-xs border-t border-gray-200 pt-2">
                    <p><span className="font-semibold text-gray-700">Amount in Words:</span> <span className="capitalize font-semibold text-gray-900">{numberToWords(roundedGrandTotal)} Rupees Only.</span></p>
                </section>

                <footer className="mt-auto pt-6 text-xs">
                    <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-4">
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-gray-800">Bank Details:</p>
                                <p>Bank: {seller.bankName}</p>
                                <p>Branch: {seller.branchName}</p>
                                <p>A/C No: {seller.accountNo}</p>
                                <p>IFSC: {seller.ifscCode}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Declaration:</p>
                                <p className="italic text-gray-700">{invoice.declaration}</p>
                            </div>
                        </div>
                        <div className="text-center flex flex-col justify-between items-center">
                            <div className="w-full">
                                <p className="font-bold text-gray-900">For {seller.name.toUpperCase()}</p>
                                <div className="h-20"></div>
                                <p className="border-t border-gray-300 pt-2 text-gray-700">Authorised Signatory</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between text-gray-600 text-[10px] mt-6 pt-2 border-t border-gray-100">
                        <span>This is a computer generated invoice.</span>
                        <span>E. & O.E</span>
                    </div>
                </footer>
            </div>
        </>
    );
};