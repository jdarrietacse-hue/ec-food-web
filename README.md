# EC Food — Propuesta Web

Página de propuesta para **EC Food** (comida ecuatoriana), hecha por **Rojo Agency**.

Sitio estático (HTML + CSS + JS puro), listo para Vercel.

## Qué tiene

- **Hero slider** a pantalla completa con efecto ken-burns, autoplay (6s), flechas, barras de progreso, swipe táctil y teclado.
- **Marquee** infinito con los platos.
- **Carrusel "Favoritos de la casa"**: 9 platos, arrastrable con mouse/dedo + flechas.
- **Nosotros** con contadores animados y sello giratorio.
- **Menú** en rejilla bento (4 categorías).
- **Testimonios** en slider con puntos.
- **Visítanos** con horario, teléfono y botón de WhatsApp.
- Respeta `prefers-reduced-motion`, tiene focus visible y alt en todas las fotos.

## ⚠️ Datos placeholder (cambiar cuando el cliente confirme)

| Dato | Valor actual | Estado |
|------|--------------|--------|
| Dirección | "Tampa, Florida (por confirmar)" | placeholder |
| Teléfono / WhatsApp | (813) 555-0123 | **demo, número falso** |
| Horario | Mié–Dom 9am–8pm | placeholder |
| Precios | $4.50–$15.99 | referenciales |
| Testimonios | 3 citas | demo |
| Logo | Monograma "EC" generado | provisional — pedir logo real |

> **Nota:** no se encontró presencia web/Instagram de "EC Food" al construir esta propuesta
> (búsqueda hecha el 2026-07-08). Cuando el cliente pase su Instagram/logo/colores reales,
> se reemplaza la identidad en minutos.

## Créditos de fotos (Wikimedia Commons)

| Foto | Autor | Licencia |
|------|-------|----------|
| encebollado.jpg | Vapelaez2212 | CC BY-SA 4.0 |
| ceviche.jpg / ceviche2.jpg | Ceibos | CC BY-SA 4.0 |
| bolon.jpg | Pablo Jarrín | CC BY-SA 4.0 |
| hornado.jpg | amalavida.tv | CC BY-SA 2.0 |
| llapingachos.jpg | Gary Soup | CC BY 2.0 |
| guatita.jpg / seco.jpg | Kevinmero | CC BY-SA 4.0 |
| empanadas.jpg | BryanGuev13 | CC BY-SA 4.0 |
| tigrillo.jpg | Rinaldo Wurglitsch | CC BY 2.0 |

## Desarrollo

```bash
npx serve .          # o cualquier server estático
npm test             # pruebas Playwright
```
