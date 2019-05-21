
// Animacion del la pantalla titulo..
function verde (){
	$(".main-titulo").animate({color:"green"}, "slow", function(){ amarillo() } )
}
function amarillo (){
	$(".main-titulo").animate({color:"yellow"}, "slow", function(){ verde() })
}
// Arrancamos animacion del titulo.
verde();


// Inicializamos la rejilla de los dulces

function cargarRejilla() {
	var max = 6;
	var columnas = $('[class^="col-"]');

	columnas.each(function () {
		var dulces = $(this).children().length;
		var agrega = max - dulces;
		for (var i = 0; i < agrega; i++) {
			var dulceTipo = generarDulce(1, 5);
			if (i === 0 && dulces < 1) {
				$(this).append('<img src="image/' + dulceTipo + '.png" class="element"></img>');
			} else {
				$(this).find('img:eq(0)').before('<img src="image/' + dulceTipo + '.png" class="element"></img>');
			}
		}
	});
	eventosDulces();
	validacionCombos();
}

// Generamos dulces aleatorios para rellenar rejilla
function generarDulce(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// Inicializamos eventos de los dulces para poderlos mover
function eventosDulces() {
	$('img').draggable({
		containment: '.panel-tablero',
		droppable: 'img',
		revert: true,
		revertDuration: 500,
		grid: [100, 100],
		zIndex: 10,
		drag: movimientoDulce
	});
	$('img').droppable({
		drop: intercambioDulce
	});
	activaEventoDulce();
}


function activaEventoDulce() {
	$('img').droppable('enable');
	$('img').draggable('enable');
}

function desactivaEventoDulce() {
	$('img').droppable('disable');
	$('img').draggable('disable');

}


function movimientoDulce(event, arrastraDulce) {
	arrastraDulce.position.top = Math.min(100, arrastraDulce.position.top);
	arrastraDulce.position.bottom = Math.min(100, arrastraDulce.position.bottom);
	arrastraDulce.position.left = Math.min(100, arrastraDulce.position.left);
	arrastraDulce.position.right = Math.min(100, arrastraDulce.position.right);
}

//Sustituimos los caramelos
function intercambioDulce(event, arrastraDulce) {
	var arrastraDulce = $(arrastraDulce.draggable);
	var dragSrc = arrastraDulce.attr('src');
	var candyDrop = $(this);
	var dropSrc = candyDrop.attr('src');
	arrastraDulce.attr('src', dropSrc);
	candyDrop.attr('src', dragSrc);

	setTimeout(function () {
		cargarRejilla();
		if ($('img.delete').length === 0) {
			arrastraDulce.attr('src', dragSrc);
			candyDrop.attr('src', dropSrc);
		} else {
			actualizaMovimientos();
		}
	}, 500);
}

function actualizaMovimientos() {
	var actualValue = Number($('#movimientos-text').text());
	var result = actualValue += 1;
	$('#movimientos-text').text(result);
}


function validacionCombos() {
	validacionColumna();	
	validacionLinea();
	// Si hay dulces que borrar
	if ($('img.delete').length !== 0) {
		eliminacionAnimada();
	}
}

//Creamos un arreglo para posicionar los dulces en toda la rejilla...
function arregloDulces(arrayType, index) {

	var columna1 = $('.col-1').children();
	var columna2 = $('.col-2').children();
	var columna3 = $('.col-3').children();
	var columna4 = $('.col-4').children();
	var columna5 = $('.col-5').children();
	var columna6 = $('.col-6').children();
	var columna7 = $('.col-7').children();

	var candyColumns = $([columna1, columna2, columna3, columna4,
		columna5, columna6, columna7
	]);

	if (typeof index === 'number') {
		var candyRow = $([columna1.eq(index), columna2.eq(index), columna3.eq(index),
			columna4.eq(index), columna5.eq(index), columna6.eq(index),
			columna7.eq(index)
		]);
	} else {
		index = '';
	}

	if (arrayType === 'columns') {
		return candyColumns;
	} else if (arrayType === 'rows' && index !== '') {
		return candyRow;
	}
}

// Obtengo posicion del dulce en la columna.
function dulcesColumnas(index) {
	var dulceColumna = arregloDulces('columns');
	return dulceColumna[index];
}

//Hago un barrido en las columnas para encontrar emparejamientos de dulces
function validacionColumna() {
	for (var j = 0; j < 7; j++) {
		var counter = 0;
		var candyPosition = [];
		var extraCandyPosition = [];
		var dulceColumna = dulcesColumnas(j);
		var comparisonValue = dulceColumna.eq(0);
		var gap = false;
		for (var i = 1; i < dulceColumna.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = dulceColumna.eq(i).attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			comparisonValue = dulceColumna.eq(i);
		}
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		candyCount = candyPosition.length;
		if (candyCount >= 3) {
			eliminarColumnaDulces(candyPosition, dulceColumna);
			contadorDulces(candyCount);
		}
	}
}
//Borramos dulces emparejados verticalmente.
function eliminarColumnaDulces(candyPosition, dulceColumna) {
	for (var i = 0; i < candyPosition.length; i++) {
		dulceColumna.eq(candyPosition[i]).addClass('delete');
	}
}

// Obtengo posicion del dulce en la linea.
function dulcesLinea(index) {
	var lineaDulce = arregloDulces('rows', index);
	return lineaDulce;
}

//Hago un barrido en las Lineas para encontrar emparejamientos de dulces
function validacionLinea() {
	for (var j = 0; j < 6; j++) {
		var counter = 0;
		var candyPosition = [];
		var extraCandyPosition = [];
		var lineaDulce = dulcesLinea(j);
		var comparisonValue = lineaDulce[0];
		var gap = false;
		for (var i = 1; i < lineaDulce.length; i++) {
			var srcComparison = comparisonValue.attr('src');
			var srcCandy = lineaDulce[i].attr('src');

			if (srcComparison != srcCandy) {
				if (candyPosition.length >= 3) {
					gap = true;
				} else {
					candyPosition = [];
				}
				counter = 0;
			} else {
				if (counter == 0) {
					if (!gap) {
						candyPosition.push(i - 1);
					} else {
						extraCandyPosition.push(i - 1);
					}
				}
				if (!gap) {
					candyPosition.push(i);
				} else {
					extraCandyPosition.push(i);
				}
				counter += 1;
			}
			comparisonValue = lineaDulce[i];
		}
		if (extraCandyPosition.length > 2) {
			candyPosition = $.merge(candyPosition, extraCandyPosition);
		}
		if (candyPosition.length <= 2) {
			candyPosition = [];
		}
		candyCount = candyPosition.length;
		if (candyCount >= 3) {
			eliminarLineaDulces(candyPosition, lineaDulce);
			contadorDulces(candyCount);
		}
	}
}
//Borramos dulces emparejados horizontalmente.
function eliminarLineaDulces(candyPosition, lineaDulce) {
	for (var i = 0; i < candyPosition.length; i++) {
		lineaDulce[candyPosition[i]].addClass('delete');
	}
}

// Incremento el marcador de acuerdo a los valores de los dulces.
function contadorDulces(candyCount) {
	var marcador = Number($('#score-text').text());
	switch (candyCount) {
		case 3:
			marcador += 25;
			break;
		case 4:
			marcador += 50;
			break;
		case 5:
			marcador += 75;
			break;
		case 6:
			marcador += 100;
			break;
		case 7:
			marcador += 200;
	}
	$('#score-text').text(marcador);
}

//Cuando elimino dulces emparejados les damos un efecto
function eliminacionAnimada() {
	desactivaEventoDulce();
	$('img.delete').effect('pulsate', 500);
	$('img.delete').animate({
			opacity: '0'
		}, {
			duration: 400
		})
		.animate({
			opacity: '0'
		}, {
			duration: 500,
			complete: function () {
				borrarDulce()
					.then(validarTableroPromise)
					.catch();
			},
			queue: true
		});
}

//Rellenamos posiciones vacias dejadas por los dulces eliminados.
function validarTableroPromise(resultado) {
	if (resultado) {
		cargarRejilla();
	}
}

//Borro dulces emparejados.
function borrarDulce() {
	return new Promise(function (resolve, reject) {
		if ($('img.delete').remove()) {
			resolve(true);
		} else {
			reject('No se pudo eliminar Candy...');
		}
	})
}


// Arranque del Juego
function arrancarJuego() {
	$('.btn-reinicio').click(function(){
		if($(this).text() === 'Reiniciar') {
			location.reload(true);
			//window.location.reload(true); 
		}
		cargarRejilla();
		$(this).text('Reiniciar');
		$('#timer').startTimer({
			onComplete: finalizaJuego
		})		
	});
}
//Finalizo juego cuando se cumplen los 2minutos.
function finalizaJuego() {
	$('div.panel-tablero, div.time').effect('fold');
	$('h1.main-titulo').addClass('title-over')
		.text('Gracias por jugar!');
	$('div.score, div.moves, div.panel-score').width('100%');
}

//Carga el programa en la pagina Web
$(function() {
	arrancarJuego();
});