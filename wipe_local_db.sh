#!/usr/bin/env bash

# This script should be executed from src/gameboardapp directory

rm db.sqlite3
rm gameboard/migrations/00*.py

python manage.py makemigrations gameboard
python manage.py migrate --run-syncdb