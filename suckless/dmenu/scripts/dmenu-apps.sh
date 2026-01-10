#!/bin/bash

# --- CONFIGURACIÓN ---
TERMINAL="alacritty -e"
FONT="Iosevka:size=12"
BG="#141414"
FG="#868686"
SEL_BG="#252525"
SEL_FG="#868686"

# Rutas de aplicaciones
FLATPAK_DIR=$(flatpak --installations 2>/dev/null | head -n 1)/exports/share/applications
DIRS="/usr/share/applications $FLATPAK_DIR $HOME/.local/share/applications"

# 1. Crear el mapeo: "ID_Archivo | Nombre"
# -h: no muestra el nombre del archivo en el grep
# -m 1: solo la primera vez que encuentre Name=
MAPEO=$(grep -r -h -m 1 "^Name=" $DIRS 2>/dev/null --with-filename | sed 's|^.*/||; s/\.desktop:Name=/|/')

# 2. Lanzar dmenu con el prompt "Run:"
SELECCION=$(echo "$MAPEO" | cut -d'|' -f2 | sort -u | dmenu -i -p "Run:" -fn "$FONT" -nb "$BG" -nf "$FG" -sb "$SEL_BG" -sf "$SEL_FG")

# 3. Procesar la selección
if [ -n "$SELECCION" ]; then
    # Recuperamos el ID (nombre del archivo .desktop) buscando la línea que termina en |Nombre
    ID_APP=$(echo "$MAPEO" | grep -F "|$SELECCION" | head -n 1 | cut -d'|' -f1)
    
    # Buscamos la ruta completa del archivo para leer sus propiedades
    FILE_PATH=$(find -L $DIRS -name "${ID_APP}.desktop" | head -n 1)
    
    # Verificamos si requiere terminal
    if grep -iq "^Terminal=true" "$FILE_PATH"; then
        # Extraemos el comando y limpiamos argumentos %u, %f, etc.
        EXEC_CMD=$(grep -i "^Exec=" "$FILE_PATH" | head -n 1 | cut -d'=' -f2- | sed 's/%.//g')
        $TERMINAL $EXEC_CMD
    else
        # Lanzamiento normal o Flatpak
        gtk-launch "$ID_APP" 2>/dev/null || flatpak run "$ID_APP" 2>/dev/null
    fi
fi
