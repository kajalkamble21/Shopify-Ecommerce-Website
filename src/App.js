import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false); // Track whether the cart is open or closed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = response.data;
        setProducts(data.categories);
        setFilteredProducts(data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const showProducts = (category) => {
    if (category.toLowerCase() === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(cat => cat.category_name.toLowerCase() === category.toLowerCase());
      setFilteredProducts(filtered);
    }
  }

  const searchProducts = (input) => {
    const filtered = products.filter(categoryData => {
      return categoryData.category_products.some(product => 
        product.vendor.toLowerCase().includes(input.toLowerCase()) ||
        product.title.toLowerCase().includes(input.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }

  const addToCart = (product) => {
    const newCartItems = [...cartItems, product];
    setCartItems(newCartItems);
    
    // Update total amount
    const newTotalAmount = totalAmount + parseFloat(product.price);
    setTotalAmount(Number(newTotalAmount.toFixed(2))); // Ensure total amount remains a number and is formatted to two decimal places
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Toggle the state of isCartOpen
  };

  return (
    <div>
      <h1>Our Products</h1>
      
      <div className="button-container">
        <div className="buttons">
          <button onClick={() => showProducts('Men')}>Mens</button>
          <button onClick={() => showProducts('Women')}>Womens</button>
          <button onClick={() => showProducts('Kids')}>Kids</button>
          {/* Cart Button */}
        <button className="cart-button" onClick={toggleCart}>Cart</button>
      </div>
        </div>

        

      {/* Search form */}
      <div className="search-container">
        <input type="text" id="search-input" placeholder="Search by brand or title" onChange={(e) => searchProducts(e.target.value)} />
      </div>

      <div className="products-container">
        {filteredProducts.map(categoryData => {
          return categoryData.category_products.map(product => (
            <div className="product" key={product.id}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>Price: {product.price}</p>
              <p>Vendor: {product.vendor}</p>
              {product.badge_text && <span className="badge">{product.badge_text}</span>}
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ));
        })}
      </div>

      {/* Cart */}
      {isCartOpen && (
        <div className="cart-container">
          <h2>Cart</h2>
          {cartItems.length > 0 ? (
            <div>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <p>{item.title}</p>
                  <p>Price: {item.price}</p>
                </div>
              ))}
              <p>Total Amount: ${totalAmount}</p>
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
