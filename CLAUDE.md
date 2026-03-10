# Presentacion Avance Semanal — CAC

## Propósito
Slides semanales de avance por sub área de la Coordinación de Tecnología (CAC).
Formato de presentación estática en HTML/CSS puro — un archivo `index.html` por semana.

## Stack visual
- HTML5 semántico + CSS inline en `<style>` (todo en un solo archivo)
- Sin frameworks, sin JavaScript
- Font: Inter (Google Fonts) — pesos 400, 500, 600, 700, 800
- Dimensiones de slide: **1000px × 580px**

## Paleta de colores
| Variable | Hex | Uso |
|---|---|---|
| bg-body | `#050507` | Fondo de página |
| bg-slide | `#09090b` | Fondo del slide |
| bg-card | `rgba(12,12,18,0.95)` | Interior de cards |
| text-primary | `#f0f0f2` | Títulos |
| text-secondary | `#e0e0e5` | Card titles |
| text-muted | `#6e6e7a` | Cuerpo items |
| text-dim | `#47474f` | Subtítulos |
| text-badge | `#78788a` | Badge |

## Colores de área (temas de cards)
| Clase CSS | Color | Hex | Área |
|---|---|---|---|
| `.c-primary` | Azul | `#243A85` / `#4a6cf7` | Pruebas, Documentación y Soporte |
| `.c-info` | Magenta | `#C4297D` | Base de Datos |
| `.c-tertiary` | Verde | `#6ABF4B` | Infraestructura |
| `.c-amber` | Ámbar | `#F5A623` | Desarrollo |

## Componentes y patrones CSS

### Slide base
```html
<div class="slide">
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="content">
    <div class="header">...</div>
    <div class="divider"></div>
    <div class="grid">
      <!-- 4 cards: 2x2 grid -->
    </div>
  </div>
  <div class="footer-bar">
    <div class="bar-1"></div>  <!-- #243A85 -->
    <div class="bar-2"></div>  <!-- #C4297D -->
    <div class="bar-3"></div>  <!-- #6ABF4B -->
  </div>
</div>
```

### Card con borde gradiente
```html
<div class="card c-{color}">
  <div class="card-border"></div>
  <div class="card-inner">
    <div class="card-header">
      <div class="icon-box"><!-- SVG 14x14 --></div>
      <div class="card-title">Nombre Área</div>
    </div>
    <div class="items">
      <div class="item"><span class="num">1.</span><span>Texto del logro.</span></div>
      <div class="item empty"><span class="num">2.</span><span>—</span></div>
    </div>
  </div>
</div>
```

### Item vacío
```html
<div class="item empty"><span class="num">N.</span><span>—</span></div>
```

### Badge de fecha
```html
<div class="badge">
  <!-- SVG calendario 11x11 -->
  DD de Mes
</div>
```

## Efectos visuales clave
- **Noise texture**: SVG fractalNoise via `background-image` en `::after` del slide (opacity 0.025)
- **Ambient glow**: divs absolutos con `radial-gradient` — azul arriba-centro, magenta arriba-derecha
- **Card border trick**: padding 1px en `.card` + `.card-border` absoluto con gradient
- **Icon glow**: `::after` en `.icon-box` con `filter: blur(6px)`
- **Divider**: `linear-gradient` horizontal con los 3 colores de área
- **Footer bar**: 3 divs flex con los colores de área (5px de alto)

## Archivos del proyecto
- `index.html` — slide de la semana actual
- `LOGO-CAC-BLANCO.png` — logo (no se usa directamente en el slide actual)

## Sistema de Datos (JSON)

**IMPORTANTE:** Todos los contenidos se manejan mediante un archivo JSON centralizado.

### Estructura de datos
```
data/
└── data.json
```

### Formato JSON (con soporte de sub-viñetas)

**Items pueden ser:**
- **Strings simples** (viñeta principal solamente)
- **Objetos con `text` y `subitems`** (viñeta principal + sub-viñetas)

```json
{
  "metadata": {
    "title": "Avances Coordinación de Tecnología",
    "subtitle": "Semana del 10 de marzo, 2026",
    "week": "2026-03-10"
  },
  "cards": [
    {
      "id": "primary",
      "colorClass": "c-primary",
      "title": "Pruebas, Documentación y Soporte",
      "items": [
        {
          "text": "Item principal sin sub-viñetas"
        },
        {
          "text": "Item con sub-viñetas:",
          "subitems": [
            "Primera sub-viñeta",
            "Segunda sub-viñeta",
            "Tercera sub-viñeta"
          ]
        }
      ]
    }
  ]
}
```

**Formato de viñetas en el slide:**
```
1. Item principal sin sub-viñetas

2. Item con sub-viñetas:
   • Primera sub-viñeta
   • Segunda sub-viñeta
   • Tercera sub-viñeta

3. Otro item principal
```

### Cartas disponibles (en orden)
1. **primary** (`c-primary`) — Pruebas, Documentación y Soporte
2. **tertiary** (`c-tertiary`) — Infraestructura
3. **info** (`c-info`) — Base de Datos
4. **amber** (`c-amber`) — Desarrollo

### Cómo modificar contenido
1. **Abrir** `data/data.json`
2. **Actualizar** los campos en la carta deseada
3. **Guardar** — El cambio es automático (DataManager recarga los datos)
4. **Actualizar la fecha** en `metadata.week` si es una nueva semana

### Estructura de Items (viñetas)

**Item simple (solo viñeta principal):**
```json
{
  "text": "Texto del item principal"
}
```
Renderiza como: `1. Texto del item principal`

**Item con sub-viñetas (viñeta principal + secundarias):**
```json
{
  "text": "Item principal con desglose:",
  "subitems": [
    "Primera sub-viñeta",
    "Segunda sub-viñeta"
  ]
}
```
Renderiza como:
```
1. Item principal con desglose:
   • Primera sub-viñeta
   • Segunda sub-viñeta
```

### Animaciones y estilos
- Las cartas se renderizan dinámicamente desde el JSON
- Los colores, iconos y estilos se aplican automáticamente según `colorClass`
- Viñetas: numeradas (1, 2, 3) en items principales
- Sub-viñetas: viñetas de bala (•) en subitems
- No hay límite de sub-viñetas por item

## Convenciones de edición
- **SIEMPRE modificar `data/data.json`**, nunca editar HTML manualmente
- Actualizar la fecha en `data.json` cada semana
- Mantener los 4 colores de área asignados a las mismas sub áreas
- No cambiar dimensiones del slide (1000×580) para consistencia con capturas
- Los iconos SVG están definidos en el JSON (no modificar manualmente)
