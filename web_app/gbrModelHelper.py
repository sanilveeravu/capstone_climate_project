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


    def getActual(df,year,month,day):
        print(df.info)

    def makePredictions(metric, state_code, year, month, day):
        
        input_pred = [[year, month, day]]

        model_file = f"../model/gbr/modelfiles/{metric}-{state_code}-model.sav"
        model = pickle.load(open(model_file, "rb"))
        
        sc = StandardScaler()
        scaler_file = f"../model/gbr/modelfiles/{metric}-{state_code}-scaler.sav"
        sc = pickle.load(open(scaler_file,'rb'))
        row = sc.transform(input_pred)

        prediction_result = model.predict(row)

        actual_value=0

        if(metric == "TMAX"):
            tmax_df = pd.read_csv('../data/cleaned_data/tmaxdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(tmax_df,year,month,day)

        if(metric == "TMIN"):    
            tmin_df = pd.read_csv('../data/cleaned_data/tmindata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(tmin_df,year,month,day)

        if(metric == "PRCP"):    
            prcp_df = pd.read_csv('../data/cleaned_data/prcpdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(prcp_df,year,month,day)

        if(metric == "SNOW"):    
            snow_df = pd.read_csv('../data/cleaned_data/snowdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(snow_df,year,month,day)
            

        print('Prediction: %d' % prediction_result[0])

        return prediction_result[0]