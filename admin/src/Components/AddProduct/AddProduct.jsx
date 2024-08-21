import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from "../../assets/upload_area.svg"

const AddProduct = () => {
    // userState variable and function to show selected image in image box
    const [image, setImage] = useState(false);
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    // userState variable and function to show default product details
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
    })
    const chnageHandler = (e) => {
      setProductDetails({...productDetails, [e.target.name]: e.target.value})  
    }

    // Add button function
    const Add_product = async ()=>{
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append("product", image);

        // upload endpoint
        await fetch('http://localhost:4000/upload',{
            method: 'POST',
            headers: {
                Accept: 'applciation/json'
            },
            body:formData,
        }).then((resp)=> resp.json()).then((data)=>{responseData=data})
        
        if(responseData.success)
            {
                product.image = responseData.image_url;
                console.log(product);

                //send product in addproduct endpoint
                await fetch('http://localhost:4000/addproduct',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify(product),
                }).then((resp)=>resp.json()).then((data)=>{
                    data.success?console.log("Product Added"):console.log("Product Not Added.Failed!")

      //              data.success?alert("Product Added"):alert("Product Not Added.Failed!")

                })
            }
    }

  return (
    <div className='addproduct'>
        <div className="addproduct-itemfield">
            <p>Product title</p>
            <input value={productDetails.name} onChange={chnageHandler} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="addproduct-price">
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={chnageHandler} type="text" name="old_price" placeholder="Type here" />
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={chnageHandler} type="text" name="new_price" placeholder="Type here" />
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select value={productDetails.category} onChange={chnageHandler} name="category" className='add-product-selector'>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kid">Kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id='file-input' hidden />
        </div>
        <button  onClick={()=>{Add_product()}} className="addproduct-btn">Add</button>
    </div>
  )
}

export default AddProduct