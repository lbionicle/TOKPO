import { Component } from "react"

import Services from "../../services/Services"
import Spinner from "../spinner/Spinner"

import "./appBasket.scss"

class AppBasket extends Component{
    state = {
        basketList : localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket")) : [],
        loading : true
    }

    _mounted = false

    services = new Services()

    componentDidMount() {
        this._mounted = true
        this.onRequest();
    }

    componentDidUpdate(prevProps) {
        if(this.props.basketIds !== prevProps.basketIds) {
            this._mounted = true
            this.onRequest();
        }
    }

    componentWillUnmount() {
        this._mounted = false
    }

    onRequest = () => {
        if (!this.state.loading) {
            this.setState({
                loading : true
            })
        }
        Promise.all(this.props.basketIds.map(id => this.services.getDishesOfId(id)))
            .then(newDishes => {
                if (this._mounted) {
                    this.setState({
                        basketList: [...newDishes],
                        loading : false
                    });
                }
            });
    }

    onChangeCounter = (e) => {
        let count = +e.target.parentElement.querySelector("input").value
        const parent =  e.target.parentElement.parentElement

        if (e.target.id === "minusCount" || e.target.id === "addCount") {
            e.target.id === "addCount" ? count = count + 1 : count = count - 1 ? count - 1 : count
            e.target.parentElement.querySelector("input").value = count
        }

        parent.querySelector("h4 > span").textContent = +parent.querySelector("h4 > span").dataset["price"] * count

        this.props.onChangeInputBasket({id : +parent.id, amount : +count, price : +parent.querySelector("h4 > span").dataset["price"]})
    }

    onChangeCount = (e) => {
        if (+e.target.value < 0) {
            e.target.value = Math.abs(+e.target.value)
        } else if (+e.target.value === 0) {
            e.target.value = 1
        }

        this.onChangeCounter(e)
    }

    deleteBasketItem = (e) => {
        const tagName = e.target.tagName.toLowerCase()
        const deleteItemBasket = (parentId) => {
            const newBasketTotal = this.props.basketTotal

            delete newBasketTotal[parentId]
            this.props.onRemoveBasket(parentId)
            this.props.onDeleteItemBasket(newBasketTotal)
        }

        if (tagName === "svg") {
            deleteItemBasket(+e.target.parentElement.parentElement.parentElement.id)
        } else if (tagName === "button") {
            deleteItemBasket(+e.target.parentElement.parentElement.id)
        } else if (tagName === "path"){
            deleteItemBasket(+e.target.parentElement.parentElement.parentElement.parentElement.id)
        }
    }

    renderbasketIds = (arr) => {
        const items = arr.map(({id, title, description, price, src}) => {

            const amount = this.props.basketTotal[`${id}`] ? this.props.basketTotal[`${id}`]["amount"] : 0

            return (
            <div id={id} key={id} className="basket-item col-12 d-flex mb-2">
                <div className="basket-item-info d-flex col-4">
                    <img style={{width: 100, height: 100}} src={src} alt="" />
                    <div className="item-info-text ms-2">
                        <h6>{title}</h6>
                        <p>{description}</p>
                    </div>
                </div>
                <div className="basket-item-counter d-flex justify-content-center col-4">
                    <button id="minusCount" onClick={(e) => {this.onChangeCounter(e)}} type="button" className="btn btn-primary align-self-center">-</button>
                    <input onChange={(e) => {this.onChangeCount(e)}} type="number" className="form-control align-self-center w-25 mx-2 text-center" defaultValue={amount}/>
                    <button id="addCount" onClick={(e) => {this.onChangeCounter(e)}} type="button" className="btn btn-primary align-self-center">+</button>
                </div>
                <div className="basket-item-totalCost col-3 d-flex text-center align-items-center justify-content-center">
                    <h4><span data-price={price}>{price * amount}</span> BYN</h4>
                </div>
                <div className="basket-item-delete col-1 d-flex align-items-center justify-content-center">
                    <button id="deleteBasketItem" onClick={(e) => {this.deleteBasketItem(e)}} className="btn-danger btn item-delete-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#f5f5f5" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
            )
        })

        return (
            <>
            <div className="basket-header d-flex col-12 text-left mb-2">
                <h5 className="col-4">Информация о товаре</h5>
                <h5 className="col-4 text-center">Количество</h5>
                <h5 className="col-3 text-center">Итоговая стоимость</h5>
            </div>
            {items}
            </>
            
        )
    }
    
    render() {
        const {basketList, loading} = this.state

        const loadingBasket = loading ? <Spinner/> : basketList.length === 0 ? <EmptyBasket/> : this.renderbasketIds(basketList)

        return (
        <div className="basket py-4">
            <h2 className="d-block text-center mb-4 col-12">КОРЗИНА</h2>
            <div className="basket-history col-12">
                {loadingBasket}
            </div>
        </div>
        )
    }
}

const EmptyBasket = () => {
    return (
        <>
        <h3 className="text-center">Корзина пуста!</h3>
        </>
    )
}

export default AppBasket