import pandas as pd


class Recommendation:

    def __init__(self):

        self.df = pd.read_csv(
            "data/all_cities.csv"
        )


    def recommend(

            self,

            budget,

            min_area,

            max_area,

            city,

            locality,

            amenities

    ):


        temp = self.df.copy()


        temp = temp[

            temp['city'] == city

        ]


        temp = temp[

            (temp['price_cr'] <= budget)

            &

            (temp['builtup_area_sqft'] >= min_area)

            &

            (temp['builtup_area_sqft'] <= max_area)

        ]


        if len(temp) == 0:

            return []


        recommendations = []


        for _, row in temp.iterrows():


            score = 0

            reasons = []


            budget_score = (

                1 -

                abs(

                    row['price_cr']

                    -

                    budget

                )

                /

                budget

            )


            score += budget_score * 50


            reasons.append(

                "Within Budget"

            )


            area_score = (

                row['builtup_area_sqft']

                -

                min_area

            )

            area_score /= (

                max_area

                -

                min_area

            )


            score += area_score * 15


            if row['locality'] == locality:


                score += 15


                reasons.append(

                    "Preferred Locality"

                )


            features = str(

                row['features_clean']

            )


            matched = 0


            for amenity in amenities:


                if amenity.lower() in features.lower():

                    matched += 1



            if len(amenities) > 0:


                amenity_score = (

                    matched

                    /

                    len(amenities)

                )


            else:


                amenity_score = 0



            score += amenity_score * 20



            if matched > 0:


                reasons.append(

                    f"Matches {matched}/{len(amenities)} amenities"

                )



            recommendations.append(

                {


                    "society_name":

                    row['society_name'],


                    "locality":

                    row['locality'],


                    "price_cr":

                    round(

                        row['price_cr'],

                        2

                    ),


                    "builtup_area_sqft":

                    int(

                        row['builtup_area_sqft']

                    ),


                    "amenity_match":

                    round(

                        amenity_score * 100,

                        1

                    ),


                    "score":

                    round(

                        score,

                        2

                    ),


                    "reasons":

                    reasons


                }

            )



        recommendations = sorted(

            recommendations,

            key=lambda x:x['score'],

            reverse=True

        )


        return recommendations[:10]