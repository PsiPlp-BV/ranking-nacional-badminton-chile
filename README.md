# Ranking Nacional de Bádminton — Chile 2026

Sitio **oficial** del Ranking Nacional de FEDEBADCHILE, construido con
Next.js y publicado en Vercel. Reemplaza al sitio estático original
(`PsiPlp-BV/Ranking_Nacional_Badminton`), que quedó solo como redirección: sus
enlaces viejos (`…pages.dev/#/jugador/<id>`, impresos en los QR de las
credenciales) llevan a la página equivalente de este sitio.

Qué cambió respecto del original:

- **Navegación por páginas** en vez de una sola página con scroll.
- **Diseño minimalista** con la paleta y el logo oficiales intactos.
- **Interacción** como parte del contenido: marcador que rota entre
  categorías, controles segmentados, búsqueda en el ranking y resaltado
  cruzado entre la tabla de clubes y su gráfico.

## Correr localmente

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de producción
npm run lint         # lint
npm test             # motor de ranking (lib/ranking.ts)
npm run test:datos   # pipeline de datos (Python)
```

## De dónde salen los datos

- `datos/` — pipeline Python que transcribe los cuadros oficiales de
  Tournamentsoftware: un `fechaN_results.py` por fecha (un `add_event(...)`
  por cuadro), `clubs.py` con nombre, sigla y color de cada club, y
  `build_data.py`, que calcula puntos, medallas y la tabla de clubes y escribe
  **`data/players.json` y `data/clubs.json`** (generados: no se editan a mano).
- `data/meta.json` — se edita a mano: fechas del calendario (sede, estado,
  cuadros, inscritos, enlace oficial), categorías, modalidades, tabla de
  puntos, reglamento y datos de la Federación.

```bash
npm run datos        # = python datos/build_data.py
```

La integración continua corre los tests de ambos lados y además regenera los
JSON y falla si no coinciden con los publicados.

`lib/ranking.ts` es un port fiel del motor del sitio original: las categorías
nunca se mezclan, en dobles ambos suman completo y los empates comparten
posición. `tests/ranking.test.mjs` son los mismos tests de allá, corriendo
sobre este archivo.

## Agregar una fecha

1. Lee los cuadros oficiales en Tournamentsoftware. Usa la vista de cada
   cuadro (`/tournament/<id>/draw/<n>`), que trae el nombre de la ronda de cada
   partido; la lista `sport/drawmatches.aspx` **no** viene en orden de ronda.
   Elimination: campeón 1°, finalista 2°, perdedores de semis 3° (sin partido
   por el 3er puesto), de cuartos 5°–8°, de rondas previas participación.
   Round Robin: la tabla de posiciones oficial. Un evento sin cuadro no
   reparte puntos.
2. Crea `datos/fechaN_results.py` con la forma de `fecha3_results.py`: plantel
   (`NAME_CLUB`), `ALIAS` si Tournamentsoftware escribe distinto a alguien que
   ya tiene perfil (cambiar el nombre cambiaría la dirección de su perfil), y
   un `add_event(...)` por cuadro. Club nuevo: agrégalo a `datos/clubs.py`.
3. Agrégalo a `FECHAS` y `FECHA_NUMS` en `datos/build_data.py`.
4. `npm run test:datos` y `npm run datos`. Revisa lo que imprime (cambios de
   club entre fechas y tabla de clubes): es la señal más rápida de una
   transcripción torcida.
5. En `data/meta.json`, marca la fecha como `"completado"` y completa
   `eventos` (cuadros disputados), `inscritos` y `fuenteUrl`.

Criterio de walkover (desde la 3ª Fecha): quien no jugó ningún partido en un
cuadro no suma puntos en él, aunque el cuadro lo ubique; quien jugó y se
retiró de un Round Robin suma participación.

### Rama masculina y femenina

El ranking se puede ver por rama. Los datos oficiales no traen un campo de
sexo, y no hace falta: **las modalidades del torneo ya son ramas**. Quien juega
Individual o Dobles Masculino compite en la rama masculina, y viceversa. Lo que
`lib/data.ts` deduce es entonces la rama en que compite cada deportista —un
dato deportivo público, como su club o su categoría—, no una afirmación sobre
su identidad; por eso el sitio la nombra "rama" y no "sexo".

El dobles mixto no se usa para deducir, porque cada pareja tiene un integrante
de cada rama. Con los datos actuales alcanza igual: las 118 personas del
circuito quedan asignadas sin ambigüedad ni conflictos (82 y 36), y las 82
parejas de mixto resultan tener siempre una de cada rama — que es la
comprobación cruzada de que la deducción está bien.

Reglas de la vista:

- Al elegir una rama las posiciones **se renumeran dentro de ella**: el ranking
  femenino parte en 1 y no hereda los huecos del general.
- El puntaje sigue siendo el total del deportista, **incluido el dobles mixto**:
  es parte de lo que jugó.
- Con una modalidad de rama (Individual Femenino, Dobles Masculino…) el control
  se bloquea mostrando la rama que esa modalidad ya implica, y en dobles mixto
  se bloquea en "General". Así no existen combinaciones imposibles como "rama
  femenina + Individual Masculino".

## Cómo se agruparon las secciones

El original era una página con siete secciones apiladas. Acá cada una es una
ruta, salvo donde separarlas no aportaba nada:

| Ruta            | Contiene                                              |
| --------------- | ----------------------------------------------------- |
| `/`             | Portada: cifras del circuito y líderes por categoría   |
| `/ranking`      | Clasificación individual, filtrable                    |
| `/clubes`       | Ranking de clubes, gráfico y reglas de puntaje         |
| `/jugadores`    | Grilla de deportistas con búsqueda y filtros           |
| `/jugadores/:id`| Perfil individual                                      |
| `/torneo`       | **Calendario + reglamento**                            |
| `/federacion`   | Directiva, gerencia, contacto y auspiciadores          |

Las dos decisiones que hubo que tomar:

- **Calendario y reglamento van juntos.** Responden la misma pregunta —cómo y
  cuándo se compite— y por separado quedaban dos páginas flacas.
- **Ranking individual y ranking de clubes van aparte.** Son dos competencias
  distintas, con datos, filtros y reglas de puntaje propios. Juntarlas obligaba
  a un selector extra para algo que la gente busca por separado.

## Diseño

La paleta es la oficial y no se tocó: azul federación `#0D1B4C`, azul deportivo
`#1E3A8A`, carbono `#0A0F1F` y rojo chileno `#E11D2E`, más la paleta categórica
de dataviz y los tonos de medalla. Lo que cambia es el uso: superficie clara,
mucho aire, y el rojo reservado para **una sola cosa por pantalla** (la acción
principal, o la columna activa de una tabla).

