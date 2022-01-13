# -*- coding: utf-8 -*-
"""
Created on Tue Oct  9 13:56:55 2022

@author: Ratnadeep Das Choudhury
"""

from flask import Flask, render_template, Response, request
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import jsonify, request
# from camera import VideoCamera
# import time
# import threading
# import os

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
productExistingInputBarcodePlaceholder = "Not scanned yet"
product="Select a product first"
productAllBarcodes = []
mainPassword = 'RU<r=eP~}s9r%md$'
passwordVerified = False
barcodeExist = 'This barcode already exist'

# For video Stream

# pi_camera = VideoCamera(flip=False) # flip pi camera if upside down.

# # App Globals (do not edit)
# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html') #you can customze index.html here

# def gen(camera):
#     #get camera frame
#     while True:
#         frame = camera.get_frame()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

# @app.route('/video_feed')
# def video_feed():
#     return Response(gen(pi_camera),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')



# Button Functionalities

@app.route('/deliveryVerification', methods=['GET', 'POST'])
def index():
  if request.method == 'POST':
    global passwordVerified
    password = request.form['password']
    if password == mainPassword :
      passwordVerified = True
      return render_template('codeScanner.html', passwordVerified=passwordVerified, studentQR=studentQR, productBarcode=productBarcode)
    else:
      return render_template('codeScanner.html', passwordVerified=passwordVerified, rejectAccess = 'Wrong Password')
  elif request.method == 'GET':
    return render_template('codeScanner.html', studentQR=studentQR, productBarcode=productBarcode, passwordVerified=passwordVerified)

@app.route('/deliveryVerification/studentQR/')
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
            cv.destroyAllWindows()
            return render_template('codeScanner.html', studentQR=studentQR, productBarcode=productBarcode, passwordVerified=passwordVerified)
            
        cv.imshow("Frame",frame)
        if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
            break
    cap.release()
    cv.destroyAllWindows()

@app.route('/deliveryVerification/ProductBarcode/')
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
            cv.destroyAllWindows()
            return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR, passwordVerified=passwordVerified)
            
        cv.imshow("Frame",frame)
        if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
            break
    cap.release()
    cv.destroyAllWindows()

@app.route('/deliveryVerification/Submit/')
def submit():
  global studentQR 
  global productBarcode
  if studentQR !="Not scanned yet" and productBarcode != "Not scanned yet":
    scanned = mongo.db.scanned.insert_one({"StudentId": studentQR, "BookBarcode": productBarcode})
    studentQR="Not scanned yet"
    productBarcode="Not scanned yet"
    return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR, success=success, passwordVerified=passwordVerified)
  else:
    return render_template('codeScanner.html', productBarcode=productBarcode , studentQR=studentQR, warn=warn, passwordVerified=passwordVerified)


# For New Product Input

@app.route('/productInput', methods=['GET', 'POST'])
def productInputIndex():
  if request.method == 'POST':
    global passwordVerified
    password = request.form['password']
    if password == mainPassword :
      passwordVerified = True
      return render_template('productInput.html', passwordVerified=passwordVerified, productInputBarcode=productInputBarcode)
    else:
      return render_template('productInput.html', passwordVerified=passwordVerified, rejectAccess = 'Wrong Password')
  elif request.method == 'GET':
    return render_template('productInput.html', productInputBarcode=productInputBarcode, passwordVerified=passwordVerified)

  
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
            cv.destroyAllWindows()
            return render_template('productInput.html', productInputBarcode=productInputBarcode, passwordVerified=passwordVerified )
            
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
  productCompany = request.form['productCompany']
  if productInputBarcode != "Not scanned yet" and productName !='' and productPrice != '' and productCategory != '' and productCompany != '':
    productAllBarcodes.append(productInputBarcode)
    # return render_template('productInput.html', success=success)
    scanned = mongo.db.products.insert_one({"productName": productName, "productBarcode": productAllBarcodes, "productCompany": productCompany, "productCategory": productCategory, "productPrice": productPrice})
    productInputBarcode = "Not scanned yet"
    return render_template('productInput.html', productName=productName, productInputBarcode=productInputBarcode, productCompany=productCompany, productCategory=productCategory, productPrice=productPrice, success=success, passwordVerified=passwordVerified)
  else:
    return render_template('productInput.html', error=error, productInputBarcode=productInputBarcode, passwordVerified=passwordVerified)



# For Existing Product Barcode Input

@app.route('/existingProduct', methods=['GET', 'POST'])
def existingProductBarcodeInputIndex():
  products = mongo.db.products.find()
  # products = mongo.db.products.find({}, {'_id': 0, 'productName': 1})
  # print(products)
  if request.method == 'POST':
    global passwordVerified
    password = request.form['password']
    if password == mainPassword :
      passwordVerified = True
      return render_template('existingProduct.html', passwordVerified=passwordVerified, products=products, productExistingInputBarcodePlaceholder=productExistingInputBarcodePlaceholder, product=product)
    else:
      return render_template('existingProduct.html', passwordVerified=passwordVerified, rejectAccess = 'Wrong Password')
  elif request.method == 'GET':
    return render_template('existingProduct.html', products=products, productExistingInputBarcodePlaceholder=productExistingInputBarcodePlaceholder, product=product, passwordVerified=passwordVerified)


  # return render_template('existingProduct.html', products=products, productExistingInputBarcodePlaceholder=productExistingInputBarcodePlaceholder, product=product)

@app.route('/add/<oid>')
def add(oid):
  product = mongo.db.products.find_one({'_id': ObjectId(oid)})
  productBarcode = product['productBarcode']
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
          cv.destroyAllWindows()
          for barcode in productBarcode:
            print(barcode)
            if barcode == productExistingInputBarcode:
              return render_template('existingProduct.html', productExistingInputBarcode=productExistingInputBarcode, barcodeExist=barcodeExist, products=products, product=product, passwordVerified=passwordVerified)
           
          mongo.db.products.find_one_and_update({'_id': ObjectId(oid)}, {'$push': {'productBarcode': productExistingInputBarcode}})
          return render_template('existingProduct.html', productExistingInputBarcode=productExistingInputBarcode, success=success, products=products, product=product, passwordVerified=passwordVerified)
          # product.save(newBarcode)
          
          
          
      cv.imshow("Frame",frame)
      if cv.waitKey(1) & 0xFF == 27:  # Press Escape Key to close all windows
          break
  cap.release()
  cv.destroyAllWindows()


# # Password Verification Codes
  
# @app.route('/deliveryVerification/passwordVerification/', methods=['POST'])
# def deliveryVerificationPassword():
#   passwordVerified = False
#   password = request.form['password']
#   if password == mainPassword :
#     passwordVerified = True
#     return render_template('codeScanner.html', passwordVerified=passwordVerified, studentQR=studentQR, productBarcode=productBarcode)
#   else:
#     return render_template('codeScanner.html', passwordVerified=passwordVerified, rejectAccess = 'Wrong Password')


# @app.route('/records')
# def record():
#   recordItem = mongo.db.scanned.find()
#   resp = dumps(recordItem)
#   return resp

if __name__ == '__main__':
  app.run(debug=True)



#install 'pip install dnspython' extra for mongo atlas
# products= dumps(resp)    #its like stringify
# pip install imutils for camera
  