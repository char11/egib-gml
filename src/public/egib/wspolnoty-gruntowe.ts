import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { getInstytucjaSkr } from "./instytucje";
import { EGB_StatusPodmiotuEwid } from "./udzialy";
import { getMalzenstwoSkr } from "./malzenstwa";
import { getOsobaSkr } from "./osoby-fizyczne";

export function getWspolnotaGruntowaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		if (obj.nazwa) {
			ret += obj.nazwa;
		} else {
			ret += getStatus(obj);
		}
	} else {
		ret += '<span class="error-inline">Brak instytucji o podanym gml id</span>';
	}
	return ret;
}

function getStatus(obj: EGB_WspolnotaGruntowaType) {
	let ret = "";
	if (obj.status) {
		if (obj.status === "41") {
			ret += EGB_StatusPodmiotuEwid[obj.status];
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak statusu</span>';
	}
	return ret;
}

function getNazwyStatus(obj: EGB_WspolnotaGruntowaType) {
	let ret = "<div>";
	if (obj.nazwa) {
		ret += '<div><span class="item">Nazwa: </span>';
		ret += obj.nazwa;
		ret += "</div>";
	}
	ret += '<div><span class="item">Status: </span>';
	ret += getStatus(obj);
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getSpolka(obj: EGB_WspolnotaGruntowaType) {
	let ret = "<div>";
	if (obj.spolkaZarzadajaca) {
		ret += '<div><span class="item">Spólka zarządzająca: </span>';
		ret +=
			'<span class="cursor-pointer" id="' +
			htmlIDs.iInstytucja +
			obj.spolkaZarzadajaca._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getInstytucjaSkr(obj.spolkaZarzadajaca._attributes.href) +
			"</span>";
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getOsobyMalzenstwaInstytucje(obj: EGB_WspolnotaGruntowaType) {
	let ret = "<div>";

	if (obj.podmiotUprawniony) {
		ret += '<div class="item">Podmioty uprawnione:</div><div class="div-scroll">';
		if (Array.isArray(obj.podmiotUprawniony)) {
			obj.podmiotUprawniony.forEach((key) => {
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
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iInstytucja +
				obj.podmiotUprawniony._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getInstytucjaSkr(obj.podmiotUprawniony._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}

	if (obj.malzenstwoUprawnione) {
		ret += '<div class="item">Małżeństwa uprawnione:</div><div class="div-scroll">';
		if (Array.isArray(obj.malzenstwoUprawnione)) {
			obj.malzenstwoUprawnione.forEach((key) => {
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
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iMalzenstwo +
				obj.malzenstwoUprawnione._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getMalzenstwoSkr(obj.malzenstwoUprawnione._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}

	if (obj.osobaFizycznaUprawniona) {
		ret += '<div class="item">Osoby uprawnione:</div><div class="div-scroll">';
		if (Array.isArray(obj.osobaFizycznaUprawniona)) {
			obj.osobaFizycznaUprawniona.forEach((key) => {
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
		} else {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iOsobaFizyczna +
				obj.osobaFizycznaUprawniona._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getOsobaSkr(obj.osobaFizycznaUprawniona._attributes.href) +
				"</div>";
		}
		ret += "</div>";
	}

	ret += "</div>";
	return ret;
}

export function pokazWspolnoteGruntowa(id: string) {
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Wspólnota gruntowa: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNazwyStatus(obj);
			html += getSpolka(obj);
			html += getOsobyMalzenstwaInstytucje(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
