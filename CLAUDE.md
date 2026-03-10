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

## Convenciones de edición
- Actualizar la fecha en el badge cada semana
- Máximo 3 items por card (usar `.item.empty` con `—` para los vacíos)
- Mantener los 4 colores de área asignados a las mismas sub áreas
- No cambiar dimensiones del slide (1000×580) para consistencia con capturas
