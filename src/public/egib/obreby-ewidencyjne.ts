import { showOnMapButton } from "../ui/ui";
import { getIdPunktuGranicznego, getNazwe, getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";

export function getJE(obj: EGB_ObrebEwidencyjnyType) {
	let ret = "";
	if (obj.lokalizacjaObrebu == null) {
		ret = '<span class="error-inline">&nbspBrak lokalizacji obrębu</span>';
	} else if (obj.lokalizacjaObrebu) {
		ret += '<span class="span-title item">Jednostka ewid.: </span>';
		const objJE = egbFeatures.jednostkiEwidencyjne.get(obj.lokalizacjaObrebu._attributes.href);
		if (objJE) {
			ret += '<span class="cursor-pointer" id="' + htmlIDs.iJednostkaEwidencyjna + objJE._attributes.id + '" onclick="showEgbFeature(this.id)">';
			if (objJE.idJednostkiEwid) {
				ret += objJE.idJednostkiEwid;
			} else {
				ret += '<span class="error-inline">Brak identyfikatora jednostki ewidencyjnej</span>';
			}
			ret += "</span>";
			if (objJE.nazwaWlasna) {
				ret += "<span> (" + objJE.nazwaWlasna + ")</span>";
			}
		} else {
			ret += '<span class="error-inline">Brak jednostki ewidencyjnej o podanym gml id</span>';
		}
	}
	return ret;
}

function getLokalizacja(obj: EGB_ObrebEwidencyjnyType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator obrębu ewidencyjnego: </span>';
	if (obj.idObrebu) {
		ret += '<span class="bold">' + obj.idObrebu + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora obrębu</span>';
	}
	//jednostka ewidencyjna
	ret += getJE(obj);

	if (obj.idObrebu) {
		ret += '</span><span class="span-title item">Nr obrębu: </span><span>' + obj.idObrebu.split(".").pop() + "</span>";
	}
	ret += "</div>";
	return ret;
}

function getPunktyGraniczne(obj: EGB_ObrebEwidencyjnyType) {
	let ret = '<div><div class="item">Punkty graniczne:</div><div class="div-scroll">';

	// punkty graniczne
	if (obj.punktGranicyObrebu == null) {
		ret += '<div class="error-inline">Brak punktów granicznych</div>';
	} else if (obj.punktGranicyObrebu.length < 3) {
		ret += '<div class="error-inline">Za mała liczba punktów granicznych</div>';
	} else {
		obj.punktGranicyObrebu.forEach((key) => {
			if (key) {
				ret += getIdPunktuGranicznego(key._attributes.href);
			}
		});
	}
	ret += "</div></div>";
	return ret;
}

export function pokazObrebEwidencyjny(id: string) {
	const obj = egbFeatures.obrebyEwidencyjne.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNazwe(obj);
			html += getPunktyGraniczne(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
