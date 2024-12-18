import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Stock.css'
const Stock = () => {
    const token = localStorage.getItem("jwt_token");
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const products = store.stock;
    const [cartQuantities, setCartQuantities] = useState({});
    useEffect(() => {
        if (!token) {
            navigate("/")
            return;
        }
        const stock = async () => {
            await actions.getStock();
        }
        stock();
    }, [token, navigate])
    useEffect(() => {
        if (products && products.length > 0) {
            console.log(products);
            setIsLoading(false)
        }
    }, [products])
    const handleItemUpdate = (e, product_id) => {
        e.stopPropagation();
        const newQuantity = parseInt(e.target.value, 10);//Transformamos quantity a un numero entero.
        if (!isNaN(newQuantity) && newQuantity > 0) { // Verificar que el valor sea un número válido y mayor que 0
            setCartQuantities(prevQuantities => ({
                ...prevQuantities, [product_id]: newQuantity
            }));
        };
    };
    const handleAddToCart = async (product_id) => {
        const newQuantity = cartQuantities[product_id] || 1;
        const data = { product_id, quantity: newQuantity };
        console.log('Sending data:', data);
        await actions.addItemCart(data);
        await actions.getItemCart();
        //window.location.reload();
    };
    const handleDetails = (product_id) => {
        navigate(`/details/${product_id}`)
    };
    return (
        <div className='container stock'>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                products.map((product, index) => (
                    <div className="card stock" key={index}>
                        <h5 className="card-title stock">Name: {product.name}</h5>
                        <p className="card-text stock">Type: {product.stocktype}</p>
                        <div className='container-img stock'>
                            <img src={product.image} className="card-img-top stock" alt={product.name} />
                        </div>
                        <div className="card-body stock">
                            <div className='quantityStock'>
                                <p className="card-text stock"> Stock: {product.stock}</p>
                                <div className='lots'>
                                    <label htmlFor="lot">Quantity to add:</label>
                                    <input
                                        id='lot'
                                        type='number'
                                        value={cartQuantities[product.id] || 1}
                                        onChange={(e) => handleItemUpdate(e, product.id)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <p className="card-text stock" style={{ "marginTop": 10 }}> Price per unit: ${product.price}</p>
                            </div>
                            <div className='addAndDetailsButtons'>
                                <button className="btn stock" onClick={() => handleAddToCart(product.id)}>
                                    <i className="fa-solid fa-cart-plus"></i>
                                </button>
                                <button className="btn stock" onClick={() => handleDetails(product.id)}>
                                    <p>Details</p>
                                    <i className="fa-solid fa-info"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
export default Stock;