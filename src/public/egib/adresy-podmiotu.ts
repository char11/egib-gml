import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export function getAdresPodmiotuSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.adresyPodmiotu.get(id);
	if (obj) {
		// kraj
		if (obj.kraj == null) {
			ret += '<span class="error-inline">Brak kraju </span>';
		} else {
			ret += obj.kraj + " ";
		}
		// kod pocztowy
		if (obj.kodPocztowy) {
			ret += obj.kodPocztowy + " ";
		}
		// miejscowość
		if (obj.miejscowosc == null) {
			ret += '<span class="error-inline">Brak miejscowości </span>';
		} else {
			ret += obj.miejscowosc + " ";
		}
		// ulica
		if (obj.ulica) {
			ret += obj.ulica + " ";
		}
		// nr budynku
		if (obj.numerPorzadkowy) {
			ret += obj.numerPorzadkowy;
		}
		// nr lokalu
		if (obj.numerLokalu) {
			ret += "/" + obj.numerLokalu;
		}
	} else {
		ret += '<span class="error-inline">Brak adresu zameldowanie o podanym gml id</span>';
	}
	return ret;
}

function getAdres(obj: EGB_AdresPodmiotuType) {
	let ret = "<div>";
	ret += '<div><span class="item">Kraj: </span>';
	if (obj.kraj == null) {
		ret += '<span class="error-inline">Brak kraju</span>';
	} else {
		ret += obj.kraj;
	}
	ret += "</div>";
	ret += '<div><span class="item">Miejscowość: </span>';
	if (obj.miejscowosc == null) {
		ret += '<span class="error-inline"> Brak miejscowości</span>';
	} else {
		ret += obj.miejscowosc;
	}
	ret += "</div>";
	if (obj.kodPocztowy) {
		ret += '<div><span class="item">Kod pocztowy: </span>';
		ret += " " + obj.kodPocztowy;
		ret += "</div>";
	}
	if (obj.ulica) {
		ret += '<div><span class="item">Ulica: </span>';
		ret += " " + obj.ulica;
		ret += "</div>";
	}
	ret += '<div><span class="item">Nr porządkowy: </span>';
	if (obj.numerPorzadkowy) {
		ret += " " + obj.numerPorzadkowy;
	} else {
		ret += '<span class="error-inline">Brak numeru porządkowego</span>';
	}
	ret += "</div>";
	if (obj.numerLokalu) {
		ret += '<div><span class="item">Nr lokalu: </span>';
		ret += obj.numerLokalu;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

export function pokazAdresPodmiotu(id: string) {
	const obj = egbFeatures.adresyPodmiotu.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Adres zameldowania: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getAdres(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
