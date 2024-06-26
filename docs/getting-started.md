# Getting started

This guide will help you to install the tool and run your first network.

## Requirements

- Python 3.6 or higher
- `pip` (Python package manager) or `conda` (Anaconda package manager)

## Step 1: Clone the repository

You can clone the repository using `git`:

```bash
# With SSH
git clone git@github.com:lucadibello/movers-sat-problem.git && cd movers-sat-problem
# With HTTPS
git clone https://github.com/lucadibello/movers-sat-problem.git && cd movers-sat-problem
```

## Step 2: Install python requirements

To install the required Python packages, you can either use `pip` (to install the packages globally) or use `conda` (preferred method) to create a virtual environment and install the packages locally.

Option A: Using `conda`:

```bash
# Create virtual environment + install packages
conda env create --file=environment.yml
# Activate the virtual environment
conda activate movers
```

Option B: Using `pip`:

```bash
# Install the required packages
pip install -r requirements.txt
```

## Step 3: Run the backend

```bash
# Start the backend in production mode
cd ./src/backend && make start
```

or, if you want to start the backend in development mode (with *fast refresh*):

```bash
# Start the backend in production mode
cd ./src/backend && make dev
```


> We need to write something here!
