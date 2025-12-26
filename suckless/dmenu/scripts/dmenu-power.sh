#!/bin/bash

# --- CONFIGURACIÓN ---
FONT="Iosevka:size=12"
BG="#141414"
FG="#868686"
SEL_BG="#252525"
SEL_FG="#868686"

# Opciones del menú en inglés
opciones="Poweroff\nReboot\nExit"

# Lanzar dmenu
seleccion=$(echo -e "$opciones" | dmenu -i -p "Power:" -fn "$FONT" -nb "$BG" -nf "$FG" -sb "$SEL_BG" -sf "$SEL_FG")

# Ejecutar acción según la selección
case "$seleccion" in
    Poweroff)
        loginctl poweroff
        ;;
    Reboot)
        loginctl reboot
        ;;
    Exit)
        # Cierra la sesión de dwm
        pkill dwm
        ;;
esac
