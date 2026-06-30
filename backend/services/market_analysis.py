import pandas as pd
from wordcloud import WordCloud
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from io import BytesIO
import base64


class MarketAnalysis:

    def __init__(self):

        self.df = pd.read_csv("data/all_cities.csv")
        self.coords = pd.read_csv("data/coordinates.csv")


    def get_city_map(self, city):

        temp = self.df.groupby(
            ['city','locality']
        )['price_cr'].mean().reset_index()

        temp = temp.merge(
            self.coords,
            on=['city','locality'],
            how='inner'
        )

        temp = temp[
            temp['city']==city
        ]

        temp = temp.dropna(
            subset=['latitude','longitude']
        )

        return {

            "avg_price":
            round(temp['price_cr'].mean(),2),

            "median_price":
            round(temp['price_cr'].median(),2),

            "max_price":
            round(temp['price_cr'].max(),2),

            "min_price":
            round(temp['price_cr'].min(),2),

            "total_localities":
            len(temp),

            "map_data":
            temp.to_dict(
                orient='records'
            )

        }


    def custom_graph(self, x_col, y_col):

        temp = self.df[[x_col, y_col]].dropna().copy()

        numeric_cols = [
            "price_cr",
            "builtup_area_sqft",
            "avg_price_per_sqft",
            "bhk",
            "facility_count",
            "society_freq",
            "locality_freq",
            "premium_facility_score"
        ]

        x_numeric = x_col in numeric_cols
        y_numeric = y_col in numeric_cols

        # --------------------------
        # Numeric vs Numeric
        # --------------------------

        if x_numeric and y_numeric:

            available_graphs = [
                "scatter",
                "line",
                "area"
            ]

            return {
                "x_axis": x_col,
                "y_axis": y_col,
                "available_graphs": available_graphs,
                "default_graph": "scatter",
                "data": temp.to_dict(orient="records")
            }

        # --------------------------
        # Categorical vs Numeric
        # --------------------------

        elif (not x_numeric) and y_numeric:

            result = (
                temp
                .groupby(x_col)[y_col]
                .mean()
                .reset_index()
                .sort_values(y_col, ascending=False)
            )

            available_graphs = [
                "bar",
                "horizontal_bar",
                "pie"
            ]

            return {
                "x_axis": x_col,
                "y_axis": y_col,
                "available_graphs": available_graphs,
                "default_graph": "bar",
                "data": result.to_dict(orient="records")
            }

        # --------------------------
        # Numeric vs Categorical
        # --------------------------

        elif x_numeric and (not y_numeric):

            result = (
                temp
                .groupby(y_col)[x_col]
                .mean()
                .reset_index()
            )

            result.columns = [y_col, x_col]

            available_graphs = [
                "bar",
                "horizontal_bar"
            ]

            return {
                "x_axis": y_col,
                "y_axis": x_col,
                "available_graphs": available_graphs,
                "default_graph": "bar",
                "data": result.to_dict(orient="records")
            }

        # --------------------------
        # Categorical vs Categorical
        # --------------------------

        else:

            result = (
                temp
                .groupby([x_col, y_col])
                .size()
                .reset_index(name="count")
            )

            available_graphs = [
                "bar",
                "horizontal_bar"
            ]

            return {
                "x_axis": x_col,
                "y_axis": y_col,
                "value_key": "count",
                "available_graphs": available_graphs,
                "default_graph": "bar",
                "data": result.to_dict(orient="records")
            }



    def available_columns(self):

        return [

            'price_cr',

            'builtup_area_sqft',

            'avg_price_per_sqft',

            'bhk',

            'property_type',

            'selling_type',

            'locality',

            'facility_count',

            'premium_facility_score',

            'society_freq',

            'locality_freq'

        ]


    def get_wordcloud(self, city, locality):

        if locality:

            temp = self.df[
                (self.df["city"] == city) &
                (self.df["locality"] == locality)
            ]

        else:

            temp = self.df[
                self.df["city"] == city
            ]


        text = " ".join(

            temp['features_clean']

            .dropna()

            .astype(str)

            .tolist()

        )


        if not text.strip():

            return {

                "image":None

            }


        wc = WordCloud(

            width=800,

            height=400,

            background_color='white',

            colormap='viridis'

        ).generate(text)



        buffer = BytesIO()



        plt.figure(

            figsize=(10,5)

        )


        plt.imshow(

            wc,

            interpolation='bilinear'

        )


        plt.axis(

            'off'

        )


        plt.savefig(

            buffer,

            format='png',

            bbox_inches='tight',

            pad_inches=0

        )


        plt.close()



        img = base64.b64encode(

            buffer.getvalue()

        ).decode()



        return {

            "image":img

        }
    
