from modules.models.api import Forniture


def sanitize_string(s: str) -> str:
    # Remove all non-alphanumeric characters from the string
    return "".join(filter(str.isalnum, s))


def validate_forniture(n_floors: int, forniture: list[Forniture]) -> bool:
    # Ensure that the forniture list only containts valid floors
    for f in forniture:
        # Sanitize the name of the forniture
        if isinstance(f.name, str):
            f.name = sanitize_string(f.name)
        if not f.name or f.floor < 0 or f.floor >= n_floors:
            return False
    return True
