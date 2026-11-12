# ALatex

Editor visual de ecuaciones que devuelve el código LaTeX al instante.

🌐 **https://elioxy.github.io/ALatex/**

Escribes matemáticas como se ven en el papel (una fracción es una fracción) y el panel de la derecha muestra siempre el LaTeX equivalente, listo para copiar.

## Qué incluye

- **Editor visual**: MathLive, con cursor dentro de fracciones, raíces, matrices y sumatorias.
- **Teclado por pestañas**: Básico, Estructuras, Operadores, Funciones, Griegas y Relaciones, ordenadas de lo más usado a lo más específico.
- **LaTeX limpio** en el panel derecho, con botón Copiar.
- Deshacer, limpiar y ejemplos de un clic.

## Cómo se usa

1. Escribe con el teclado sobre la fórmula o pulsa los botones.
2. `Tab` salta al siguiente hueco; las flechas mueven el cursor por dentro de la fórmula.
3. Pulsa **Copiar** y pega el LaTeX en Overleaf, Word, Google Docs o Notion.

## En local

No hay build ni dependencias que instalar:

```bash
python -m http.server 8123
```

Y abre `http://127.0.0.1:8123`.

## Despliegue

Cada push a `main` publica la web en GitHub Pages mediante `.github/workflows/pages.yml`.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Estilos |
| `app.js` | Teclado y sincronización con el panel LaTeX |
| `.github/workflows/pages.yml` | Despliegue automático en Pages |

MathLive y sus fuentes se cargan desde CDN, así que la página necesita conexión a internet.
