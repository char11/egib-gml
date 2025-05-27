import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { EGB_RodzajPrawa, getPodmiotSkr, getPrzedmiot, getPrzedmiotSkr } from "./udzialy";

function getRodzaj(obj: EGB_UdzialWeWlasnosciType) {
	let ret = '<div><span class="item">Rodzaj prawa: </span>';
	if (obj.rodzajPrawa) {
		const rodzajPrawa = EGB_RodzajPrawa[obj.rodzajPrawa];
		if (rodzajPrawa) {
			ret += rodzajPrawa;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju prawa</span>';
	}
	ret += "</div>";
	return ret;
}

function getWartosc(obj: EGB_UdzialWeWlasnosciType) {
	let ret = "<div>";
	ret += '<div><span class="item">Licznik ułamka wartości udziału: </span>';
	if (obj.licznikUlamkaOkreslajacegoWartoscUdzialu) {
		ret += obj.licznikUlamkaOkreslajacegoWartoscUdzialu;
	} else {
		ret += '<span class="error-inline">Brak licznika</span>';
	}
	ret += "</div>";
	ret += '<div><span class="item">Mianownik ułamka wartości udziału: </span>';
	if (obj.mianownikUlamkaOkreslajacegoWartoscUdzialu) {
		ret += obj.mianownikUlamkaOkreslajacegoWartoscUdzialu;
	} else {
		ret += '<span class="error-inline">Brak mianownika</span>';
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getPodmiotPrzedmiot(obj: EGB_UdzialWeWlasnosciType) {
	let ret = "<div>";
	ret += '<div><span class="item">Podmiot: </span>';
	if (obj.podmiotUdzialuWlasnosci == null) {
		ret += '<span class="error-inline">Brak podmiotu</span>';
	} else if (obj.podmiotUdzialuWlasnosci) {
		ret += getPodmiotSkr(obj.podmiotUdzialuWlasnosci._attributes.href);
	}
	ret += "</div>";
	ret += '<div><span class="item">Przedmiot: </span>';
	if (obj.przedmiotUdzialuWlasnosci == null) {
		ret += '<span class="error-inline">Brak przedmiotu</span>';
	} else if (obj.przedmiotUdzialuWlasnosci) {
		ret += getPrzedmiot(obj.przedmiotUdzialuWlasnosci._attributes.href);
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getUdzialWNieruchomosciWspolnej(obj: EGB_UdzialWeWlasnosciType) {
	let ret = "";
	if (obj.udzialWNieruchomosciWspolnej) {
		ret += '<div><span class="item">Udział w nieruchomości wspólnej: </span>';
		const objUd = egbFeatures.udzialyWeWlasnosci.get(obj.udzialWNieruchomosciWspolnej._attributes.href);
		if (objUd) {
			ret += '<span class="cursor-pointer" id="' + htmlIDs.iUdzialWeWlasnosci + objUd._attributes.id + '" onclick="showEgbFeature(this.id)">';
			if (objUd.licznikUlamkaOkreslajacegoWartoscUdzialu && objUd.mianownikUlamkaOkreslajacegoWartoscUdzialu) {
				ret += "<sup>" + objUd.licznikUlamkaOkreslajacegoWartoscUdzialu + "</sup>/<sub>" + objUd.mianownikUlamkaOkreslajacegoWartoscUdzialu + "</sub> ";
			} else {
				ret += '<span class="error-inline">Brak wielkości udziału </span>';
			}
			if (objUd.przedmiotUdzialuWlasnosci) {
				ret += getPrzedmiotSkr(objUd.przedmiotUdzialuWlasnosci._attributes.href);
			}
			ret += "</span>";
		} else {
			ret += '<span class="error-inline">Brak udziału we własności o podanym gml id</span>';
		}
		ret += "</div>";
	}
	return ret;
}

export function pokazUdzialWeWlasnosci(id: string) {
	const obj = egbFeatures.udzialyWeWlasnosci.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Udział we własności: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzaj(obj);
			html += getWartosc(obj);
			html += getPodmiotPrzedmiot(obj);
			html += getUdzialWNieruchomosciWspolnej(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
