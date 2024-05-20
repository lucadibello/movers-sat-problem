from enum import Enum
from typing import Optional
from modules.models.api import Forniture


class MoverActionType(Enum):
    ASCEND = "ascend"
    DESCEND = "descend"
    CARRY = "carry"


ID = str | int


class MoverAction:
    def __init__(self, mover_id: ID, action_type: MoverActionType) -> None:
        self._mover = mover_id
        self._action_type = action_type

    def __str__(self):
        return f"{self._mover} is {self._action_type}"


class MoverCarryAction(MoverAction):
    def __init__(self, mover_id: ID, forniture: Forniture) -> None:
        super().__init__(mover_id, MoverActionType.CARRY)
        self._forniture = forniture

    def __str__(self):
        return f"{self._mover} is carrying {self._forniture.name}"


class MoverState:
    def __init__(self, mover_id: ID, floor: int, action: Optional[MoverAction]) -> None:
        self._mover = mover_id
        self._floor = floor
        self._action = action


class FornitureState:
    def __init__(self, forniture: Forniture, floor: int) -> None:
        self._forniture = forniture
        self._floor = floor

    def __str__(self):
        return f"{self._forniture.name} is at floor {self._floor}"


MoverStatesPerTime = dict[int, set[MoverState]]
FornitureStatesPerTime = dict[int, set[FornitureState]]


class MoversSolution:
    def __init__(self):
        # Create empty dict
        self._movers_states: MoverStatesPerTime = {}
        self._forniture_states: FornitureStatesPerTime = {}

    def add_movers_state(self, time: int, state: MoverState):
        if time not in self._movers_states:
            self._movers_states[time] = set[MoverState]()
        # Append state to time
        self._movers_states[time].add(state)

    def add_forniture_state(self, time: int, state: FornitureState):
        if time not in self._forniture_states:
            self._forniture_states[time] = set[FornitureState]()
        # Append state to time
        self._forniture_states[time].add(state)

    def get_solution(self) -> tuple[MoverStatesPerTime, FornitureStatesPerTime]:
        return (self._movers_states, self._forniture_states)
