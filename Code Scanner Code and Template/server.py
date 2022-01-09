# -*- coding: utf-8 -*-
"""
Created on Tue Oct  10 13:56:55 2022

@author: Ratnadeep Das Choudhury
"""

from flask import Flask, render_template
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import jsonify, request

import cv2 as cv
import numpy as np
from pyzbar.pyzbar import decode 

app = Flask(__name__)

app.secret_key="secretkey"
app.config["MONGO_URI"] = "mongodb+srv://ratnadeep:N0M4fXXQhFW1tiNq@cluster0.ym3x4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
# app.config["MONGO_URI"] = "mongodb://localhost:27017/IotProject"
# N0M4fXXQhFW1tiNq

mongo = PyMongo(app)

studentQR = "Not scanned yet"
productBarcode = "Not scanned yet"
warn = "Scan both QR code and Product's Barcode"
error = "Please enter all the information"
success = "Submitted successfully"
productInputBarcode = "Not scanned yet"
productExistingInputBarcode = "Not scanned yet"
product="Select a product first"
productAllBarcodes = []

@app.route('/')
def index():
  return render_template('codeScanner.html', studentQR=studentQR, productBarcode=productBarcode)

@app.route('/studentQR/')
def codeScanner():
    cap = cv.VideoCapture(0)

    while True:
        _,frame = cap.read()
    
        for barcode in decode(frame):
            print(barcode.data.decode('utf-8'))
            global studentQR
            studentQR = barcode.data.decode('utf-8')
            pts = np.array([barcode.polygon],np.int32)
            pts = pts.reshape((1,-1,2))
            cv.polylines(frame,[pts],True,(0,255,0),3)
            pts2 = barcode.rect
            cv.putText(frame,studentQR,(pts2[0],pts2[1]),cv.FONT_HERSHEY_COMPLEX_SMALL,0.9,(255,0,255),2)
            # scanned = mongo.db.scanned.insert_one({"scanned": studentQR})
            
            return render_template('codeScanner.html', studentQR=studentQR, productBarcode=productBarcode)
            
        cv.imshow("Frame",frame)
        if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
            break
    cap.release()
    cv.destroyAllWindows()

@app.route('/ProductBarcode/')
def barcodeScanner():
    cap = cv.VideoCapture(0)

    while True:
        _,frame = cap.read()
    
        for barcode in decode(frame):
            print(barcode.data.decode('utf-8'))
            global productBarcode
            productBarcode = barcode.data.decode('utf-8')
            pts = np.array([barcode.polygon],np.int32)
            pts = pts.reshape((1,-1,2))
            cv.polylines(frame,[pts],True,(0,255,0),3)
            pts2 = barcode.rect
            cv.putText(frame,productBarcode,(pts2[0],pts2[1]),cv.FONT_HERSHEY_COMPLEX_SMALL,0.9,(255,0,255),2)
            
            return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR)
            
        cv.imshow("Frame",frame)
        if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
            break
    cap.release()
    cv.destroyAllWindows()

@app.route('/Submit/')
def submit():
  global studentQR 
  global productBarcode
  if studentQR !="Not scanned yet" and productBarcode != "Not scanned yet":
    scanned = mongo.db.scanned.insert_one({"StudentId": studentQR, "BookBarcode": productBarcode})
    studentQR="Not scanned yet"
    productBarcode="Not scanned yet"
    return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR, success=success)
  else:
    return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR, warn=warn)


# For New Product Input

@app.route('/productInput')
def productInputIndex():
  return render_template('productInput.html', productInputBarcode=productInputBarcode)
  
@app.route('/productInput/ProductBarcode/')
def barcodeScannerInputProduct():
    cap = cv.VideoCapture(0)

    while True:
        _,frame = cap.read()
    
        for barcode in decode(frame):
            print(barcode.data.decode('utf-8'))
            global productInputBarcode
            productInputBarcode = barcode.data.decode('utf-8')
            pts = np.array([barcode.polygon],np.int32)
            pts = pts.reshape((1,-1,2))
            cv.polylines(frame,[pts],True,(0,255,0),3)
            pts2 = barcode.rect
            cv.putText(frame,productInputBarcode,(pts2[0],pts2[1]),cv.FONT_HERSHEY_COMPLEX_SMALL,0.9,(255,0,255),2)
            
            return render_template('productInput.html', productInputBarcode=productInputBarcode )
            
        cv.imshow("Frame",frame)
        if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
            break
    cap.release()
    cv.destroyAllWindows()


@app.route('/productInput/submitInputProduct/', methods=['POST'])
def productInputSubmit():
  global productInputBarcode
  global productAllBarcodes
  productName = request.form['productName']
  productPrice = request.form['productPrice']
  productCategory = request.form['productCategory']
  manufacturingDate = request.form['manufacturingDate']
  if productInputBarcode != "Not scanned yet" and productName !='' and productPrice != '' and productCategory != '' and manufacturingDate != '':
    productAllBarcodes.append(productInputBarcode)
    # return render_template('productInput.html', success=success)
    scanned = mongo.db.products.insert_one({"productName": productName, "productBarcode": productAllBarcodes, "manufacturingDate": manufacturingDate, "productCategory": productCategory, "productPrice": productPrice})
    productInputBarcode = "Not scanned yet"
    return render_template('productInput.html', productName=productName, productInputBarcode=productInputBarcode, manufacturingDate=manufacturingDate, productCategory=productCategory, productPrice=productPrice, success=success)
  else:
    return render_template('productInput.html', error=error, productInputBarcode=productInputBarcode)



# For Existing Product Barcode Input

@app.route('/existingProduct')
def existingProductBarcodeInputIndex():
  products = mongo.db.products.find()
  # products = mongo.db.products.find({}, {'_id': 0, 'productName': 1})
  print(products)
  return render_template('existingProduct.html', products=products, productExistingInputBarcode=productExistingInputBarcode, product=product)

@app.route('/add/<oid>')
def add(oid):
  product = mongo.db.products.find_one({'_id': ObjectId(oid)})
  products = mongo.db.products.find()
  cap = cv.VideoCapture(0)
  while True:
      _,frame = cap.read()
  
      for barcode in decode(frame):
          print(barcode.data.decode('utf-8'))
          global productExistingInputBarcode
          productExistingInputBarcode = barcode.data.decode('utf-8')
          pts = np.array([barcode.polygon],np.int32)
          pts = pts.reshape((1,-1,2))
          cv.polylines(frame,[pts],True,(0,255,0),3)
          pts2 = barcode.rect
          cv.putText(frame,productExistingInputBarcode,(pts2[0],pts2[1]),cv.FONT_HERSHEY_COMPLEX_SMALL,0.9,(255,0,255),2)
          mongo.db.products.find_one_and_update({'_id': ObjectId(oid)}, {'$push': {'productBarcode': productExistingInputBarcode}})
          # product.save(newBarcode)
          return render_template('existingProduct.html', productExistingInputBarcode=productExistingInputBarcode, success=success, products=products, product=product)
          
      cv.imshow("Frame",frame)
      if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
          break
  cap.release()
  cv.destroyAllWindows()
  

# @app.route('/records')
# def record():
#   recordItem = mongo.db.scanned.find()
#   resp = dumps(recordItem)
#   return resp

if __name__ == '__main__':
  app.run(debug=True)



#install 'pip install dnspython' extra for mongo atlas
# products= dumps(resp)    #its like stringify
  