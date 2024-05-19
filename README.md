# Movers<!-- omit in toc -->

Theory of Computation, Spring 2024

## DEV NOTES<!-- omit in toc -->

Python z3-solver examples: <https://github.com/Z3Prover/z3/tree/master/examples/python>

## Table of Contents<!-- omit in toc -->

- [1. Problem description](#1-problem-description)
  - [1.1. Constraints](#11-constraints)
- [2. Mathematical representation](#2-mathematical-representation)
  - [2.1. Sets / Domains](#21-sets--domains)
  - [2.2. Data](#22-data)
    - [2.2.1. Input parameters](#221-input-parameters)
    - [2.2.2. Variables describing the state of the system](#222-variables-describing-the-state-of-the-system)
    - [2.2.2. Variables describing actions of the movers on the system](#222-variables-describing-actions-of-the-movers-on-the-system)
- [2.3. Action definitions](#23-action-definitions)
  - [2.3. Constraints](#23-constraints)
- [3. Getting started](#3-getting-started)
- [4. System design](#4-system-design)
  - [4.1. Frontend - User Interface](#41-frontend---user-interface)
  - [4.2. Backend - APIs and Solver](#42-backend---apis-and-solver)

## 1. Problem description

In the _movers_ satisfability problem, a moving company is tasked with relocating all furniture from a building with multiple floors. The objective is to move all furniture to the ground floor within a given time frame (maximum number of time steps). For this task, the company has a team of movers of size $m$, and each mover is identified with a unique name, and can move up or down one floor at a time.

The building has $n$ floors, each identifier by a unique integer number. The building contains a set of forniture $F = \lbrace f_1, f_2, \ldots, f_n \rbrace$ to be moved. Each piece of forniture is located within the floors of the building, and there could be more than one piece of forniture in the same floor. The movers are initially located at the ground floor of the building, and they must move all forniture to the ground floor within a given time frame. By the end of the time frame, all movers and all forniture must be located at the ground floor in order to solve the problem.

When a mover is at the same floor as a piece of forniture, and decides to carry it, the mover and the forniture in question are moved together to the floor below.

### 1.1. Constraints

From the problem description, the following constraints can be identified:

1. The movers start at floor 0
2. Each mover can either move up or down one floor at a time, or stay in the same floor.
3. Each mover can carry at most one piece of forniture at a time. To carry a piece of forniture, the mover must be at the same floor as the forniture.
4. The carrying of forniture by the movers is not mandatory. A mover can move to a different floor without carrying any forniture.
5. At ground floor, the movers can only ascend to the first floor, as there are no floors below the ground floor.
6. Movers are not allowed to carry forniture that is already at the ground floor.
7. The movers and the forniture must be at the ground floor at maximum time step $max_t$. If they are able to reach the ground floor before $max_t$, the problem is considered also solved.

## 2. Mathematical representation

### 2.1. Sets / Domains

- $M = \lbrace m_1, m_2, \ldots, m_m \rbrace$: set of mover identifiers
- $L = \lbrace l_1, l_2, \ldots, l_n \rbrace$: set of floor identifiers ("levels") in the building
- $T = \lbrace t_1, t_2, \ldots, t_{max_t} \rbrace$: set of time step identifiers from $1$ to $max_t$
- $F = \lbrace f_1, f_2, \ldots, f_n \rbrace$: set of forniture to be moved by the movers

### 2.2. Data

#### 2.2.1. Input parameters

- $m \in \mathcal{N^{+}}$

> number of available movers to move the forniture

- $n \in \mathcal{N^{+}}$

> number of floors in the building

- $max_t \in \mathcal{N^{+}}$

> maximum number of time steps to solve correctly the problem

#### 2.2.2. Variables describing the state of the system

- $atFloor(m_i, l_j, t) \in \lbrace 0, 1 \rbrace \ \forall \ l_j \in L, \ m_i \in M$

> true if mover $m_i$ is at floor $l_j$ at time $t$

- $atFloorForniture(f_i, l_j, t) \in \lbrace 0, 1 \rbrace \ \forall \ l_j \in L, \ f_i \in F$:

> `true` if forniture $f_i$ is at floor $l_j$ at time $t$, otherwise `false`

#### 2.2.2. Variables describing actions of the movers on the system

- $ascend(m_i, t) \in \lbrace 0, 1 \rbrace \ \forall \ m_i \in M \ m_i \in M, \ t \in T$

> true if mover $m_i$ is ascending at time $t$

- $descend(m_i, t) \in \lbrace 0, 1 \rbrace \ \forall \ m_i \in M \ m_i \in M, \ t \in T$

> true if mover $m_i$ is descending at time $t$

- $carry(m_i, f_j, t) \in \lbrace 0, 1 \rbrace \ \forall \ m_i \in M \ f_j \in F, \ t \in T$

> true if mover $m_i$ is carrying forniture $f_k$ at time $t$, otherwise false

## 2.3. Action definitions

This section describes how the actions of the movers alter the state of the system.

1. Ascend: a mover can move up one floor at a time (except when at the last floor):

   - $\exists \ l \in L,\ m_i \in M: l < n \land atFloor(m_i, l, t) \land ascend(m_j, t) \implies atFloor(m_i, l+1, t+1)$

2. Descend: a mover can move down one floor at a time (except when at the ground floor)

   - $\exists \ l \in L,\ m_i \in M: l > 0 \land atFloor(m_i, l, t) \land descend(m_i, t) \implies atFloor(m_i, f-1, t+1)$

3. Carry: a mover can carry a piece of forniture if it is at the same floor as the mover. At the next time step, the mover and the forniture will be at the floor below:

   - $\exists \ l \in L,\ m_i \in M,\ f_j \in F: f > 0 \land atFloor(m_i, f, t) \land atFloorForniture(f_j, f, t) \land carry(m_i, f_j, t) \implies atFloor(m_i, l-1, t+1) \land atFloorForniture(f_j, f-1, t+1)$

### 2.3. Constraints

- Initial constrant: movers start at the ground floor

$\textcolor{red}{TODO!!!!}$

- Final constrant: movers end at the ground floor

$\textcolor{red}{TODO!!!!}$

- Each mover is exactly at one floor at a time

  $\forall t \in T,\ m_i \in M: \sum_{l_j \in L} atFloor(m_i, l_j, t) = 1$

_ Each mover stays at the same floor if not ascending or descending

$\textcolor{red}{TODO!!!!}$

- Each forniture is exactly at one floor at a time

$\textcolor{red}{TODO!!!!}$

- Each mover can only ascend or descend at a time

  $\forall t \in T,\ m_i \in M,\ f_j \in F: \forall m_i \in M: ascend(m_i, t) + descend(m_i, t) + carry(m_i, f_j, t) \leq 1$

- Each mover can only carry one piece of forniture at a time

  $\forall t \in T,\ m_i \in M: \sum_{f_j \in F} carry(m_i, f_j, t) \leq 1$

- Each piece of forniture can be carried by at most one mover

$\textcolor{red}{TODO!!!!}$

- If a forniture is not carried by anyone, it stays in the same floors

$\textcolor{red}{TODO!!!!}$


- A mover cannot carry an item which is already at the ground floor

  $\forall t \in T,\ m_i \in M: \forall f_k \in F: carry(m_i, f_k, t) \land atFloorForniture(f_k, 0, t) = \bot$

- A mover cannot carry an item which is not at the same floor as the mover

  $\forall t \in T,\ l \in L, m_i \in M, f_j \in F: carry(m_i, f_j, t)$ and $atFloor(m_i, l, t) \land \lnot atFloorForniture(f_j, l, t) = \bot$

> Already enforced by the `carry` action definition.

- A mover cannot ascend from the last floor (no more floors available)

  $\forall t \in T,\ m_i \in M: ascend(m_i, t) \land atFloor(m_i, n, t) = \bot$

> Already enforced by the `ascend` action definition

- A mover cannot descend from the ground floor (no more floors available)

  $\forall t \in T,\ m_i \in M: descend(m_i, t) \land atFloor(m_i, 0, t) = \bot$

> Already enforced by the `descend` action definition

## 3. Getting started

Please, refer to the [Getting Started](./docs/getting-started.md) guide to learn how to properly run the tool.

## 4. System design

The system has been divided into a frontend and a backend. The frontend is responsible for receiving the problem instance from the user, and sending it to the backend for processing. The backend will receive the problem data from a specialized API, and will solve the problem using the z3-solver. The solution will be sent back to the frontend as a response.

In the following sections, the frontend and backend will be described in more detail.

### 4.1. Frontend - User Interface

> add meaningful description here

### 4.2. Backend - APIs and Solver

The backend, as previously mentioned, is responsible for receiving the problem instance from the frontend, and solving it using the z3-solver. The backend exposes a single endpoint `/solve` which receives a JSON object containing the problem instance, and returns a JSON object with the solution.

This is the structure of a call to the `/solve` endpoint on the backend started on the local machine:

```bash
curl -X POST -H "Content-Type: application/json"
      --data '{"max_t": 10, "forniture": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}'
      http://localhost:5000/solve?m=2&n=5?max_t=10
```

<!-- FIXME: we should only use POST parameters -->
