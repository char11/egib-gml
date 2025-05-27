import { showOnMapButton } from "../ui/ui";
import { getOgolnyObiekt } from "./common-functions";
import { egbFeatures } from "./features";

export const EGB_KodStabilizacji: { [key: string]: string } = {
	"1": "brak informacji",
	"2": "niestabilizowany",
	"3": "znak naziemny",
	"4": "znak naziemny i podziemny",
	"5": "znak podziemny",
	"6": "szczegół terenowy",
};

export const EGB_SpelnienieWarunkowDokladnosciowych: { [key: string]: string } = {
	"1": "spełnia",
	"2": "nie spełnia",
};

export const EGB_SposobPozyskania: { [key: string]: string } = {
	"1": "ustalony",
	"2": "nieustalony",
};

function getIdPunktu(obj: EGB_PunktGranicznyType) {
	let ret = '<div class="div-title">';

	// id punktu
	ret += '<span class="item">Identyfikator punktu granicznego: </span>';
	if (obj.idPunktu) {
		ret += '<span class="bold">' + obj.idPunktu + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora</span>';
	}
	ret += "</div>";
	return ret;
}

function getPozyskanieDokladnoscStabilizacje(obj: EGB_PunktGranicznyType) {
	let ret = "<div>";

	// sposób pozyskania
	if (obj.sposobPozyskania) {
		ret += '<div><span class="item">Sposób pozyskania: </span>';
		const sposobPozyskania = EGB_SposobPozyskania[obj.sposobPozyskania];
		if (sposobPozyskania) {
			ret += sposobPozyskania;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
		ret += "</div>";
	}
	// spełnienie warunków dokładnościowych
	ret += '<div><span class="item">Spełnienie warunków dokładnościowych: </span>';
	if (obj.spelnienieWarunkowDokl) {
		const spelnienieWarunkowDokl = EGB_SpelnienieWarunkowDokladnosciowych[obj.spelnienieWarunkowDokl];
		if (spelnienieWarunkowDokl) {
			ret += spelnienieWarunkowDokl;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak spełnienia warunków dokładnościowych</span>';
	}
	ret += "</div>";
	// rodzaj stabilizacji
	ret += '<div><span class="item">Rodzaj stabilizacji: </span>';
	if (obj.rodzajStabilizacji) {
		const rodzajStabilizacji = EGB_KodStabilizacji[obj.rodzajStabilizacji];
		if (rodzajStabilizacji) {
			ret += rodzajStabilizacji;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju stabilizacji</span>';
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getOznaczenieOperat(obj: EGB_PunktGranicznyType) {
	let ret = "<div>";

	// oznaczenie w materiale źródłowym
	if (obj.oznWMaterialeZrodlowym) {
		ret += '<div><span class="item">Oznaczenie w materiale źródłowym: </span>';
		ret += obj.oznWMaterialeZrodlowym;
		ret += "</div>";
	}
	// nr operatu technicznego
	if (obj.numerOperatuTechnicznego) {
		ret += '<div><span class="item">Nr operatu technicznego: </span>';
		ret += obj.numerOperatuTechnicznego;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getInformacje(obj: EGB_PunktGranicznyType) {
	let ret = "<div>";

	// dodatkowe informacje
	if (obj.dodatkoweInformacje) {
		ret += '<div><span class="item">Dodatkowe informacje: </span>';
		ret += obj.dodatkoweInformacje;
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

export function pokazPunkt(id: string) {
	const obj = egbFeatures.punktyGraniczne.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdPunktu(obj);
			html += '<div class="grid-container">';
			//html += getStartKoniecObiektu(obj);
			//html += getDokumentyOperaty(obj);
			html += getOgolnyObiekt(obj);
			html += getPozyskanieDokladnoscStabilizacje(obj);
			html += getOznaczenieOperat(obj);
			html += getInformacje(obj);

			const div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
