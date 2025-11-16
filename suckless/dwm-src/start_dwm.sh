#!/bin/bash

setxkbmap la-latin1 & # keyboard layout

/home/$USER/new_dots/dwm/status.sh & # status bar
nitrogen --restore & # wallpaper
exec dwm
