var mMap;
var mQuest;
var mFile;
var osmFile;
var mJson;
var allPath;
var AllPathJSON;
var hd;
var multiRoute;
var mOSM;
var mOSMPoint;
var mymap;
window.onload = function() {
    init();
	//ymaps.ready(init);
    document.getElementById('file-input').addEventListener('change', readFile, false);
	document.getElementById('file-osm').addEventListener('change', readFileOSM, false);
    document.getElementById('open').addEventListener('click', displayContents, false);
	document.getElementById('download').addEventListener('click', getAllMyPath, false);
	document.getElementById('openosm').addEventListener('click', displayOSM, false);
};

function init() {
	mymap = L.map('mapid').setView([55.7522200, 37.6155600], 10);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGl6YTk1IiwiYSI6ImNqaGV3YWVpczA2Y3YzMHBhM2FzZ2hvNGQifQ.bEZYv7fl29Mgpcm0uPPfjA'
}).addTo(mymap);
	/*var mPlacemark;
    mMap = new ymaps.Map("map", {
            center: [59.934616, 30.330974],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        });
    // Слушаем клик на карте.
    mMap.events.add('click', function(e) {
        var coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        if (mPlacemark) {
            mPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
            mPlacemark = createPlacemark(coords);
            mMap.geoObjects.add(mPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            mPlacemark.events.add('dragend', function() {
                getAddress(mPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });*/
}
//------------------------------------------------------------------------
//Работа с osm файлом
function readFileOSM(e)
{
	 osmFile = e.target.files[0];
    if (!osmFile) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        mOSM = e.target.result;
    };
    reader.readAsText(osmFile);
}
function displayOSM()
{
	var marker;
	parser = new DOMParser();
	var point_osm = parser.parseFromString(mOSM, "text/xml");
	var nodes = point_osm.getElementsByTagName("node");
	console.log(nodes[0].lat);
	//clearMap();
    var сoordinates = new Array();
	var placemarks = new Array();
	for (var i = 0; i < nodes.length; i++) {
        newCoordinate = [nodes[i].getAttribute("lat"), nodes[i].getAttribute("lon")];
		сoordinates.push(newCoordinate);
		console.log('Добавил', newCoordinate, 'в массив');
		var marker=L.marker(newCoordinate).addTo(mymap);
		placemarks.push(marker);
		//var placemark = new ymaps.Placemark(newCoordinate );
        
	} 
    /*multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: сoordinates,
        params: {
            //Тип маршрутизации - пешеходная маршрутизация.
            routingMode: 'pedestrian',
        }
    }, {
        // Внешний вид путевых точек.
        wayPointStartIconColor: "#333",
        wayPointStartIconFillColor: "#B3B3B3",
        // Позволяет скрыть иконки путевых точек маршрута.
        //wayPointVisible:false,

        // Внешний вид транзитных точек.
        viaPointIconRadius: 7,
        viaPointIconFillColor: "#000088",
        viaPointActiveIconFillColor: "#E63E92",

        // Позволяет скрыть иконки транзитных точек маршрута.
        //viaPointVisible:false,

        // Внешний вид точечных маркеров под путевыми точками.
        pinIconFillColor: "#000088",
        pinActiveIconFillColor: "#B3B3B3",
        // Позволяет скрыть точечные маркеры путевых точек.
        //pinVisible:false,

        // Внешний вид линии маршрута.
        routeStrokeWidth: 2,
        routeStrokeColor: "#000088",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#E63E92",

        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    // Добавляем мультимаршрут на карту.
    mMap.geoObjects.add(multiRoute);
*/
}
//------------------------------------------------------------------------
//Получение всех точек маршрута
function getAllMyPath()
{
	var way;
	AllPath = multiRoute.model.getViaPoints();
	AllPathJSON = multiRoute.model.getJson();
	console.log(multiRoute.getRoutes().toArray()[0].getPaths());
	console.log(multiRoute.model.getJson());
}

//Создание файла маршрута
function generateFile()
{
	console.log('Вызов функции generateFile');
	webkitRequestFileSystem(TEMPORARY, 5*1024*1024, createhd, showerror);
	var name = document.getElementById('file-output').value;
	if (name != ''){
			hd.getFile(name, {create: true, exclusive:false}, function(entry){entry.createWriter(writecontent,showerror);},showerror);
		}
}

function writecontent(fileWriter){
	var text = "JSON";
	fileWriter.addEventListener('writeend', function(){hd.getDirectory(name,null,readdir,showerror)});
	var blob = new Blob([text]);
	fileWriter.writer(blob);
	}

function readdir(dir){
	var reader = dir.createReader();
	reader.readEntries(downloadFile,showerror);
}
function downloadFile(files){
	url = files[0].toURL();
	window.open(url);	
	}

function createhd(fs){
	console.log('Создание файловой системы');
	hd=fs.root;
	}
function showerror(e)
	{
		alert('Error: ' + e.code);
	}
//-------------------------------------------------------------------------------
// Создание метки.
function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
        iconCaption: 'поиск...'
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true
    });
}

