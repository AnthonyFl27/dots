# Helix Editor - Guía rápida de atajos

> Basado en config.toml personal + defaults de Helix 25.07

## Personalizados (`config.toml`)

| Tecla | Acción |
|-------|--------|
| `<space> q` | Cerrar vista (`:quit!`) |
| `<space> w` | Guardar (`:write`) |
| `<space> v` | Split vertical (`:vsplit`) |
| `<space> h` | Split horizontal (`:hsplit`) |
| `<space> e` | File explorer |

## File explorer (`<space> e`)

| Tecla | Acción |
|-------|--------|
| `j` / `k` | Navegar |
| `Enter` | Abrir archivo / expandir carpeta |
| `q` | Cerrar explorer |

## Navegación básica

| Tecla | Acción |
|-------|--------|
| `h` `j` `k` `l` | Moverse (izq, abajo, arriba, der) |
| `w` `b` `e` | Palabra siguiente / anterior / final |
| `gg` / `G` | Inicio / fin del archivo |
| `Ctrl-u` / `Ctrl-d` | Media página arriba / abajo |
| `Ctrl-b` / `Ctrl-f` | Página arriba / abajo |
| `%` | Seleccionar todo |
| `;` | Colapsar selección a un cursor |

## Ventanas / Splits

| Tecla | Acción |
|-------|--------|
| `<space> v` | Split vertical |
| `<space> h` | Split horizontal |
| `Ctrl-w v` | Split vertical (default) |
| `Ctrl-w s` | Split horizontal (default) |
| `Ctrl-w q` | Cerrar split |
| `Ctrl-w o` | Cerrar otros splits |
| `Ctrl-w w` | Siguiente split |
| `Ctrl-w h/j/k/l` | Navegar entre splits |
| `Ctrl-w H/J/K/L` | Mover split |

## Buffers / Pestañas

| Tecla | Acción |
|-------|--------|
| `gn` / `gp` | Buffer siguiente / anterior |
| `:q` | Cerrar buffer |
| `:bclose` / `:bc` | Cerrar buffer |
| `<space> b` | Buffer picker |
| `<space> f` | File picker |
| `<space> F` | File picker (directorio actual) |

## Edición

| Tecla | Acción |
|-------|--------|
| `i` / `a` | Insertar antes / después del cursor |
| `I` / `A` | Insertar inicio / fin de línea |
| `o` / `O` | Nueva línea abajo / arriba |
| `d` | Eliminar selección |
| `c` | Cambiar selección (eliminar + insertar) |
| `u` / `U` | Deshacer / rehacer |
| `y` / `p` | Copiar / pegar |
| `x` | Extender línea abajo |
| `X` | Extender a línea completa |
| `~` | Cambiar mayúscula/minúscula |
| `J` | Unir líneas |
| `r` | Reemplazar caracter |
| `R` | Reemplazar con texto copiado |

## Búsqueda

| Tecla | Acción |
|-------|--------|
| `/` / `?` | Buscar / buscar reverso |
| `n` / `N` | Siguiente / anterior coincidencia |
| `*` | Buscar palabra bajo cursor |
| `<space> /` | Búsqueda global en workspace |
| `s` | Seleccionar por regex |
| `S` | Dividir selección por regex |

## LSP / Language Server

| Tecla | Acción |
|-------|--------|
| `gd` | Ir a definición |
| `gr` | Ir a referencias |
| `gi` | Ir a implementación |
| `gy` | Ir a type definition |
| `<space> a` | Code actions |
| `<space> k` | Hover (documentación) |
| `<space> d` | Diagnostic picker |
| `]d` / `[d` | Siguiente / anterior diagnóstico |
| `<space> c` | Comentar / descomentar |
| `=` | Formatear selección |

## Archivos

| Tecla | Acción |
|-------|--------|
| `:w` | Guardar |
| `:q` | Cerrar vista |
| `:wq` / `:x` | Guardar y cerrar |
| `:e <archivo>` | Abrir archivo |
| `:o <archivo>` | Abrir archivo |
| `gf` | Ir a archivo bajo cursor |
| `:cd <dir>` | Cambiar directorio |
| `:pwd` | Mostrar directorio actual |

## Misceláneos

| Tecla | Acción |
|-------|--------|
| `:theme <nombre>` | Cambiar tema |
| `:tutor` | Abrir tutorial interactivo |
| `:config-open` | Abrir config.toml |
| `:reload` | Recargar archivo |
| `Tab` / `S-Tab` | Sangrar / desangrar |
| `ms` / `mr` / `md` | Surround: agregar / reemplazar / eliminar |
| `mi` / `ma` | Seleccionar dentro / alrededor de objeto |
