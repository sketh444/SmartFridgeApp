import torch
import random
from utils import load, store
import numpy as np
import pandas as pd
from sklearn import tree
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import logging

app = Flask(__name__)
app.run(debug=True)
cors = CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG
app.config['CORS_HEADERS'] = 'Content-Type'

# Read the initial data
xls = pd.ExcelFile('./FNDDS.xlsx')
df = pd.read_excel(xls)
df.set_index('Ingredient_Code', inplace=True)

X = df.iloc[:, 2:-16]
# X has nutrient levels
print(X.shape)
X = X.values

_, y = torch.max(torch.from_numpy(df.iloc[:, -16:].values),1)
# y has mood classes
y = y.numpy()

all_classifiers = {}
# all_classifiers = load()
    
store(all_classifiers)

@app.route('/')
@cross_origin()
def index():
    return 'Server Works!'
  
@app.route('/init_user/<username>')
@cross_origin()
def init_user(username):
    all_classifiers = load()
    if username not in all_classifiers.keys():
        classifier = tree.DecisionTreeClassifier()
        classifier = classifier.fit(X, y)
        all_classifiers[username] = [classifier, X, y]
        store(all_classifiers)
    ret = '{"message": "Classifier for ' + username + ' created", "username": "' + username + '"}'
    # parse x:
    return json.loads(ret)

@app.route('/predict_mood/<username>')
@cross_origin()
def predict(username):
    all_classifiers = load()
    user_data = all_classifiers[username]
    X_test = [[request.args.get('protein'), request.args.get('totalFat'), request.args.get('carbohydrate'), request.args.get('energy'), request.args.get('alcohol'), request.args.get('water'), request.args.get('caffeine'), request.args.get('theobromine'), request.args.get('sugars'), request.args.get('fiber'), request.args.get('calcium'), request.args.get('iron'), request.args.get('magnesium'), request.args.get('phosphorus'), request.args.get('potassium'),	 request.args.get('sodium'),  request.args.get('zinc'),	request.args.get('copper'),	request.args.get('selenium'), request.args.get('retinol'), request.args.get('vitA'), request.args.get('betaCarotene'), request.args.get('alphaCarotene'), request.args.get('vitE'), request.args.get('vitD'), request.args.get('cryptoxanthin'), request.args.get('Lycopene'), request.args.get('Lutein'), 	request.args.get('vitC'), request.args.get('thiamin'), request.args.get('riboflavin'),  request.args.get('niacin'),  request.args.get('vitB6'),  request.args.get('folate'), request.args.get('vitB12'), request.args.get('choline'), request.args.get('vitK'),	request.args.get('folicAcid'),request.args.get('cholesterol'), request.args.get('fattyAcids')]]
    print(len(X_test[0]))
    result = user_data[0].predict(X_test)
    store(all_classifiers)
    print(result[0])
    ret = '{"mood": '+ str(result[0]) +'}'
    return json.loads(ret)


@app.route('/learn_behavior/<username>')
@cross_origin()
def learn(username):
    all_classifiers = load()
    user_data = all_classifiers[username]
    classifier = user_data[0]
    X = user_data[1]
    y = user_data[2]
    X_new = [[request.args.get('protein'), request.args.get('totalFat'), request.args.get('carbohydrate'), request.args.get('energy'), request.args.get('alcohol'), request.args.get('water'), request.args.get('caffeine'), request.args.get('theobromine'), request.args.get('sugars'), request.args.get('fiber'), request.args.get('calcium'), request.args.get('iron'), request.args.get('magnesium'), request.args.get('phosphorus'), request.args.get('potassium'),	 request.args.get('sodium'),  request.args.get('zinc'),	request.args.get('copper'),	request.args.get('selenium'), request.args.get('retinol'), request.args.get('vitA'), request.args.get('betaCarotene'), request.args.get('alphaCarotene'), request.args.get('vitE'), request.args.get('vitD'), request.args.get('cryptoxanthin'), request.args.get('Lycopene'), request.args.get('Lutein'), 	request.args.get('vitC'), request.args.get('thiamin'), request.args.get('riboflavin'),  request.args.get('niacin'),  request.args.get('vitB6'),  request.args.get('folate'), request.args.get('vitB12'), request.args.get('choline'), request.args.get('vitK'),	request.args.get('folicAcid'), request.args.get('cholesterol'), request.args.get('fattyAcids')]]
    y_new = request.args.get('mood')
    print(X.shape)
    print(len(X_new[0]))
    X = np.append(X, X_new, axis=0)
    y = np.append(y, y_new)
    classifier = classifier.fit(X, y)
    all_classifiers[username] = [classifier, X, y]
    store(all_classifiers)
    ret = '{"message": "User ' + username + ' behavior learned and updated", "username": "' + username + '"}'
    print(ret)
    return json.loads(ret)

if __name__ == '__main__':
    app.run(debug=True)