// Определяем адрес по координатам (обратное геокодирование).
function getAddress(coords) {
    mPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function(res) {
        var firstGeoObject = res.geoObjects.get(0);

        mPlacemark.properties
            .set({
                // Формируем строку с данными об объекте.
                iconCaption: [
                    // Название населенного пункта или вышестоящее административно-территориальное образование.
                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                    // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                // В качестве контента балуна задаем строку с адресом объекта.
                balloonContent: firstGeoObject.getAddressLine()
            });
    });
}

function readFile(e) {
    mFile = e.target.files[0];
    if (!mFile) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        mJson = e.target.result;
    };
    reader.readAsText(mFile);
}

function displayContents() {
    var quest_json = JSON.parse(mJson);
    mQuest = new Quest(quest_json.name);
    for (var j = 0; j < quest_json.points.length; j++) {
        mQuest.addMark(new Mark(quest_json.points[j].number,
            quest_json.points[j].name,
            quest_json.points[j].long,
            quest_json.points[j].lat,
            quest_json.points[j].radius));
    }
    refresh();
}

function refresh() {
    clearMap();
    startQuestOnMap();
    document.getElementById('pointsOfQuest').textContent = mQuest.toString();
}

function clearMap() {
    mMap.geoObjects.removeAll();
}

function startQuestOnMap() {
    if (mMap == null || mQuest == null) {
        return;
    }
    var marks = mQuest.getMarks();
    var сoordinates = new Array();

    for (var i = 0; i < marks.length; i++) {
        newCoordinate = [marks[i].getLat(), marks[i].getLong()];
        сoordinates.push(newCoordinate);
    }

    multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: сoordinates,
        params: {
            //Тип маршрутизации - пешеходная маршрутизация.
            routingMode: 'pedestrian',
        }
    }, {
        // Внешний вид путевых точек.
        wayPointStartIconColor: "#333",
        wayPointStartIconFillColor: "#B3B3B3",
        // Позволяет скрыть иконки путевых точек маршрута.
        //wayPointVisible:false,

        // Внешний вид транзитных точек.
        viaPointIconRadius: 7,
        viaPointIconFillColor: "#000088",
        viaPointActiveIconFillColor: "#E63E92",

        // Позволяет скрыть иконки транзитных точек маршрута.
        //viaPointVisible:false,

        // Внешний вид точечных маркеров под путевыми точками.
        pinIconFillColor: "#000088",
        pinActiveIconFillColor: "#B3B3B3",
        // Позволяет скрыть точечные маркеры путевых точек.
        //pinVisible:false,

        // Внешний вид линии маршрута.
        routeStrokeWidth: 2,
        routeStrokeColor: "#000088",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#E63E92",

        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    // Событие для выбора длинны маршрута и других данных
    multiRoute.model.events.add("requestsuccess", function(event) {
        var x = document.getElementById("distance");
        x.textContent = "Полная длина маршрута:" + multiRoute.getRoutes().get(0).properties.get("distance").value + " метров";
        var x = document.getElementById("duration");
        var seconds = multiRoute.getRoutes().get(0).properties.get("duration").value;
        x.textContent = "Приблизительное время прохождения:" + Math.ceil(seconds / 60) + " минут";
    });

    // Добавляем мультимаршрут на карту.
    mMap.geoObjects.add(multiRoute);
}

class Quest {
    constructor(name) {
        this.name = name;
        this.marks = new Array();
    }

    addMark(mark) {
        this.marks.push(mark);
    }

    toString() {
        var text = "";
        text += "Пункты : "
        for (var i = 0; i < this.marks.length; i++) {
            text += "\n";
            text += this.marks[i].toString();
        }
        text += "\n"
        return text;
    }

    getMarks() {
        return this.marks;
    }
}

class Mark {
    constructor(number, name, long, lat, radius) {
        this.number = number;
        this.name = name;
        this.long = long;
        this.lat = lat;
        this.radius = radius;
    }

    toString() {
        var text = "Номер(id) : " + this.number;
        text += ", Название : " + this.name;
        text += ", Long : " + this.long;
        text += ", Lat : " + this.lat;
        text += ", Радиус до обнаружения : " + this.radius;
        return text;
    }

    getLong() {
        return this.long;
    }

    getLat() {
        return this.lat;
    }

    getNumber() {
        return this.number;
    }

    getName() {
        return this.name;
    }
}

class QuestOSM {
    constructor(name) {
        this.name = name;
        this.marks = new Array();
    }

    addMark(mark) {
        this.marks.push(mark);
    }

    toString() {
        var text = "";
        text += "Пункты : "
        for (var i = 0; i < this.marks.length; i++) {
            text += "\n";
            text += this.marks[i].toString();
        }
        text += "\n"
        return text;
    }

    getMarks() {
        return this.marks;
    }
}

class MarkOSM {
    constructor(number, name, long, lat) {
        this.number = number;
        this.long = long;
        this.lat = lat;
    }

    toString() {
        var text = "Номер(id) : " + this.number;
        text += ", Long : " + this.long;
        text += ", Lat : " + this.lat;
        return text;
    }

    getLong() {
        return this.long;
    }

    getLat() {
        return this.lat;
    }

    getNumber() {
        return this.number;
    }
}