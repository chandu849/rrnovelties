import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FILTER_BY_BRAND, FILTER_BY_CATEGORY, FILTER_BY_PRICE } from '../../../redux/slice/filterSlice'
import { selectMaxPrice, selectMinPrice, selectProducts } from '../../../redux/slice/productSlice'
import styles from './ProductFilter.module.scss'



const ProductFilter = () => {
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [price, setPrice] = useState(3000)
  const dispatch = useDispatch()

  const products = useSelector(selectProducts);
  const minPrice = useSelector(selectMinPrice);
  const maxPrice = useSelector(selectMaxPrice);


  useEffect(() => {
    dispatch(FILTER_BY_BRAND({products, brand}))
  },[products, brand, products])
  useEffect(() => {
    dispatch(FILTER_BY_PRICE({products, price}))
  },[products, price, products])

  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ]
  const allBrands = [
    "All",
    ...new Set(products.map((product) => product.brand))
  ]
  const filterProducts = (cat) => {
    setCategory(cat);
    dispatch(FILTER_BY_CATEGORY({ products, category: cat }))
  }

  const clearFilter = () => {
    setCategory("All");
    setBrand("All")
    setPrice(maxPrice)
  }

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button key={index} type="button"
            className={`${category}` === cat ? `${styles.active}` : null}
            onClick={() => filterProducts(cat)}>
            &#8250; {cat}
          </button>
          )
        })}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((brand, index) => {
            return(
              <option key={index} value={brand}>{brand}</option>
            )
          })}
        </select>
      </div>
      <h4>Price</h4>
      <p>{`$${price}`}</p>
      <div className={styles.price}>
        <input type="range" value={price} min={minPrice} max={maxPrice} onChange={(e) => setPrice(e.target.value)}/>
      </div>
      <br />
      <button className="--btn --btn-danger" onClick={clearFilter}>Clear Filter</button>
    </div>
  )
}

export default ProductFilter