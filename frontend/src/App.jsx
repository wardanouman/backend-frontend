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

      <div style={{ maxWidth: "1200px", margin: "0 auto 30px auto", width: "100%" }}>
      
      {/* NEW PRODUCT CARD */}
      <div className="add-section"
       style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "#1a1a1a", textAlign: "left" }}>
          New Product</h2>
        <form onSubmit={handleAddProduct} 
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text"
           placeholder="Product ID (Auto-filled)" 
           disabled style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="text"
           placeholder="Title"
           value={newTitle} onChange={(e) => setNewTitle(e.target.value)} 
           style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Image URL"
           value={newImage} onChange={(e) => setNewImage(e.target.value)} 
           style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number"
           placeholder="Price"
            value={newPrice} onChange={(e) => setNewPrice(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <textarea placeholder="Description" rows="3" 
          value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
           style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <button type="submit" className="btn btn-secondary"
           style={{ padding: "12px", fontSize: "1rem", alignSelf: "flex-start", minWidth: "140px" }}>
            Add Product</button>
        </form>
      </div>
//
      {/* PRODUCT UPDATE CARD */}
      <div className="update-section" 
      ref={updateSectionRef} 
      style={{ backgroundColor: "#ffffff", padding: "24px",
       borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", 
          color: "#1a1a1a", textAlign: "left" }}>
            Product Update</h2>
        <form onSubmit={handleUpdateProduct}
       style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="text"
           placeholder="Product ID (Auto-filled)" 
           value={updateId} onChange={(e) => setUpdateId(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="text" placeholder="Title"
           value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="text"
           placeholder="Image URL" 
           value={updateImageUrl} onChange={(e) => setUpdateImageUrl(e.target.value)} 
           style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <input type="number"
           placeholder="Price"
            value={updatePrice} onChange={(e) => setUpdatePrice(e.target.value)} 
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <textarea placeholder="Description" 
          rows="3" value={updateDesc} onChange={(e) => setUpdateDesc(e.target.value)} 
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
          <button type="submit" className="btn btn-secondary" 
          style={{ padding: "12px", fontSize: "1rem", alignSelf: "flex-start", minWidth: "140px" }}>
            Update Product</button>
        </form>
      </div>

    </div>
      
         

      {/* PRODUCTS DISPLAY SECTION */}
      <div className="products-section">
        <h2>Fetched Products</h2>
        <div className="product-grid">
          {products.length === 0 ? (
            <p className="no-products">No products loaded yet.</p>
          ) : (

products.map((item, index) => (
  <div key={item._id || item.id || index} className="product-card">
    {/* IMAGE CONTAINER */}
    <div className="img-container">
      <img 
        src={item.imageUrl || item.image} 
        alt={item.title || item.name || 'Product Image'} 
        style={{ width: "100%", height: "auto", maxHeight: "200px", objectFit: "contain", borderRadius: "8px" }}
      />
    </div>

    {/* CENTERED INNER BOX FOR DETAILS */}
    <div 
      style={{
        backgroundColor: "#f8f9fa",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "16px",
        margin: "16px auto",
        textAlign: "center",
        maxWidth: "90%"
      }}
    >
      <h3 style={{ margin: "6px 0", fontSize: "1.1rem", color: "#1a1a1a", textTransform: "capitalize" }}>
        <strong>Title:</strong> {item.title || item.name || 'Untitled Product'}
      </h3>
      <h3 style={{ margin: "6px 0", fontSize: "1.1rem", color: "#1a1a1a" }}>
        <strong>Price:</strong> ${item.price}
      </h3>
      <h3 style={{ margin: "6px 0", fontSize: "1.1rem", color: "#1a1a1a", textTransform: "capitalize" }}>
        <strong>Description:</strong> {item.desc || item.description || 'No description provided.'}
      </h3>
    </div>

    {/* BUTTONS IN A SINGLE ROW */}
    <div 
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        marginTop: "16px",
        flexWrap: "wrap"
      }}
    >
      <button 
        type="button" 
        className="btn btn-secondary" 
        style={{ padding: "10px 20px", fontSize: "1rem", minWidth: "100px" }}
        onClick={() => handleSelectForUpdate(item)}
      >
        Edit
      </button>
      <button 
        type="button" 
        className="btn btn-secondary" 
        style={{ padding: "10px 20px", fontSize: "1rem", minWidth: "100px" }}
        onClick={() => handleDeleteProduct(item._id || item.id)}
      >
        Delete
      </button>
      <button 
        type="button" 
        className="btn btn-secondary" 
        style={{ padding: "10px 20px", fontSize: "1rem", minWidth: "120px" }}
      >
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
