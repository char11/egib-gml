import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { EGB_StatusPodmiotuEwid } from "./udzialy";
import { getOsobaSkr } from "./osoby-fizyczne";

export function getMalzenstwoSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		if (obj.osobaFizyczna2 == null) {
			ret += '<span class="error-inline">Brak osoby</span>';
		} else if (obj.osobaFizyczna2) {
			ret += getOsobaSkr(obj.osobaFizyczna2._attributes.href);
		}
		ret += ", ";
		if (obj.osobaFizyczna3 == null) {
			ret += '<span class="error-inline">Brak osoby</span>';
		} else if (obj.osobaFizyczna3) {
			ret += getOsobaSkr(obj.osobaFizyczna3._attributes.href);
		}
	} else {
		ret += '<span class="error-inline">Brak małżeństwa o podanym gml id</span>';
	}
	return ret;
}

function getOsoby(obj: EGB_MalzenstwoType) {
	let ret = "<div>";
	ret += '<div><span class="item">Osoba płci żeńskiej: </span>';
	if (obj.osobaFizyczna2 == null) {
		ret += '<span class="error-inline">Brak osoby</span>';
	} else if (obj.osobaFizyczna2) {
		ret +=
			'<span class="cursor-pointer" id="' +
			htmlIDs.iOsobaFizyczna +
			obj.osobaFizyczna2._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getOsobaSkr(obj.osobaFizyczna2._attributes.href) +
			"</span>";
	}
	ret += "</div>";
	ret += '<div><span class="item">Osoba płci męskiej: </span>';
	if (obj.osobaFizyczna3 == null) {
		ret += '<span class="error-inline">Brak osoby</span>';
	} else if (obj.osobaFizyczna3) {
		ret +=
			'<span class="cursor-pointer" id="' +
			htmlIDs.iOsobaFizyczna +
			obj.osobaFizyczna3._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getOsobaSkr(obj.osobaFizyczna3._attributes.href) +
			"</span>";
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getStatus(obj: EGB_MalzenstwoType) {
	let ret = '<div> <span class="item">Status: </span>';
	if (obj.status) {
		if (obj.status === "34" || obj.status === "35") {
			ret += EGB_StatusPodmiotuEwid[obj.status];
		} else {
			ret += '<div class="error-inline">Nieprawidłowa wartość</div>';
		}
	} else {
		ret += '<span class="error-inline">Brak statusu</span>';
	}
	ret += "</div>";

	ret += "</div>";
	return ret;
}

export function pokazMalzenstwo(id: string) {
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Małżeństwo: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getOsoby(obj);
			html += getStatus(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
