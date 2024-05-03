class Services {
    _apiBase = "http://dono-01.danbot.host:1480"

    getResources = async(url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getDishesOfDay = async (day) => {
        const res = await this.getResources(`${this._apiBase}/dishes/${day}`)
        return res
    }

    getUserData = async (token) => {
        const res = await this.getResources(`${this._apiBase}/udata/${token}`)
        return res
    }

    getDishesOfId = async (id) => {
        const res = await this.getResources(`${this._apiBase}/dishes/day/${id}`)
        return this._transformRes(res)
    }

    getUserOrders = async (token) => {
        const res = await this.getResources(`${this._apiBase}/orders/${token}`)
        return res
    }

    setUserToken = (jsonFirst) => {
        this.postData(`${this._apiBase}/reg`, jsonFirst).then(
            json => localStorage.setItem("token", json)
        )
    }

    sendUserOrders = (jsonFirst) => {
        this.postData(`${this._apiBase}/ordersend`, jsonFirst)
    }

    postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            body: data,
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "DELETE, POST, GET, OPTIONS",
                "Access-Control-Allow-Headers" : "Content-Type, Authorization, X-Requested-With"
              })
        });
    
        return await res.json();
    };

    _transformRes = (dish) => {
        return {
            id: dish.id,
            title : dish.title, 
            description : dish.description,
            price: dish.price,
            src: dish.src
        }
    }
}

export default Services