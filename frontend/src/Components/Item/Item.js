import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div className="item">
        <Link to={`/product/${props.id}`}><img onClick={window.scrollTo({ top: 0, behavior: 'smooth' })} src={props.image} alt="" /></Link>
        <p>{props.name}</p>
        <div className="item-prices">
            {props.price}
        </div>

    </div>
  )
}

export default Item