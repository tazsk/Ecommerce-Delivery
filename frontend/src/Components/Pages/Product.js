import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom'
import RelatedProducts from '../RelatedProducts/RelatedProducts'
import ProductDisplay from '../ProductDisplay/ProductDisplay'

export const Product = () => {

  const {products} = useContext(ShopContext);
  const {productId} = useParams();
  const product = products.find((e) => e._id === productId);
    
  return (
    <div>
      <ProductDisplay product={product}/>
      <RelatedProducts/>
    </div>
  )
}