from pydantic import BaseModel


class HouseInput(BaseModel):

    selling_type: str

    property_type: str

    society_name: str

    bhk: int

    builtup_area_sqft: float

    locality: str

    city: str

    facilities: list[str] = []