import { getIdJRG, getOgolnyObiekt } from "./common-functions";
import { getGrupaRejestrowa, getWlasnosciWladania } from "./udzialy";
import { egbFeatures, htmlIDs } from "./features";
import { getJE } from "./obreby-ewidencyjne";
import { getOE } from "./dzialki-ewidencyjne";

function getIdLokalizacja(obj: EGB_JednostkaRejestrowaBudynkowType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator JRB: </span>';
	if (obj.idJednostkiRejestrowej) {
		ret += '<span class="bold">' + obj.idJednostkiRejestrowej + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora JRB</span>';
	}

	// lokalizacja
	if (obj.lokalizacjaJRB == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji JRB</span>';
	} else if (obj.lokalizacjaJRB) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRB._attributes.href);
		if (objObr) {
			ret += getJE(objObr);
			ret += getOE(objObr);
			// nr
			if (obj.idJednostkiRejestrowej) {
				ret += '</span><span class="span-title item">Nr JRB: </span><span>' + obj.idJednostkiRejestrowej.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getJRGZwiazanaZJRB(obj: EGB_JednostkaRejestrowaBudynkowType) {
	let ret = '<div><div class="item">JRG związana z JRB:</div><div class="div-scroll">';
	if (obj.JRGZwiazanaZJRB == null) {
		ret += '<div class="error">Brak JRG związanej z JRB</div>';
	} else if (obj.JRGZwiazanaZJRB) {
		if (Array.isArray(obj.JRGZwiazanaZJRB)) {
			obj.JRGZwiazanaZJRB.forEach((key) => {
				if (key) {
					ret += getIdJRG(key._attributes.href);
				}
			});
		} else {
			ret += getIdJRG(obj.JRGZwiazanaZJRB._attributes.href);
		}
	}
	ret += "</div></div>";
	return ret;
}

function getJRBBudynki(id: string) {
	let ret = '<div><div class="item">Budynki:</div><div class="div-scroll">';
	let tmp = "";
	for (const obj of egbFeatures.budynki.values()) {
		if (obj.JRBdlaBudynku) {
			if (obj.JRBdlaBudynku._attributes.href === id) {
				tmp += '<div class="cursor-pointer" id="' + htmlIDs.iBudynek + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
				if (obj.idBudynku) {
					tmp += obj.idBudynku.split(".").pop();
				} else {
					tmp += '<span class="error-inline">Brak identyfikatora budynku</span>';
				}
				tmp += "</div>";
			}
		}
	}
	if (tmp) {
		ret += tmp;
	} else {
		ret += '<div class="error">Brak budynku</div>';
	}
	ret += "</div>";
	return ret;
}

export function pokazJRB(id: string) {
	const obj = egbFeatures.jednostkiRejestroweBudynkow.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getGrupaRejestrowa(obj);
			html += getJRGZwiazanaZJRB(obj);
			html += getJRBBudynki(obj._attributes.id);

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
