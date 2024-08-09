### 3djs - World:

Un globo interactivo utilizando D3.js, permitiendo a los usuarios rotarlo con el mouse y ver información detallada de los países al pasar el cursor sobre ellos. El código se divide en las siguientes funciones:

1. **`int(data)`**: Inicializa y renderiza el globo, la graticule, el panel de información, y configura los eventos de interacción.
2. **`drawGlobe()`**: Dibuja el globo y los países en un elemento SVG utilizando datos geográficos.
3. **`drawGraticule()`**: Dibuja las líneas de latitud y longitud en el globo.
4. **`renderInfoPanel()`**: Crea un panel de información para mostrar detalles de los países.
5. **`createHoverEffect()`**: Configura efectos de hover para mostrar la información de los países en el panel.
6. **`createDraggIntEvents()`**: Configura eventos de arrastre para permitir la rotación del globo utilizando el mouse.