- **Tipografía**: Inter para texto y datos tabulares, Barlow Condensed para
  títulos y cifras grandes — condensada y deportiva sin perder formalidad.
- **Tema claro y oscuro**: el layout escribe el tema en `data-theme` antes del
  primer paint, y el botón alterna sus dos iconos por CSS. Sin estado en React,
  sin destello de tema equivocado.
- **Assets**: el logo y la ilustración del volante vienen del sitio original
  (identidad de marca). El volante aparece como marca de agua tenue en el
  encabezado de cada página; en modo oscuro se invierte por CSS en vez de
  mantener dos archivos.

### Interacción y movimiento

Con `motion`, y siempre corto: acá la gente viene a consultar una tabla, no a
mirar una animación. El criterio es que el movimiento explique algo —de dónde a
dónde cambió el dato— y no que decore.

- **Marcador de portada** (`HeroBoard`): muestra el top 5 real y rota entre
  categorías cada 4,6 s. Las filas son ranuras fijas (1° a 5°), así que al
  cambiar de categoría los nombres se relevan y los puntajes **ruedan desde el
  valor anterior** en vez de saltar. Se puede elegir categoría a mano; ahí la
  rotación se detiene, porque moverle la vista a quien tomó el control es una
  molestia. También se pausa con el mouse encima.
- **Controles segmentados** con indicador deslizante para categoría, rama y
  fecha en el ranking: se ve todo el rango de una y cambia en un clic. La fecha
  que aún no se disputa aparece deshabilitada, no oculta.
- **Búsqueda dentro del ranking**, que filtra sin renumerar: la posición que se
  muestra sigue siendo la del ranking completo.
- **Resaltado cruzado** en clubes: pasar el mouse por una barra ilumina su fila
  y viceversa, y la barra activa cambia su subtítulo por el desglose de puntos
  fecha a fecha.
- **Realce que sigue al cursor** en las tarjetas de deportistas, con un solo
  listener delegado para las casi cien tarjetas.
- Píldora de navegación que se desliza entre secciones (`layoutId`), transición
  de entrada por página (`app/template.tsx`), barra de avance de lectura,
  contadores que suben y barras que crecen al entrar en viewport.

Todo respeta `prefers-reduced-motion`: con esa preferencia activa el contenido
simplemente está ahí, sin movimiento.

Nota de implementación: el marcador no usa `AnimatePresence` para relevar los
nombres. La fase de salida puede quedar a medias si la rotación llega antes de
que termine, y la fila se ve vacía; con cambiar la `key` basta.

## Estado

En producción en Vercel (https://ranking-nacional-badminton-next.vercel.app),
con deploy automático al hacer push a `main`. Temporada 2026 cerrada: las 3
fechas cargadas.
