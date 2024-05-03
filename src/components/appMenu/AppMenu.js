import { Component } from "react"

import Spinner from "../spinner/Spinner"
import Services from "../../services/Services"

import "./appMenu.scss"

class AppMenu extends Component{
    state = {
        menu: [],
        loading: false
    }
    _isMounted = false

    services = new Services()

    componentDidMount() {
        this._isMounted = true
        this.updateMenu()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.day !== prevProps.day && this._isMounted) {
            this.updateMenu();
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    updateMenu = () => {
        this.onMenuLoading();
        this.services.getDishesOfDay(this.props.day)
        .then(this.onLoaded)
;
    }

    onMenuLoading = () => {
        this.setState({
            loading: true
        })
    }

    onLoaded = (menu) => {
        if (this._isMounted) {
            this.setState(({
                menu,
                loading: false
            }))
        }
    }
    

    addBasketId = (e) => {
        const idElement = e.target.parentElement.parentElement;
        const priceElement = e.target.parentElement.querySelector("div > h2 > span");
    
        if (idElement && priceElement) {
            const id = +idElement.id;
            const price = +priceElement.textContent;
    
            if (!isNaN(id) && !isNaN(price)) {
                this.props.onChangeBasket(id);
                this.props.onChangeInputBasket({ id, amount: 1, price });
            } else {
                console.error('ID or price is not a number');
            }
        } else {
            console.error('ID or price element does not exist');
        }
    }
    

    renderDishes = (arr) => {
        const items = arr.map(({title, description, id, price, src}) => {
            return (
                <div id={id} key={id} className="card col-3">
                    <img src={src} className="card-img-top w-100" alt="..."/>
                    <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text m-0">{description}</p>
                            <h2 className="my-2"><span>{price}</span> BYN</h2>
                        </div>
                        <button onClick={(e) => {this.addBasketId(e)}} className="btn btn-primary mt-2" disabled={this.props.basketIds.includes(+id)}>{this.props.basketIds.includes(+id) ? "Добавлено в корзину" : "Добавить в заказ"}</button>
                    </div>
                </div>
            )
        })

        return items
    }

    render() {
        const {loading, menu} = this.state

        const spinnerMessage = loading ? <Spinner/> : null
        const viewMessage = !(loading || !menu) ? this.renderDishes(menu) : null
        
        return (
            <>
            <h2 className="d-block text-center my-4 col-12">МЕНЮ</h2>
            <div className="menu w-100 mt-2 d-flex justify-content-between">
                {spinnerMessage}
                {viewMessage}
            </div>
            </>
        )
    }
}

export default AppMenu