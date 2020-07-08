from app import db, app

class Ticker(db.Model):
    __tablename__ = 'ticker_data'
    # id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(10), nullable=False)
    date = db.Column(db.Date, nullable=False)
    open = db.Column(db.Float(precision=2))
    high = db.Column(db.Float(precision=2))
    low = db.Column(db.Float(precision=2))
    close = db.Column(db.Float(precision=2))
    adj_close = db.Column(db.Float(precision=2))
    volume = db.Column(db.Float(precision=2))

    def __repr__(self):
        return f"Ticker('{self.ticker}')"
