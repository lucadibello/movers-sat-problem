# Movers<!-- omit in toc -->

Theory of Computation, Spring 2024

## DEV NOTES<!-- omit in toc -->

Python z3-solver examples: <https://github.com/Z3Prover/z3/tree/master/examples/python>

## Table of Contents<!-- omit in toc -->

- [1. Problem description](#1-problem-description)
- [2. Mathematical representation](#2-mathematical-representation)
	- [2.1. Sets / Domains](#21-sets--domains)
	- [2.2. Data](#22-data)
	- [2.3. Mathematical model](#23-mathematical-model)
	- [2.4. Input data format](#24-input-data-format)
- [3. Getting started](#3-getting-started)
- [4. Solution](#4-solution)

## 1. Problem description

> Add meaningful text here

## 2. Mathematical representation

### 2.1. Sets / Domains

- $M = \lbrace m_1, m_2, \ldots, m_m \rbrace$: set of mover identifiers
- $L = \lbrace l_1, l_2, \ldots, l_n \rbrace$: set of floor identifiers ("levels") in the building
- $T = \lbrace t_1, t_2, \ldots, t_{max_t} \rbrace$: set of time step identifiers from $1$ to $max_t$
- $F = \lbrace f_1, f_2, \ldots, f_n \rbrace$: set of forniture to be moved by the movers

### 2.2. Data

- $m$: number of available movers to move the forniture
- $n$: number of floors in the building
- $max_t$: maximum time step available to the movers to move the forniture to floor $l_1$ (ground floor)
- $atFloor(m_i, l_j, t)$: true if mover $m_i$ is at floor $l_j$ at time $t$
- $ascend(m_i, t)$: true if mover $m_i$ is ascending at time $t$
- $descend(m_i, t)$: true if mover $m_i$ is descending at time $t$
- $carry(m_i, f_k, t)$: true if mover $m_i$ is carrying forniture $f_k$ at time $t$

### 2.3. Mathematical model

### 2.4. Input data format

## 3. Getting started

Please, refer to the [Getting Started](./docs/getting-started.md) guide to learn how to properly run the tool.

> Add meaningful description here

## 4. Solution

> Add meaningful text here
