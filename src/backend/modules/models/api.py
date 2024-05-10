from pydantic import BaseModel


class Forniture(BaseModel):
    name: str
    floor: int
