import { getAdresNieruchomosci, getArea, getDokWlasnosciKW, getIdBudynku, getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { EGB_RodzajPomieszczenia } from "./pomieszczenia-przynalezne-do-lokalu";

export const EGB_RodzajLokalu: { [key: string]: string } = { "1": "mieszkalny", "2": "niemieszkalny" };

function getIdLokalu(obj: EGB_LokalSamodzielnyType) {
	let ret = '<div class="div-title">';

	ret += '<span class="item">Identyfikator lokalu: </span>';
	if (obj.idLokalu) {
		ret += '<span class="bold">' + obj.idLokalu + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora</span>';
	}
	ret += "</div>";
	return ret;
}

function getNumerRodzajKondygnacje(obj: EGB_LokalSamodzielnyType) {
	let ret = "<div>";

	if (obj.numerPorzadkowyLokalu) {
		ret += '<div><span class="item">Nr porządkowy lokalu: </span>';
		ret += obj.numerPorzadkowyLokalu;
		ret += "</div>";
	}
	ret += '<div><span class="item">Rodzaj lokalu: </span>';
	if (obj.rodzajLokalu) {
		const rodzajLokalu = EGB_RodzajLokalu[obj.rodzajLokalu];
		if (rodzajLokalu) {
			ret += rodzajLokalu;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju</span>';
	}
	ret += "</div>";

	if (obj.nrKondygnacji) {
		ret += '<div><span class="item">Nr kondygnacji: </span>';
		ret += obj.nrKondygnacji;
		ret += "</div>";
	}

	ret += "</div>";
	return ret;
}

function getPomPrzynalezne(id: string) {
	let ret = "";
	const obj = egbFeatures.pomieszczeniaPrzynalezneDoLokalu.get(id);
	if (obj) {
		if (obj.rodzajPomieszczeniaPrzynaleznego) {
			ret += '<div class="cursor-pointer" id="' + htmlIDs.iPomieszczeniePrzynalezneDoLokalu + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
			const rodzajPom = EGB_RodzajPomieszczenia[obj.rodzajPomieszczeniaPrzynaleznego];
			if (rodzajPom) {
				ret += rodzajPom;
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
		} else {
			ret += '<div class="error">Brak rodzaju pomieszczenia</div>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak pomieszczenia o podanym gml id</div>';
	}
	return ret;
}

function getPowierzchniePomieszczeniaPrzynalezne(obj: EGB_LokalSamodzielnyType) {
	let ret = "<div>";

	// powierzchnia użytkowa
	ret += '<div><span class="item">Powierzchnia użytkowa: </span>';
	if (obj.powUzytkowaLokalu) {
		ret += getArea(obj.powUzytkowaLokalu);
	} else {
		ret += '<span class="error-inline">Brak powierzchni użytkowej</span>';
	}
	ret += "</div>";
	// liczba pomieszczeń przynależnych
	if (obj.liczbaPomieszczenPrzynaleznych) {
		ret += '<div><span class="item">Liczba pom. przynależnych: </span>';
		ret += obj.liczbaPomieszczenPrzynaleznych;
		ret += "</div>";
	}
	// powierzchnia pomieszczeń przynależnych
	if (obj.powPomieszczenPrzynaleznychDoLokalu) {
		ret += '<div><span class="item">Powierzchnia pom. przynależnych do lokalu: </span>';
		ret += getArea(obj.powPomieszczenPrzynaleznychDoLokalu);
		ret += "</div>";
	}
	// pomieszczenia przynależne
	if (obj.pomPrzynalezne) {
		ret += '<div class="item">Pom. przynależne do lokalu:</div><div class="div-scroll">';
		if (Array.isArray(obj.pomPrzynalezne)) {
			ret += "<div>";
			obj.pomPrzynalezne.forEach((key) => {
				if (key) {
					ret += getPomPrzynalezne(key._attributes.href);
				}
			});
			ret += "</div>";
		} else ret += getPomPrzynalezne(obj.pomPrzynalezne._attributes.href);
		ret += "</div>";
	}

	ret += "</div>";
	return ret;
}

function getBudynekAdresInformacje(obj: EGB_LokalSamodzielnyType) {
	let ret = "<div>";

	ret += '<div><span class="item">Budynek z wyodrębnionym lokalem: </span>';
	if (obj.budynekZWyodrebnionymLokalem == null) {
		ret += '<span class="error-inline">Brak budynku</span>';
	} else if (obj.budynekZWyodrebnionymLokalem) {
		ret += getIdBudynku(obj.budynekZWyodrebnionymLokalem._attributes.href);
	}
	ret += "</div>";

	if (obj.adresLokalu) {
		ret += '<div class="item">Adres lokalu:</div><div>';
		ret += getAdresNieruchomosci(obj.adresLokalu);
		ret += "</div>";
	}

	if (obj.dodatkoweInformacje) {
		ret += '<div class="item">Dodatkowe informacje:</div><div>' + obj.dodatkoweInformacje + "</div>";
	}

	ret += "</div>";
	return ret;
}

function getJRL(obj: EGB_LokalSamodzielnyType) {
	let ret = "";
	if (obj.JRdlaLokalu) {
		ret = '<div><span class="item">Jednostka rejestrowa lokali: </span>';
		const objJl = egbFeatures.jednostkiRejestroweLokali.get(obj.JRdlaLokalu._attributes.href);
		if (objJl) {
			ret += '<span class="bold cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaLokali + objJl._attributes.id + '" onclick="showEgbFeature(this.id)">';
			if (objJl.idJednostkiRejestrowej) {
				ret += objJl.idJednostkiRejestrowej.split(".").pop();
			} else {
				ret += '<span class="error-inline">Brak identyfikatora JRL/span>';
			}
			ret += "</span>";
		} else {
			ret += '<span class="error-inline">Brak JRL o podanym gml id</span>';
		}
		ret += "</div>";
	}
	return ret;
}

export function pokazLokal(id: string) {
	const obj = egbFeatures.lokaleSamodzielne.get(id);
	if (obj) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdLokalu(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getNumerRodzajKondygnacje(obj);
			html += getPowierzchniePomieszczeniaPrzynalezne(obj);
			html += getDokWlasnosciKW(obj);
			html += getBudynekAdresInformacje(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			html = getJRL(obj);
			//html += "<br>";

			div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);
		}
	}
}
