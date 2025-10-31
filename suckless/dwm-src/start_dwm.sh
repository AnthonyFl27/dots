#!/bin/bash

/home/$USER/new_dots/dwm/status.sh &
nitrogen --restore &
exec dwm
