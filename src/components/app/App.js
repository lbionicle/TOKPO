import { Component } from 'react';
import AppHeader from '../appHeader/AppHeader';
import AppBasket from '../appBasket/AppBasket';
import AppMenu from '../appMenu/AppMenu';
import AppOrders from '../appOrders/AppOrders';
import AppPersonalInfo from '../appPersonalInfo/AppPersonalInfo';

import './App.scss';
import Services from '../../services/Services';

class App extends Component {
  state = {
    day : localStorage.getItem("day") ? localStorage.getItem("day") : "Понедельник",
    basketIds : JSON.parse(localStorage.getItem("basket")) ? JSON.parse(localStorage.getItem("basket")) : [],
    basketTotal : JSON.parse(localStorage.getItem("basketTotal")) ? JSON.parse(localStorage.getItem("basketTotal")) : {},
    totalCost : JSON.parse(localStorage.getItem("basketTotal")) ? Object.values(JSON.parse(localStorage.getItem("basketTotal"))).map(({amount, price}) => amount * price).reduce((acc, curr) => acc + curr, 0) : 0,
    orders : [],
    token : localStorage.getItem("token") ? localStorage.getItem("token") : "",
    loadingOrdersHistory : true
  }

  services = new Services()

  componentDidMount() {
    if (!this.state.token) {
      this.services.postData(`${this.services._apiBase}/reg`, JSON.stringify({})).then(
        json => {
            this.setState({
              token : json
            })
            localStorage.setItem("token", json)
        }
      )
    }
  }
  onChangeBasket = (newBasketIds) => {
    this.setState(({
      basketIds: [...this.state.basketIds, newBasketIds]
    }))

    localStorage.setItem("basket", JSON.stringify([...this.state.basketIds, newBasketIds]))
  }

  onChangeToken = (token) => {
    this.setState({token})

    localStorage.setItem("token", token)
  }

  onChangeOrders = (orders, wipe=false) => {
    this.setState({orders})

    if (wipe) {
      this.onClearBasket([])
      this.onDeleteItemBasket({})

      this.onChangeLoadingHistory(true)
    } else {
      this.onChangeLoadingHistory(false)
    }

    localStorage.setItem("history", JSON.stringify(this.state.orders))
  }

  onChangeLoadingHistory = (loadingOrdersHistory) => {
    this.setState({loadingOrdersHistory})
  }

  onClearBasket = (basketIds) => {
    this.setState({basketIds})

    localStorage.setItem("basket", JSON.stringify(basketIds))
  }

  onChangeTotalCost = () => {
    this.setState({
      totalCost : JSON.parse(localStorage.getItem("basketTotal")) ? Object.values(JSON.parse(localStorage.getItem("basketTotal"))).map(({amount, price}) => amount * price).reduce((acc, curr) => acc + curr, 0) : 0
    })
  }

  onRemoveBasket = (removeBasket) => {
    this.setState(({
      basketIds: this.state.basketIds.filter(item => +item !== removeBasket)
    }))

    localStorage.setItem("basket", JSON.stringify(this.state.basketIds.filter(item => +item !== removeBasket)))
  }

  onChangeDay = (day) => {
    this.setState({day})
    localStorage.setItem("day", day)
  }

  onChangeInputBasket = ({id, amount, price}) => {

    const element = this.state.basketTotal
    element[id] = {amount: amount, price: price}

    this.setState({
      basketTotal: element
    })

    localStorage.setItem("basketTotal", JSON.stringify(element))
    this.onChangeTotalCost()
  }

  onDeleteItemBasket = (newBasketTotal) => {
    this.setState({
      basketTotal : newBasketTotal
    })

    localStorage.setItem("basketTotal", JSON.stringify(newBasketTotal))
    this.onChangeTotalCost()
  }

  setUnixToDay(unixTime, delivery = false, plusDay = 7) {
    let month = unixTime.getUTCMonth() + 1;
    let day = delivery ? unixTime.getUTCDate() + plusDay: unixTime.getUTCDate();
    let year = unixTime.getUTCFullYear();

    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`
  }

  render() {

    return (
      <div className='wrapper'>
        <AppHeader day={this.state.day} onChangeDay={this.onChangeDay}/>
        <AppMenu day={this.state.day} onChangeInputBasket={this.onChangeInputBasket} onChangeBasket={this.onChangeBasket} basketIds={this.state.basketIds}/>
        <AppBasket basketTotal={this.state.basketTotal} basketIds={this.state.basketIds} onDeleteItemBasket={this.onDeleteItemBasket} onChangeBasket={this.onChangeBasket} onRemoveBasket={this.onRemoveBasket} onChangeInputBasket={this.onChangeInputBasket}/>
        <AppPersonalInfo onChangeToken={this.onChangeToken} day={this.state.day} totalCost={this.state.totalCost} basketIds={this.state.basketIds} basketTotal={this.state.basketTotal} onClearBasket={this.onClearBasket} onDeleteItemBasket={this.onDeleteItemBasket} onChangeOrders={this.onChangeOrders} onChangeLoadingHistory={this.onChangeLoadingHistory}/>
        <AppOrders basketTotal={this.state.basketTotal} basketIds={this.state.basketIds} loadingOrdersHistory={this.state.loadingOrdersHistory} token={this.state.token} ordersProp={this.state.orders} setUnixToDay={this.setUnixToDay} onChangeLoadingHistory={this.onChangeLoadingHistory} onChangeOrders={this.onChangeOrders}/>
      </div>
    )
  }
}

export default App;
