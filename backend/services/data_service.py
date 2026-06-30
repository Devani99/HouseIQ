import pandas as pd


class DataService:

    def __init__(self):

        self.df = pd.read_csv(
            "data/all_cities.csv"
        )


    def get_cities(self):

        return sorted(

            self.df['city']
            .dropna()
            .unique()
            .tolist()

        )


    def get_localities(self, city):

        return sorted(

            self.df[

                self.df['city'] == city

            ]['locality']

            .dropna()

            .unique()

            .tolist()

        )


    def get_societies(self, locality):

        return sorted(

            self.df[

                self.df['locality'] == locality

            ]['society_name']

            .dropna()

            .unique()

            .tolist()

        )


    def get_amenities(self):

        return [

            'Gym',

            'Lift',

            'Parking',

            'Swimming Pool',

            'Power Backup',

            'Club House',

            'Security',

            'Garden'

        ]
    
    def get_property_types(self):

        return sorted(

            self.df['property_type']
            .dropna()
            .unique()
            .tolist()

        )


    def get_selling_types(self):

        return sorted(

            self.df['selling_type']
            .dropna()
            .unique()
            .tolist()

        )
    
    def get_facility_categories(self):

        return [

            "Standard",

            "Premium",

            "Luxury",

            "Ultra Luxury"

        ]