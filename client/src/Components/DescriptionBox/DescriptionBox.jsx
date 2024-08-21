import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
          <div className="descriptionbox-nav-box">Description</div>
          <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>

        <div className="descriptionbox-description">
          <p>Welcome to ShopEase, your ultimate destination
             for a seamless and delightful online shopping experience. 
             Discover a wide range of products across various categories,
             from fashion and electronics to home essentials and beauty.
             With user-friendly navigation and secure transactions, ShopEase ensures 
             a hassle-free shopping journey. Join our community of satisfied customers and
              elevate your shopping game today!
          </p>
        </div>

    </div>
  )
}

export default DescriptionBox