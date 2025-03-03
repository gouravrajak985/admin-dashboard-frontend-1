import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createDiscount, clearDiscountError, resetDiscountSuccess } from '../../redux/slices/discountSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { ArrowLeft, Save } from 'lucide-react';
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const CreateDiscount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading, error, success } = useSelector((state: RootState) => state.discounts);
  
  const [code, setCode] = useState('');
  const [type, setType] = useState('discount_code');
  const [value, setValue] = useState('');
  const [valueType, setValueType] = useState('percentage');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('0');
  const [maxUses, setMaxUses] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(clearDiscountError());
    dispatch(resetDiscountSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/discounts/manage');
    }
  }, [success, navigate]);

  const generateRandomCode = (prefix: string = 'SALE') => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!code || !value || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const discountData = {
      code,
      type,
      value: parseFloat(value),
      valueType,
      minPurchaseAmount: parseFloat(minPurchaseAmount),
      maxUses: maxUses ? parseInt(maxUses) : undefined,
      startDate,
      endDate,
      status,
      description
    };

    dispatch(createDiscount(discountData));
  };

  const inputClassName = "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="border rounded-lg">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/discounts/manage')}
            className="p-2 mr-4 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">Create Discount</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && <Message variant="error">{error}</Message>}
        {loading && <Loader />}

        {/* Discount Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Discount Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('discount_code')}
              className={`p-4 border rounded-lg text-left ${
                type === 'discount_code'
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              <h3 className="font-medium mb-1">Discount Code</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Single code that can be used multiple times</p>
            </button>
            <button
              type="button"
              onClick={() => setType('coupon_codes')}
              className={`p-4 border rounded-lg text-left ${
                type === 'coupon_codes'
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              <h3 className="font-medium mb-1">Coupon Codes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generate multiple single-use codes</p>
            </button>
          </div>
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium mb-2">Discount Code</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code or generate one"
              className={inputClassName}
              required
            />
            <button
              type="button"
              onClick={() => generateRandomCode()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Discount Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Discount Value</label>
            <div className="flex">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="0"
                step={valueType === 'percentage' ? '1' : '0.01'}
                className={`${inputClassName} rounded-r-none`}
                required
              />
              <select
                value={valueType}
                onChange={(e) => setValueType(e.target.value)}
                className={`${inputClassName} rounded-l-none border-l-0 w-24`}
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Purchase Amount</label>
            <input
              type="number"
              value={minPurchaseAmount}
              onChange={(e) => setMinPurchaseAmount(e.target.value)}
              min="0"
              step="0.01"
              className={inputClassName}
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div>
          <label className="block text-sm font-medium mb-2">Maximum Uses (leave empty for unlimited)</label>
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            min="0"
            className={inputClassName}
            placeholder="Unlimited"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClassName}
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClassName}
            required
          >
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClassName} h-24`}
            placeholder="Add a description for this discount"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/discounts/manage')}
            className="px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={loading}
          >
            <Save className="h-5 w-5 mr-2" />
            Create Discount
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscount;