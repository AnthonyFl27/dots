#### Herdr config
Configuración de Herdr (app de escritorio): atajos, ajustes, layout `paradise`, tema y mods propios (`my-*`).

Instalar Herdr y abrirlo una vez (crea `~/.config/herdr-app`), luego copiar:
```
cp -vr herdr/{keys.json,settings.json,layouts,themes,mods} ~/.config/herdr-app/
```
Los cambios se aplican en vivo. Los mods y layouts que trae Herdr no se incluyen: los regenera la app.

Mods propios extra: `ask-close*` / `ask-quit` (confirmación al cerrar pane/tab/salir, teclas `ctrl-alt-x`, `ctrl-shift-w`, `ctrl-shift-q`) y `quiet-hours` (modo quiet con tablero de agentes, basado en curfew-herdr/quiet-hours, Apache-2.0). `quiet-hours` necesita `node` >= 18.
