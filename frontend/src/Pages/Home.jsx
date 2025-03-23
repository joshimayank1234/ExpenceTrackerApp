import React, { useState } from 'react';
import { baseUrl } from '../config';
import axios from "axios"

export default function Home() {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  async function handleSubmitData(e) {
    e.preventDefault();  
    // Reset form after submission
    setFormData({
      amount: '',
      category: '',
      date: '',
      description: ''
    });

    let res = axios.post(`${baseUrl}expenses`,formData) 
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mt-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Expense Tracker</h1>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Expense
        </h2>
        
        <form onSubmit={handleSubmitData} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Expense Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="What did you spend on?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Expense Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Expense Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Expense Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="utilities">Bills & Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health & Medical</option>
                <option value="travel">Travel</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 shadow-md"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}