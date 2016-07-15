from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Float, String, DateTime
from utils.utils import random_string


Base = declarative_base()


class Exchange(Base):
    __tablename__ = 'exchange'

    id = Column(String(9), default="TR%s" % random_string(7), primary_key=True)
    sell_currency = Column(String(3), nullable=False)
    sell_amount = Column(Float, nullable=False)
    buy_currency = Column(String(3), nullable=False)
    buy_amount = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    date_booked = Column(DateTime, default=datetime.utcnow(), nullable=False)

    def __repr__(self):
        aa = "<Exchange(id='%s', sell_currency='%s', "
        aa += "sell_amount='%s', buy_currency='%s', "
        aa += "buy_amount='%s', rate='%s', date_booked='%s')>"
        return aa % (
            self.id,
            self.sell_currency,
            self.sell_amount,
            self.buy_currency,
            self.buy_amount,
            self.rate,
            self.date_booked)
