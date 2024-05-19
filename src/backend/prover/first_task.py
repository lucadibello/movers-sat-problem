from typing import Dict
from z3 import Bool, Solver, Implies, Not, Or, And, sat


# #################################################################
#                           INPUTS
# #################################################################

# Define the number of floors and movers
m: int = 3
n: int = 3
max_t = 7

# Create list of movers
movers = ["Joe", "Bill", "Mia"]
floors = [0, 1, 2]
forniture = ["table", "chair", "plant"]
forniture_initial_level = [2, 2, 1]


# #################################################################
#                           VARIABLES
# #################################################################

variables = {}  # dictionary mapping variable name to Bool

# functions that give string representation of variables

def atFloorFormat(m, l, t):
    return f"atFloor({m},{l},{t})"

def atFloorFornitureFormat(f, l, t):
    return f"atFloorForniture({f},{l},{t})"

def ascendFormat(m, t):
    return f"ascend({m},{t})"

def descendFormat(m, t):
    return f"descend({m},{t})"

def carryFormat(m, f, t):
    return f"carry({m},{f},{t})"


# generate variables
for t in range(max_t + 1):
    for m in movers:
        variables[ascendFormat(m, t)] = Bool(ascendFormat(m, t))
        variables[descendFormat(m, t)] = Bool(descendFormat(m, t))
        for l in floors:
            variables[atFloorFormat(m, l, t)] = Bool(atFloorFormat(m, l, t))
        for f in forniture:
            variables[carryFormat(m, f, t)] = Bool(carryFormat(m, f, t))
    for f in forniture:
        for l in floors:
            variables[atFloorFornitureFormat(f, l, t)] = Bool(atFloorFornitureFormat(f, l, t))


# Functions that retreive the corresponding variable

def atFloor(m, l, t):
    return variables[atFloorFormat(m, l, t)]

def atFloorForniture(f, l, t):
    return variables[atFloorFornitureFormat(f, l, t)]

def ascend(m, t):
    return variables[ascendFormat(m, t)]

def descend(m, t):
    return variables[descendFormat(m, t)]

def carry(m, f, t):
    return variables[carryFormat(m, f, t)]


# #################################################################
#                           ACTIONS
# #################################################################


s = Solver()

# Ascend:
for t in range(max_t):
    for m in movers:
        for l in floors:
            if l < n - 1:
                s.add(Implies(And(ascend(m, t), atFloor(m, l, t)), atFloor(m, l + 1, t + 1)))

# Descend:
for t in range(max_t):
    for m in movers:
        for l in floors:
            if l > 0:
                s.add(Implies(And(descend(m, t), atFloor(m, l, t)), atFloor(m, l - 1, t + 1)))

# Carry:
for t in range(max_t):
    for m in movers:
        for f in forniture:
            for l in floors:
                if l > 0:
                    s.add(Implies(
                        And(carry(m, f, t), atFloor(m, l, t), atFloorForniture(f, l, t)), 
                        And(atFloor(m, l - 1, t + 1), atFloorForniture(f, l - 1, t + 1))))


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
    s.add(atFloor(m, 0, max_t - 1))

# Final constraint: all forniture end at the ground floor at max_t
for f in forniture:
    s.add(atFloorForniture(f, 0, max_t - 1))

# Each mover is exactly at one floor at each time
for t in range(max_t):
    for m in movers:
        # mover is at least at one floor
        s.add(Or([atFloor(m, f, t) for f in floors]))
        for f1 in floors:
            for f2 in floors:
                if f1 != f2:
                    # mover is not at more than one floor
                    s.add(Implies(atFloor(m, f1, t), Not(atFloor(m, f2, t))))
                    
# If a mover is not ascending, descending, or carrying it stays at the same floor
for t in range(max_t - 1):
    for m in movers:
        for l in floors:
            s.add(Implies(
                And(
                    Not(Or(ascend(m, t), descend(m, t))),
                    Not(Or([carry(m, f, t) for f in forniture])), 
                    atFloor(m, l, t)),
                atFloor(m, l, t + 1)
            ))

# Each forniture is exactly at one floor at each time
for t in range(max_t):
    for f in forniture:
        # forniture is at least at one floor
        s.add(Or([atFloorForniture(f, l, t) for l in floors]))
        for l1 in floors:
            for l2 in floors:
                if l1 != l2:
                    # forniture is not at more than one floor
                    s.add(Implies(atFloorForniture(f, l1, t), Not(atFloorForniture(f, l2, t))))

# Each mover can do only one action at a time
for t in range(max_t):
    for m in movers:
        s.add(Implies(ascend(m, t), Not(descend(m, t))))
        s.add(Implies(descend(m, t), Not(ascend(m, t))))
        for f in forniture:
            s.add(Implies(ascend(m, t), Not(carry(m, f, t))))
            s.add(Implies(descend(m, t), Not(carry(m, f, t))))
            s.add(Implies(carry(m, f, t), Not(ascend(m, t))))
            s.add(Implies(carry(m, f, t), Not(descend(m, t))))

# Each forniture can be carried by at most one mover
for t in range(max_t):
    for f in forniture:
        for m1 in movers:
            for m2 in movers:
                if m1 != m2:
                    s.add(Implies(carry(m1, f, t), Not(carry(m2, f, t))))
    

# Each mover can carry at most one piece of forniture
for t in range(max_t):
    for m in movers:
        for f1 in forniture:
            for f2 in forniture:
                if f1 != f2:
                    s.add(Implies(carry(m, f1, t), Not(carry(m, f2, t))))

# If a forniture is not carried by anyone, it stays in the same floors
for t in range(max_t - 1):
    for f in forniture:
        for l in floors:
            s.add(Implies(
                And(Not(Or([carry(m, f, t) for m in movers])), atFloorForniture(f, l, t)),
                atFloorForniture(f, l, t + 1)
            ))

# A mover cannot carry an item which is already at the ground floor
for t in range(max_t):
    for m in movers:
        for f in forniture:
            s.add(Implies(atFloorForniture(f, 0, t), Not(carry(m, f, t))))

# A mover has to be on the same floor as an item in order to carry it
for t in range(max_t):
    for m in movers:
        for f in forniture:
            for l1 in floors:
                for l2 in floors:
                    if l1 != l2:
                        s.add(Implies(
                            And(atFloorForniture(f, l1, t), atFloor(m, l2, t)),
                            Not(carry(m, f, t))
                        ))

# movers cannot ascend if they are at the top floor
for t in range(max_t):
    for m in movers:
        s.add(Implies(atFloor(m, n-1, t), Not(ascend(m, t))))

# movers cannot descend if they are at the ground floor
for t in range(max_t):
    for m in movers:
        s.add(Implies(atFloor(m, 0, t), Not(descend(m, t))))



# #################################################################
#                           SOLUTION
# #################################################################

if s.check() == sat:
    print("Satisfiable\n")
    model = s.model()
    
    for t in range(max_t):
        print(f"Time {t}:")
        for m in movers:
            for l in floors:
                if model.evaluate(atFloor(m, l, t)):
                    print(f"  {m} is at floor {l}")
            if model.evaluate(ascend(m, t)):
                print(f"  {m} ascends")
            if model.evaluate(descend(m, t)):
                print(f"  {m} descends")
            for f in forniture:
                if model.evaluate(carry(m, f, t)):
                    print(f"  {m} carries {f}")
        for f in forniture:
            for l in floors:
                if model.evaluate(atFloorForniture(f, l, t)):
                    print(f"  {f} is at floor {l}")
        print()
else:
    print("Unsatsfiable\n")

