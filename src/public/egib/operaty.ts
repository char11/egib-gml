import { idIIPtoText } from "./common-functions";
import { egbFeatures } from "./features";

export function getOperatTechniczny(id: string) {
	let ret = '<div class="padded bottom-dashed-line">';
	const obj = egbFeatures.operatyTechniczne.get(id);
	if (obj) {
		ret += '<div><span class="item">Utw. obiektu: </span>';
		if (obj.startObiekt) {
			ret += new Date(obj.startObiekt).toLocaleString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty utworzenia obiektu</span>';
		}
		if (obj.koniecObiekt) {
			ret += '<span class="item">&nbspKoniec obiektu: </span>' + new Date(obj.koniecObiekt).toLocaleString("pl-PL");
		}
		ret += "</div>";
		ret += '<div><span class="item">Data sporządzenia: </span>';
		if (obj.dataSporzadzenia) {
			ret += new Date(obj.dataSporzadzenia).toLocaleDateString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty sporządzenia</span>';
		}
		ret += '<span class="item">&nbspData przyjęcia do PZGIK: </span>';
		if (obj.dataPrzyjeciaDoPZGIK) {
			ret += new Date(obj.dataPrzyjeciaDoPZGIK).toLocaleDateString("pl-PL");
		} else {
			ret += '<span class="error-inline">Brak daty przyjęcia do PZGIK</span>';
		}
		ret += "</div>";
		ret += '<div><span class="item">Identyfikator operatu wg PZGIK: </span>';
		if (obj.identyfikatorOperatuWgPZGIK == null) {
			ret += '<span class="error-inline">Brak id operatu wg PZGIK</span>';
		} else {
			ret += obj.identyfikatorOperatuWgPZGIK;
		}
		ret += "</div>";
		if (obj.nazwaTworcy) {
			ret += '<div><span class="item">Nazwa twórcy: </span>' + obj.nazwaTworcy + "</div>";
		}
		if (obj.opisOperatu) {
			ret += '<div><span class="item">Opis operatu: </span>' + obj.opisOperatu + "</div>";
		}
		ret += '<div><span class="item">Zasob sieciowy: </span>';
		if (obj.zasobSieciowy == null) {
			ret += '<span class="error-inline">Brak zasobu sieciowego</span>';
		} else if (obj.zasobSieciowy) {
			ret += obj.zasobSieciowy.linkage.URL ? obj.zasobSieciowy.linkage.URL : "";
		}
		ret += "</div>";
		ret += '<div><span class="item">IIP: </span>';
		if (obj.idIIP) {
			ret += idIIPtoText(obj.idIIP);
		} else {
			ret += '<span class="error-inline">Brak IIP</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak operatu o podanym gml id</div>';
	}
	ret += "</div>";
	return ret;
}

export function pokazOperat(id: string) {
	const wrapper = document.getElementById("main-wrapper");
	if (wrapper) {
		let html = '<div class="div-title"><span class="item">Operat techniczny: </span></div>';
		html += getOperatTechniczny(id);

		const div = document.createElement("div");
		div.innerHTML = html;
		wrapper.appendChild(div);
	}
}
