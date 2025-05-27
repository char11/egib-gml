import { getArea, getIdBudynku, getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export const EGB_RodzajPomieszczenia: { [key: string]: string } = {
	"1": "piwnica",
	"2": "garaż",
	"3": "miejsce postojowe w garażu",
	"4": "strych",
	"5": "komórka",
	"6": "inne",
};

function getRodzajPowierzchnia(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	let ret = "<div>";

	ret += '<div><span class="item">Rodzaj pomieszczenia: </span>';
	if (obj.rodzajPomieszczeniaPrzynaleznego) {
		const rodzajPomieszczeniaPrzynaleznego = EGB_RodzajPomieszczenia[obj.rodzajPomieszczeniaPrzynaleznego];
		if (rodzajPomieszczeniaPrzynaleznego) {
			ret += rodzajPomieszczeniaPrzynaleznego;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju pomieszczenia</span>';
	}
	ret += "</div>";

	ret += '<div><span class="item">Powierzchnia pomieszczenia: </span>';
	if (obj.powierzchniaPomieszczeniaPrzynaleznego) {
		ret += getArea(obj.powierzchniaPomieszczeniaPrzynaleznego);
	} else {
		ret += '<span class="error-inline">Brak powierzchni pomieszczenia</span>';
	}
	ret += "</div>";

	ret += "</div>";
	return ret;
}

function getBudynek(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	let ret = "<div>";

	if (obj.idBudynku) {
		ret += '<div><span class="item">Id budynku: </span>' + obj.idBudynku + "</div>";
	}

	if (obj.budynekZPomieszczeniemPrzynaleznym) {
		ret += '<div><span class="item">Budynek z pom. przynależnym: </span>';
		ret += getIdBudynku(obj.budynekZPomieszczeniemPrzynaleznym._attributes.href);
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getInformacje(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	let ret = "<div>";

	if (obj.dodatkoweInformacje) {
		ret += '<div class="item">Dodatkowe informacje:</div><div>' + obj.dodatkoweInformacje + "</div>";
	}

	ret += "</div>";
	return ret;
}

export function pokazPomieszczeniePrzynalezne(id: string) {
	const obj = egbFeatures.pomieszczeniaPrzynalezneDoLokalu.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = '<div class="div-title"><span class="item">Pomieszczenie przynależne do lokalu: </span></div>';
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzajPowierzchnia(obj);
			html += getBudynek(obj);
			html += getInformacje(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
