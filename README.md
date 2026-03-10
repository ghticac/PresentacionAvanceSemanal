# Presentación Avance Semanal - CAC

Slides semanales de avance por sub área de la Coordinación de Tecnología (CAC). Presentación estática moderna con soporte de modo claro/oscuro y efectos visuales avanzados.

## 🎯 Características

- ✨ Diseño moderno con tema claro/oscuro
- 🎨 Efectos visuales avanzados (glows, beams, spotlight)
- 📱 Responsivo y optimizado
- ⚡ Sin dependencias externas
- 🏗️ Arquitectura modular y mantenible
- ♿ Accesibilidad básica incluida

## 📁 Estructura del Proyecto

```
.
├── index.html              # Archivo principal
├── css/
│   ├── reset.css          # Normalización de estilos
│   ├── variables.css      # Tokens de diseño y variables CSS
│   ├── components.css     # Componentes (cards, buttons, etc)
│   └── main.css           # Estilos globales
├── js/
│   ├── main.js            # Punto de entrada de la aplicación
│   ├── theme.js           # Gestión de temas
│   ├── date.js            # Gestión de fechas
│   └── spotlight.js       # Efectos spotlight en cards
├── assets/
│   └── images/
│       └── LOGO-CAC-BLANCO.png
├── README.md
└── .gitignore
```

## 🚀 Uso

1. Clonar o descargar el proyecto
2. Abrir `index.html` en un navegador moderno
3. El modo claro se carga por defecto
4. Hacer clic en el botón toggle (☀️/🌙) para cambiar de tema

### Actualizar Contenido

Editar el contenido de las cards en `index.html`:

```html
<div class="item">
    <span class="num">1.</span>
    <span>Tu contenido aquí...</span>
</div>
```

La fecha se actualiza automáticamente cada día.

## 🎨 Temas

### Modo Claro (Predeterminado)
- Fondo blanco limpio
- Texto oscuro para máximo contraste
- Efectos visuales sutiles

### Modo Oscuro
- Fondo oscuro premium
- Efectos más vibrantes
- Ideal para presentaciones en baja luz

## 🔧 Desarrollo

### Variables CSS

El proyecto utiliza CSS custom properties para fácil personalización:

```css
:root {
    --color-primary: #4a6cf7;
    --color-info: #C4297D;
    --color-tertiary: #6ABF4B;
    --color-amber: #F5A623;
}
```

Ver `css/variables.css` para la lista completa.

### Agregar Nuevas Funcionalidades

1. Crear archivo en `js/` para la funcionalidad
2. Importar en `js/main.js`
3. Inicializar la clase en `initializeApp()`

Ejemplo:

```javascript
import MyFeature from './my-feature.js';

function initializeApp() {
    new MyFeature();
}
```

### Agregar Estilos

Seguir el orden de importación en `index.html`:
1. `reset.css` - Normalización
2. `variables.css` - Tokens de diseño
3. `components.css` - Componentes
4. `main.css` - Globales

## 🌐 Compatibilidad

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Requiere soporte de CSS custom properties y ES6 modules

## 📝 Convenciones

### Naming
- Clases CSS: kebab-case (`card-title`)
- Variables JS: camelCase (`themeToggle`)
- Clases JS: PascalCase (`ThemeManager`)

### CSS
- Usar variables CSS en lugar de valores hardcoded
- Incluir comentarios con separadores para secciones
- Organizar por componente

### JavaScript
- Usar módulos ES6
- Incluir documentación JSDoc
- Una clase por archivo

## 🔒 Mejores Prácticas Implementadas

✅ Separación de responsabilidades (HTML, CSS, JS)
✅ DRY (Don't Repeat Yourself) - CSS variables
✅ KISS (Keep It Simple, Stupid) - Sin dependencias
✅ Modularidad - Archivos separados y reutilizables
✅ Accesibilidad - Atributos ARIA básicos
✅ Performance - Animaciones optimizadas
✅ Mantenibilidad - Código limpio y documentado

## 📄 Licencia

Proyecto interno CAC - Coordinación de Tecnología

## 👥 Contribuidores

Equipo de Tecnología CAC
