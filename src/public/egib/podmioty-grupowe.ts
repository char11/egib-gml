import { getAdresSiedziby, getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { getInstytucjaSkr } from "./instytucje";
import { EGB_StatusPodmiotuEwid } from "./udzialy";
import { getMalzenstwoSkr } from "./malzenstwa";
import { getOsobaSkr } from "./osoby-fizyczne";

export function getPodmiotGrupowySkr(id: string) {
	let ret = "";
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		if (obj.nazwaPelna) {
			ret += obj.nazwaPelna;
		} else {
			ret += getStatus(obj);
		}
	} else {
		ret += '<span class="error-inline">Brak instytucji o podanym gml id</span>';
	}
	return ret;
}

function getStatus(obj: EGB_PodmiotGrupowyType) {
	let ret = "";
	if (obj.status) {
		if (obj.status === "32" || obj.status === "33") {
			ret += EGB_StatusPodmiotuEwid[obj.status];
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak statusu</span>';
	}
	return ret;
}

function getNazwyRegonStatus(obj: EGB_PodmiotGrupowyType) {
	let ret = "<div>";
	if (obj.nazwaPelna) {
		ret += '<div><span class="item">Nazwa pełna: </span>';
		ret += obj.nazwaPelna;
		ret += "</div>";
	}
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
	ret += getStatus(obj);
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getSklad(obj: EGB_PodmiotGrupowyType) {
	let ret = "<div>";
	ret += '<div class="item">Skład podmiotu grupowego:</div><div class="div-scroll">';
	if (obj.instytucja) {
		ret += '<div class="item">Instytucje:</div><div class="div-scroll">';
		if (Array.isArray(obj.instytucja)) {
			ret += "<div>";
			obj.instytucja.forEach((key) => {
				if (key) {
					ret +=
						'<div class="cursor-pointer" id="' +
						htmlIDs.iInstytucja +
						key._attributes.href +
						'" onclick="showEgbFeature(this.id)">' +
						getInstytucjaSkr(key._attributes.href) +
						"</div>";
				}
			});
			ret += "</div>";
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iInstytucja +
				obj.instytucja._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getInstytucjaSkr(obj.instytucja._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}
	if (obj.osobaFizyczna4) {
		ret += '<div class="item">Osoby fizyczne:</div><div class="div-scroll">';
		if (Array.isArray(obj.osobaFizyczna4)) {
			ret += "<div>";
			obj.osobaFizyczna4.forEach((key) => {
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
				obj.osobaFizyczna4._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getOsobaSkr(obj.osobaFizyczna4._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}
	if (obj.malzenstwo3) {
		ret += '<div class="item">Małżeństwa:</div><div class="div-scroll">';
		if (Array.isArray(obj.malzenstwo3)) {
			ret += "<div>";
			obj.malzenstwo3.forEach((key) => {
				if (key) {
					ret +=
						'<div class="cursor-pointer" id="' +
						htmlIDs.iMalzenstwo +
						key._attributes.href +
						'" onclick="showEgbFeature(this.id)">' +
						getMalzenstwoSkr(key._attributes.href) +
						"</div>";
				}
			});
			ret += "</div>";
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iMalzenstwo +
				obj.malzenstwo3._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getMalzenstwoSkr(obj.malzenstwo3._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

export function pokazPodmiotGrupowy(id: string) {
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Podmiot grupowy: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNazwyRegonStatus(obj);
			html += getSklad(obj);
			html += getAdresSiedziby(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
