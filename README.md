# EC FOOD — Authentic Ecuadorian Coastal Cuisine

Sitio web de **EC FOOD** (comida ecuatoriana de la costa), hecho por **Rojo Agency**.
Diseño v3 con la **marca oficial del cliente**: fondo negro, blanco y tricolor de la bandera (como el logo).

Sitio estático (HTML + CSS + JS puro), en Vercel: **ecfood.vercel.app**

## Qué tiene

- **Hero slider** a pantalla completa: 5 platos estrella en círculo blanco gigante con anillo de color, precio en sticker, autoplay (6s), flechas, barras de progreso tricolor, swipe táctil y teclado.
- **Doble marquee** (amarillo y azul) con los platos y el lema.
- **Carrusel "Favoritos"**: 9 platos con franja tricolor, arrastrable + flechas.
- **Nosotros** con anillo tricolor giratorio y contadores.
- **Menú** en 4 categorías, **Acompañantes** en círculos, **Bebidas** (Club, Tropical, Manzana, etc.).
- **Testimonios** en slider y **Visítanos** con WhatsApp.
- Respeta `prefers-reduced-motion`, focus visible, alt en todas las fotos.

## Marca y fotos

- **Logo oficial**: `img/logo.png` (del Drive del cliente).
- **TODAS las fotos son del cliente** (estudio, fondo blanco) — carpeta Drive compartida por JD el 2026-07-08.
  Los originales pesados (1.5GB) están en `img/raw/` (fuera de git).
- Fuentes: Poppins (Black/ExtraBold) + Karla.
- Colores: negro #050505 · blanco · amarillo #FFD100 · azul #0A4DA3 · rojo #E8362D.

## ⚠️ Datos placeholder (cambiar cuando el cliente confirme)

| Dato | Valor actual | Estado |
|------|--------------|--------|
| Dirección | "Tampa, Florida (por confirmar)" | placeholder |
| Teléfono / WhatsApp | (813) 555-0123 | **demo, número falso** |
| Horario | Mié–Dom 9am–8pm | placeholder |
| Precios | $3.99–$17.99 | referenciales |
| Testimonios | 3 citas | demo |
| Nombres de platos | leídos de las fotos | **confirmar con el cliente** (ej. "Encocado", "Pollo Criollo") |

## Desarrollo

```bash
npx serve .          # server local
npm test             # 8 pruebas Playwright
```
