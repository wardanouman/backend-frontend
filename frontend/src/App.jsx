import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://mongo-db-production-8ab9.up.railway.app/products'; 


export default function ProductApp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({ id: '', title: '', image: '', price: '', description: '' });
  const [updateProduct, setUpdateProduct] = useState({ id: '', title: '', image: '', price: '', description: '' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8DDD1] to-[#D5C3B3] font-sans antialiased py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <header className="text-center space-y-2 mb-10">
          <span className="inline-block px-3 py-1 bg-[#5A3A28]/10 text-[#5A3A28] font-semibold text-xs rounded-full uppercase tracking-wider">
            Inventory & Catalog Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2517] tracking-tight">
            Product Server Management
          </h1>
          <p className="text-[#6E5444] text-sm sm:text-base max-w-md mx-auto">
            Create, update, and monitor your product listings in real-time.
          </p>
        </header>

        {/* Top Forms Grid: New Product & Update Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: New Product Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E0D0C1] transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#5A3A28]/10 flex items-center justify-center text-[#5A3A28] font-bold text-xl">
                ＋
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3D2517]">New Product</h2>
                <p className="text-xs text-[#8A7060]">Add a new item to the store</p>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="Product ID (Auto-filled)"
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leather Satchel"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide details about the product..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full mt-2 py-3 px-4 bg-[#5A3A28] hover:bg-[#442B1D] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add Product</span>
              </button>
            </form>
          </div>

          {/* Card 2: Product Update Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E0D0C1] transition-all hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#5A3A28]/10 flex items-center justify-center text-[#5A3A28] font-bold text-xl">
                ✏️
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3D2517]">Product Update</h2>
                <p className="text-xs text-[#8A7060]">Modify an existing product record</p>
              </div>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Product ID to Edit"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Updated Title"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Updated Image URL"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  placeholder="Updated Price"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Updated Description"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full mt-2 py-3 px-4 bg-[#5A3A28] hover:bg-[#442B1D] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Update Product</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Card: Fetched Products Display */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E0D0C1]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-[#3D2517]">Fetched Products</h2>
              <p className="text-xs text-[#8A7060]">Live records from backend database</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-[#5A3A28] rounded-full text-xs font-bold">
              0 Items
            </span>
          </div>

          {/* Empty State */}
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="w-12 h-12 mx-auto mb-3 text-[#8A7060] opacity-50 flex items-center justify-center text-3xl">
              📦
            </div>
            <p className="text-gray-500 font-medium text-sm">No products loaded yet.</p>
            <p className="text-gray-400 text-xs mt-1">Add items above or fetch from your MongoDB backend.</p>
          </div>
        </div>

      </div>
    </div>
  );
}