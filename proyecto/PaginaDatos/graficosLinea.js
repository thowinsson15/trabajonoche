// Función para cargar el archivo CSV y convertirlo en un array de objetos
async function cargarCSV(ruta) {
    return fetch(ruta)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const headers = rows[0];
            const rowsData = rows.slice(1);


        

            return rowsData.map(row => {
                let obj = {};
                row.forEach((col, i) => {
                    obj[headers[i]] = col;
                    console.log(col)
                });
                return obj;
            });
        });
}

// Función para generar el gráfico de línea
function generarGraficoLinea(datos) {
    const labels = []; // Aquí se almacenarán los años o fechas
    const valores = []; // Aquí se almacenarán los valores de la capacidad instalada

    // Extraemos los datos del CSV para el gráfico de línea
    datos.forEach(fila => {
        // Ajusta estas columnas según las que tengas en tu archivo CSV
        labels.push(fila['Year']);  // Suponiendo que 'Year' contiene el año o la fecha
        valores.push(parseFloat(fila['PaginaDatos/14_solar-share-energy.csv']) || 0); // Ajusta el nombre de la columna
    });

    // Crear el gráfico de línea
    const ctx = document.getElementById('graficoLinea').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Etiquetas (años o fechas)
            datasets: [{
                label: 'Capacidad Instalada Solar (%)', // Etiqueta del gráfico
                data: valores, // Datos de capacidad instalada
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fondo de la línea
                borderWidth: 2,
                fill: true, // Rellenar el área bajo la línea
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.raw}%`; // Muestra el valor en porcentaje
                        }
                    }
                }
            }
        }
    });
}

// Cargar los datos del archivo CSV y generar el gráfico
document.addEventListener('DOMContentLoaded', () => {
    cargarCSV('/PaginaDatos/14_solar-share-energy.csv') // Asegúrate de que la ruta al CSV sea correcta
        .then(datos => {
            generarGraficoLinea(datos); // Genera el gráfico con los datos del CSV
        })
        .catch(error => {
            console.error('Error al cargar o procesar el archivo CSV:', error);
        });
});
