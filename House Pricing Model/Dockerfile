FROM ubuntu:latest

MAINTAINER Juan Corp

# Local directory with project source
ENV DOCKYARD_SRC=APP
#Directory in container for all project files
ENV DOCKYARD_SRVHOME=/srv
# Directory in container for project source files
ENV DOCKYARD_SRVPROJ=/srv/APP
ENV DOCKYARD_SRVNPM=/srv/APP/static

# Update the default repository sources list
RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y curl
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update && apt-get install -y python3.6

#Create application subdirectories
WORKDIR $DOCKYARD_SRVHOME
RUN mkdir static


RUN apt install -y python3-distutils
# Install Python dependencies
RUN apt-get update && apt-get install -y python3.6-dev
RUN apt-get update && apt-get install -y g++ && apt-get install -y make
ENV PIP_DEFAULT_TIMEOUT=10000
COPY $DOCKYARD_SRC/requirements.txt $DOCKYARD_SRVPROJ/requirements.txt
WORKDIR $DOCKYARD_SRVPROJ/
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
  	nginx \
  	supervisor && \
     rm -rf /var/lib/apt/lists/*

RUN python3.6 -m pip install virtualenv
RUN virtualenv --no-site-packages venv
RUN . venv/bin/activate && python3.6 -m pip install uwsgi


RUN . venv/bin/activate && python3.6 -m pip install --no-cache-dir -r requirements.txt
COPY $DOCKYARD_SRC/static/build/transformed.js $DOCKYARD_SRVPROJ/static/build/transformed.js
COPY $DOCKYARD_SRC $DOCKYARD_SRVPROJ
EXPOSE 9000
WORKDIR $DOCKYARD_SRVPROJ
COPY ./docker-entrypoint.sh /
ENTRYPOINT . venv/bin/activate; \
           cd /APP; \
           python APP.py
