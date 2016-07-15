#!/usr/bin/env python
import bottle
from exchange.controllers import Exchange
from exchange import models
from bottle import request, response
from utils.db import PostgreSQL
import json


def setup_routing(app):
    app.route('/api/exchange', ['POST'], add_new_entry)
    app.route('/api/exchange', ['GET'], get_all_entries)
    # app.route('/api/sensors', ['GET'], allSensorIds)
    # app.route('/api/signals', ['GET'], allSignalIds)
    # app.route('/api/uploadCSV', ['POST'], uploadFile)


response.content_type = 'application/json'
response.headers['Access-Control-Allow-Origin'] = '*'
response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
response.headers['Access-Control-Allow-Headers'] =\
    'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


def add_new_entry():
    # curl \
    # -H "Content-Type: application/json" \
    # -X POST \
    # -d '{
    #       "sell_currency": "EUR",
    #       "sell_amount": 1000,
    #       "buy_currency": "USD",
    #       "buy_amount": 1000,
    #       "rate": 0.14}' \
    # http://0.0.0.0:8090/api/exchange
    if request.content_type == 'application/json':
        ex = Exchange(**{
            'sell_currency': request.json.get('sell_currency', ''),
            'sell_amount': request.json.get('sell_amount', ''),
            'buy_currency': request.json.get('buy_currency', ''),
            'buy_amount': request.json.get('buy_amount', ''),
            'rate': request.json.get('rate', '')
        })
        ex.save()


def get_all_entries():
    entries = []
    session = PostgreSQL('test').session
    for ex in session.query(models.Exchange).all():
        entries.append({
            'sell_currency': ex.sell_currency,
            'sell_amount': ex.sell_amount,
            'buy_currency': ex.buy_currency,
            'buy_amount': ex.buy_amount,
            'rate': ex.rate
        })
    return json.dumps(entries)


if __name__ == "__main__":
    app = bottle.Bottle()
    setup_routing(app)
    app.run(host='0.0.0.0', port=8090)
else:
    application = bottle.default_app()
    setup_routing(application)
