# Atajos de teclado de Sway

Configuración extraída de `~/.config/sway/config`.

- **`$mod`** = tecla `Super/Windows` (`Mod4`)
- **`$term`** = `alacritty`
- **`$menu`** = `wmenu-run`
- **Direcciones (estilo Vim)** = `h` (izq), `j` (abajo), `k` (arriba), `l` (der)

## Básicos

| Atajo | Acción |
|-------|--------|
| `$mod + Return` | Abrir terminal |
| `$mod + q` | Cerrar ventana enfocada |
| `$mod + d` | Abrir lanzador de aplicaciones |
| `$mod + Shift + c` | Recargar configuración de Sway |
| `$mod + Shift + e` | Salir de Sway (confirma antes) |

## Navegación

| Atajo | Acción |
|-------|--------|
| `$mod + h/j/k/l` | Mover foco (izquierda/abajo/arriba/derecha) |
| `$mod + Left/Down/Up/Right` | Mover foco con flechas |
| `$mod + Shift + h/j/k/l` | Mover ventana enfocada |
| `$mod + Shift + Left/Down/Up/Right` | Mover ventana enfocada con flechas |

## Espacios de trabajo

| Atajo | Acción |
|-------|--------|
| `$mod + 1..0` | Cambiar al espacio de trabajo 1–10 |
| `$mod + Shift + 1..0` | Mover ventana al espacio de trabajo 1–10 |

## Diseño de ventanas

| Atajo | Acción |
|-------|--------|
| `$mod + b` | División horizontal (`splith`) |
| `$mod + v` | División vertical (`splitv`) |
| `$mod + s` | Apilamiento (`stacking`) |
| `$mod + w` | Pestañas (`tabbed`) |
| `$mod + e` | Alternar división |
| `$mod + f` | Pantalla completa |
| `$mod + Shift + space` | Alternar flotante / tiling |
| `$mod + space` | Cambiar foco entre área tiling y flotante |
| `$mod + a` | Foco al contenedor padre |

## Scratchpad

| Atajo | Acción |
|-------|--------|
| `$mod + Shift + minus` | Enviar ventana al scratchpad |
| `$mod + minus` | Mostrar/ocultar ventana del scratchpad |

## Redimensionar (`$mod + r`)

Entra en modo resize; usa las teclas de dirección para cambiar el tamaño.

| Atajo | Acción |
|-------|--------|
| `h / Left` | Reducir anchura |
| `j / Down` | Aumentar altura |
| `k / Up` | Reducir altura |
| `l / Right` | Aumentar anchura |
| `Return / Escape` | Salir del modo resize |

## Funciones especiales

| Atajo | Acción |
|-------|--------|
| `XF86AudioMute` | Silenciar audio |
| `XF86AudioLowerVolume` | Bajar volumen 5% |
| `XF86AudioRaiseVolume` | Subir volumen 5% |
| `XF86AudioMicMute` | Silenciar micrófono |
| `XF86MonBrightnessDown` | Bajar brillo 5% |
| `XF86MonBrightnessUp` | Subir brillo 5% |
| `Print` | Captura de pantalla con `grim` |
