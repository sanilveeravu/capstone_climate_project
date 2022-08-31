from re import A
import pandas as pd
import datetime
import time
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
import bz2

class GBRModelHelper():

    def __init__(self):
        pass

    def makePredictions(metric, state_code, year, month, day, scale):
        
        input_pred = [[year, month, day]]
        model_file = f"../model/gbr/modelfiles/temp/model.sav"
        model_file_zip = f"../model/gbr/modelfiles/{metric}-{state_code}-model.sav.bz2"
        with bz2.open(model_file_zip, "rb") as fin:
            data = fin.read()
            f = open(model_file, "wb")
            f.write(data)
            f.close()
            
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


        predicted_value=round(prediction_result[0],1)
        if(scale == "fahrenheit"):
            if actual_value != "NA":
                actual_value=round((actual_value*1.8)+32,1)
            predicted_value=round((predicted_value*1.8)+32,1)

        act_pred = [actual_value,predicted_value]

        print(act_pred)

        return act_pred

    def makePredictionsByYear(metric, state_code, year, scale):
                
        model_file = f"../model/gbr/modelfiles/temp/model.sav"
        model_file_zip = f"../model/gbr/modelfiles/{metric}-{state_code}-model.sav.bz2"
        with bz2.open(model_file_zip, "rb") as fin:
            data = fin.read()
            f = open(model_file, "wb")
            f.write(data)
            f.close()
            
        model = pickle.load(open(model_file, "rb"))
        
        sc = StandardScaler()
        scaler_file = f"../model/gbr/modelfiles/{metric}-{state_code}-scaler.sav"
        sc = pickle.load(open(scaler_file,'rb'))
        
        year_before=year-1 
        year_after=year+1

        input_date_df=pd.DataFrame(pd.date_range(f'{year_before}-01-01', f'{year_after}-12-31', freq='D'), columns=['date'])

        input_date_df['year'] = input_date_df.date.dt.year
        input_date_df['month'] = input_date_df.date.dt.month
        input_date_df['day'] = input_date_df.date.dt.day
        row = sc.transform(input_date_df[['year','month','day']].values)

        prediction_result = model.predict(row)

        input_date_df['predicted']=prediction_result

        def getActualByYear(df,state_code,year_before,year_after):
            print("test")
            print(df.info)
            dt1 = datetime.datetime(year_before, 1, 1)
            dt2 = datetime.datetime(year_after, 12, 31)
            new_df = df.loc[(df['state_code'] == state_code) & (df['date'] >= dt1.strftime("%Y-%m-%d")) & (df['date'] <= dt2.strftime("%Y-%m-%d")) ]
            return new_df    

        if(metric == "TMAX"):
            tmax_df = pd.read_csv('../data/cleaned_data/tmaxdata.csv',names=["state_code", "date", "value"])
            actual_df = getActualByYear(tmax_df,state_code,year_before,year_after)

        if(metric == "TMIN"):    
            tmin_df = pd.read_csv('../data/cleaned_data/tmindata.csv',names=["state_code", "date", "value"])
            actual_df = getActualByYear(tmin_df,state_code,year_before,year_after)

        if(metric == "PRCP"):    
            prcp_df = pd.read_csv('../data/cleaned_data/prcpdata.csv',names=["state_code", "date", "value"])
            actual_df = getActualByYear(prcp_df,state_code,year_before,year_after)

        if(metric == "SNOW"):    
            snow_df = pd.read_csv('../data/cleaned_data/snowdata.csv',names=["state_code", "date", "value"])
            actual_df = getActualByYear(snow_df,state_code,year_before,year_after)

        input_date_df['date']=input_date_df['date'].dt.strftime('%Y-%m-%d')

        final_df=input_date_df.merge(actual_df,on="date",how="left")

        final_df.drop(["state_code","year","month","year","day"],inplace=True,axis=1)
        final_df.rename({"value":"actual"},axis=1,inplace=True)
        if(scale == "fahrenheit"):
            final_df["actual"]=round((final_df["actual"]*1.8)+32,2)
            final_df["predicted"]=round((final_df["predicted"]*1.8)+32,2)
        final_df

        return final_df       