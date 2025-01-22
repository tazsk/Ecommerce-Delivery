import React, { useContext } from 'react'
import Item from '../Item/Item'
import './RelatedProducts.css'
import { ShopContext } from '../Context/ShopContext'

const RelatedProducts = () => {

  const {products} = useContext(ShopContext)

  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr/>
        <div className='related-items'>
            {products.map((item, i) => {
                return <Item key={item._id} id={item._id} name={item.title} image={item.imageUrl} price={`$${item.price}`}/>
            })}
        </div>
    </div>
  )
}

export default RelatedProducts