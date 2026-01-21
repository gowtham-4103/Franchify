import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, Edit, Plus, AlertCircle, CheckCircle, X, ChevronDown, ChevronUp, Package, TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';

const InventoryDashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('brandName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [expandedBrands, setExpandedBrands] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [stockUpdateType, setStockUpdateType] = useState('add');
  const [stockUpdateValue, setStockUpdateValue] = useState('');
  const [showBrandDetailsModal, setShowBrandDetailsModal] = useState(false);
  const [selectedBrandDetails, setSelectedBrandDetails] = useState(null);
  const [showProductDetailsModal, setShowProductDetailsModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  
  // WebSocket connection for real-time updates
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  // API configuration
  // Replace this at the top of InventoryDashboard.jsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Fetch inventory data from backend
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/inventory/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
      }
      
      const data = await response.json();
      setInventoryData(data.brands || []);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSyncMessage({
        type: 'error',
        text: 'Failed to fetch inventory data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    wsRef.current = new WebSocket(`${wsUrl}/inventory-updates`);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'inventory_update':
          handleRealTimeUpdate(data.payload);
          break;
        case 'stock_update':
          handleStockUpdate(data.payload);
          break;
        case 'brand_update':
          handleBrandUpdate(data.payload);
          break;
        case 'sync_complete':
          handleSyncComplete(data.payload);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    };
    
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        initializeWebSocket();
      }, 3000);
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };
  };
  
  // Handle real-time inventory updates
  const handleRealTimeUpdate = (payload) => {
    setInventoryData(prevData => {
      const updatedData = [...prevData];
      const brandIndex = updatedData.findIndex(brand => brand.brandId === payload.brandId);
      
      if (brandIndex !== -1) {
        const productIndex = updatedData[brandIndex].products.findIndex(
          product => product.id === payload.productId
        );
        
        if (productIndex !== -1) {
          updatedData[brandIndex].products[productIndex] = {
            ...updatedData[brandIndex].products[productIndex],
            ...payload.updates
          };
        }
      }
      
      return updatedData;
    });
    
    // Add to real-time updates list
    setRealTimeUpdates(prev => [
      {
        id: Date.now(),
        type: 'inventory_update',
        message: `${payload.brandName}: ${payload.productName} updated`,
        timestamp: new Date(),
        brandId: payload.brandId,
        productId: payload.productId
      },
      ...prev.slice(0, 9) // Keep only last 10 updates
    ]);
  };
  
  // Handle stock updates
  const handleStockUpdate = (payload) => {
    setInventoryData(prevData => {
      const updatedData = [...prevData];
      const brandIndex = updatedData.findIndex(brand => brand.brandId === payload.brandId);
      
      if (brandIndex !== -1) {
        const productIndex = updatedData[brandIndex].products.findIndex(
          product => product.id === payload.productId
        );
        
        if (productIndex !== -1) {
          const skuIndex = updatedData[brandIndex].products[productIndex].skuCodes.findIndex(
            sku => sku.sku === payload.sku
          );
          
          if (skuIndex !== -1) {
            updatedData[brandIndex].products[productIndex].skuCodes[skuIndex].quantity = payload.newQuantity;
            
            // Recalculate total stock
            const newTotalStock = updatedData[brandIndex].products[productIndex].skuCodes.reduce(
              (sum, sku) => sum + sku.quantity, 0
            );
            updatedData[brandIndex].products[productIndex].totalStock = newTotalStock;
          }
        }
      }
      
      return updatedData;
    });
    
    // Add to real-time updates list
    setRealTimeUpdates(prev => [
      {
        id: Date.now(),
        type: 'stock_update',
        message: `Stock updated for ${payload.brandName} - ${payload.productName} (${payload.sku})`,
        timestamp: new Date(),
        brandId: payload.brandId,
        productId: payload.productId
      },
      ...prev.slice(0, 9)
    ]);
  };
  
  // Handle brand updates
  const handleBrandUpdate = (payload) => {
    setInventoryData(prevData => {
      const updatedData = [...prevData];
      const brandIndex = updatedData.findIndex(brand => brand.brandId === payload.brandId);
      
      if (brandIndex !== -1) {
        updatedData[brandIndex] = {
          ...updatedData[brandIndex],
          ...payload.updates
        };
      }
      
      return updatedData;
    });
    
    // Add to real-time updates list
    setRealTimeUpdates(prev => [
      {
        id: Date.now(),
        type: 'brand_update',
        message: `Brand updated: ${payload.brandName}`,
        timestamp: new Date(),
        brandId: payload.brandId
      },
      ...prev.slice(0, 9)
    ]);
  };
  
  // Handle sync completion
  const handleSyncComplete = (payload) => {
    setSyncMessage({
      type: 'success',
      text: `Sync completed: ${payload.successfulSyncs} brands updated successfully`
    });
    setLastSyncTime(new Date());
  };
  
  // Initialize component
  useEffect(() => {
    fetchInventoryData();
    initializeWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...inventoryData];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(brand => {
        const searchLower = searchQuery.toLowerCase();
        return (
          brand.brandName.toLowerCase().includes(searchLower) ||
          brand.brandOwnerName.toLowerCase().includes(searchLower) ||
          brand.userId.toLowerCase().includes(searchLower) ||
          brand.products.some(product => 
            product.name.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            product.subCategory.toLowerCase().includes(searchLower)
          )
        );
      });
    }
    
    // Apply brand filter
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(brand => brand.brandId === selectedBrand);
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.map(brand => ({
        ...brand,
        products: brand.products.filter(product => product.category === selectedCategory)
      })).filter(brand => brand.products.length > 0);
    }
    
    // Apply sub-category filter
    if (selectedSubCategory !== 'all') {
      filtered = filtered.map(brand => ({
        ...brand,
        products: brand.products.filter(product => product.subCategory === selectedSubCategory)
      })).filter(brand => brand.products.length > 0);
    }
    
    // Apply stock status filter
    if (stockStatusFilter !== 'all') {
      filtered = filtered.map(brand => ({
        ...brand,
        products: brand.products.filter(product => {
          if (stockStatusFilter === 'in-stock') {
            return product.totalStock > 0;
          } else if (stockStatusFilter === 'low-stock') {
            return product.totalStock > 0 && product.totalStock < 50;
          } else if (stockStatusFilter === 'out-of-stock') {
            return product.totalStock === 0;
          }
          return true;
        })
      })).filter(brand => brand.products.length > 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'brandName') {
        aValue = a.brandName;
        bValue = b.brandName;
      } else if (sortBy === 'brandOwner') {
        aValue = a.brandOwnerName;
        bValue = b.brandOwnerName;
      } else if (sortBy === 'totalStock') {
        aValue = a.products.reduce((sum, product) => sum + product.totalStock, 0);
        bValue = b.products.reduce((sum, product) => sum + product.totalStock, 0);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredData(filtered);
  }, [inventoryData, searchQuery, selectedBrand, selectedCategory, selectedSubCategory, stockStatusFilter, sortBy, sortOrder]);
  
  // Get unique values for filters
  const brands = inventoryData.map(brand => ({
    id: brand.brandId,
    name: brand.brandName
  }));
  
  const categories = [...new Set(inventoryData.flatMap(brand => 
    brand.products.map(product => product.category)
  ))];
  
  const subCategories = [...new Set(inventoryData.flatMap(brand => 
    brand.products.map(product => product.subCategory)
  ))];
  
  // Toggle brand expansion
  const toggleBrandExpansion = (brandId) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };
  
  // Toggle product expansion
  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };
  
  
  // Process stock update
  const processStockUpdate = async () => {
    if (!selectedStockItem || !stockUpdateValue) return;
    
    const updateValue = parseInt(stockUpdateValue);
    if (isNaN(updateValue) || updateValue < 0) {
      alert('Please enter a valid positive number');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/update-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          brandId: selectedStockItem.brandId,
          productId: selectedStockItem.productId,
          sku: selectedStockItem.sku,
          updateType: stockUpdateType,
          value: updateValue
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update stock');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setShowStockUpdateModal(false);
        setSyncMessage({
          type: 'success',
          text: `Stock updated successfully for ${selectedStockItem.productName} (${selectedStockItem.sku})`
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setSyncMessage(null), 3000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setSyncMessage({
        type: 'error',
        text: 'Failed to update stock. Please try again.'
      });
    }
  };
  
  // Sync with individual brand dashboards
  const syncWithBrandDashboards = async () => {
    setSyncing(true);
    setSyncMessage(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/sync-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync inventory');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh inventory data after sync
        await fetchInventoryData();
        
        setSyncMessage({
          type: 'success',
          text: `Sync completed: ${result.data.syncedBrands} brands updated successfully`
        });
      } else {
        throw new Error(result.message || 'Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncMessage({
        type: 'error',
        text: 'Failed to sync inventory data. Please try again.'
      });
    } finally {
      setSyncing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };
  
  // Export inventory data
  const exportInventoryData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSyncMessage({
        type: 'success',
        text: 'Inventory data exported successfully'
      });
      
      setTimeout(() => setSyncMessage(null), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setSyncMessage({
        type: 'error',
        text: 'Failed to export data. Please try again.'
      });
    }
  };
  
  // Calculate total stock across all brands
  const calculateTotalStock = () => {
    return filteredData.reduce((total, brand) => {
      return total + brand.products.reduce((brandTotal, product) => {
        return brandTotal + product.totalStock;
      }, 0);
    }, 0);
  };
  
  // Calculate total products across all brands
  const calculateTotalProducts = () => {
    return filteredData.reduce((total, brand) => {
      return total + brand.products.length;
    }, 0);
  };
  
  // View brand details
  const viewBrandDetails = (brand) => {
    setSelectedBrandDetails(brand);
    setShowBrandDetailsModal(true);
  };
  
  // View product details
  const viewProductDetails = (brand, product) => {
    setSelectedProductDetails({
      ...product,
      brandName: brand.brandName,
      brandOwnerName: brand.brandOwnerName,
      userId: brand.userId
    });
    setShowProductDetailsModal(true);
  };
  
  // Manual refresh
  const handleManualRefresh = () => {
    fetchInventoryData();
    setSyncMessage({
      type: 'success',
      text: 'Inventory data refreshed successfully'
    });
    setTimeout(() => setSyncMessage(null), 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200;300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <div className="max-w-8xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Real-Time Inventory Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage inventory across all brands in real-time</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : connectionStatus === 'disconnected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {connectionStatus === 'connected' ? (
                    <>
                      <Wifi size={12} className="mr-1" />
                      Connected
                    </>
                  ) : connectionStatus === 'disconnected' ? (
                    <>
                      <WifiOff size={12} className="mr-1" />
                      Disconnected
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} className="mr-1" />
                      Error
                    </>
                  )}
                </div>
                {lastSyncTime && (
                  <span className="text-xs text-gray-500">
                    Last sync: {lastSyncTime.toLocaleTimeString()}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleManualRefresh}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </button>
              
              <button
                onClick={syncWithBrandDashboards}
                disabled={syncing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {syncing ? (
                  <>
                    <RefreshCw size={20} className="mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} className="mr-2" />
                    Sync with Brand Dashboards
                  </>
                )}
              </button>
              
              <button
                onClick={exportInventoryData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download size={20} className="mr-2" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* Sync Status Message */}
          {syncMessage && (
            <div className={`mb-4 p-3 rounded-md ${
              syncMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center">
                {syncMessage.type === 'success' ? (
                  <CheckCircle size={20} className="mr-2" />
                ) : (
                  <AlertCircle size={20} className="mr-2" />
                )}
                <span className="text-sm">{syncMessage.text}</span>
              </div>
            </div>
          )}
          
          {/* Real-time Updates Feed */}
          {realTimeUpdates.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Real-time Updates</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {realTimeUpdates.map(update => (
                  <div key={update.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        update.type === 'inventory_update' ? 'bg-blue-500' :
                        update.type === 'stock_update' ? 'bg-green-500' :
                        update.type === 'brand_update' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="text-gray-700">{update.message}</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {update.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Package className="text-blue-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Total Brands</p>
                  <p className="text-xl font-semibold">{filteredData.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <Package className="text-green-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-xl font-semibold">{calculateTotalProducts()}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <Package className="text-yellow-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-xl font-semibold">{calculateTotalStock()}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center">
                <TrendingUp className="text-purple-600 mr-2" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-xl font-semibold">
                    {filteredData.reduce((count, brand) => {
                      return count + brand.products.filter(product => product.totalStock > 0 && product.totalStock < 50).length;
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search brands, products..."
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Brands</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sub-Categories</option>
                {subCategories.map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          {/* Sorting */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="brandName">Brand Name</option>
                <option value="brandOwner">Brand Owner</option>
                <option value="totalStock">Total Stock</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Inventory Data */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading inventory data...</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 mb-4">No inventory data found</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setSelectedCategory('all');
                setSelectedSubCategory('all');
                setStockStatusFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map(brand => (
              <div key={brand.brandId} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Brand Header */}
                <div 
                  className="p-4 bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleBrandExpansion(brand.brandId)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {expandedBrands[brand.brandId] ? 
                        <ChevronUp size={20} className="text-gray-600" /> : 
                        <ChevronDown size={20} className="text-gray-600" />
                      }
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{brand.brandName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Owner: {brand.brandOwnerName}</span>
                        <span>ID: {brand.userId}</span>
                        <span>Products: {brand.products.length}</span>
                        <span>Total Stock: {brand.products.reduce((sum, product) => sum + product.totalStock, 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewBrandDetails(brand);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      title="View Brand Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Brand Products */}
                {expandedBrands[brand.brandId] && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {brand.products.map(product => (
                        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Product Header */}
                          <div 
                            className="p-3 bg-gray-50 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleProductExpansion(product.id)}
                          >
                            <div className="flex items-center">
                              <div className="mr-3">
                                {expandedProducts[product.id] ? 
                                  <ChevronUp size={16} className="text-gray-600" /> : 
                                  <ChevronDown size={16} className="text-gray-600" />
                                }
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <span>Category: {product.category}</span>
                                  <span>Sub-Category: {product.subCategory}</span>
                                  <span>MRP: ₹{product.mrp}</span>
                                  <span>Selling Price: ₹{product.sellingPrice}</span>
                                  <span>Total Stock: {product.totalStock}</span>
                                  <span>Last Updated: {new Date(product.lastUpdated).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewProductDetails(brand, product);
                                }}
                                className="p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                title="View Product Details"
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {/* Product SKUs */}
                          {expandedProducts[product.id] && (
                            <div className="p-3 border-t border-gray-200">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SKU
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Color
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {product.skuCodes.map((sku, index) => (
                                      <tr key={index}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {sku.sku}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {sku.size}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {sku.color}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            sku.quantity === 0 
                                              ? 'bg-red-100 text-red-800' 
                                              : sku.quantity < 50 
                                              ? 'bg-yellow-100 text-yellow-800' 
                                              : 'bg-green-100 text-green-800'
                                          }`}>
                                            {sku.quantity}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          <button
                                            onClick={() => handleStockUpdate(brand.brandId, product.id, index)}
                                            className="p-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                            title="Update Stock"
                                          >
                                            <Edit size={14} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Color-wise Quantity Summary */}
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Color-wise Quantity</h5>
                                  <div className="space-y-1">
                                    {Object.entries(
                                      product.skuCodes.reduce((colors, sku) => {
                                        colors[sku.color] = (colors[sku.color] || 0) + sku.quantity;
                                        return colors;
                                      }, {})
                                    ).map(([color, quantity]) => (
                                      <div key={color} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{color}:</span>
                                        <span className={`font-medium ${
                                          quantity === 0 
                                            ? 'text-red-600' 
                                            : quantity < 50 
                                            ? 'text-yellow-600' 
                                            : 'text-green-600'
                                        }`}>
                                          {quantity}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Size-wise Quantity Summary */}
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Size-wise Quantity</h5>
                                  <div className="space-y-1">
                                    {Object.entries(
                                      product.skuCodes.reduce((sizes, sku) => {
                                        sizes[sku.size] = (sizes[sku.size] || 0) + sku.quantity;
                                        return sizes;
                                      }, {})
                                    ).map(([size, quantity]) => (
                                      <div key={size} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{size}:</span>
                                        <span className={`font-medium ${
                                          quantity === 0 
                                            ? 'text-red-600' 
                                            : quantity < 50 
                                            ? 'text-yellow-600' 
                                            : 'text-green-600'
                                        }`}>
                                          {quantity}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Stock Update Modal */}
      {showStockUpdateModal && selectedStockItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Stock</h3>
              <button 
                onClick={() => setShowStockUpdateModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand</p>
                <p className="font-medium">{selectedStockItem.brandName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Owner</p>
                <p className="font-medium">{selectedStockItem.brandOwnerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="font-medium">{selectedStockItem.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-medium">{selectedStockItem.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium">{selectedStockItem.category} / {selectedStockItem.subCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">SKU</p>
                <p className="font-medium">{selectedStockItem.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Variant</p>
                <p className="font-medium">{selectedStockItem.size} / {selectedStockItem.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Quantity</p>
                <p className="font-medium">{selectedStockItem.currentQuantity}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stockUpdateType"
                      value="add"
                      checked={stockUpdateType === 'add'}
                      onChange={() => setStockUpdateType('add')}
                      className="mr-2"
                    />
                    <span className="text-sm">Add to existing</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="stockUpdateType"
                      value="set"
                      checked={stockUpdateType === 'set'}
                      onChange={() => setStockUpdateType('set')}
                      className="mr-2"
                    />
                    <span className="text-sm">Set new quantity</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {stockUpdateType === 'add' ? 'Quantity to Add' : 'New Quantity'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockUpdateValue}
                  onChange={(e) => setStockUpdateValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={stockUpdateType === 'add' ? 'Enter quantity to add' : 'Enter new quantity'}
                />
                {stockUpdateType === 'add' && stockUpdateValue && (
                  <p className="text-xs text-gray-500 mt-1">
                    New total: {selectedStockItem.currentQuantity + parseInt(stockUpdateValue)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStockUpdateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={processStockUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Brand Details Modal */}
      {showBrandDetailsModal && selectedBrandDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Brand Details</h3>
              <button 
                onClick={() => setShowBrandDetailsModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Name</p>
                <p className="font-medium">{selectedBrandDetails.brandName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Owner Name</p>
                <p className="font-medium">{selectedBrandDetails.brandOwnerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="font-medium">{selectedBrandDetails.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="font-medium">{selectedBrandDetails.products.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                <p className="font-medium">
                  {selectedBrandDetails.products.reduce((sum, product) => sum + product.totalStock, 0)}
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Products</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sub-Category
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MRP
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selling Price
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Stock
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedBrandDetails.products.map(product => (
                        <tr key={product.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {product.subCategory}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.mrp}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.sellingPrice}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {product.totalStock}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {new Date(product.lastUpdated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowBrandDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Details Modal */}
      {showProductDetailsModal && selectedProductDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <button 
                onClick={() => setShowProductDetailsModal(false)}
                className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Name</p>
                <p className="font-medium">{selectedProductDetails.brandName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Brand Owner Name</p>
                <p className="font-medium">{selectedProductDetails.brandOwnerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="font-medium">{selectedProductDetails.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Product Name</p>
                <p className="font-medium">{selectedProductDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Category</p>
                <p className="font-medium">{selectedProductDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Sub-Category</p>
                <p className="font-medium">{selectedProductDetails.subCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">MRP</p>
                <p className="font-medium">₹{selectedProductDetails.mrp}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Selling Price</p>
                <p className="font-medium">₹{selectedProductDetails.sellingPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                <p className="font-medium">{selectedProductDetails.totalStock}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-medium">{new Date(selectedProductDetails.lastUpdated).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">SKU Codes</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SKU
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Color
                        </th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProductDetails.skuCodes.map((sku, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {sku.sku}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {sku.size}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {sku.color}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              sku.quantity === 0 
                                ? 'bg-red-100 text-red-800' 
                                : sku.quantity < 50 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {sku.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProductDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;