import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";
import { EGB_RodzajWladania, getPodmiotSkr, getPrzedmiot } from "./udzialy";

function getRodzaj(obj: EGB_UdzialWeWladaniuType) {
	let ret = '<div><span class="item">Rodzaj prawa: </span>';
	if (obj.rodzajWladania) {
		const rodzajPrawa = EGB_RodzajWladania[obj.rodzajWladania];
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

function getWartosc(obj: EGB_UdzialWeWladaniuType) {
	let ret = "<div>";
	if (obj.licznikUlamkaOkreslajacegoWartoscUdzialu) {
		ret += '<div><span class="item">Licznik ułamka wartości udziału: </span>';
		ret += obj.licznikUlamkaOkreslajacegoWartoscUdzialu;
		ret += "</div>";
	}
	if (obj.mianownikUlamkaOkreslajacegoWartoscUdzialu) {
		ret += '<div><span class="item">Mianownik ułamka wartości udziału: </span>';
		ret += obj.mianownikUlamkaOkreslajacegoWartoscUdzialu;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getPodmiotPrzedmiot(obj: EGB_UdzialWeWladaniuType) {
	let ret = "<div>";
	ret += '<div><span class="item">Podmiot: </span>';
	if (obj.podmiotUdzialuWeWladaniu == null) {
		ret += '<span class="error-inline">Brak podmiotu</span>';
	} else if (obj.podmiotUdzialuWeWladaniu) {
		ret += getPodmiotSkr(obj.podmiotUdzialuWeWladaniu._attributes.href);
	}
	ret += "</div>";
	ret += '<div><span class="item">Przedmiot: </span>';
	if (obj.przedmiotUdzialuWladania == null) {
		ret += '<span class="error-inline">Brak przedmiotu</span>';
	} else if (obj.przedmiotUdzialuWladania) {
		ret += getPrzedmiot(obj.przedmiotUdzialuWladania._attributes.href);
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

export function pokazUdzialWeWladaniu(id: string) {
	const obj = egbFeatures.udzialyWeWladaniu.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Udział we władaniu: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzaj(obj);
			html += getWartosc(obj);
			html += getPodmiotPrzedmiot(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
