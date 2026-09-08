import React, { useEffect, useState ,useRef} from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [products, setProducts] = useState([])
  const updateSectionRef = useRef(null);
  //update product PUT//
  const [updateId, setUpdateId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateImageUrl, setUpdateImageUrl] = useState('');
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
      await axios.post('https://mongo-db-production-8ab9.up.railway.app/products', {
        id : new Date().getTime().toString(),
        name: newTitle,
        imageUrl: newImage,
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
    setUpdateImageUrl(item.image || item.imageUrl || '');
    setUpdatePrice(item.price || '');
    setUpdateDesc(item.desc || item.description || '');
    if (updateSectionRef.current) {
      updateSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. PUT Function
  async function handleUpdateProduct(e) {
    e.preventDefault()
    if (!updateId) {
      alert('please click "Edit" on a prodct card to load its ID!')
      return
    }
    try {
      await axios.put(`https://mongo-db-production-8ab9.up.railway.app/products/${updateId}`, {
        name: updateTitle,
        imageUrl: updateImageUrl,
        price: Number(updatePrice),
        description: updateDesc,
      })
      setUpdateId('')
      setUpdateTitle('')
      setUpdateImageUrl('')
      setUpdatePrice('')
      setUpdateDesc('')
      fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

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
        <div classNam="update-section" ref={updateSectionRef}>
          <h2>Update Product</h2>
          </div>
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
            value={updateImageUrl}
            onChange={(e) => setUpdateImageUrl(e.target.value)}
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
              <div key={item.id || item._id || index} className="product-card">
                <div className="img-container">
                  <img
                   src={item.imageUrl || item.image} 
                  alt={item.title || item.name || 'Product Image'}
                  style={{ width: '100%', height: 'auto', maxHeight: '200px',objectFit: "contain",
                    borderRadius: '8px', marginBottom: '10px'
                   }} />
                </div>
              
{/* FORMAL LABELS & DETAILS */}
          <div className="product-details" style={{ marginTop: "12px", textAlign: "left" }}>
            <h3 style={{ textTransform: "capitalize", margin: "4px 0" }}>
              <strong>Title:</strong> {item.title || item.name || 'Untitled Product'}
            </h3>
            
            <p style={{ fontWeight: "bold", margin: "4px 0", color: "#2c3e50" }}>
              <strong>Price:</strong> ${item.price}
            </p>

            <p style={{ margin: "8px 0", color: "#555", textAlign: "center" }}>
              <strong>Description:</strong> {item.desc || item.description || 'No description provided.'}
            </p>
          </div>

          {/* CENTERED BUTTONS INCLUDING ADD TO CART */}
          <div className="card-actions" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginTop: "12px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => handleSelectForUpdate(item)}>
                Edit
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handleDeleteProduct(item.id || item._id)}>
                Delete
              </button>
            </div>
            <button type="button" className="btn btn-secondary">
              Add to Cart
            </button>
          </div>
        </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
