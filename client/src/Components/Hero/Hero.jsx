import React from 'react'
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className="hero">
        <div className="hero-left">
            <h2>Checkout New Arrivals</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>Welcome</p>
                </div>
                <p>to</p>
                <p>shopifyplus</p>
            </div>
            <div className="hero-latest-button">
                <div>Latest Collection</div>
                <img src={arrow_icon} alt="" />
            </div>
        </div>
        <div className="hero-right">
            <img src={hero_image} height="700" width="700" alt="" />
        </div>
    </div>
  )
}

export default Hero