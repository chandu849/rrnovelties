import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from '../../redux/slice/cartSlice'
import Card from '../card/Card'
import styles from './CheckoutSummary.module.scss'



const CheckoutSummary = () => {
    const cartItems = useSelector(selectCartItems);
    const cartTotalAmount = useSelector(selectCartTotalAmount);
    const cartTotalQuantity = useSelector(selectCartTotalQuantity)
  return (
    <div>
        <h3>CheckoutSummary</h3>
        <div>
            {cartItems.length === 0 ? (
                <>
                    <p>No items in your cart.</p>
                    <button className='--btn'>
                        <Link to="/#products">
                            Back To Shop
                        </Link>
                    </button>
                </>
            ) : (
                <div>
                    <p>
                        <b>{`Cart Item(s): ${cartTotalQuantity}`}</b>
                    </p>
                    <div className={styles.text}>
                        <h4>Subtotal:</h4>
                        <h3>{cartTotalAmount.toFixed(2)}</h3>
                    </div>
                    {cartItems.map((item, index) => {
                        const {id, name, price, cartQuantity} = item
                        return(
                            <Card cardClass={styles.card}>
                                <h4>Product: {name}</h4>
                                <h4>Quantity: {cartQuantity}</h4>
                                <h4>Unit price: {price}</h4>
                                <h4>Set price: {price * cartQuantity}</h4>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
  )
}

export default CheckoutSummary