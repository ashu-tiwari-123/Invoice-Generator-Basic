import React from 'react';
import type { Party } from '../types';
import { INDIAN_STATES } from '../constants';

interface PartyDetailsProps {
  party: Party;
  setParty: React.Dispatch<React.SetStateAction<Party>>;
  partyType: 'seller' | 'customer' | 'consignee';
}

export const PartyDetails: React.FC<PartyDetailsProps> = ({ party, setParty, partyType }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParty(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${partyType}-name`} className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id={`${partyType}-name`}
          name="name"
          value={party.name || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor={`${partyType}-address`} className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          id={`${partyType}-address`}
          name="address"
          rows={2}
          value={party.address || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
        <div>
            <label htmlFor={`${partyType}-gstin`} className="block text-sm font-medium text-gray-700">GSTIN</label>
            <input
            type="text"
            id={`${partyType}-gstin`}
            name="gstin"
            value={party.gstin || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </div>
        <div>
            <label htmlFor={`${partyType}-pan`} className="block text-sm font-medium text-gray-700">PAN</label>
            <input
            type="text"
            id={`${partyType}-pan`}
            name="pan"
            value={party.pan || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </div>
        <div>
            <label htmlFor={`${partyType}-state`} className="block text-sm font-medium text-gray-700">State</label>
            <select
                id={`${partyType}-state`}
                name="state"
                value={party.state || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
                <option value="">Select State</option>
                {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
        </div>
         <div>
            <label htmlFor={`${partyType}-pincode`} className="block text-sm font-medium text-gray-700">Pincode</label>
            <input
            type="text"
            id={`${partyType}-pincode`}
            name="pincode"
            value={party.pincode || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </div>
         <div>
            <label htmlFor={`${partyType}-phone`} className="block text-sm font-medium text-gray-700">Phone</label>
            <input
            type="text"
            id={`${partyType}-phone`}
            name="phone"
            value={party.phone || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </div>
         <div>
            <label htmlFor={`${partyType}-email`} className="block text-sm font-medium text-gray-700">Email</label>
            <input
            type="email"
            id={`${partyType}-email`}
            name="email"
            value={party.email || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
        </div>
      </div>
    </div>
  );
};