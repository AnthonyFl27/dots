#!/bin/bash

# Menu de energia con wofi usando style.css
# Opciones: apagar, reiniciar, cerrar sesion, suspender

opciones="Apagar\nReiniciar\nCerrar sesion\nSuspender\nBloquear"

seleccion=$(printf "$opciones" | wofi \
    --dmenu \
    --prompt "" \
    --cache-file /dev/null \
    --style "$HOME/.config/wofi/power.css" \
    --conf /dev/null \
    --width 180 \
    --height 220 \
    --yoffset -20 \
    --xoffset -20 \
    --location 3 \
    --normal-window)

case "$seleccion" in
    "Apagar")
        systemctl poweroff
        ;;
    "Reiniciar")
        systemctl reboot
        ;;
    "Cerrar sesion")
        if [ "$XDG_SESSION_DESKTOP" = "sway" ] || [ "$XDG_CURRENT_DESKTOP" = "sway" ]; then
            swaymsg exit
        elif [ "$XDG_CURRENT_DESKTOP" = "Hyprland" ]; then
            hyprctl dispatch exit
        else
            loginctl terminate-session $XDG_SESSION_ID
        fi
        ;;
    "Suspender")
        systemctl suspend
        ;;
    "Bloquear")
        hyprlock
        ;;
    *)
        exit 0
        ;;
esac