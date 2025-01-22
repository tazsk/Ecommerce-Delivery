import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './css/Orders.css';

const Orders = () => {
  const { orders } = useContext(ShopContext);

  return (
    <div className="orders">
      <h1>Order History</h1>
      {orders.map((order, index) => (
        <div key={index} className="order-receipt">
          <h3>Order #{`${order._id}`}</h3>
          <div className='date-time'>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Time: {new Date(order.date).toLocaleTimeString()}</p>
          </div>
          <div className='order-items'>
          {order.items.map((item) => (
            <div key={item._id}>
              <img src={`${process.env.REACT_APP_AWS_CLOUDFRONT_URL}${item.image}`} alt={item.title} style={{ width: '50px', height: '50px' }} />
              <p>{item.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${item.total}</p>
            </div>
          ))}
          </div>
          <h3>Total: ${order.total}</h3>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Orders;
