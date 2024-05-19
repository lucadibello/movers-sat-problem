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
from z3 import Bool, Solver, Implies, Not, Or, And, sat


# #################################################################
#                           INPUTS
# #################################################################

# Define the number of floors and movers
m: int = 3
n: int = 3
max_t = 10

# Create list of movers
movers = ["Joe", "Bill", "Mia"]
floors = [0, 1, 2]
forniture = ["table", "chair"]
forniture_initial_level = [1, 2]
times = [t for t in range(max_t)]


# #################################################################
#                           VARIABLES
# #################################################################


# Functions that generate the boolean variables

def atFloor(m, l, t):
    return Bool(f"atFloor({m},{l},{t})")

def atFloorForniture(f, l, t):
    return Bool(f"atFloorForniture({f},{l},{t})")

def ascend(m, t):
    return Bool(f"ascend({m},{t})")

def descend(m, t):
    return Bool(f"descend({m},{t})")

def carry(m, f, t):
    return Bool(f"descend({m},{f},{t})")


# #################################################################
#                           ACTIONS
# #################################################################


s = Solver()

# Ascend: 
#  a mover can move up one floor at a time if it's not at the last floor
for t in range(max_t - 1):
    for m in movers:
        for l in floors:
            if l < n:
                s.add(Implies(
                    ascend(m, t), 
                    Implies(
                        atFloor(m, l, t), 
                        atFloor(m, l + 1, t + 1))))

           

# Descend: 
#  a mover can move down one floor at a time if it's not at the ground floor
for t in range(max_t - 1):
    for m in movers:
        for l in floors:
            if l > 0:
                s.add(Implies(
                    descend(m, t), 
                    Implies(
                        atFloor(m, l, t), 
                        atFloor(m, l - 1, t + 1))))

# Carry: 
#  a mover can carry a piece of forniture if it is at the same floor as the mover (and not at ground floor). 
# At the next time step, the mover and the forniture will be at the floor below:
for t in range(max_t - 1):
    for m in movers:
        for l in floors:
            for f in forniture:
                if l > 0:
                    s.add(Implies(
                        carry(m, f, t), 
                        Implies(
                            And(atFloor(m, l, t), atFloorForniture(f, l, t)), 
                            And(atFloor(m, l - 1, t + 1), atFloorForniture(f, l - 1, t + 1)))))

# #################################################################
#                           CONSTRAINTS
# #################################################################

# Initial constraint: movers start at the ground floor
for m in movers:
    s.add(atFloor(m, 0, 0))

# Initial constraint: forniture starts at the input floors
for i in range(len(forniture)):
    s.add(atFloorForniture(forniture[i], forniture_initial_level[i], 0))

# Final constraint: movers end at the ground floor at max_t
for m in movers:
    s.add(atFloor(m, 0, max_t))

# Final constraint: all forniture end at the ground floor at max_t
for f in forniture:
    s.add(atFloorForniture(f, 0, max_t))

# Each mover is exactly at one floor at each time
for t in times:
    for m in movers:
        # mover is at least at one floor
        s.add(Or([atFloor(m, f, t) for f in floors]))
        for f1 in floors:
            for f2 in floors:
                if f1 != f2:
                    # mover is not at more than one floor
                    s.add(Implies(atFloor(m, f1, t), Not(atFloor(m, f2, t))))

# Each forniture is exactly at one floor at each time
for t in times:
    for f in forniture:
        # forniture is at least at one floor
        s.add(Or([atFloorForniture(f, l, t) for l in floors]))
        for l1 in floors:
            for l2 in floors:
                if l1 != l2:
                    # forniture is not at more than one floor
                    s.add(Implies(atFloor(f, l1, t), Not(atFloor(f, l2, t))))

# Each mover can do only one action at a time
for t in times:
    for m in movers:
        s.add(Implies(ascend(m, t), Not(descend(m, t))))
        s.add(Implies(descend(m, t), Not(ascend(m, t))))
        for f in forniture:
            s.add(Implies(ascend(m, t), Not(carry(m, f, t))))
            s.add(Implies(descend(m, t), Not(carry(m, f, t))))
            s.add(Implies(carry(m, f, t), Not(ascend(m, t))))
            s.add(Implies(carry(m, f, t), Not(descend(m, t))))

# Each forniture can be carried by at most one mover
for t in times:
    for f in forniture:
        for m1 in movers:
                for m2 in movers:
                    if m1 != m2:
                        s.add(Implies(carry(m1, f, t), Not(atFloor(m2, f, t))))

# Each mover can carry at most one piece of forniture
for t in times:
    for m in movers:
        for f1 in forniture:
                for f2 in forniture:
                    if f1 != f2:
                        s.add(Implies(carry(m, f1, t), Not(atFloor(m, f2, t))))

# If a forniture is not carried by anyone, it stays in the same floors
for t in times:
    for f in forniture:
        for m in movers:
            for l in floors:
                s.add(Implies(
                    And(Not(carry(m, f, t)), atFloorForniture(f, l, t)), 
                    atFloorForniture(f, l, t+1)
                ))

# A mover cannot carry an item which is already at the ground floor
for t in times:
    for m in movers:
        for f in forniture:
            s.add(Implies(atFloorForniture(f, 0, t), Not(carry(m, f, t))))


# check satisfability
if s.check() == sat:
    print("Satisfiable: There is a solution.")
    m = s.model()
    for t in range(max_t):
        for p in movers:
            if m.evaluate(ascend(p, t)):
                    print(f"ascend({p}, {t})")
            if m.evaluate(descend(p, t)):
                    print(f"descend({p}, {t})")
            for l in floors:
                if m.evaluate(atFloor(p, l, t)):
                    print(f"atFloor({p}, {l}, {t})")
                for f in forniture:
                    if m.evaluate(carry(p, f, t)):
                        print(f"carry({p}, {f}, {t})")
        for f in forniture:
            for l in floors:
                if m.evaluate(atFloorForniture(f, l, t)):
                    print(f"atFloorForniture(({f}, {l}, {t})")
                    
            
else:
    print("Unsatisfiable: No solution exists.")
