// Importación de funciones de D3.js
const { json, select, selectAll, geoOrthographic, geoPath, geoGraticule } = d3;

// Declaración de variables globales
let dataSet, globe, projection, path, graticule, infoPanel;
let isMouseDown = false;
let rotation = { x: 0, y: 0 }; // Objeto para almacenar la rotación del globo

// Definición del tamaño del globo basado en las dimensiones de la ventana
const globeSize = {
    w: window.innerWidth / 2, // Ancho del globo (mitad del ancho de la ventana)
    h: window.innerHeight // Altura del globo (altura completa de la ventana)
};

// Carga de datos geográficos desde un archivo JSON y llamada a la función de inicialización
json('./custom.geo.json').then(res => int(res));

// Función de inicialización: configura y renderiza el globo y sus elementos interactivos
const int = data => {
    dataSet = data; // Almacena los datos cargados en la variable global `dataSet`
    drawGlobe(); // Dibuja el globo en el DOM
    drawGraticule(); // Dibuja las líneas de latitud y longitud en el globo
    renderInfoPanel(); // Renderiza el panel de información
    createHoverEffect(); // Configura los efectos de hover sobre los países
    createDraggIntEvents(); // Configura los eventos de arrastre para rotar el globo
};

// Función para dibujar el globo en el DOM
const drawGlobe = () => {
    // Crea un elemento SVG en el cuerpo de la página con el tamaño de la ventana
    globe = select('body')
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight);

    // Configura la proyección ortográfica para el globo
    projection = geoOrthographic()
        .fitSize([globeSize.w, globeSize.h], dataSet) // Ajusta el tamaño del globo basado en el tamaño definido
        .translate([window.innerWidth - globeSize.w / 2, window.innerHeight / 2]); // Centra el globo en la ventana

    // Crea un generador de caminos geográficos usando la proyección definida
    path = geoPath().projection(projection);

    // Dibuja cada país en el globo como un camino SVG
    globe
        .selectAll('path')
        .data(dataSet.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', '#163744') // Color de relleno de los países
        .style('stroke', '#080909') // Color de borde de los países
        .attr('class', 'country'); // Asigna la clase 'country' a cada país
};

// Función para dibujar la retícula (graticule) en el globo
const drawGraticule = () => {
    // Crea un generador de graticule (líneas de latitud y longitud)
    graticule = geoGraticule();
    
    // Dibuja la graticule como un camino SVG en el globo
    globe
        .append('path')
        .attr('class', 'graticule') // Asigna la clase 'graticule'
        .attr('d', path(graticule())) // Genera el camino SVG para la graticule
        .attr('fill', 'none') // Sin relleno
        .attr('stroke', '#171718'); // Color de las líneas de la graticule
};

// Función para renderizar el panel de información en el DOM
const renderInfoPanel = () => {
    infoPanel = select('body').append('article').attr('class', 'info');
};

// Función para crear el efecto de hover sobre los países en el globo
const createHoverEffect = () => {
    globe
        .selectAll('.country')
        .on('mouseover', (e, data) => {
            const { formal_en, economy, subregion } = data.properties;
            // Muestra la información del país en el panel de información
            infoPanel.html(
                /*html*/ `
                <h1>${formal_en}</h1> <br>
                <h3>${subregion}</h3> <br>
                <p>${economy}</p>
                `);

            // Restablece el estilo de todos los países
            globe.selectAll('.country').style('fill', '#163744').style('stroke', '#080909');
            // Cambia el estilo del país actualmente seleccionado
            select(e.currentTarget).style('fill', '#7dadec').style('stroke', 'white');
        });
};

// Función para crear eventos de arrastre para rotar el globo
const createDraggIntEvents = () => {
    let lastX = 0; // Posición X del mouse en el último movimiento
    let lastY = 0; // Posición Y del mouse en el último movimiento
    let needsUpdate = false; // Bandera para determinar si el globo necesita actualizarse

    // Función para actualizar el globo (llamada en cada frame)
    const updateGlobe = () => {
        if (needsUpdate) {
            // Actualiza la rotación de la proyección y redibuja el globo
            projection.rotate([rotation.x, rotation.y]);
            selectAll('.country').attr('d', path);
            selectAll('.graticule').attr('d', path(graticule()));
            needsUpdate = false;
        }
        requestAnimationFrame(updateGlobe); // Solicita la próxima actualización en el siguiente frame
    };

    // Eventos del mouse sobre el globo
    globe
        .on('mousedown', (e) => {
            isMouseDown = true; // Marca que el mouse está presionado
            lastX = e.clientX; // Guarda la posición X del mouse al presionar
            lastY = e.clientY; // Guarda la posición Y del mouse al presionar
        })
        .on('mouseup', () => isMouseDown = false) // Marca que el mouse ha sido soltado
        .on('mousemove', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - lastX; // Calcula la diferencia en X desde el último movimiento
                const deltaY = e.clientY - lastY; // Calcula la diferencia en Y desde el último movimiento

                rotation.x += deltaX; // Actualiza la rotación en X
                rotation.y += deltaY; // Actualiza la rotación en Y

                lastX = e.clientX; // Actualiza la posición X del último movimiento
                lastY = e.clientY; // Actualiza la posición Y del último movimiento

                needsUpdate = true; // Marca que el globo necesita actualizarse
            }
        });

    updateGlobe(); // Inicia la actualización del globo
};
