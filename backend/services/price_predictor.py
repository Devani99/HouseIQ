import numpy as np
import pandas as pd
from catboost import CatBoostRegressor


class PricePredictor:

    def __init__(self):

        self.model = CatBoostRegressor()
        self.model.load_model("models/real_estate_model.cbm")

        self.df = pd.read_csv("data/all_cities.csv")

        self.facilities = [
            'Gym',
            'Lift',
            'Parking',
            'Swimming Pool',
            'Power Backup',
            'Club House',
            'Security',
            'Garden'
        ]

        self.mean_price = self.df['price_cr'].mean()

    def prepare_features(self, data):

        society_df = self.df[
            self.df['society_name'] == data['society_name']
        ]

        locality_df = self.df[
            self.df['locality'] == data['locality']
        ]

        society_freq = society_df.shape[0]
        locality_freq = locality_df.shape[0]

        society_mean_price = society_df['price_cr'].mean()
        locality_mean_price = locality_df['price_cr'].mean()

        if pd.isna(society_mean_price):
            society_mean_price = self.mean_price

        if pd.isna(locality_mean_price):
            locality_mean_price = self.mean_price

        facility_count = len(data['facilities'])

        facility_dict = {
            facility: 0
            for facility in self.facilities
        }

        for facility in data['facilities']:

            if facility in facility_dict:
                facility_dict[facility] = 1

        premium_facility_score = sum(
            facility_dict.values()
        )

        facility_category = (
            'premium'
            if premium_facility_score >= 3
            else 'standard'
        )

        area_per_bhk = (
            data['builtup_area_sqft']
            /
            data['bhk']
        )

        log_area = np.log1p(
            data['builtup_area_sqft']
        )

        bins = [
            0,
            500,
            1000,
            1500,
            2000,
            3000,
            5000,
            10000
        ]

        area_bin = pd.cut(
            [data['builtup_area_sqft']],
            bins=bins,
            labels=False
        )[0]

        area_bin = int(area_bin)

        X = pd.DataFrame([{

            'selling_type':
            data['selling_type'],

            'property_type':
            data['property_type'],

            'society_name':
            data['society_name'],

            'bhk':
            data['bhk'],

            'builtup_area_sqft':
            data['builtup_area_sqft'],

            'locality':
            data['locality'],

            'city':
            data['city'],

            'facility_count':
            facility_count,

            'facility_category':
            facility_category,

            'society_freq':
            society_freq,

            'locality_freq':
            locality_freq,

            'premium_facility_score':
            premium_facility_score,

            'area_per_bhk':
            area_per_bhk,

            'log_area':
            log_area,

            'is_premium':
            int(premium_facility_score >= 3),

            'area_bin':
            area_bin,

            'Gym':
            facility_dict['Gym'],

            'Lift':
            facility_dict['Lift'],

            'Parking':
            facility_dict['Parking'],

            'Swimming Pool':
            facility_dict['Swimming Pool'],

            'Power Backup':
            facility_dict['Power Backup'],

            'Club House':
            facility_dict['Club House'],

            'Security':
            facility_dict['Security'],

            'Garden':
            facility_dict['Garden'],

            'locality_mean_price':
            locality_mean_price,

            'society_mean_price':
            society_mean_price

        }])

        return X


    def predict(self, data):

        X = self.prepare_features(data)

        pred = self.model.predict(X)[0]

        price = np.expm1(pred)

        mape = 18.83 / 100

        low = price * (1 - mape)

        high = price * (1 + mape)


        temp = self.df[

            (self.df['city'] == data['city'])

            &

            (self.df['locality'] == data['locality'])

        ]


        avg_locality_price = round(

            temp['price_cr'].mean(),

            2

        )


        median_locality_price = round(

            temp['price_cr'].median(),

            2

        )


        avg_price_per_sqft = round(

            temp['avg_price_per_sqft'].mean(),

            0

        )


        area_per_bhk = round(

            data['builtup_area_sqft']

            /

            data['bhk'],

            0

        )


        return {

            "predicted_price":

                round(

                    price,

                    2

                ),

            "min_price":

                round(

                    low,

                    2

                ),

            "max_price":

                round(

                    high,

                    2

                ),

            "confidence":

                int(

                    100 - 18.83

                ),

            "avg_locality_price":

                avg_locality_price,

            "median_locality_price":

                median_locality_price,

            "avg_price_per_sqft":

                avg_price_per_sqft,

            "area_per_bhk":

                area_per_bhk

        }