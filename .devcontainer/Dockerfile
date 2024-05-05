FROM mcr.microsoft.com/devcontainers/anaconda:0-3

COPY ./environment.yml /tmp/environment.yml

# Create environment from file
RUN /opt/conda/bin/conda env create -f /tmp/environment.yml

# Change shell command
SHELL ["/bin/bash", "-c"]

# Initialize conda
RUN conda init bash
# Now, change the UMASK
RUN umask 0002
# Activate environment
RUN source /opt/conda/bin/activate movers
# Permanently activate environment
RUN echo "source /opt/conda/bin/activate movers" >> ~/.bashrc
# Delete environment file
RUN rm /tmp/environment.yml

# Go to tmp directory
WORKDIR /tmp
# Clone z3 repository
RUN git clone https://github.com/Z3Prover/z3.git
WORKDIR /tmp/z3

# Build z3
RUN python3 scripts/mk_make.py
WORKDIR /tmp/z3/build
RUN make
RUN make install