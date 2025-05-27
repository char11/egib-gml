import { showOnMapButton } from "../ui/ui";
import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export function getAdresNieruchomosciSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.adresyNieruchomosci.get(id);
	if (obj) {
		if (obj.nazwaMiejscowosci == null) {
			ret += '<span class="error-inline">Brak nazwy </span>';
		} else {
			ret += obj.nazwaMiejscowosci + " ";
		}
		if (obj.nazwaUlicy) {
			ret += obj.nazwaUlicy + " ";
		}
		if (obj.numerPorzadkowy) {
			ret += obj.numerPorzadkowy;
		}
		if (obj.numerLokalu) {
			ret += "/" + obj.numerLokalu;
		}
	} else {
		ret += '<div class="error-inline">Brak adresu nieruchomości o podanym gml id</div>>';
	}
	return ret;
}

function getAdres(obj: EGB_AdresNieruchomosciType) {
	let ret = "<div>";
	ret += '<div><span class="item">Nazwa miejscowości: </span>';
	if (obj.nazwaMiejscowosci == null) {
		ret += '<span class="error-inline">Brak nazwy</span>';
	} else {
		ret += obj.nazwaMiejscowosci;
	}
	ret += "</div>";
	if (obj.idMiejscowosci) {
		ret += '<div><span class="item">Id miejscowości: </span>';
		ret += obj.idMiejscowosci;
		ret += "</div>";
	}
	if (obj.nazwaUlicy) {
		ret += '<div><span class="item">Nazwa ulicy: </span>';
		ret += obj.nazwaUlicy;
		ret += "</div>";
	}
	if (obj.idNazwyUlicy) {
		ret += '<div><span class="item">Id ulicy: </span>';
		ret += obj.idNazwyUlicy;
		ret += "</div>";
	}
	if (obj.numerPorzadkowy) {
		ret += '<div><span class="item">Nr porządkowy: </span>';
		ret += obj.numerPorzadkowy;
		ret += "</div>";
	}
	if (obj.numerLokalu) {
		ret += '<div><span class="item">Nr lokalu: </span>';
		ret += obj.numerLokalu;
		ret += "</div>";
	}

	//geometria

	ret += "</div>";
	return ret;
}

export function pokazAdresNieruchomosci(id: string) {
	const obj = egbFeatures.adresyNieruchomosci.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Adres nieruchomości: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getAdres(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
