import { parseGml } from "../parsegml/parse-gml";
import L, { Layer, type LeafletEvent } from "leaflet";
import * as geojson from "geojson";
import "./leaflet.canvaslabel";
import "./TileLayer.ProjWMTS";
import proj4 from "proj4";
import "proj4leaflet";
import "leaflet-easybutton";
import { egbFeatures, htmlIDs, showEgbFeatureFromMap } from "../egib/features";
import { EGB_KodStabilizacji, EGB_SpelnienieWarunkowDokladnosciowych, EGB_SposobPozyskania } from "../egib/punkty-graniczne";
import { EGB_RodzajObiektu } from "../egib/obiekty-trwale-zwiazane-z-budynkiem";
import { EGB_RodzajBloku } from "../egib/bloki-budynku";
import { EGB_RodzajWgKST } from "../egib/budynki";

proj4.defs([
	["EPSG:2176", "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
	["EPSG:2177", "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs +axis=neu"],
	["EPSG:2178", "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs +axis=neu"],
	["EPSG:2179", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
	["EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
]);

proj4.defs("urn:ogc:def:crs:EPSG::2176", proj4.defs("EPSG:2176"));
proj4.defs("urn:ogc:def:crs:EPSG::2177", proj4.defs("EPSG:2177"));
proj4.defs("urn:ogc:def:crs:EPSG::2178", proj4.defs("EPSG:2178"));
proj4.defs("urn:ogc:def:crs:EPSG::2179", proj4.defs("EPSG:2179"));
proj4.defs("urn:ogc:def:crs:EPSG::2180", proj4.defs("EPSG:2180"));
proj4.defs("urn:x-ogc:def:crs:EPSG:4326", proj4.defs("EPSG:4326"));

type featureProperties = {
	id: string;
	text?: string;
	pos?: string;
	rot?: number;
	style?: string;
	ref?: number[];
};

const canvasLabel = new L.CanvasLabel({
	collisionFlg: true,
});

const mapOptions = {
	center: L.latLng(51.9194, 19.1451),
	zoom: 7,
	preferCanvas: true,
	renderer: canvasLabel,
	//renderer: labelTextCollision,
};

const map = L.map("map", mapOptions);

let prevLayerClicked: any;

let layers: { [key: string]: any } = {};

const tableButton = L.easyButton(
	'<img src="./images/table-icon.png">',
	function () {
		(document.getElementById("table-dialog") as HTMLDialogElement)?.showModal();
	},
	{ position: "bottomright" },
);

const info = L.control({ position: "bottomright" });

function onEachFeature(feature: geojson.Feature, layer: Layer) {
	layers[feature.properties.id] = layer;
	layer.on({
		click: mapHighlightFeature,
	});
}

export function sheetHighlightFeature(id: string) {
	const layer = layers[id];
	if (layer) {
		if (layer.feature.geometry.type === "Point") {
			map.fitBounds(layer.getLatLng().toBounds(2));
		} else {
			map.fitBounds(layer.getBounds());
		}
	}
	highlightFeature(layers[id]);
}

function mapHighlightFeature(e: LeafletEvent) {
	const layer = e.target;
	highlightFeature(layer);
}

function highlightFeature(layer) {
	if (prevLayerClicked !== undefined) {
		if (prevLayerClicked.feature.geometry.type === "Point") {
			prevLayerClicked.setStyle(prevLayerClicked.defaultOptions);
		} else {
			prevLayerClicked.setStyle(prevLayerClicked.defaultOptions.style);
		}
	}
	prevLayerClicked = layer;

	if (layer) {
		layer.setStyle({
			weight: 3,
			color: "#666",
			dashArray: "",
			fillOpacity: 0.3,
		});
		info.update(layer.feature.properties.id);
	} else {
		info.update();
	}
}

export function showMap() {
	map.invalidateSize();

	// działka
	const deStyle = {
		// fillColor: "#000000",
		color: "#40A0FF",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.15,
	};
	// jednostka
	const jeStyle = {
		// fillColor: "#000000",
		color: "#3388ff",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.1,
	};
	//obręb
	const oeStyle = {
		// fillColor: "#000000",
		color: "#3388ff",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.1,
	};
	// punkt graniczny
	const punktGr = {
		radius: 6,
		// fillColor: "#ff7800",
		color: "#f00",
		weight: 1,
		// opacity: 1,
		// fillOpacity: 0.8,
	};
	// punkt graniczny
	const punktGrSPDISD = {
		radius: 6,
		// fillColor: "#ff7800",
		color: "#00f",
		weight: 1,
		// opacity: 1,
		// fillOpacity: 0.8,
	};
	// punkt graniczny
	const punktGrUstab = {
		radius: 3,
		fillColor: "#000",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 1,
	};
	// obiekt związany z budynkiem - punkt
	const obCircleStyle = {
		radius: 8,
		// fillColor: "#000000",
		color: "#C80000",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.15,
	};
	// kontur klasyfikacyjny
	const kkStyle = {
		// fillColor: "#000000",
		color: "#24BC24",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.1,
		dashArray: "9, 7",
	};
	// użytek
	const kuStyle = {
		// fillColor: "#000000",
		color: "#000080",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.1,
		dashArray: "5, 5",
	};
	// budynek
	const buStyle = {
		// fillColor: "#000000",
		color: "#c80000",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.15,
	};
	// blok budynku
	const bbStyle = {
		// fillColor: "#000000",
		color: "#c80000",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.15,
	};
	// obiekt zwiazany z budynkiem
	const obStyle = {
		// fillColor: "#000000",
		color: "#c80000",
		weight: 2,
		// opacity: 1,
		fillOpacity: 0.15,
	};
	// adres nieruchmości
	const adStyle = {
		radius: 3,
		// fillColor: "#000000",
		color: "#222222",
		weight: 1,
		// opacity: 1,
		//fillOpacity: 0.15,
	};
	// odnośnik
	//const odStyle = {
	//	color: "#222222",
	//	weight: 1,
	//	// opacity: 1,
	//	//fillOpacity: 0.15,
	//};

	let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		maxZoom: 19,
	});

	//let osm = L.tileLayer.canvas("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	//	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	//	maxZoom: 19,
	//});

	let blank = L.tileLayer("", {
		maxZoom: 22,
	});

	//proj4.defs("EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs");
	//let crs2180 = new L.Proj.CRS("EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs", {});
	let crs2180 = new L.Proj.CRS(
		"EPSG:2180",
		"+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu",
		{},
	);

	let wmts = L.tileLayer.projwmts("https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/G2_MOBILE_500", {
		format: "image/png",
		tileSize: 512,
		version: "1.0.0",
		transparent: true,
		crs: crs2180,
		origin: [850000.0, 100000.0],
		scales: [
			30238155.714285716, 15119077.857142858, 7559538.928571429, 3779769.4642857146, 1889884.7321428573, 944942.3660714286, 472471.1830357143,
			236235.59151785716, 94494.23660714286, 47247.11830357143, 23623.559151785714, 9449.423660714287, 4724.711830357143, 1889.8847321428573, 944.9423660714286,
			472.4711830357143,
		],
		tilematrixSet: "EPSG:2180",
		opacity: 1.0,
		crossOrigin: true,
		minZoom: 5,
		attribution: '&copy; <a href="https://www.geoportal.gov.pl">Geoportal.gov.pl</a>',
	});

	let orto = L.tileLayer(
		"https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?SERVICE=WMTS&REQUEST=GetTile&VERSION=&LAYER=&STYLE=&FORMAT=image/png&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{z}&TILEROW={y}&TILECOL={x}",
		{
			noWrap: true,
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.geoportal.gov.pl">Geoportal.gov.pl</a>',
		},
	);

	//let orto = L.tileLayer.wms("https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution", {
	//	layers: "Raster",
	//	format: "image/png",
	//	transparent: "true",
	//	version: "1.1.1",
	//});

	let baseMaps = {
		"Bez podkładu": blank,
		OpenStreetMap: osm,
		"Geoportal Topo": wmts,
		"Geoportal Orto": orto,
	};

	let geoJson: geojson.FeatureCollection = {
		type: "FeatureCollection",
		features: [],
	};

	for (const obj of egbFeatures.jednostkiEwidencyjne.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mJednostkaEwidencyjna + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerJE = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: jeStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};

	for (const obj of egbFeatures.obrebyEwidencyjne.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mObrebEwidencyjny + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerOE = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: oeStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.dzialkiEwidencyjne.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mDzialkaEwidencyjna + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerDE = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: deStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.konturyUzytkuGruntowego.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mKonturUzytkuGruntowego + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerKU = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: kuStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.konturyKlasyfikacyjne.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mKonturKlasyfikacyjny + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerKK = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: kkStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.budynki.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mBudynek + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerBu = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: buStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.blokiBudynku.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mBlokBudynku + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerBB = L.geoJSON(geoJson, {
		onEachFeature: onEachFeature,
		style: bbStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.values()) {
		if (obj.geometria) {
			geoJson.features.push({
				type: "Feature",
				properties: { id: htmlIDs.mObiektTrwaleZwiazanyZBudynkiem + obj._attributes.id },
				geometry: parseGml(obj.geometria),
			});
			//if (obj.poliliniaKierunkowa) {
			//	geoJson.features.push({
			//		type: "Feature",
			//		properties: { id: htmlIDs.mObiektTrwaleZwiazanyZBudynkiem + obj._attributes.id },
			//		geometry: parseGml(obj.poliliniaKierunkowa),
			//	});
			//}
		}
	}
	let layerOb = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			return L.circleMarker(latlng, obCircleStyle);
		},
		onEachFeature: onEachFeature,
		style: obStyle,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.punktyGraniczne.values()) {
		if (obj.geometria) {
			let circleStyle = "circleRed";
			if (obj.spelnienieWarunkowDokl === "1" && obj.sposobPozyskania === "1") {
				circleStyle = "circleBlue";
			}
			if (["3", "4", "5", "6"].includes(obj.rodzajStabilizacji)) {
				circleStyle = "dotBlack";
			}
			geoJson.features.push({
				type: "Feature",
				properties: { id: htmlIDs.mPunktGraniczny + obj._attributes.id, style: circleStyle },
				geometry: parseGml(obj.geometria),
			});
		}
	}
	let layerPG = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			switch (feature.properties.style) {
				case "circleRed":
					return L.circleMarker(latlng, punktGr);
				case "circleBlue":
					return L.circleMarker(latlng, punktGrSPDISD);
				case "dotBlack":
					return L.circleMarker(latlng, punktGrUstab);
			}
		},
		onEachFeature: onEachFeature,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};
	for (const obj of egbFeatures.adresyNieruchomosci.values()) {
		if (obj.geometria) {
			geoJson.features.push({ type: "Feature", properties: { id: htmlIDs.mAdresNieruchomosci + obj._attributes.id }, geometry: parseGml(obj.geometria) });
		}
	}
	let layerAd = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			return L.circleMarker(latlng, adStyle);
		},
		onEachFeature: onEachFeature,
	});

	geoJson = {
		type: "FeatureCollection",
		features: [],
	};

	//------------------------------------------------

	let layerLabelsJE = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsOE = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsDE = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsKU = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsKK = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsBu = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsBB = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsOb = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	let layerLabelsPG = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
	});

	let layerLabelsAd = L.geoJSON(geoJson, {
		pointToLayer: (feature, latlng) => {
			if (feature.properties.text !== undefined) {
				const label = String(feature.properties.text);
				return L.circleMarker(latlng, {
					radius: 1,
					opacity: 0,
					//text: label,
					labelStyle: {
						text: label,
						pos: feature.properties.pos,
						rotation: feature.properties.rot,
						ref: feature.properties.ref,
					},
				});
			}
		},
		//style: odStyle,
	});

	for (const obj of egbFeatures.prezentacjeGraficzne.values()) {
		const obiektPrzedstawiany = obj.obiektPrzedstawiany;
		if (obiektPrzedstawiany) {
			geoJson = {
				type: "FeatureCollection",
				features: [],
			};

			const etykieta = obj.etykieta;
			if (etykieta) {
				if (Array.isArray(etykieta)) {
					etykieta.forEach((key) => {
						if (key.Etykieta.geometria) {
							geoJson.features.push({
								type: "Feature",
								properties: getProps(key, obiektPrzedstawiany._attributes.href),
								geometry: parseGml(key.Etykieta.geometria),
							});
						}
					});
				} else {
					if (etykieta.Etykieta.geometria) {
						geoJson.features.push({
							type: "Feature",
							properties: getProps(etykieta, obiektPrzedstawiany._attributes.href),
							geometry: parseGml(etykieta.Etykieta.geometria),
						});
					}
				}
			}
			if (geoJson.features.length) {
				if (egbFeatures.jednostkiEwidencyjne.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsJE.addData(geoJson);
				} else if (egbFeatures.obrebyEwidencyjne.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsOE.addData(geoJson);
				} else if (egbFeatures.konturyUzytkuGruntowego.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsKU.addData(geoJson);
				} else if (egbFeatures.konturyKlasyfikacyjne.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsKK.addData(geoJson);
				} else if (egbFeatures.dzialkiEwidencyjne.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsDE.addData(geoJson);
				} else if (egbFeatures.budynki.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsBu.addData(geoJson);
				} else if (egbFeatures.blokiBudynku.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsBB.addData(geoJson);
				} else if (egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsOb.addData(geoJson);
				} else if (egbFeatures.punktyGraniczne.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsPG.addData(geoJson);
				} else if (egbFeatures.adresyNieruchomosci.get(obiektPrzedstawiany._attributes.href)) {
					layerLabelsAd.addData(geoJson);
				}
			}
		}
	}

	let layerGroupJE = L.layerGroup([layerJE, layerLabelsJE]);
	let layerGroupOE = L.layerGroup([layerOE, layerLabelsOE]);
	let layerGroupDE = L.layerGroup([layerDE, layerLabelsDE]);
	let layerGroupKU = L.layerGroup([layerKU, layerLabelsKU]);
	let layerGroupKK = L.layerGroup([layerKK, layerLabelsKK]);
	let layerGroupBu = L.layerGroup([layerBu, layerLabelsBu]);
	let layerGroupBB = L.layerGroup([layerBB, layerLabelsBB]);
	let layerGroupOb = L.layerGroup([layerOb, layerLabelsOb]);
	let layerGroupPG = L.layerGroup([layerPG, layerLabelsPG]);
	let layerGroupAd = L.layerGroup([layerAd, layerLabelsAd]);

	let overlayMaps = {
		//"Jedn. ew.": layerJE,
		"Jedn. ew.": layerGroupJE,
		//"Obr. ew.": layerOE,
		"Obr. ew.": layerGroupOE,
		//Użytki: layerKU,
		Użytki: layerGroupKU,
		//"Kontury Klas.": layerKK,
		"Kontury Klas.": layerGroupKK,
		//"Działki ew.": layerDE,
		"Działki ew.": layerGroupDE,
		//Budynki: layerBu,
		Budynki: layerGroupBu,
		//"Bloki budynków": layerBB,
		"Bloki budynków": layerGroupBB,
		//"Obiekty zw. z bud.": layerOb,
		"Obiekty zw. z bud.": layerGroupOb,
		//"Punkty gr.": layerPG,
		"Punkty gr.": layerGroupPG,
		"Adresy nieruchom.": layerGroupAd,
	};

	map.on("overlayadd", () => {
		layerJE.bringToFront();
		layerOE.bringToFront();
		layerKU.bringToFront();
		layerKK.bringToFront();
		layerDE.bringToFront();
		layerBu.bringToFront();
		layerBB.bringToFront();
		layerOb.bringToFront();
		layerPG.bringToFront();
		layerAd.bringToFront();
	});

	let layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

	map.addLayer(blank);
	// map.addLayer(layerJE);
	// map.addLayer(layerOE);
	// map.addLayer(layerKU);
	// map.addLayer(layerKK);
	//map.addLayer(layerDE);
	map.addLayer(layerGroupDE);
	//map.addLayer(layerLabelDE);
	//map.fitBounds(layerDE.getBounds());
	//map.addLayer(layerBu);
	//map.addLayer(layerBB);
	//map.addLayer(layerOb);
	map.addLayer(layerGroupBu);
	//map.addLayer(layerGroupBB);
	map.addLayer(layerGroupOb);
	// map.addLayer(layerPG);

	if (layerDE.getBounds().isValid()) {
		map.fitBounds(layerDE.getBounds());
	} else if (layerBu.getBounds().isValid()) {
		map.fitBounds(layerBu.getBounds());
	} else if (layerKK.getBounds().isValid()) {
		map.fitBounds(layerKK.getBounds());
	} else if (layerKU.getBounds().isValid()) {
		map.fitBounds(layerKU.getBounds());
	} else if (layerOE.getBounds().isValid()) {
		map.fitBounds(layerOE.getBounds());
	} else if (layerJE.getBounds().isValid()) {
		map.fitBounds(layerJE.getBounds());
	} else if (layerPG.getBounds().isValid()) {
		map.fitBounds(layerPG.getBounds());
	}

	// map.on("zoomend", function () {
	// 	var zoomlevel = map.getZoom();
	// 	if (zoomlevel < 18) {
	// 		if (map.hasLayer(layerPG)) {
	// 			map.removeLayer(layerPG);
	// 		} else {
	// 			console.log("no point layer active");
	// 		}
	// 	}
	// 	if (zoomlevel >= 18) {
	// 		if (map.hasLayer(layerPG)) {
	// 			console.log("layer already added");
	// 		} else {
	// 			map.addLayer(layerPG);
	// 		}
	// 	}
	// 	console.log("Current Zoom Level = " + zoomlevel);
	// });

	/* 	let info = L.control({ position: "bottomright" }); */

	info.onAdd = function () {
		this.infoDiv = L.DomUtil.create("div", "div-mapinfo");
		this.infoDiv.addEventListener("click", showFullInfo);
		this.update();
		return this.infoDiv;
	};

	info.update = function (fId: string) {
		let info = "";
		let html = '<div class="info-wrapper">';
		if (fId) {
			const id = fId.slice(3);
			const gmlFeature = fId.slice(0, 3);
			switch (gmlFeature) {
				case htmlIDs.mJednostkaEwidencyjna: {
					info += '<div class="map-h">Jednostka ewidencyjna</div><br>';
					const jednostkaEwid = egbFeatures.jednostkiEwidencyjne.get(id);
					if (jednostkaEwid) {
						const idJednostkiEwid = jednostkaEwid.idJednostkiEwid;
						if (idJednostkiEwid) {
							info += '<div class="map-item">Id: ' + '<span class="map-val">' + jednostkaEwid.idJednostkiEwid + "</span></div>";
						}
						const nazwaWlasna = jednostkaEwid.nazwaWlasna;
						if (nazwaWlasna) {
							info += '<div class="map-item">Nazwa: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
						}
					}
					break;
				}
				case htmlIDs.mObrebEwidencyjny: {
					info += '<div class="map-h">Obręb ewidencyjny</div><br>';
					const obreb = egbFeatures.obrebyEwidencyjne.get(id);
					if (obreb) {
						const idObrebu = obreb.idObrebu;
						if (idObrebu) {
							info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idObrebu + "</span></div>";
						}
						const nazwaWlasna = obreb.nazwaWlasna;
						if (nazwaWlasna) {
							info += '<div class="map-item""</div><div>Nazwa: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
						}
						const jednostka = obreb.lokalizacjaObrebu;
						if (jednostka) {
							const objJE = egbFeatures.jednostkiEwidencyjne.get(jednostka._attributes.href);
							if (objJE) {
								const nazwaWlasna = objJE.nazwaWlasna;
								if (nazwaWlasna) {
									info += '<div class="map-item""</div><div>Lokalizacja: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
								}
							}
						}
					}
					break;
				}
				case htmlIDs.mKonturKlasyfikacyjny:
					{
						info += '<div class="map-h">Kontur klasyfikacyjny</div><br>';
						const kontur = egbFeatures.konturyKlasyfikacyjne.get(id);
						if (kontur) {
							const idKonturu = kontur.idKonturu;
							if (idKonturu) {
								info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idKonturu + "</span></div>";
							}
							const obreb = kontur.lokalizacjaKonturu;
							if (obreb) {
								const objOE = egbFeatures.obrebyEwidencyjne.get(obreb._attributes.href);
								if (objOE) {
									const nazwaWlasna = objOE.nazwaWlasna;
									if (nazwaWlasna) {
										info += '<div class="map-item""</div><div>Lokalizacja: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
									}
								}
								const OZU = kontur.OZU;
								if (OZU) {
									const OZK = kontur.OZK;
									info += '<div class="map-item""<div>Klasa: ' + '<span class="map-val">' + OZU + (OZK ? OZK : "") + "</span></div>";
								}
							}
						}
					}
					break;
				case htmlIDs.mKonturUzytkuGruntowego:
					{
						info += '<div class="map-h">Kontur użytku gruntowego</div><br>';
						const uzytek = egbFeatures.konturyUzytkuGruntowego.get(id);
						if (uzytek) {
							const idUzytku = uzytek.idUzytku;
							if (idUzytku) {
								info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idUzytku + "</span></div>";
							}
							const obreb = uzytek.lokalizacjaUzytku;
							if (obreb) {
								const objOE = egbFeatures.obrebyEwidencyjne.get(obreb._attributes.href);
								if (objOE) {
									const nazwaWlasna = objOE.nazwaWlasna;
									if (nazwaWlasna) {
										info += '<div class="map-item""</div><div>Lokalizacja: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
									}
								}
								const OFU = uzytek.OFU;
								if (OFU) {
									info += '<div class="map-item""<div>Rodzaj: ' + '<span class="map-val">' + OFU + "</span></div>";
								}
							}
						}
					}
					break;
				case htmlIDs.mDzialkaEwidencyjna: {
					info += '<div class="map-h">Działka ewidencyjna</div><br>';
					const dzialka = egbFeatures.dzialkiEwidencyjne.get(id);
					if (dzialka) {
						const idDzialki = dzialka.idDzialki;
						if (idDzialki) {
							info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idDzialki + "</span></div>";
						}
						const obreb = dzialka.lokalizacjaDzialki;
						if (obreb) {
							const objOE = egbFeatures.obrebyEwidencyjne.get(obreb._attributes.href);
							if (objOE) {
								const nazwaWlasna = objOE.nazwaWlasna;
								if (nazwaWlasna) {
									info += '<div class="map-item""</div><div>Lokalizacja: ' + '<span class="map-val">' + nazwaWlasna + "</span></div>";
								}
							}
						}
						const JRG = dzialka.JRG2;
						if (JRG) {
							const objJRG = egbFeatures.jednostkiRejestroweGruntow.get(JRG._attributes.href);
							if (objJRG) {
								const idJednostkiRejestrowej = objJRG.idJednostkiRejestrowej;
								if (idJednostkiRejestrowej) {
									info += '<div class="map-item""</div><div>JRG: ' + '<span class="map-val">' + idJednostkiRejestrowej.split(".").pop() + "</span></div>";
								}
							}
						}
					}
					break;
				}
				case htmlIDs.mBudynek:
					{
						info += '<div class="map-h">Budynek</div><br>';
						const budynek = egbFeatures.budynki.get(id);
						if (budynek) {
							const idBudynku = budynek.idBudynku;
							if (idBudynku) {
								info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idBudynku + "</span></div>";
							}
							let rodzajWgKST = budynek.rodzajWgKST;
							if (rodzajWgKST) {
								info += '<div class="map-item""<div>Rodzaj: ' + '<span class="map-val">' + EGB_RodzajWgKST[rodzajWgKST] + "</span></div>";
							}
							const dzialkaZabudowana = budynek.dzialkaZabudowana;
							if (dzialkaZabudowana) {
								let tmp = "";
								if (Array.isArray(dzialkaZabudowana)) {
									dzialkaZabudowana.forEach((key) => {
										if (tmp) {
											tmp += ", ";
										}
										const objDE = egbFeatures.dzialkiEwidencyjne.get(key._attributes.href);
										if (objDE) {
											const idDE = objDE.idDzialki;
											if (idDE) {
												tmp += idDE.split(".").pop();
											}
										}
									});
								} else {
									const objDE = egbFeatures.dzialkiEwidencyjne.get(dzialkaZabudowana._attributes.href);
									if (objDE) {
										const idDE = objDE.idDzialki;
										if (idDE) {
											tmp += idDE.split(".").pop();
										}
									}
								}
								info += '<div class="map-item""</div><div>Działka: ' + '<span class="map-val">' + tmp + "</span></div>";
							}
							const JRBdlaBudynku = budynek.JRBdlaBudynku;
							if (JRBdlaBudynku) {
								const objJRB = egbFeatures.jednostkiRejestroweBudynkow.get(JRBdlaBudynku._attributes.href);
								if (objJRB) {
									const idJednostkiRejestrowej = objJRB.idJednostkiRejestrowej;
									if (idJednostkiRejestrowej) {
										info += '<div class="map-item""</div><div>JRB: ' + '<span class="map-val">' + idJednostkiRejestrowej.split(".").pop() + "</span></div>";
									}
								}
							}
						}
					}
					break;
				case htmlIDs.mBlokBudynku:
					{
						info += '<div class="map-h">Blok budynku</div><br>';
						const blok = egbFeatures.blokiBudynku.get(id);
						if (blok) {
							const rodzajBloku = blok.rodzajBloku;
							if (rodzajBloku) {
								const opis = EGB_RodzajBloku[rodzajBloku];
								if (opis) {
									info += '<div class="map-item""<div>Rodzaj: ' + '<span class="map-val">' + opis + "</span></div>";
								}
							}
							const budynek = blok.budynekZBlokiemBud;
							if (budynek) {
								const objBu = egbFeatures.budynki.get(budynek._attributes.href);
								if (objBu) {
									const idBudynku = objBu.idBudynku;
									if (idBudynku) {
										info += '<div class="map-item""</div><div>Budynek: ' + '<span class="map-val">' + idBudynku.split(".").pop() + "</span></div>";
									}
								}
							}
						}
					}
					break;
				case htmlIDs.mObiektTrwaleZwiazanyZBudynkiem:
					{
						info += '<div class="map-h">Obiekt trwale związany z budynkiem</div><br>';
						const obiekt = egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.get(id);
						if (obiekt) {
							const rodzajObiektuZwiazanegoZBudynkiem = obiekt.rodzajObiektuZwiazanegoZBudynkiem;
							if (rodzajObiektuZwiazanegoZBudynkiem) {
								const opis = EGB_RodzajObiektu[rodzajObiektuZwiazanegoZBudynkiem];
								if (opis) {
									info += '<div class="map-item""<div>Rodzaj: ' + '<span class="map-val">' + opis + "</span></div>";
								}
							}
							const budynek = obiekt.budynekZElementamiZwiazanymi;
							if (budynek) {
								const objBu = egbFeatures.budynki.get(budynek._attributes.href);
								if (objBu) {
									const idBudynku = objBu.idBudynku;
									if (idBudynku) {
										info += '<div class="map-item""</div><div>Budynek: ' + '<span class="map-val">' + idBudynku.split(".").pop() + "</span></div>";
									}
								}
							}
						}
					}
					break;
				case htmlIDs.mPunktGraniczny:
					{
						info += '<div class="map-h">Punkt graniczny</div><br>';
						const punkt = egbFeatures.punktyGraniczne.get(id);
						if (punkt) {
							const idPunktu = punkt.idPunktu;
							if (idPunktu) {
								info += '<div class="map-item""<div>Id: ' + '<span class="map-val">' + idPunktu + "</span></div>";
							}
							const sposobPozyskania = punkt.sposobPozyskania;
							if (sposobPozyskania) {
								const opis = EGB_SposobPozyskania[sposobPozyskania];
								if (opis) {
									info += '<div class="map-item""<div>SPD: ' + '<span class="map-val">' + opis + "</span></div>";
								}
							}
							const spelnienieWarunkowDokl = punkt.spelnienieWarunkowDokl;
							if (spelnienieWarunkowDokl) {
								const opis = EGB_SpelnienieWarunkowDokladnosciowych[spelnienieWarunkowDokl];
								if (opis) {
									info += '<div class="map-item""<div>ISD: ' + '<span class="map-val">' + opis + "</span></div>";
								}
							}
							const rodzajStabilizacji = punkt.rodzajStabilizacji;
							if (rodzajStabilizacji) {
								const opis = EGB_KodStabilizacji[rodzajStabilizacji];
								if (opis) {
									info += '<div class="map-item""<div>STB: ' + '<span class="map-val">' + opis + "</span></div>";
								}
							}
						}
					}
					break;
				case htmlIDs.mAdresNieruchomosci:
					{
						info += '<div class="map-h">Adres nieruchomości</div><br>';
						const adres = egbFeatures.adresyNieruchomosci.get(id);
						if (adres) {
							let tmp = "";
							if (adres.nazwaMiejscowosci) {
								tmp += adres.nazwaMiejscowosci + " ";
							}
							if (adres.nazwaUlicy) {
								tmp += adres.nazwaUlicy + " ";
							}
							if (adres.numerPorzadkowy) {
								tmp += adres.numerPorzadkowy;
							}
							if (adres.numerLokalu) {
								tmp += "/" + adres.numerLokalu;
							}
							info += '<div class="map-item""<div>' + '<span class="map-val">' + tmp + "</span></div>";
						}
					}
					break;
				default:
					info = "Brak informacji";
			}
			html += "<div>" + info + "</div><br><div>Kliknij aby wyświetlić pełne informacje</div>" + '<div id="feature-id" style="display: none;">' + fId + "</div>";
		} else {
			html += '<div>Wybierz obiekt</div><div id="feature-id" style="display: none;"></div>';
		}
		html += "</div>";
		this.infoDiv.innerHTML = html;
	};

	info.addTo(map);
	tableButton.addTo(map);
}

