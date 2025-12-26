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

# 1. Crear el mapeo: "ID_Archivo | Nombre - (GenericName)"
# Este bucle genera la lista que verás en dmenu
MAPEO=$(find -L $DIRS -maxdepth 1 -name "*.desktop" 2>/dev/null | while read -r file; do
    ID=$(basename "$file" .desktop)
    NAME=$(grep -m 1 "^Name=" "$file" | cut -d'=' -f2)
    GNAME=$(grep -m 1 "^GenericName=" "$file" | cut -d'=' -f2)
    
    if [ -n "$GNAME" ]; then
        echo "$ID|$NAME - ($GNAME)"
    else
        echo "$ID|$NAME"
    fi
done)

# 2. Lanzar dmenu con el prompt "Run:" y tus colores
SELECCION=$(echo "$MAPEO" | cut -d'|' -f2 | sort -u | dmenu -i -p "Run:" -fn "$FONT" -nb "$BG" -nf "$FG" -sb "$SEL_BG" -sf "$SEL_FG")

# 3. Procesar la selección
if [ -n "$SELECCION" ]; then
    # Recuperamos el ID (nombre del archivo .desktop)
    ID_APP=$(echo "$MAPEO" | grep -F "|$SELECCION" | head -n 1 | cut -d'|' -f1)
    
    # Buscamos la ruta completa del archivo
    FILE_PATH=$(find -L $DIRS -name "${ID_APP}.desktop" | head -n 1)
    
    # Verificamos si es una aplicación de terminal
    IS_TERM=$(grep -i "^Terminal=true" "$FILE_PATH")

    if [ -n "$IS_TERM" ]; then
        # Extraemos el comando y limpiamos argumentos tipo %u o %f
        EXEC_CMD=$(grep -i "^Exec=" "$FILE_PATH" | head -n 1 | cut -d'=' -f2- | sed 's/%.//g')
        # Ejecutamos con Alacritty
        $TERMINAL $EXEC_CMD
    else
        # Lanzamiento normal o vía Flatpak
        gtk-launch "$ID_APP" 2>/dev/null || flatpak run "$ID_APP" 2>/dev/null
    fi
fi
