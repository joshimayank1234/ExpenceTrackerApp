import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { baseUrl } from '../config'
import { Chart as ChartJs} from "chart.js/auto"
import {Doughnut} from "react-chartjs-2"

export default function MyExpences() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    month: '',
    category: ''
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [summary, setSummary] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: ''
  })
  const categoryTotals = filteredData.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };


  async function getData() {
    setLoading(true)
    try {
      let res = await axios.get(`${baseUrl}expenses`)
      if(res?.status) {
        setData(res?.data?.data)
        setFilteredData(res?.data?.data)
      }
    } catch(error) {
      console.error("Data not found", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, data])

  const applyFilters = () => {
    let result = [...data]
    
    if (filters.month) {
      result = result.filter(expense => {
        const expenseDate = new Date(expense.date)
        const expenseMonth = expenseDate.getMonth() + 1
        return expenseMonth === parseInt(filters.month)
      })
    }
    
    if (filters.category && filters.category !== 'all') {
      result = result.filter(expense => 
        expense.category.toLowerCase() === filters.category.toLowerCase()
      )
    }
    
    setFilteredData(result)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${baseUrl}expenses/${id}`)
        getData() 
      } catch (error) {
        console.error("Failed to delete expense", error)
      }
    }
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount,
      date: expense.date.split('T')[0], 
      category: expense.category
    })
    setShowEditModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${baseUrl}expenses/${editingExpense._id}`,formData)
      setShowEditModal(false)
      getData() // Refresh data after update
    } catch (error) {
      console.error("Failed to update expense", error)
    }
  }

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(data.map(expense => expense.category))]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Expenses</h1>
      
  
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <select 
              name="month" 
              value={filters.month} 
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading your expenses...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((expense, index) => (
                  <tr key={expense.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-medium ${parseFloat(expense.amount) > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                        ${parseFloat(expense.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(expense)} 
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(expense._id)} 
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.month || filters.category ? 
                "Try changing your filters or add a new expense." : 
                "Get started by adding your first expense."}
            </p>
          </div>
        )}
      </div>
      

      {filteredData.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                ${filteredData.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Highest Expense</p>
              <p className="text-2xl font-bold text-gray-800">
                ${Math.max(...filteredData.map(expense => parseFloat(expense.amount))).toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Average Expense</p>
              <p className="text-2xl font-bold text-gray-800">
                ${(filteredData.reduce((total, expense) => total + parseFloat(expense.amount), 0) / filteredData.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
      

      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-transparent bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 md:mx-0 animate-fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Edit Expense</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200 focus:outline-none "
                >
                  <svg className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Description
                  </label>
                  <input
                    type="text"
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="edit-amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Date
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Category
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
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
                    {!['food', 'transportation', 'utilities', 'entertainment', 'shopping', 'health', 'travel', 'education', 'other'].includes(formData.category.toLowerCase()) && (
                      <option value={formData.category}>{formData.category}</option>
                    )}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>

      </div>
     <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">Expense Distribution</h2>
    <Doughnut data={chartData} />
  </div>
    </div>
  )
}