// Invocamos el evento load de windows para garantizar que todo el Html este cargado 
// incluido los scripts.
window.onload = function () {
    //Funcion para cambiar la respuesta por "Sin datos" cuando el valor sea - o -, 0cm o - lb, 0 kg
    function cambioResultado(respuesta) {
        if (respuesta === "-" || respuesta === "-, 0 cm" || respuesta === "- lb, 0 kg") {
            return "Sin datos";
        }
        else {
            return respuesta;
        }
    }

    $(document).ready(function () {
        //Evento click en la etiqueta button para obtener el resultado segun corresponda
        $('button').on('click', function () {
            //Creamos la variable y le asignamos el id input para obtener el valor que ingrese el usuario
            const idSuperHero = $('#input').val();
            //Creamos un arreglo vacio que almacenara los valores para el grafico
            let dataPoints = [];
            //Creamos la condicion if para que el usuario solo pueda ingresar numeros
            if (!(/^[0-9]+$/.test(idSuperHero))) {
                alert('Por favor, ingrese solo números.');
                return;
            }
            
            //Creamos el else if para informar cuando la ID ingresada no tiene datos de
            //un superheroe porque esta fuera del rango
            else if ((idSuperHero) > 732 || (idSuperHero) == 0) {
                alert("El ID proporcionado no tiene resultados. Por favor, ingrese un ID válido del 1 al 732.");
                return;
            }
            //Añadimos un show para que cuando el valor ingresado sea correcto, se despliegue 
            //el h2 y la card
            $('h2').show();
            $('.card').show();
            
            //Creamos la peticion AJAX con un GET sobre la Api para conectarnos y extraer la informacion
            $.ajax({
                type: "GET",
                //Interpolamos al final de la url la variable idSuperHero para realizar la 
                //busqueda segun lo ingresado por el usuario
                url: `https://www.superheroapi.com/api.php/4905856019427443/${idSuperHero}`,
                dataType: "json",
                success: function (datos) {
                    //Le asignamos datos.powerstats a datosGrafico para que nos
                    //muestre sus valores posteriormente
                    let datosGrafico = datos.powerstats;
                    //Mostramos en consola lo que nos devuelve datos
                    console.log("Success valor de datos obtenidos: ", datos);
                    //Mostramos en consola lo que nos devuelve datosGrafico
                    console.log("Success valor de datosGrafico obtenidos: ", datosGrafico);
                    //Creamos un for in para recorrer los datos de los powerstats
                    //y se lo añadimos a dataPoints con un .push
                    for (let resultado in datosGrafico) {
                        dataPoints.push({
                            label: resultado,
                            y: parseInt(datosGrafico[resultado])
                        });
                    }
                    //Creamos el objeto que nos pide Canvas JS para hacer el grafico
                    let options = {
                        title: { text: `Estadísticas de Poder para ${datos.name}` },
                        data: [
                            {
                                type: "pie",
                                dataPoints: dataPoints
                            }
                        ]
                    };
                    //Indicamos donde ira el grafico (#chartContainer) y llamamos a un
                    //plugin externo para crear el grafico con los valores de options
                    $("#chartContainer").CanvasJSChart(options);
                    //Asignamos los valores a la CARD en el html
                    $('.imagen').html(`<img src="${datos.image.url}" class="img-fluid rounded-start">`)
                    $('.card-title').text(`Nombre: ${datos.name}`)
                    //Llamamos a la funcion cambioResultado para hacer la validacion y
                    //cambiar a "Sin datos" donde corresponda.
                    $('.card-text').html(`
                        <p>-Conexiones: ${cambioResultado(datos.connections["group-affiliation"])}</p>
                        <p>-Publicado por: ${cambioResultado(datos.biography.publisher)}</p>
                        <p>-Ocupación: ${cambioResultado(datos.work.occupation)}</p>
                        <p>-Primera aparición: ${cambioResultado(datos.biography["first-appearance"])}</p>
                        <p>-Altura: ${cambioResultado(datos.appearance.height.join(', '))}</p>
                        <p>-Peso: ${cambioResultado(datos.appearance.weight.join(', '))}</p>
                        <p>-Alianzas: ${cambioResultado(datos.biography.aliases.join(', '))}</p>
                    `);
                },
                //Añadimos las acciones si ocurre algun error al conectar con la api
                error: function (error) {
                    console.log("error: ", error.status);
                    alert(`Ha ocurrido un error con la pagina ${this.url}: error ` + error.status);
                }
            });
        });
    });
};
