import pandas as pd
import datetime
import time
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor


class GBRModelHelper():

    def __init__(self):
        pass

    def makePredictions(metric, state_code, year, month, day):

        input_pred = [[year, month, day]]

        model_file = f"../model/gbr/modelfiles/{metric}-{state_code}-model.sav"
        model = pickle.load(open(model_file, "rb"))
        
        sc = StandardScaler()
        scaler_file = f"../model/gbr/modelfiles/{metric}-{state_code}-scaler.sav"
        sc = pickle.load(open(scaler_file,'rb'))
        row = sc.transform(input_pred)

        prediction_result = model.predict(row)
        print('Prediction: %d' % prediction_result[0])

        return prediction_result[0]