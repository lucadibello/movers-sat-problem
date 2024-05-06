# Import z3 prover
import builtins
from z3 import *

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
from ..modules.models import Forniture

# Define the number of floors and movers
m: int = 3
n: int = 3

# FIXME: t is a variable given by the user
t = 10

# Create list of movers
movers = ['Joe', 'Bill', 'Mia']
floors = [0, 1, 2]
forniture = [
    Forniture('flowerpot', 1),
    Forniture('chair', 0),
    Forniture('piano', 0),
    Forniture('table', 1),
    Forniture('sofa', 1),
]

# Create a list of all the variables representing the state of the movers
# at a given time ()
s = Solver()

# Create a list of variables representing the state of the movers at a given time
atFloor = dict[str, dict[int, Bool]]()
for mover in movers:
    for floor in floors:
        for time in range(t):
            atFloor[mover][floor][time] = Bool(
                f'{mover}_atFloor_{floor}_{time}'
            )
            s.add(atFloor[mover][floor][time])

# Model each action as a boolean variable
ascend = dict[str, Int]()
descend = dict[str, Int]()
carry = dict[str, Int]()
for mover in movers:
    for time in range(t):
        ascend[mover] = Bool(f'{mover}_ascend_{time}')
        descend[mover] = Bool(f'{mover}_descend_{time}')
        carry[mover] = Bool(f'{mover}_carry_{time}')
        s.add(ascend[mover], descend[mover], carry[mover])

# Model also the effect of the actions on the state of the movers
# at a given time
for mover in movers:
    for time in range(t):
        for floor in floors:
            s.add(Implies(ascend[mover], atFloor[mover][floor + 1][time + 1]))
            s.add(Implies(descend[mover], atFloor[mover][floor - 1][time + 1]))
            s.add(Implies(carry[mover, floor],
                  atFloor[mover][floor-1][time + 1]))

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
    for time in range(t):
        if time == 0:
            s.add(atFloor[mover][0][0])
        else:
            s.add(Not(atFloor[mover][0][time]))

# 2) At time t, all movers are at the start state
for mover in movers:
    s.add(atFloor[mover][0][t])
