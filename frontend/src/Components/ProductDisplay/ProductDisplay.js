import React, { useContext } from 'react'
import '../ProductDisplay/ProductDisplay.css'
import { ShopContext } from '../Context/ShopContext';

const ProductDisplay = (props) => {

  const {product} = props;
  const {addToCart} = useContext(ShopContext);
  

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className='product_display'>
      <h1>{product.title}</h1>
      <img src={product.imageUrl} alt = ""/>
      <p>{product.description}</p>
      <div className='price-star'>
        <span>{`$${product.price}`}</span>
        <span>{`Review: ${product.rating} star`}</span>
      </div>
      <br/>
      <button type='button' onClick={() => {addToCart(product._id)}}>Add to Cart</button>
    </div>
  )
}

export default ProductDisplay;