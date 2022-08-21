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

        def getActual(df,state_code,year,month,day):
            actual_value="NA"
            print("test")
            print(df.info)
            dt = datetime.datetime(year, month, day)
            df = df.loc[(df['state_code'] == state_code) & (df['date'] == dt.strftime("%Y-%m-%d"))]
            if(len(df)==1):
                actual_value=df['value'].iloc[0]
            return actual_value    

        actual_value="NA"

        if(metric == "TMAX"):
            tmax_df = pd.read_csv('../data/cleaned_data/tmaxdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(tmax_df,state_code,year,month,day)

        if(metric == "TMIN"):    
            tmin_df = pd.read_csv('../data/cleaned_data/tmindata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(tmin_df,state_code,year,month,day)

        if(metric == "PRCP"):    
            prcp_df = pd.read_csv('../data/cleaned_data/prcpdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(prcp_df,state_code,year,month,day)

        if(metric == "SNOW"):    
            snow_df = pd.read_csv('../data/cleaned_data/snowdata.csv',names=["state_code", "date", "value"])
            actual_value = getActual(snow_df,state_code,year,month,day)
            
        print('Actual: %s' % actual_value)
        print('Prediction: %d' % prediction_result[0])

        act_pred = [actual_value,round(prediction_result[0],1)]

        print(act_pred)

        return act_pred