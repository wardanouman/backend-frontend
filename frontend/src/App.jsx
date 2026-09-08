import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [products, setProducts] = useState([])
  //update product PUT//
  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateImage, setUpdateImage] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [updatePrice, setUpdatePrice] = useState('');
  //new product POST//
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://mongo-db-production-8ab9.up.railway.app/products/')
        console.log('Fetched products:', response.data)
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])


// 1. POST Function
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(' https://mongo-db-production-8ab9.up.railway.app/products', {
        id : new Date().getTime().toString(),
        name: newTitle,
        image: newImage,
        price: Number(newPrice),
        desc: newDesc,
      });
      setNewTitle('');
      setNewImage('');
      setNewPrice('');
      setNewDesc('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Helper to pre-fill Update Form when Edit button is clicked
  const handleSelectForUpdate = (item) => {
    const selectedId = item.id || item._id || '' ;
    setUpdateId(selectedId);
    setUpdateTitle(item.title || item.name || '');
    setUpdateImage(item.image || '');
    setUpdatePrice(item.price || '');
    setUpdateDesc(item.desc || item.description || '');
  };

  // 2. PUT Function
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!updateId) {
      alert('please click "Edit" on a prodct card to load its ID!');
      return;
    }
    try {
      await axios.put(`https://mongo-db-production-8ab9.up.railway.app/products/${updateId}`, {
        name: updateTitle,
        imageUrl: updateImage,
        price: Number(updatePrice),
        desc: updateDesc,
      });
      setUpdateId('');
      setUpdateTitle('');
      setUpdateImage('');
      setUpdatePrice('');
      setUpdateDesc('');
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // 3. DELETE Function
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`https://mongo-db-production-8ab9.up.railway.app/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
}

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://mongo-db-production-8ab9.up.railway.app/products/')
      console.log('Fetched products:', response.data)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  return (
    <div className="main-container">
      <div className="forms-wrapper">
        {/* New Product Form */}
        <form className="form-card" onSubmit={handleAddProduct}>
          <h3>New Product</h3>
          <input
            type="text"
            placeholder="Product ID (Auto-filled)"
            value={updateId || ''}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <textarea
            placeholder="Description"
            rows="3"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>

        {/* Product Update Form */}
        <form className="form-card" onSubmit={handleUpdateProduct}>
          <h3>Product Update</h3>
          <input
            type="text"
            placeholder="Product ID (Auto-filled)"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Title"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={updateImage}
            onChange={(e) => setUpdateImage(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={updatePrice}
            onChange={(e) => setUpdatePrice(e.target.value)}
          />
          <textarea
            placeholder="Description"
            rows="3"
            value={updateDesc}
            onChange={(e) => setUpdateDesc(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Update Product</button>
        </form>
      </div>

      {/* PRODUCTS DISPLAY SECTION */}
      <div className="products-section">
        <h2>Fetched Products</h2>
        <div className="product-grid">
          {products.length === 0 ? (
            <p className="no-products">No products loaded yet.</p>
          ) : (
            products.map((item, index) => (
              <div key={index} className="product-card">
                {item.image && (
                  <div className="img-container">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <h4>{item.title || item.name|| 'Untitled Product'}</h4>
                {item.price && <p className="price">{item.price}</p>}
                <p className="desc">{item.desc || item.description}</p>
                <div className="card-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => handleSelectForUpdate(item)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleDeleteProduct(item.id || item._id)}>
                    Delete
                  </button>
                </div>
                <button type="button" className="btn btn-primary btn-full">Add to Cart</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
