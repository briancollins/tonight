#!/bin/bash

docker build . -t tonight
docker run -v `dirname BASH_SOURCE[0]`/data:/var/whatsapp tonight
