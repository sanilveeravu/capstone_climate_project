import pandas as pd
import datetime
import time
import pickle
import numpy as np
from sqlalchemy import create_engine, inspect

class SQLHelper():
    def __init__(self):
        self.database_path = "weather.sqlite"
        self.conn_string = f"sqlite:///{self.database_path}"

        # Create an engine that can talk to the database
        self.engine = create_engine(self.conn_string)

    def getDataFromDatabase(self, metric, state_code, min_date, max_date):

        query = f"""
                SELECT
                    state_name,
                    date,
                    value
                FROM
                    {metric}
                WHERE
                    state_code = '{state_code}'
                    AND date >= '{min_date}'
                    AND date <= '{max_date}'
                    """

        print(query)

        df = pd.read_sql(query, con=self.engine)

        return df