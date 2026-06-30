from pydantic import BaseModel

class RecommendationInput(BaseModel):

    budget: float
    min_area: int
    max_area: int

    city: str
    locality: str

    amenities: list[str]