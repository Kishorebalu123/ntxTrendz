// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarItemDetails} = props
  const {imageUrl, title, brand, price, rating} = similarItemDetails
  return (
    <div>
      <img src={imageUrl} alt={`similar product ${title}`} />
      <h1>{title}</h1>
      <p>{brand}</p>
      <div>
        <p>{price}</p>
        <p>{rating}</p>
      </div>
    </div>
  )
}
export default SimilarProductItem
