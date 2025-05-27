import { getOgolnyObiekt } from "./common-functions";
import { getGrupaRejestrowa, getWlasnosciWladania } from "./udzialy";
import { egbFeatures, htmlIDs } from "./features";
import { getJE } from "./obreby-ewidencyjne";
import { getOE } from "./dzialki-ewidencyjne";
import { showReportButton } from "../ui/ui";

function getIdLokalizacja(obj: EGB_JednostkaRejestrowaGruntowType) {
	let ret = '<div class="div-title">';

	// id działki
	ret += '<span class="item">Identyfikator JRG: </span>';
	if (obj.idJednostkiRejestrowej) {
		ret += '<span class="bold">' + obj.idJednostkiRejestrowej + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora JRG</span>';
	}

	// lokalizacja
	if (obj.lokalizacjaJRG == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji JRG</span>';
	} else if (obj.lokalizacjaJRG) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRG._attributes.href);
		if (objObr) {
			ret += getJE(objObr);
			ret += getOE(objObr);
			if (obj.idJednostkiRejestrowej) {
				ret += '</span><span class="span-title item">Nr JRG: </span><span>' + obj.idJednostkiRejestrowej.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getJRGDzialki(id: string) {
	let ret = '<div><div class="item">Działki:</div><div class="div-scroll">';
	let tmp = "";
	for (const obj of egbFeatures.dzialkiEwidencyjne.values()) {
		if (obj.JRG2) {
			if (obj.JRG2._attributes.href === id) {
				tmp += '<div class="cursor-pointer" id="' + htmlIDs.iDzialkaEwidencyjna + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
				if (obj.idDzialki) {
					tmp += obj.idDzialki.split(".").pop();
				} else {
					tmp += '<span class="error-inline">Brak identyfikatora działki</span>';
				}
				tmp += "</div>";
			}
		}
	}
	if (tmp) {
		ret += tmp;
	} else {
		ret += '<div class="error">Brak działki</div>';
	}
	ret += "</div>";
	return ret;
}

export function pokazJRG(id: string) {
	const obj = egbFeatures.jednostkiRejestroweGruntow.get(id);
	if (obj) {
		showReportButton();
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdLokalizacja(obj);
			html += '<div class="grid-container">';
			//html += getStartKoniecObiektu(obj);
			//html += getDokumentyOperaty(obj);
			html += getOgolnyObiekt(obj);
			html += getGrupaRejestrowa(obj);
			html += getJRGDzialki(obj._attributes.id);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			html = getWlasnosciWladania(obj._attributes.id);

			div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
