from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField

class ProductInputForm(FlaskForm):
    productName: StringField('productName')
    price: StringField('price')
    productBarcode: StringField('productInputBarcode')
    expiryDate: StringField('expiryDate')
    manufactureDate: StringField('manufactureDate')
    submit: SubmitField('submitInputProduct')