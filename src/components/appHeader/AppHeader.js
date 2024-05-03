import { Component } from "react"
import "./appHeader.scss"

class AppHeader extends Component{

    renderDropDown = () => {
        const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"]
        .map((elem, i) => {
            return (
                <li key={i} onClick={(e) => {this.props.onChangeDay(e.target.textContent)}} className="dropdown-item user-select-none">{elem}</li>
            )
        })

        return (
            <ul className="dropdown-menu col-12">
                {days}
            </ul>
        )
    }

    render () {
        const {day} = this.props
        const daysDropDown = this.renderDropDown()

        return (
            <div className="choicer col-12">
                <div className="btn-group d-flex flex-column col-12">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                        {day}
                    </button>
                    {daysDropDown}
                </div>
            </div>
        )  
    }
}

export default AppHeader