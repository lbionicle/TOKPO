import { Component } from "react"

import Services from "../../services/Services"
import Spinner from "../spinner/Spinner"

import "./appOrders.scss"

class AppOrders extends Component{
    state = {
        modalElems : [],
        choicedIdElem : -1,
        loading : true
    }

    _mounted = false

    services = new Services()

    componentDidMount() {
        this.services.getUserOrders(this.props.token)
        .then(orders => {
            this.props.onChangeOrders(orders)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ordersProp !== prevProps.ordersProp && this.props.basketIds !== prevProps.basketIds && this.props.basketTotal !== prevProps.basketTotal) {
            setTimeout(() => this.props.onChangeLoadingHistory(false), 500);
        }
        else if (this.state.choicedIdElem !== prevState.choicedIdElem) {
            if (!this.state.loading) {
                this.setState({
                    loading : true
                })
            }
            Promise.all(Object.keys(this.props.ordersProp[+this.state.choicedIdElem].orders).map(id => this.services.getDishesOfId(+id)))
            .then(modalElems => {
                this.setState({
                    modalElems : modalElems,
                    loading : false
                })
            });
        }
    }

    onChangeChoicedElem = (choicedIdElem) => {
        this.setState({choicedIdElem})
    }

    renderOrders = (arr) => {

        const ordersProp = arr.map(({firstname, lastname, address, comment, time, orders}, i) => {

            return (
                <div onClick={(e) => {this.onChangeChoicedElem(i)}} key={i} className="btn-group col-12 mb-4">
                    <div className="dropdown-toggle col-12 d-flex align-items-center text-left" id="defaultDropdown" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <h5 className="col-1 text-wrap ps-1 pe-1">{i + 1}</h5>
                        <h5 className="col-1 text-wrap text-left ps-1 pe-1">{lastname}</h5>
                        <h5 className="col-1 text-wrap text-left ps-1 pe-1">{firstname}</h5>
                        <h5 className="col-3 text-wrap text-left ps-1 pe-3">{address}</h5>
                        <h5 className="col-2 text-wrap text-left ps-1 pe-2">{comment ? comment : "Не указано"}</h5>
                        <h5 className="col-1 text-wrap text-left ps-1 pe-1">{this.props.setUnixToDay(new Date(time))}</h5>
                        <h5 className="col-2 text-wrap text-center ps-1 pe-2">{Object.values(orders).map(item => item.amount * item.price).reduce((acc, curr) => acc + curr, 0) + " BYN"}</h5>
                        <div className="col-1 text-center d-flex justify-content-center align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <>
            <div className="basket-header d-flex col-12 text-left mb-2">
                <h5 className="col-1">Заказ №</h5>
                <h5 className="col-1 text-left">Фамилия</h5>
                <h5 className="col-1 text-left">Имя</h5>
                <h5 className="col-3 text-center">Адрес</h5>
                <h5 className="col-2 text-left">Комментарий</h5>
                <h5 className="col-1 text-left">Дата заказа</h5>
                <h5 className="col-2 text-end">Итоговая стоимость</h5>
            </div>
            {ordersProp.reverse()}
            </>
        )
    }

    renderOrdersOfModal = (arr) => {
        const {ordersProp} = this.props
        const {choicedIdElem} = this.state

        const dayOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]

        const ordersHistory = arr.map(({description, id, price, src, title}) => {

            const order = ordersProp[choicedIdElem]?.orders[id];
            const amount = order?.amount;

            return (
                <div id={+id} key={+id} className="order-item col-12 d-flex mb-2 align-items-top justify-content-left text-left">
                <div className="order-item-info d-flex col-5">
                    <img style={{minWidth: 80, height: 80}} src={src} alt="" />
                    <div className="item-info-text ms-2">
                        <h6 className="text-wrap ps-1 pe-5">{title}</h6>
                        <p className="fs-6 text-wrap ps-1 pe-5">{description}</p>
                    </div>
                </div>
                <div className="order-item-amount d-flex align-items-top col-2 mt-2">
                    <h6 className="text-wrap ps-1 pe-2">{amount}</h6>
                </div>
                <div className="order-item-day d-flex align-items-top col-2 mt-2">
                    <h6 className="text-wrap ps-1 pe-2">{dayOfWeek[+id[0] - 1]}</h6>
                </div>
                <div className="order-item-totalCost col-3 d-flex align-items-top mt-2">
                    <h6 className="text-wrap ps-1 pe-2"><span>{amount * +price}</span> BYN</h6>
                </div>
            </div>
            )
        })

        return ordersHistory
    }

    render() {
        const {ordersProp, loadingOrdersHistory} = this.props
        const {modalElems, loading} = this.state

        const headerOrderList = loadingOrdersHistory ? <Spinner/> : ordersProp.length === 0 ? <EmptyOrderList/> : this.renderOrders(ordersProp)
        const ordersHistory = loading ? <Spinner/> : this.renderOrdersOfModal(modalElems)

        return (
            <>
            <div className="orders-history py-4">
                <h2 className="d-block text-center mb-4 col-12">ИСТОРИЯ ЗАКАЗОВ</h2>
                {headerOrderList}
            </div>

            <div class="modal fade modal-xl" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                <div class="modal-header">
                    <div className="order-header d-flex col-12 text-left mb-2">
                        <h6 className="col-5">Информация о товаре</h6>
                        <h6 className="col-2">Количество</h6>
                        <h6 className="col-2">День недели</h6>
                        <h6 className="col-3">Итоговая стоимость</h6>
                    </div> 
                </div>
                <div class="modal-body">
                    {ordersHistory}
                </div>
                </div>
            </div>
            </div>
            </>
        )
    }
}

const EmptyOrderList = () => {
    return (
        <h3 className="text-center">История заказов пуста!</h3>
    )
}


export default AppOrders