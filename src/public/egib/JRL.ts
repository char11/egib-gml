import { getIdJRG, getOgolnyObiekt } from "./common-functions";
import { getGrupaRejestrowa, getWlasnosciWladania } from "./udzialy";
import { egbFeatures, htmlIDs } from "./features";
import { getJE } from "./obreby-ewidencyjne";
import { getOE } from "./dzialki-ewidencyjne";

function getIdLokalizacja(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator JRL: </span>';
	if (obj.idJednostkiRejestrowej) {
		ret += '<span class="bold">' + obj.idJednostkiRejestrowej + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora JRL</span>';
	}

	// lokalizacja
	if (obj.lokalizacjaJRL == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji JRL</span>';
	} else if (obj.lokalizacjaJRL) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRL._attributes.href);
		if (objObr) {
			ret += getJE(objObr);
			ret += getOE(objObr);
			// nr
			if (obj.idJednostkiRejestrowej) {
				ret += '</span><span class="span-title item">Nr JRL: </span><span>' + obj.idJednostkiRejestrowej.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getJRGZwiazanaZJRL(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret = '<div><div class="item">JRG związana z JRL:</div><div class="div-scroll">';
	if (obj.JRGZwiazanaZJRL == null) {
		ret += '<div class="error">Brak JRG związanej z JRL</div>';
	} else if (obj.JRGZwiazanaZJRL) {
		if (Array.isArray(obj.JRGZwiazanaZJRL)) {
			obj.JRGZwiazanaZJRL.forEach((key) => {
				if (key) {
					ret += getIdJRG(key._attributes.href);
				}
			});
		} else {
			ret += getIdJRG(obj.JRGZwiazanaZJRL._attributes.href);
		}
	}
	ret += "</div></div>";
	return ret;
}

function getIdJRB(id: string) {
	let ret = "";
	const obj = egbFeatures.jednostkiRejestroweBudynkow.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaBudynkow + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej.split(".").pop();
		} else {
			ret += '<span class="error">Brak identyfikatora JRB</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak JRB o podanym gml id</div>';
	}
	return ret;
}

function getNieruchomoscWspolna(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret = "<div>";
	ret += '<div><span class="item">Udział w nieruchomości wspólnej: </span>';
	if (obj.licznikUdzialuWNieruchomWspolnej) {
		ret += "<sup>" + obj.licznikUdzialuWNieruchomWspolnej + "</sup>/";
	} else {
		ret += '<span class="error-inline">Brak licznika</span>';
	}
	if (obj.mianownikUdzialuWNieruchomWspolnej) {
		ret += "<sub>" + obj.mianownikUdzialuWNieruchomWspolnej + "</sub>";
	} else {
		ret += '<span class="error-inline">Brak mianownika</span>';
	}
	ret += "</div>";

	if (obj.czescWspolnaDlaLokalu) {
		ret += '<div><div class="item">Część wspólna:</div><div class="div-scroll">';
		if (Array.isArray(obj.czescWspolnaDlaLokalu)) {
			obj.czescWspolnaDlaLokalu.forEach((key) => {
				if (key) {
					ret += getIdJRB(key._attributes.href);
				}
			});
		} else {
			ret += getIdJRB(obj.czescWspolnaDlaLokalu._attributes.href);
		}
		ret += "</div></div>";
	}

	ret += "</div>";
	return ret;
}

function getJRLLokal(id: string) {
	let ret = '<div><span class="item">Lokal: </span>';
	for (const obj of egbFeatures.lokaleSamodzielne.values()) {
		if (obj.JRdlaLokalu) {
			if (obj.JRdlaLokalu._attributes.href === id) {
				ret += '<span class="cursor-pointer" id="' + htmlIDs.iLokalSamodzielny + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
				if (obj.idLokalu) {
					ret += obj.idLokalu.split(".").pop();
				} else {
					ret += '<span class="error-inline">Brak identyfikatora lokalu</span>';
				}
				ret += "</span";
				ret += "</div>";
				return ret;
			}
		}
	}
	ret += '<span class="error-inline">Brak lokalu</span></div>';
	return ret;
}

export function pokazJRL(id: string) {
	const obj = egbFeatures.jednostkiRejestroweLokali.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getGrupaRejestrowa(obj);
			html += getNieruchomoscWspolna(obj);
			html += getJRGZwiazanaZJRL(obj);
			html += getJRLLokal(obj._attributes.id);
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
