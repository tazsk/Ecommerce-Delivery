import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Item/Item'
import '../Pages/css/ShopCategory.css'

export const ShopCategory = (props) => {

  const {products} = useContext(ShopContext)

  return (
    <div className='shopcategory-products'>
      {products.map((item, i)=> {
        if (props.category===item.category) {
          return <Item key={item._id} id={item._id} name={item.title} image={item.imageUrl} price={`$${item.price}`}/>
        }
        else {
          return null
        }
      })}
    </div>
  )
}