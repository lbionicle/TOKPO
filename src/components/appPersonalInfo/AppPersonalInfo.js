import { Component } from "react"

import Services from "../../services/Services"

import "./appPersonalInfo.scss"

class AppPersonalInfo extends Component{
    state = {
        checkout: false
    }

    services = new Services()

    onChangeInput = (e) => {
        if (e.target.value) {
            e.target.classList.add("is-valid")
            e.target.classList.remove("is-invalid")
        } else {
            e.target.classList.add("is-invalid")
            e.target.classList.remove("is-valid")
        }
        
        this.checkValidity()
    }

    checkValidity = () => {
        const firstNameInput = document.querySelector("#firstname")
        const lastNameInput = document.querySelector("#lastname")
        const addressInput = document.querySelector("#address")

        if (this.props.basketIds.length && firstNameInput.value && lastNameInput.value && addressInput.value) {
            this.setState({
                checkout: true
            })
        } else {
            this.setState({
                checkout: false
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.basketIds !== prevProps.basketIds) {
            this.checkValidity()
        }
    }

    onHandleForm = (e) => {

        e.preventDefault()

        const token = localStorage.getItem("token")
        const form = document.querySelector("form")

        const formData = new FormData(form);
        const {firstname, lastname, comment, address} = Object.fromEntries(formData.entries())

        if (!localStorage.getItem("token")) {
            Promise.resolve()
            .then(() => {
                this.services.postData(`${this.services._apiBase}/reg`, {}).then(
                    json => {
                        this.props.onChangeToken(json)
                    }
                )
            })
            .then(() => this.services.postData(`${this.services._apiBase}/ordersend`, JSON.stringify({"token" : token, "dishes" : {"orders" : JSON.parse(localStorage.getItem("basketTotal")), "time" : Date.now(), "firstname" : firstname, "lastname" : lastname, "address" : address, "comment" : comment}})))
            .then(() => {
                this.services.getUserOrders(token)
                .then(orders => {
                    this.props.onChangeOrders(orders)
                })
            })
        } else {
            Promise.resolve()
            .then(() => this.services.postData(`${this.services._apiBase}/ordersend`, JSON.stringify({"token" : token, "dishes" : {"orders" : JSON.parse(localStorage.getItem("basketTotal")), "time" : Date.now(), "firstname" : firstname, "lastname" : lastname, "address" : address, "comment" : comment}})))
            .then(() => {
                this.services.getUserOrders(token)
                .then(orders => {
                    this.props.onChangeOrders(orders, true)
                })
            })
        }

        ["#firstname", "#lastname", "#address"].forEach(item => {
            document.querySelector(item).value = ""
            document.querySelector(item).classList.remove("is-invalid")
            document.querySelector(item).classList.remove("is-valid")
        })

        form.reset()
    }

    render() {
        const {checkout} = this.state

        return (
            <div className="client-contact-info py-4">
            <h2 className="d-block text-center mb-4 col-12">ОФОРМЛЕНИЕ ЗАКАЗА</h2>
                <form onSubmit={this.onHandleForm} className="userOrderInfo" action="#" noValidate="novalidate">
                <div className="mb-3">
                        <label htmlFor="lastname" className="form-label">Фамилия <span className="text-danger">*</span></label>
                        <input name="lastname" onChange={(e) => {this.onChangeInput(e)}} type="text" className="form-control" id="lastname" placeholder="Иванов"/>
                        <div className="valid-feedback">
                            Корректно!
                        </div>
                        <div className="invalid-feedback">
                            Введите фамилия!
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">Имя <span className="text-danger">*</span></label>
                        <input name="firstname" onChange={(e) => {this.onChangeInput(e)}} type="text" className="form-control" id="firstname" placeholder="Иван"/>
                        <div className="valid-feedback">
                            Корректно!
                        </div>
                        <div className="invalid-feedback">
                            Введите имя!
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Адрес доставки <span className="text-danger">*</span></label>
                        <input name="address" onChange={(e) => {this.onChangeInput(e)}} type="text" className="form-control" id="address" placeholder="г. Минск, ул. Петруся Бровки, 4" required/>
                        <div className="valid-feedback">
                            Корректно!
                        </div>
                        <div className="invalid-feedback">
                            Введите адрес!
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="comment" className="form-label">Комментарий</label>
                        <textarea name="comment" className="form-control" id="comment" rows="3"></textarea>
                    </div>
                    <div className="mb-3 col-12 d-flex align-items-end">
                        <div id="totalCost" className="col-9 fs-3 fw-semibold">Итоговая стоимость: <span>{this.props.totalCost}</span></div>
                        <button type="submit" className={`btn btn-success col-3 ${checkout ? "" : "disabled"}`}>Оформить</button>
                    </div>
                </form>   
            </div>
        )
    }
}

export default AppPersonalInfo