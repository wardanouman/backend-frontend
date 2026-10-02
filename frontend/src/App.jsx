import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5050';

export default function ProductApp() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({ id: '', title: '', image: '', price: '', description: '' });
  const [updateProduct, setUpdateProduct] = useState({ id: '', title: '', image: '', price: '', description: '' });

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Handle Add Product (Maps title -> name, image -> imageUrl)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const productPayload = {
        id: newProduct.id || Date.now().toString(),
        name: newProduct.title,       // Mapped to schema 'name'
        imageUrl: newProduct.image,   // Mapped to schema 'imageUrl'
        price: Number(newProduct.price),
        description: newProduct.description
      };

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });

      if (res.ok) {
        alert("Product added successfully!");
        setNewProduct({ id: '', title: '', image: '', price: '', description: '' });
        fetchProducts();
      } else {
        alert("Failed to add product.");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Handle Update Product (Maps title -> name, image -> imageUrl)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateProduct.id) {
      alert("Please select or enter a Product ID to update!");
      return;
    }

    try {
      const updatePayload = {
        ...(updateProduct.title && { name: updateProduct.title }),         // Mapped to schema 'name'
        ...(updateProduct.image && { imageUrl: updateProduct.image }),     // Mapped to schema 'imageUrl'
        ...(updateProduct.price && { price: Number(updateProduct.price) }),
        ...(updateProduct.description && { description: updateProduct.description })
      };

      const res = await fetch(`${API_BASE_URL}/products/${updateProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      if (res.ok) {
        alert("Product updated successfully!");
        setUpdateProduct({ id: '', title: '', image: '', price: '', description: '' });
        fetchProducts();
      } else {
        alert("Product not found or update failed.");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Populate update form when clicking "Edit" on a card (Reads from 'name' and 'imageUrl')
  const handleEditClick = (p) => {
    setUpdateProduct({
      id: p.id || p._id || '',
      title: p.name || p.title || '',         // Read from database 'name'
      image: p.imageUrl || p.image || '',     // Read from database 'imageUrl'
      price: p.price || '',
      description: p.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E0D0C1]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#5A3A28]/10 flex items-center justify-center text-[#5A3A28] font-bold text-xl">
                ＋
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3D2517]">New Product</h2>
                <p className="text-xs text-[#8A7060]">Add a new item to the store</p>
              </div>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="Leave blank for auto-generation"
                  value={newProduct.id}
                  onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leather Satchel"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
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
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide details about the product..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-[#5A3A28] hover:bg-[#442B1D] text-white font-semibold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add Product</span>
              </button>
            </form>
          </div>

          {/* Card 2: Product Update Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-[#E0D0C1]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#5A3A28]/10 flex items-center justify-center text-[#5A3A28] font-bold text-xl">
                ✏️
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#3D2517]">Product Update</h2>
                <p className="text-xs text-[#8A7060]">Modify an existing product record</p>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  placeholder="Enter or click Edit on a product below"
                  value={updateProduct.id}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wider mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  placeholder="Updated Title"
                  value={updateProduct.title}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, title: e.target.value })}
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
                  value={updateProduct.image}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, image: e.target.value })}
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
                  value={updateProduct.price}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, price: e.target.value })}
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
                  value={updateProduct.description}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#5A3A28] focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
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
              {products.length} Items
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <div className="w-12 h-12 mx-auto mb-3 text-[#8A7060] opacity-50 flex items-center justify-center text-3xl">
                📦
              </div>
              <p className="text-gray-500 font-medium text-sm">No products loaded yet.</p>
              <p className="text-gray-400 text-xs mt-1">Add items above or fetch from your MongoDB backend.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const imgSrc = p.imageUrl || p.image || p.img;
                const productTitle = p.name || p.title;
                const productId = p.id || p._id;
                
                return (
                  <div key={productId} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col justify-between space-y-3">
                    <div className="space-y-3">
                      {/* Fixed image container layout */}
                      <div className="w-full h-40 bg-[#F9F6F0] rounded-lg overflow-hidden flex items-center justify-center border border-[#E8DDD1] p-2">
                        {imgSrc ? (
                          <img 
                            src={imgSrc} 
                            alt={productTitle} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        ) : (
                          <div className="text-center text-[#8A7060] space-y-1">
                            <span className="text-2xl">🖼️</span>
                            <p className="text-[10px] uppercase font-semibold tracking-wider">No Image Provided</p>
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-[#3D2517] text-base">{productTitle || "Untitled Product"}</div>
                      <div className="text-xs text-gray-400 font-mono">ID: {productId}</div>
                      <div className="text-sm font-semibold text-[#5A3A28]">${p.price}</div>
                      <p className="text-xs text-gray-600 line-clamp-2">{p.description || "No description available."}</p>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="flex-1 py-2 px-3 bg-[#E8DDD1] hover:bg-[#D5C3B3] text-[#3D2517] font-medium text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(productId)}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        🗑️️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}