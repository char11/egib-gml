import { showOnMapButton } from "../ui/ui";
import { getOgolnyObiekt } from "./common-functions";
import { getOE } from "./dzialki-ewidencyjne";
import { egbFeatures } from "./features";
import { EGB_OZK, EGB_OZU } from "./kontury-uzytku-gruntowego";
import { getJE } from "./obreby-ewidencyjne";

function getLokalizacja(obj: EGB_KonturKlasyfikacyjnyType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator konturu klasyfikacyjnego: </span>';
	if (obj.idKonturu) {
		ret += '<span class="bold">' + obj.idKonturu + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora konturu</span>';
	}
	if (obj.lokalizacjaKonturu == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji konturu</span>';
	} else if (obj.lokalizacjaKonturu) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaKonturu._attributes.href);
		if (objObr) {
			ret += getJE(objObr);
			ret += getOE(objObr);
			if (obj.idKonturu) {
				ret += '</span><span class="span-title item">Nr konturu: </span><span>' + obj.idKonturu.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getKlasy(obj: EGB_KonturKlasyfikacyjnyType) {
	let ret = "<div>";
	ret += '<div><span class="item">OZU: </span>';
	if (obj.OZU) {
		const oZU = EGB_OZU[obj.OZU];
		if (oZU) {
			ret += oZU;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak OZU</span>';
	}
	ret += "</div>";

	if (obj.OZK) {
		ret += '<div><span class="item">OZK: </span>';
		const oZK = EGB_OZK[obj.OZK];
		if (oZK) {
			ret += oZK;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

export function pokazKonturKlasyfikacyjny(id: string) {
	const obj = egbFeatures.konturyKlasyfikacyjne.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getKlasy(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
