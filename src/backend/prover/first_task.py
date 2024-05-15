# The following exercises concern encoding of the movers problem: Your moving company is
# given a task to carry all furniture of a building with n floors with a team of m people to the
# ground floor. An example configuration for m = n = 3 is given in Fig. 1. Each person is capable
# of carrying exactly one item. The goal is to carry out this task in an optimal number of steps
# using the actions described in Table 1. In the initial situation all persons are on the ground floor,
# i.e., the floor 0, and all items and movers end up on the ground floor in the end.
# I suggest you proceed in the modeling task incrementally. Common to all tasks is that
# • All actions must be encoded as Boolean variables, and you most likely will need to specify
# extra variables to help in the modeling task; and
# • every problem corresponds to determining whether it is possible to accomplish the task in
# i discrete time steps.

# Your first task is to model the effect of persons climbing and descending
# independently of each other in the building. The fact that a person p is on floor f at time
# step t is represented by the propositional variable atFloor(p, f, t). Thus, for instance, if
# atFloor(Joe, 0, 0) is true and ascends(Joe, 0), then atFloor(Joe, 1, 1) should also be true.
# You may ignore the furniture for now.
# Show using your encoding of the above problem and a call to a SAT solver that in the case
# where there are three persons in the initial position
# atFloor(Joe, 0, 0), atFloor(Bill, 0, 0), atFloor(Mia, 0, 0)
# it is possible to reach the final position
# atFloor(Joe, 2, 2), atFloor(Bill, 2, 2), atFloor(Mia, 2, 2).
# Use the setting m = n = 3 again
from typing import Dict
from z3 import Bool, Solver, Implies, Not, Int


class Forniture:
    def __init__(self, name: str, floor: int) -> None:
        self._name = name
        self._floor = floor

    @property
    def name(self):
        return self._name

    @property
    def floor(self):
        return self._floor


# Some prefixes for the variables/constraint names
AT_FLOOR_PREFIX = "atFloor"
AT_FLOOR_FORNITURE_PREFIX = "atFloorForniture"
ASCEND_PREFIX = "ascend"
DESCEND_PREFIX = "descend"
CARRY_PREFIX = "carry"

# Define the number of floors and movers
m: int = 3
n: int = 3
max_t = 10

# Create list of movers
movers = ["Joe", "Bill", "Mia"]
floors = [0, 1, 2]
forniture = [
    Forniture(name="table", floor=1),
    Forniture(name="chair", floor=0),
]

# Create a list of all the variables representing the state of the movers
# at a given time ()
s = Solver()

AtFloor = Dict[str, Dict[int, Dict[int, Bool]]]

# Create important variables
atFloor: AtFloor = {}
atFloorForniture: AtFloor = {}
for mover in movers:
    for floor in floors:
        for time in range(max_t):
            # Build nested dictionary
            atFloor[mover] = {}
            atFloor[mover][floor] = {}

            # Create + register the variable
            atFloor[mover][floor][time] = Bool(
                f"{mover}_{AT_FLOOR_PREFIX}_{floor}_{time}"
            )
            s.add(atFloor[mover][floor][time])

            # TODO: Ascend, descend

for f in forniture:
    for floor in floors:
        for time in range(max_t):
            # Build nested dictionary
            atFloorForniture[f.name] = {}
            atFloorForniture[f.name][floor] = {}

            atFloorForniture[f.name][floor][time] = Bool(
                f"{f.name}_{AT_FLOOR_FORNITURE_PREFIX}_{floor}_{time}"
            )
            # register varaible in solver
            s.add(atFloorForniture[f.name][floor][time])

# TODO: Create variables for carry!

# Print all the variables of the solver
for var in s.assertions():
    print(var)

exit()

# Model each action as a boolean variable
ascend = dict[str, Int]()
descend = dict[str, Int]()
carry = dict[str, Int]()
for mover in movers:
    for time in range(max_t):
        ascend[mover] = Bool(f"{mover}_ascend_{time}")
        descend[mover] = Bool(f"{mover}_descend_{time}")
        carry[mover] = Bool(f"{mover}_carry_{time}")
        s.add(ascend[mover], descend[mover], carry[mover])

# Model also the effect of the actions on the state of the movers
# at a given time
for mover in movers:
    for time in range(max_t):
        for floor in floors:
            s.add(Implies(ascend[mover], atFloor[mover][floor + 1][time + 1]))
            s.add(Implies(descend[mover], atFloor[mover][floor - 1][time + 1]))
            s.add(Implies(carry[mover, floor], atFloor[mover][floor - 1][time + 1]))

            # at time 0, the movers are in the ground floor
            if time == 0:
                s.add(atFloor[mover][0][0])

            if floor == 0:
                s.add(Not(descend[mover]))
                s.add(Not(carry[mover, floor]))
            if floor == m:
                s.add(Not(ascend[mover]))
                s.add(Not(carry[mover, floor]))

# Add the initial and final conditions

# 1) All movers are in the ground floor at time 0 and
# they cannot be in any other floor
for mover in movers:
    for time in range(max_t):
        if time == 0:
            s.add(atFloor[mover][0][0])
        else:
            s.add(Not(atFloor[mover][0][time]))

# 2) At time t, all movers are at the start state
for mover in movers:
    s.add(atFloor[mover][0][max_t])
