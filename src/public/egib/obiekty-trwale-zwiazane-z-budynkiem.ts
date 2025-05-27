import { showOnMapButton } from "../ui/ui";
import { getIdBudynku, getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export const EGB_RodzajObiektu: { [key: string]: string } = {
	t: "taras",
	w: "weranda/ganek",
	i: "wiatrołap",
	s: "schody",
	r: "rampa",
	o: "podpora",
	j: "wjazd do podziemia",
	d: "podjazd dla osób niepełnosprawnych",
};

function getRodzaj(obj: EGB_ObiektTrwaleZwiazanyZBudynkiemType) {
	let ret = "<div>";

	if (obj.rodzajObiektuZwiazanegoZBudynkiem) {
		ret += '<div><span class="item">Rodzaj obiektu: </span>';
		const rodzajObiektuZwiazanegoZBudynkiem = EGB_RodzajObiektu[obj.rodzajObiektuZwiazanegoZBudynkiem];
		if (rodzajObiektuZwiazanegoZBudynkiem) {
			ret += rodzajObiektuZwiazanegoZBudynkiem;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
		ret += "</div>";
	} else {
		ret += '<span class="error-inline">Brak rodzaju obiektu trwale związanego z budynkiem</span>';
	}
	ret += "</div>";
	return ret;
}

function getBudynek(obj: EGB_ObiektTrwaleZwiazanyZBudynkiemType) {
	let ret = "<div>";

	ret += '<div><span class="item">Budynek: </span>';
	if (obj.budynekZElementamiZwiazanymi == null) {
		ret += '<span class="error-inline">Brak budynku</span>';
	} else if (obj.budynekZElementamiZwiazanymi) {
		ret += getIdBudynku(obj.budynekZElementamiZwiazanymi._attributes.href);
	}
	ret += "</div>";
	return ret;
}

export function pokazObiektZwiazanyZBudynkiem(id: string) {
	const obj = egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Obiekt trwale związany z budynkiem: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzaj(obj);
			html += getBudynek(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
