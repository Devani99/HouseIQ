from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas.house import HouseInput
from services.price_predictor import PricePredictor
from services.market_analysis import MarketAnalysis

from schemas.recommendation import RecommendationInput
from services.recommendation import Recommendation

from services.data_service import DataService


app = FastAPI(
    title="HouseIQ API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


predictor = PricePredictor()
market = MarketAnalysis()
recommender = Recommendation()
data_service = DataService()


@app.get("/")
def home():

    return {
        "message": "Welcome to HouseIQ API",
        "version": "1.0.0"
    }


@app.post("/predict")
def predict(house: HouseInput):

    return predictor.predict(
        house.model_dump()
    )


@app.get("/market-map/{city}")
def market_map(city: str):

    return market.get_city_map(
        city
    )


@app.get("/columns")
def get_columns():

    return {
        "columns":
            market.available_columns()
    }


@app.get("/custom-graph")
def custom_graph(
    x_col: str,
    y_col: str
):
    return market.custom_graph(
        x_col,
        y_col
    )

@app.get("/wordcloud")
def wordcloud(city: str, locality: str):

    try:
        return market.get_wordcloud(city, locality)

    except Exception as e:
        return {
            "error": str(e)
        }
        

@app.post("/recommend")
def recommend(data: RecommendationInput):

    try:

        return recommender.recommend(

            data.budget,
            data.min_area,
            data.max_area,
            data.city,
            data.locality,
            data.amenities

        )

    except Exception as e:

        return {

            "error": str(e)

        }
    

@app.get("/cities")
def get_cities():

    return data_service.get_cities()


@app.get("/localities/{city}")
def get_localities(city: str):

    return data_service.get_localities(

        city

    )


@app.get("/societies/{locality}")
def get_societies(locality: str):

    return data_service.get_societies(

        locality

    )


@app.get("/amenities")
def get_amenities():

    return data_service.get_amenities()

@app.get("/property-types")
def get_property_types():

    return data_service.get_property_types()


@app.get("/selling-types")
def get_selling_types():

    return data_service.get_selling_types()

@app.get("/facility-categories")
def get_facility_categories():

    return data_service.get_facility_categories()