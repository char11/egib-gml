import { showOnMapButton } from "../ui/ui";
import { getIdBudynku, getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export const EGB_RodzajBloku: { [key: string]: string } = {
	n: "kondygnacje nadziemne",
	p: "kondygnacje podziemne",
	l: "łącznik",
	a: "nawis",
	z: "przejazd przez budynek",
	y: "inny",
};

function getRodzajOznaczenie(obj: EGB_BlokBudynkuType) {
	let ret = "<div>";

	// rodzaj bloku
	if (obj.rodzajBloku) {
		ret += '<div><span class="item">Rodzaj bloku: </span>';
		const rodzajBloku = EGB_RodzajBloku[obj.rodzajBloku];
		if (rodzajBloku) {
			ret += rodzajBloku;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
		ret += "</div>";
	} else {
		ret += '<span class="error-inline">Brak rodzaju bloku</span>';
	}
	// oznaczenie bloku
	if (obj.oznaczenieBloku) {
		ret += '<div><span class="item">Oznaczenie bloku: </span>';
		ret += obj.oznaczenieBloku;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getKondygnacje(obj: EGB_BlokBudynkuType) {
	let ret = "<div>";

	if (obj.numerNajwyzszejKondygnacji) {
		ret += '<div><span class="item">Nr najwyższej kondygnacji: </span>';
		ret += obj.numerNajwyzszejKondygnacji;
		ret += "</div>";
	}
	if (obj.numerNajnizszejKondygnacji) {
		ret += '<div><span class="item">Nr najniższej kondygnacji: </span>';
		ret += obj.numerNajnizszejKondygnacji;
		ret += "</div>";
	}

	ret += "</div>";
	return ret;
}

function getBudynek(obj: EGB_BlokBudynkuType) {
	let ret = "<div>";

	// budynek z blokiem
	ret += '<div><span class="item">Budynek: </span>';
	if (obj.budynekZBlokiemBud == null) {
		ret += '<span class="error-inline">Brak budynku</span>';
	} else if (obj.budynekZBlokiemBud) {
		ret += getIdBudynku(obj.budynekZBlokiemBud._attributes.href);
	}
	ret += "</div>";
	return ret;
}

export function pokazBlokBudynku(id: string) {
	const obj = egbFeatures.blokiBudynku.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Blok budynku: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzajOznaczenie(obj);
			html += getKondygnacje(obj);
			html += getBudynek(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
