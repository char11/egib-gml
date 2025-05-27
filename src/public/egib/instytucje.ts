import { getAdresSiedziby, getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { EGB_StatusPodmiotuEwid } from "./udzialy";
import { getOsobaSkr } from "./osoby-fizyczne";

export function getInstytucjaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		if (obj.nazwaPelna == null) {
			ret += '<span class="error-inline">Brak nazwy</span>';
		} else {
			ret += obj.nazwaPelna;
		}
	} else {
		ret += '<span class="error-inline">Brak instytucji o podanym gml id</span>';
	}
	return ret;
}

function getNazwyRegonStatus(obj: EGB_InstytucjaType) {
	let ret = "<div>";
	ret += '<div><span class="item">Nazwa pełna: </span>';
	if (obj.nazwaPelna == null) {
		ret += '<span class="error-inline">Brak nazwy</span>';
	} else {
		ret += obj.nazwaPelna;
	}
	ret += "</div>";
	if (obj.nazwaSkrocona) {
		ret += '<div><span class="item">Nazwa skrócona: </span>';
		ret += obj.nazwaSkrocona;
		ret += "</div>";
	}
	if (obj.regon) {
		ret += '<div><span class="item">Regon: </span>';
		ret += obj.regon;
		ret += "</div>";
	}
	ret += '<div><span class="item">Status: </span>';
	if (obj.status) {
		if (Number(obj.status) >= 3 && Number(obj.status) <= 47 && obj.status !== "32" && obj.status !== "33" && obj.status !== "34" && obj.status !== "35") {
			ret += EGB_StatusPodmiotuEwid[obj.status];
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak statusu</span>';
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getZarzad(obj: EGB_InstytucjaType) {
	let ret = "<div>";
	if (obj.czlonekZarzaduWspolnoty) {
		ret += '<div class="item">Członkowie zarządu wspólnoty:</div><div class="div-scroll">';
		if (Array.isArray(obj.czlonekZarzaduWspolnoty)) {
			ret += "<div>";
			obj.czlonekZarzaduWspolnoty.forEach((key) => {
				if (key) {
					ret +=
						'<div class="cursor-pointer" id="' +
						htmlIDs.iOsobaFizyczna +
						key._attributes.href +
						'" onclick="showEgbFeature(this.id)">' +
						getOsobaSkr(key._attributes.href) +
						"</div>";
				}
			});
			ret += "</div>";
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iOsobaFizyczna +
				obj.czlonekZarzaduWspolnoty._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getOsobaSkr(obj.czlonekZarzaduWspolnoty._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

export function pokazInstytucje(id: string) {
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Instytucja: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNazwyRegonStatus(obj);
			if (obj.status === "41") {
				html += getZarzad(obj);
			}
			html += getAdresSiedziby(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