let getProps = function (obj: Etykieta, id: string) {
	let props: featureProperties = { id: "met", pos: "5", rot: 0 };
	if (obj.Etykieta.justyfikacja) {
		props.pos = obj.Etykieta.justyfikacja;
	}
	if (obj.Etykieta.katObrotu) {
		props.rot = -parseFloat(obj.Etykieta.katObrotu);
	}
	if (obj.Etykieta.odnosnik) {
		props.ref = parseGml(obj.Etykieta.odnosnik).coordinates;
	}
	if (obj.Etykieta.tekst) {
		props.text = obj.Etykieta.tekst;
	} else {
		let fObj;
		if ((fObj = egbFeatures.jednostkiEwidencyjne.get(id))) {
			props.text = fObj.idJednostkiEwid ? fObj.idJednostkiEwid + (fObj.nazwaWlasna ? " " + fObj.nazwaWlasna : "") : "";
		} else if ((fObj = egbFeatures.obrebyEwidencyjne.get(id))) {
			props.text = fObj.idObrebu ? fObj.idObrebu.split(".").pop() + (fObj.nazwaWlasna ? " " + fObj.nazwaWlasna : "") : "";
		} else if ((fObj = egbFeatures.konturyUzytkuGruntowego.get(id))) {
			props.text = fObj.OFU ? fObj.OFU : "";
		} else if ((fObj = egbFeatures.konturyKlasyfikacyjne.get(id))) {
			props.text = fObj.OZU ? fObj.OZU + (fObj.OZK ? fObj.OZK : "") : "";
		} else if ((fObj = egbFeatures.dzialkiEwidencyjne.get(id))) {
			props.text = fObj.idDzialki ? fObj.idDzialki.split(".").pop() : "";
		} else if ((fObj = egbFeatures.budynki.get(id))) {
			if (fObj.rodzajWgKST) {
				props.text = fObj.rodzajWgKST;
				if (fObj.liczbaKondygnacjiNadziemnych === "0") {
					props.text += fObj.liczbaKondygnacjiPodziemnych ? "-" + fObj.liczbaKondygnacjiPodziemnych : "";
				} else {
					props.text += fObj.liczbaKondygnacjiNadziemnych ? fObj.liczbaKondygnacjiNadziemnych : "";
				}
			}
		} else if ((fObj = egbFeatures.blokiBudynku.get(id))) {
			switch (fObj.rodzajBloku) {
				case "n": {
					props.text = fObj.numerNajwyzszejKondygnacji ? fObj.numerNajwyzszejKondygnacji : "";
					break;
				}
				case "p": {
					props.text = fObj.numerNajnizszejKondygnacji ? "-" + fObj.numerNajnizszejKondygnacji : "";
					break;
				}
				case "l": {
					props.text = fObj.numerNajwyzszejKondygnacji
						? fObj.numerNajwyzszejKondygnacji + "/" + (fObj.numerNajnizszejKondygnacji ? fObj.numerNajnizszejKondygnacji : "")
						: "";
					break;
				}
				case "a": {
					props.text = fObj.numerNajwyzszejKondygnacji
						? fObj.numerNajwyzszejKondygnacji + "/" + (fObj.numerNajnizszejKondygnacji ? fObj.numerNajnizszejKondygnacji : "")
						: "";
					break;
				}
				case "y": {
					props.text = fObj.numerNajwyzszejKondygnacji
						? fObj.numerNajwyzszejKondygnacji
						: fObj.numerNajnizszejKondygnacji
							? fObj.numerNajnizszejKondygnacji
							: "";
					break;
				}
			}
		}
	}
	return props;
};

function showFullInfo() {
	const gmlFeature = document.querySelector("#feature-id") as HTMLInputElement;
	if (gmlFeature.innerHTML) {
		showEgbFeatureFromMap(gmlFeature.innerHTML.slice(1));
	}
}
