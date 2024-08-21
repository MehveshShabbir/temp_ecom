import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import axios from 'axios';


const ListProduct = () => {

  //useState and function to Fetch Data using API
  const [allproducts, setAllProducts] =useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  },[])

// remove Product
const remove_product = async(id) => {
  await fetch('http://localhost:4000/removeproduct', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({id:id})
  })
  await fetchInfo();
}

const deleteAllProducts = async () => {
  try {
      const response = await axios.delete('http://localhost:4000/removeallproducts');
      if (response.data.success) {
          setProducts([]);
          alert('All products have been removed');
      } else {
          alert('Failed to remove all products');
      }
  } catch (error) {
      console.error('Error removing all products:', error);
      alert('Error removing all products');
  }
};

  return (
    <div className='listproduct'>
      <h1>ALL Products List</h1>
      <button onClick={deleteAllProducts}>Delete all</button>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index)=>{
          return(
          <>
            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} className="listproduct-remove-icon" src={cross_icon} />           
            </div>
            <hr />
          </>
        )})}
      </div>
    </div>
  )
}

export default ListProduct