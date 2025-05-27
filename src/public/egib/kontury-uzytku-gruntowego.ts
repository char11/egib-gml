import { showOnMapButton } from "../ui/ui";
import { getOgolnyObiekt } from "./common-functions";
import { getOE } from "./dzialki-ewidencyjne";
import { egbFeatures } from "./features";
import { getJE } from "./obreby-ewidencyjne";

export const EGB_OFU: { [key: string]: string } = {
	R: "grunt orny",
	S: "sad",
	Ł: "łąka trwała",
	Ps: "pastwisko trwałe",
	Br: "grunt rolny zabudowany",
	Wsr: "grunt pod stawem",
	W: "grunt pod rowem",
	Lzr: "grunt rolny zadrzewiony i zakrzewiony",
	Ls: "las",
	Lz: "grunt zadrzewiony i zakrzewiony",
	B: "teren mieszkaniowy",
	Ba: "teren przemysłowy",
	Bi: "inny teren zabudowany",
	Bp: "zurbanizowany teren nie zabudowany lub w trakcie zabudowy",
	Bz: "teren rekreacyjno-wypoczynkowy",
	K: "użytek kopalny",
	dr: "droga",
	Tk: "teren kolejowy",
	Ti: "inny teren komunikacyjny",
	Tp: "grunt przeznaczony pod budowę drog publ. lub linii kolej.",
	N: "nieużytek",
	Wp: "grunt pod wodami powierzchniowymi płynącymi",
	Ws: "grunt pod wodami powierzchniowymi stojącymi",
	Wm: "grunt pod morskimi wodami wewnętrznymi",
	Tr: "teren różny",
};

export const EGB_OZU: { [key: string]: string } = {
	R: "grunt orny",
	Ł: "łąka trwała",
	Ps: "pastwisko trwałe",
	Ls: "las",
	Lz: "grunt zadrzewiony i zakrzewiony",
	N: "nieużytek",
};

export const EGB_OZK: { [key: string]: string } = {
	I: "I",
	II: "II",
	III: "III",
	IIIa: "IIIa",
	IIIb: "IIIb",
	IV: "IV",
	IVa: "IVa",
	IVb: "IVb",
	V: "V",
	VI: "VI",
	VIz: "VIz",
};

function getLokalizacja(obj: EGB_KonturUzytkuGruntowegoType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator konturu użytku gruntowego: </span>';
	if (obj.idUzytku) {
		ret += '<span class="bold">' + obj.idUzytku + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora użytku</span>';
	}

	if (obj.lokalizacjaUzytku == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji użytku</span>';
	} else if (obj.lokalizacjaUzytku) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaUzytku._attributes.href);
		if (objObr) {
			ret += getJE(objObr);
			ret += getOE(objObr);
			// nr
			if (obj.idUzytku) {
				ret += '</span><span class="span-title item">Nr użytku: </span><span>' + obj.idUzytku.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getUzytek(obj: EGB_KonturUzytkuGruntowegoType) {
	let ret = "<div>";
	ret += '<div><span class="item">OFU: </span>';
	if (obj.OFU) {
		const oFU = EGB_OFU[obj.OFU];
		if (oFU) {
			ret += oFU;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak OFU</span>';
	}
	ret += "</div>";

	ret += "</div>";
	return ret;
}

export function pokazKonturUzytkugruntowego(id: string) {
	const obj = egbFeatures.konturyUzytkuGruntowego.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getUzytek(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
