import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    count: 1,
    similarProducts: [],
    productDetails: [],
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      //  console.log(data)
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      //  console.log(updatedData)
      const updateSimilarProducts = data.similar_products.map(each => ({
        availability: each.availability,
        brand: each.brand,
        description: each.description,
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        style: each.style,
        title: each.title,
        totalReviews: each.total_reviews,
      }))
      //  console.log(updateSimilarProducts)
      this.setState({
        productDetails: updatedData,
        similarProducts: updateSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  clickMinusBtn = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  clickPlusBtn = () => {
    this.setState(prev => ({count: prev.count + 1}))
  }

  renderProductItemDetails = () => {
    const {productDetails, similarProducts, count} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      description,
      totalReviews,
      rating,
      availability,
    } = productDetails
    return (
      <div>
        <div className="bg-card">
          <img className="image" src={imageUrl} alt="product" />
          <div className="bg-card1">
            <h1>{title}</h1>
            <p>{price}</p>
            <div className="reviews">
              <p className="rating">
                {rating}

                <span>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                    alt="star"
                    className="star"
                  />
                </span>
              </p>

              <p> {totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Avaliable: {availability}</p>
            <p>Brand: {brand}</p>
            <hr className="hr-line" />
            <div className="plus-minus-bg">
              <button
                data-testid="minus"
                onClick={this.clickMinusBtn}
                type="button"
              >
                <BsDashSquare />
              </button>
              <p>{count}</p>
              <button
                data-testid="plus"
                onClick={this.clickPlusBtn}
                type="button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>

        <div>
          <h1>Similar Products</h1>
          <ul>
            {similarProducts.map(eachItem => (
              <SimilarProductItem
                similarItemDetails={eachItem}
                key={eachItem.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderProductView()}</div>
      </>
    )
  }
}
export default ProductItemDetails
