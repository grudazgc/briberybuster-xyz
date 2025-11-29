'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

interface ReportFormData {
  description: string;
  latitude: number;
  longitude: number;
  category: string;
}

export default function ReportForm() {
  const { publicKey, connected } = useWallet();
  const [formData, setFormData] = useState<ReportFormData>({
    description: '',
    latitude: 0,
    longitude: 0,
    category: 'BRIBERY',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports`,
        {
          ...formData,
          walletAddress: publicKey.toString(),
        }
      );
      setSuccess(true);
      setFormData({ description: '', latitude: 0, longitude: 0, category: 'BRIBERY' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-primary">Submit Corruption Report</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Report submitted successfully! You will receive 100 CORRUPT tokens after verification.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="BRIBERY">Bribery</option>
          <option value="EMBEZZLEMENT">Embezzlement</option>
          <option value="FRAUD">Fraud</option>
          <option value="NEPOTISM">Nepotism</option>
          <option value="ABUSE_OF_POWER">Abuse of Power</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={5}
          placeholder="Describe the corruption incident..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!connected || loading}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>

      {!connected && (
        <p className="text-red-500 text-center mt-4">Please connect your wallet to submit a report</p>
      )}
    </form>
  );
}
