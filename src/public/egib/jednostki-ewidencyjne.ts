import { showOnMapButton } from "../ui/ui";
import { getIdPunktuGranicznego, getNazwe, getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

function getIdJedonstki(obj: EGB_JednostkaEwidencyjnaType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator jednostki ewidencyjnej: </span>';
	if (obj.idJednostkiEwid) {
		ret += '<span class="bold">' + obj.idJednostkiEwid + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora</span>';
	}
	ret += "</div>";
	return ret;
}

function getPunktyGraniczne(obj: EGB_JednostkaEwidencyjnaType) {
	let ret = '<div><div class="item">Punkty graniczne:</div><div class="div-scroll">';

	// punkty graniczne
	if (obj.punktGranicyJednEwid == null) {
		ret += '<div class="error-inline">Brak punktów granicznych</div>';
	} else if (obj.punktGranicyJednEwid.length < 3) {
		ret += '<div class="error-inline">Za mała liczba punktów granicznych</div>';
	} else {
		obj.punktGranicyJednEwid.forEach((key) => {
			if (key) {
				ret += getIdPunktuGranicznego(key._attributes.href);
			}
		});
	}
	ret += "</div></div>";
	return ret;
}

export function pokazJednostkeEwidencyjna(id: string) {
	const obj = egbFeatures.jednostkiEwidencyjne.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdJedonstki(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNazwe(obj);
			html += getPunktyGraniczne(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
