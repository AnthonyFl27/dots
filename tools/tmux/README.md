#### Tmux config file 
Configuración básica y funcional de Tmux sin plugins

Pegar tmux en `$HOME/.config`
```
cp -vr tmux /$HOME/.config/. 
```
Aplicar configuraciones, ingresando a `tmux` en la terminal y ejecutando `Ctrl + a + r`

#### Keybidings

| Atajo                | Acción                      |
| -------------------- | --------------------------- |
| Ctrl + a             | Prefijo principal           |
| Ctrl + a + c         | Nueva ventana               |
| Ctrl + a + #         | Moverse a ventana           |
| Ctrl + a + h         | Dividir panel en horizontal |
| Ctrl + a + v         | Dividir panel en vertical   |
| Ctrl + direccionales | Moverse entre paneles       |
| Ctrl + a + z         | Hacer zoom a panel activo   |
| Ctrl + a + x         | Cerrar panel o ventana      |
| Ctrl + a + w         | Resumen de la session       |
|                      |                             |
#### Vim copy mode

| Atajo         | Acción                           |
| ------------- | -------------------------------- |
| Ctrl + c      | Entrar al modo copy vim          |
| v             | Activamos la selección de texto  |
| Direccionales | Para copiar y salir              |
| Ctrl + P      | Para pegar dentro de la terminal |
