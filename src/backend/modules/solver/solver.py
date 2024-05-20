# this class will contain the solver for the movers problem!
from modules.models.api import Forniture
from z3 import And, Bool, BoolRef, Implies, Not, Or, Solver, sat, BoolVal

from typing import Optional

from modules.models.solution import (
    MoverAction,
    MoverActionType,
    MoverCarryAction,
    MoverState,
    MoversSolution,
    FornitureState,
)

ID = int | str  # Type shorthand


class VariableNameFormat:
    @staticmethod
    def atFloorFormat(mover_id: ID, floor_no: int, time: int):
        return f"atFloor({mover_id},{floor_no},{time})"

    @staticmethod
    def atFloorFornitureFormat(forniture_id: ID, floor_no: int, time: int):
        return f"atFloorForniture({forniture_id},{floor_no},{time})"

    @staticmethod
    def ascendFormat(mover_id: ID, time: int):
        return f"ascend({mover_id},{time})"

    @staticmethod
    def descendFormat(mover_id: ID, time: int):
        return f"descend({mover_id},{time})"

    @staticmethod
    def carryFormat(mover_id: ID, forniture_id: ID, time: int):
        return f"carry({mover_id},{forniture_id},{time})"


class MoversSolver:
    # Decorator to ensure that the problem has been solved before accessing the solution
    @staticmethod
    def EnsureSolved(func):
        def wrapper(self, *args, **kwargs):
            if not self._is_solved:
                raise ValueError("The problem has not been solved yet!")
            return func(self, *args, **kwargs)

    def __init__(self, n: int, m: int, max_t: int, forniture: list[Forniture]) -> None:
        # Save the problem instance
        self._n = n  # Number of floors
        self._m = m  # Number of movers
        self._max_t = max_t
        self._actual_forniture = forniture

        # Generate some IDs
        self._movers = [f"m{i}" for i in range(1, m + 1)]
        self._floors = [i for i in range(0, n)]
        self._forniture = [f"f{i}" for i in range(1, len(forniture) + 1)]

        # Add some utility variables
        self._is_solved = False
        self._solution = MoversSolution()
        self._variables: dict[str, BoolRef] = {}

        # Initialize the solver
        self._solver = Solver()

        # Build the model
        # 1. Add required variables
        self._build_variables()
        # 2. Add action definitions (how actions alter the state of the problem instance)
        self._build_action_definitions()
        # 3. Add constraints
        self._build_constraints()

    # useful getters
    def movers_ids(self):
        return self._movers

    def _build_variables(self) -> None:
        """
        This function will generate all the variables required for the problem instance.
        """

        # generate variables
        for t in range(self._max_t + 1):
            for m in self._movers:
                name = VariableNameFormat.ascendFormat(m, t)
                self._variables[name] = Bool(name)
                name = VariableNameFormat.descendFormat(m, t)
                self._variables[name] = Bool(name)
                for l in self._floors:
                    name = VariableNameFormat.atFloorFormat(m, l, t)
                    self._variables[name] = Bool(name)
                for f in self._forniture:
                    name = VariableNameFormat.carryFormat(m, f, t)
                    self._variables[name] = Bool(name)
            for f in self._forniture:
                for l in self._floors:
                    name = VariableNameFormat.atFloorFornitureFormat(f, l, t)
                    self._variables[name] = Bool(name)

    def _build_action_definitions(self) -> None:
        """
        This function will define how movers actions affect the state of the problem instance.
        """
        # Ascend:
        for t in range(self._max_t):
            for m in self._movers:
                for l in self._floors:
                    if l < self._n - 1:
                        self._solver.add(
                            Implies(
                                And(self.ascend(m, t), self.atFloor(m, l, t)),
                                self.atFloor(m, l + 1, t + 1),
                            )
                        )
        # Descend:
        for t in range(self._max_t):
            for m in self._movers:
                for l in self._floors:
                    if l > 0:
                        self._solver.add(
                            Implies(
                                And(self.descend(m, t), self.atFloor(m, l, t)),
                                self.atFloor(m, l - 1, t + 1),
                            )
                        )
        # Carry:
        for t in range(self._max_t):
            for m in self._movers:
                for f in self._forniture:
                    for l in self._floors:
                        if l > 0:
                            self._solver.add(
                                Implies(
                                    And(
                                        self.carry(m, f, t),
                                        self.atFloor(m, l, t),
                                        self.atFloorForniture(f, l, t),
                                    ),
                                    And(
                                        self.atFloor(m, l - 1, t + 1),
                                        self.atFloorForniture(f, l - 1, t + 1),
                                    ),
                                )
                            )

    def _build_constraints(self) -> None:
        # Initial constraint: movers start at the ground floor
        for m in self._movers:
            self._solver.add(self.atFloor(m, 0, 0))

        # Initial constraint: forniture starts at the input floors
        for i in range(len(self._forniture)):
            self._solver.add(
                self.atFloorForniture(
                    self._forniture[i],
                    self._actual_forniture[i].floor,
                    0,  # FIXME: Check if this is the correct way to get the initial floor
                )
            )

        # Final constraint: movers end at the ground floor at max_t
        for m in self._movers:
            self._solver.add(self.atFloor(m, 0, self._max_t - 1))

        # Final constraint: all forniture end at the ground floor at max_t
        for f in self._forniture:
            self._solver.add(self.atFloorForniture(f, 0, self._max_t - 1))

        # Each mover is exactly at one floor at each time
        for t in range(self._max_t):
            for m in self._movers:
                # mover is at least at one floor
                self._solver.add(Or([self.atFloor(m, f, t) for f in self._floors]))
                for f1 in self._floors:
                    for f2 in self._floors:
                        if f1 != f2:
                            # mover is not at more than one floor
                            self._solver.add(
                                Implies(
                                    self.atFloor(m, f1, t), Not(self.atFloor(m, f2, t))
                                )
                            )

        # If a mover is not ascending, descending, or carrying it stays at the same floor
        for t in range(self._max_t - 1):
            for m in self._movers:
                for l in self._floors:
                    self._solver.add(
                        Implies(
                            And(
                                Not(Or(self.ascend(m, t), self.descend(m, t))),
                                Not(Or([self.carry(m, f, t) for f in self._forniture])),
                                self.atFloor(m, l, t),
                            ),
                            self.atFloor(m, l, t + 1),
                        )
                    )

        # Each forniture is exactly at one floor at each time
        for t in range(self._max_t):
            for f in self._forniture:
                # forniture is at least at one floor
                self._solver.add(
                    Or([self.atFloorForniture(f, l, t) for l in self._floors])
                )
                for l1 in self._floors:
                    for l2 in self._floors:
                        if l1 != l2:
                            # forniture is not at more than one floor
                            self._solver.add(
                                Implies(
                                    self.atFloorForniture(f, l1, t),
                                    Not(self.atFloorForniture(f, l2, t)),
                                )
                            )

        # Each mover can do only one action at a time
        for t in range(self._max_t):
            for m in self._movers:
                self._solver.add(Implies(self.ascend(m, t), Not(self.descend(m, t))))
                self._solver.add(Implies(self.descend(m, t), Not(self.ascend(m, t))))
                for f in self._forniture:
                    self._solver.add(
                        Implies(self.ascend(m, t), Not(self.carry(m, f, t)))
                    )
                    self._solver.add(
                        Implies(self.descend(m, t), Not(self.carry(m, f, t)))
                    )
                    self._solver.add(
                        Implies(self.carry(m, f, t), Not(self.ascend(m, t)))
                    )
                    self._solver.add(
                        Implies(self.carry(m, f, t), Not(self.descend(m, t)))
                    )

        # Each forniture can be carried by at most one mover
        for t in range(self._max_t):
            for f in self._forniture:
                for m1 in self._movers:
                    for m2 in self._movers:
                        if m1 != m2:
                            self._solver.add(
                                Implies(self.carry(m1, f, t), Not(self.carry(m2, f, t)))
                            )

        # Each mover can carry at most one piece of forniture
        for t in range(self._max_t):
            for m in self._movers:
                for f1 in self._forniture:
                    for f2 in self._forniture:
                        if f1 != f2:
                            self._solver.add(
                                Implies(self.carry(m, f1, t), Not(self.carry(m, f2, t)))
                            )

        # If a forniture is not carried by anyone, it stays in the same floors
        for t in range(self._max_t - 1):
            for f in self._forniture:
                for l in self._floors:
                    self._solver.add(
                        Implies(
                            And(
                                Not(Or([self.carry(m, f, t) for m in self._movers])),
                                self.atFloorForniture(f, l, t),
                            ),
                            self.atFloorForniture(f, l, t + 1),
                        )
                    )

        # A mover cannot carry an item which is already at the ground floor
        for t in range(self._max_t):
            for m in self._movers:
                for f in self._forniture:
                    self._solver.add(
                        Implies(
                            self.atFloorForniture(f, 0, t), Not(self.carry(m, f, t))
                        )
                    )

        # A mover has to be on the same floor as an item in order to carry it
        for t in range(self._max_t):
            for m in self._movers:
                for f in self._forniture:
                    for l1 in self._floors:
                        for l2 in self._floors:
                            if l1 != l2:
                                self._solver.add(
                                    Implies(
                                        And(
                                            self.atFloorForniture(f, l1, t),
                                            self.atFloor(m, l2, t),
                                        ),
                                        Not(self.carry(m, f, t)),
                                    )
                                )

        # movers cannot ascend if they are at the top floor
        for t in range(self._max_t):
            for m in self._movers:
                self._solver.add(
                    Implies(self.atFloor(m, self._n - 1, t), Not(self.ascend(m, t)))
                )

        # movers cannot descend if they are at the ground floor
        for t in range(self._max_t):
            for m in self._movers:
                self._solver.add(
                    Implies(self.atFloor(m, 0, t), Not(self.descend(m, t)))
                )

    def solve(self):
        """
        This function will solve the problem instance.
        """
        # Solve the problem instance
        result = self._solver.check()
        try:
            if result == sat:
                model = self._solver.model()

                # Backtrack the operations made by movers
                for t in range(self._max_t):
                    for m in self._movers:
                        floor_no: Optional[int] = None
                        action: Optional[MoverAction] = None

                        # Now, check the floor number of m at time t
                        for l in self._floors:
                            if model.evaluate(self.atFloor(m, l, t)).eq(BoolVal(True)):
                                floor_no = l
                                break

                        # Now, ensure which action m is doing at time t
                        if model.evaluate(self.ascend(m, t)).eq(BoolVal(True)):
                            action = MoverAction(m, MoverActionType.ASCEND)
                        elif model.evaluate(self.descend(m, t)).eq(BoolVal(True)):
                            action = MoverAction(m, MoverActionType.DESCEND)
                        else:
                            for f in self._forniture:
                                if model.evaluate(self.carry(m, f, t)).eq(
                                    BoolVal(True)
                                ):
                                    # Get the forniture object from the initial array
                                    forniture_obj = self._actual_forniture[
                                        int(f[1:]) - 1
                                    ]
                                    action = MoverCarryAction(m, forniture_obj)
                                    break

                        if floor_no is not None:
                            # Create state + action
                            state = MoverState(m, floor_no, action)
                            self._solution.add_movers_state(t, state)

                    # Now, keep track also of the floors of the forniture
                    for f in self._forniture:
                        floor_no: Optional[int] = None
                        for l in self._floors:
                            # Check in which floor the forniture f is at the moment
                            if model.evaluate(self.atFloorForniture(f, l, t)).eq(
                                BoolVal(True)
                            ):
                                floor_no = l
                                break
                        # Register forniture state at time t
                        if floor_no is not None:
                            self._solution.add_forniture_state(
                                t,
                                FornitureState(
                                    self._actual_forniture[int(f[1:]) - 1], floor_no
                                ),
                            )
                # Return the solution
                return self._solution
            else:
                return None
        finally:
            # In any case, mark the problem as solved
            self._is_solved = True

    #
    # UTILITY FUNCTIONS TO ACCESS STATE VARIABLES
    #
    def atFloor(self, mover_id: ID, floor_no: int, time: int) -> BoolRef:
        return self._variables[
            VariableNameFormat.atFloorFormat(mover_id, floor_no, time)
        ]

    def atFloorForniture(self, forniture_id: ID, floor_no: int, time: int) -> BoolRef:
        return self._variables[
            VariableNameFormat.atFloorFornitureFormat(forniture_id, floor_no, time)
        ]

    def ascend(self, mover_id: ID, time: int) -> BoolRef:
        return self._variables[VariableNameFormat.ascendFormat(mover_id, time)]

    def descend(self, mover_id: ID, time: int) -> BoolRef:
        return self._variables[VariableNameFormat.descendFormat(mover_id, time)]

    def carry(self, mover_id: ID, forniture_id: ID, time: int) -> BoolRef:
        return self._variables[
            VariableNameFormat.carryFormat(mover_id, forniture_id, time)
        ]

    @EnsureSolved
    def get_solution(self):
        return self._solution
