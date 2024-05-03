from random import random
import uvicorn, string
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import json, uuid,sqlitedict

from starlette.middleware.cors import CORSMiddleware

app = FastAPI()
db=sqlitedict.SqliteDict("data.db",autocommit=True)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Order(BaseModel):
    token: str
    dishes: dict
class User(BaseModel):
    Orders: list = []

@app.post('/reg')
def reg(d:User):
    while True:
        token = str(uuid.uuid4())
        if db.get(token):
            pass
        else:
            break
    print(d.json())
    db[token] = json.loads(d.json())
    return token

@app.get('/orders/{token}')
def get_orders(token:str):
    if db.get(token):
        return db[token]["Orders"]
    else:
        raise HTTPException(status_code=404, detail='Аккаунт не найден')

@app.post('/ordersend')
def get_order_send(d:Order):
    if db.get(d.token):
        p = db[d.token]
        p["Orders"].append(d.dishes)
        db[d.token] = p
        raise HTTPException(status_code=200, detail='Ok!')
    else:
        raise HTTPException(status_code=404, detail='Аккаунт не найден')

@app.get('/udata/{token}')
def get_user_data(token:str):
    return db.get(token)

@app.get('/dishes/{day}')
def get_dishes_by_day(day: str):
    with open('server.json', encoding="utf-8") as file:
        data = json.load(file)
    dishes = data['Dishes'].get(day)
    print(data['Dishes'], day)
    if dishes:
        return dishes
    else:
        raise HTTPException(status_code=404, detail='Нет блюд для данного дня')

@app.get('/dishes/day/{id}')
def get_dishes_by_day(id: str):
    with open('server.json', encoding="utf-8") as file:
        data = json.load(file)

    for day, dishes in data["Dishes"].items():
        for dish in dishes:
            if dish["id"] == id:
                return dish

    raise HTTPException(status_code=404, detail="Блюдо не найдено")

if __name__ == '__main__':
    uvicorn.run("main:app",port=1480,host="0.0.0.0")