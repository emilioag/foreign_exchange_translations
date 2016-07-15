from datetime import datetime
from utils.db import PostgreSQL
from exchange import models
from utils.utils import random_string
import psycopg2

session = PostgreSQL('test').session


class Exchange:
    def __init__(
            self, rate, sell_currency, buy_amount, buy_currency, sell_amount):
        self.id = "TR%s" % random_string(7)
        self.sell_currency = sell_currency
        self.sell_amount = sell_amount
        self.buy_currency = buy_currency
        self.buy_amount = buy_amount
        self.rate = rate
        self.date_booked = datetime.utcnow()

    def save(self):
        try:
            ex = models.Exchange(**self.__dict__)
            session.add(ex)
        except psycopg2.IntegrityError:
            session.rollback()
            self.id = "TR%s" % random_string(7)
            self.save()
        else:
            session.commit()
