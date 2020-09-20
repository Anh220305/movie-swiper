#!/bin/bash

export PORT=80
cd moviefindr
sudo python3 manage.py runserver 0.0.0.0:8000 &
cd ../movie-findr-web
npm start & 
