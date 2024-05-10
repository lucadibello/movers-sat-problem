from pydantic import BaseModel
from typing import Optional, TypeVar, TypedDict


class Forniture(BaseModel):
    name: str
    floor: int


T = TypeVar("T", dict, list)


class Response[K](TypedDict):
    success: bool
    message: str
    data: Optional[K]


def build_response(
    success: bool, message: str, data: Optional[T] = None
) -> Response[T]:
    response = {"success": success, "message": message}
    # If data is provided, add it to the response
    if data:
        response["data"] = data
    return Response[T](**response)
