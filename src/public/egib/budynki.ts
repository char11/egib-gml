import { showOnMapButton } from "../ui/ui";
import { getAdresNieruchomosci, getArea, getDokWlasnosciKW, getOgolnyObiekt } from "./common-functions";
import { egbFeatures, htmlIDs } from "./features";
import { getWlasnosciWladania } from "./udzialy";
import { EGB_RodzajObiektu } from "./obiekty-trwale-zwiazane-z-budynkiem";

export const EGB_RodzajWgKST: { [key: string]: string } = {
	m: "mieszkalny",
	g: "produkcyjny, uslugowy i gospodarczy",
	t: "transportu i łączności",
	k: "oświaty, nauki i kultury oraz sportu",
	z: "szpitala i inne budynki opieki zdrowotnej",
	b: "biurowy",
	h: "handlowo-usługowy",
	p: "przemysłowy",
	s: "zbiornik, silos i budynek magazynowy",
	i: "budynek niemieszkalny",
};

function getIdBudynku(obj: EGB_BudynekType) {
	let ret = '<div class="div-title">';

	// id budynku
	ret += '<span class="item">Identyfikator budynku: </span>';
	if (obj.idBudynku) {
		ret += '<span class="bold">' + obj.idBudynku + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora</span>';
	}
	ret += "</div>";
	return ret;
}

function getRodzajKondygnacje(obj: EGB_BudynekType) {
	let ret = "<div>";

	// rodzaj
	ret += '<div><span class="item">Rodzaj wg KST: </span>';
	if (obj.rodzajWgKST) {
		const rodzajWgKST = EGB_RodzajWgKST[obj.rodzajWgKST];
		if (rodzajWgKST) {
			ret += rodzajWgKST;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju</span>';
	}
	ret += "</div>";

	// liczba kondygnacji nadziemnych
	ret += '<div><span class="item">Liczba kondygnacji nadziemnych: </span>';
	if (obj.liczbaKondygnacjiNadziemnych) {
		ret += obj.liczbaKondygnacjiNadziemnych;
	} else {
		ret += '<span class="error-inline">Brak liczby kondygnacji</span>';
	}
	ret += "</div>";

	// liczba kondygnacji podziemnych
	ret += '<div><span class="item">Liczba kondygnacji podziemnych: </span>';
	if (obj.liczbaKondygnacjiPodziemnych) {
		ret += obj.liczbaKondygnacjiPodziemnych;
	} else {
		ret += '<span class="error-inline">Brak liczby kondygnacji</span>';
	}
	ret += "</div>";

	ret += "</div>";
	return ret;
}

function getPowierzchnie(obj: EGB_BudynekType) {
	let ret = "<div>";

	// powierzchnia zabudowy
	ret += '<div><span class="item">Powierzchnia zabudowy: </span>';
	if (obj.powZabudowy) {
		ret += getArea(obj.powZabudowy);
	} else {
		ret += '<span class="error-inline">Brak powierzchni zabudowy</span>';
	}
	ret += "</div>";
	// łączna powierzchnia użytkowa lokali wyodrębnionych
	if (obj.lacznaPowUzytkowaLokaliWyodrebnionych) {
		ret += '<div><span class="item">Łączna pow. użyt. lokali wyodrębnionych: </span>';
		ret += getArea(obj.lacznaPowUzytkowaLokaliWyodrebnionych);
		ret += "</div>";
	}
	// łączna powierzchnia użytkowa lokali niewyodrębnionych
	if (obj.lacznaPowUzytkowaLokaliNiewyodrebnionych) {
		ret += '<div><span class="item">Łączna pow. użyt. lokali niewyodrębnionych: </span>';
		ret += getArea(obj.lacznaPowUzytkowaLokaliNiewyodrebnionych);
		ret += "</div>";
	}
	// łączna powierzchnia użytkowa pomieszczeń przynależnych
	if (obj.lacznaPowUzytkowaPomieszczenPrzynaleznych) {
		ret += '<div><span class="item">Łączna pow. użyt. pomieszczeń przynależnych: </span>';
		ret += getArea(obj.lacznaPowUzytkowaPomieszczenPrzynaleznych);
		ret += "</div>";
	}

	ret += "</div>";
	return ret;
}

function getIDDzialki(id: string) {
	let ret = "";
	const obj = egbFeatures.dzialkiEwidencyjne.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iDzialkaEwidencyjna + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idDzialki) {
			ret += obj.idDzialki.split(".").pop();
		} else {
			ret += '<span class="error">Brak identyfikatora działki</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak działki o podanym gml id</div>';
	}
	return ret;
}

function getDzialkeAdresInformacje(obj: EGB_BudynekType) {
	let ret = "<div>";
	// działka zabudowana
	ret += '<div><div class="item">Działka zabudowana:</div><div class="div-scroll">';
	if (obj.dzialkaZabudowana == null) {
		ret += '<div class="error">Brak działki zabudowanej</div>';
	} else if (obj.dzialkaZabudowana) {
		if (Array.isArray(obj.dzialkaZabudowana)) {
			obj.dzialkaZabudowana.forEach((key) => {
				if (key) {
					ret += getIDDzialki(key._attributes.href);
				}
			});
		} else {
			ret += getIDDzialki(obj.dzialkaZabudowana._attributes.href);
		}
	}
	ret += "</div></div>";

	// adres
	if (obj.adresBudynku) {
		ret += '<div class="item">Adres działki:</div><div class="div-scroll">';
		ret += getAdresNieruchomosci(obj.adresBudynku);
		ret += "</div>";
	}
	// informacje
	if (obj.dodatkoweInformacje) {
		ret += '<div class="item">Dodatkowe informacje:</div><div>' + obj.dodatkoweInformacje + "</div>";
	}

	ret += "</div>";
	return ret;
}

function getJRB(obj: EGB_BudynekType) {
	let ret = "";
	if (obj.JRBdlaBudynku) {
		ret = '<div><span class="item">Jednostka rejestrowa budynków: </span>';
		const objJb = egbFeatures.jednostkiRejestroweBudynkow.get(obj.JRBdlaBudynku._attributes.href);
		if (objJb) {
			ret += '<span class="bold cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaBudynkow + objJb._attributes.id + '" onclick="showEgbFeature(this.id)">';
			if (objJb.idJednostkiRejestrowej) {
				ret += objJb.idJednostkiRejestrowej.split(".").pop();
			} else {
				ret += '<span class="error-inline">Brak identyfikatora JRB</span>';
			}
			ret += "</span>";
		} else {
			ret += '<span class="error-inline">Brak JRB o podanym gml id</span>';
		}
		ret += "</div>";
	}
	return ret;
}

export function getLokaleIds(id: string) {
	let ret = "";
	for (const obj of egbFeatures.lokaleSamodzielne.values()) {
		if (obj.budynekZWyodrebnionymLokalem) {
			if (obj.budynekZWyodrebnionymLokalem._attributes.href === id) {
				ret += '<div class="cursor-pointer" id="' + htmlIDs.iLokalSamodzielny + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
				if (obj.idLokalu) {
					ret += obj.idLokalu.split(".").pop();
				} else {
					ret += '<span class="error">Brak identyfikatora lokalu</span>';
				}
				ret += "</div>";
			}
		}
	}
	return ret;
}

function getLokale(id: string) {
	let ret = '<div class="item-bold bottom-line">Lokale:</div>';
	let tmp = getLokaleIds(id);
	if (tmp) {
		ret += '<div class="div-scroll">' + tmp + "</div><br>";
	} else {
		ret = "";
	}
	return ret;
}

function getObiektyZwiazaneZBudynkiem(id: string) {
	let ret = '<div class="item-bold bottom-line">Obiekty trwale związane z budynkiem:</div>';
	let tmp = "";
	for (const obj of egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.values()) {
		if (obj.budynekZElementamiZwiazanymi) {
			if (obj.budynekZElementamiZwiazanymi._attributes.href === id) {
				tmp += '<div class="cursor-pointer" id="' + htmlIDs.iObiektTrwaleZwiazanyZBudynkiem + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
				if (obj.rodzajObiektuZwiazanegoZBudynkiem) {
					const rodzajObiektu = EGB_RodzajObiektu[obj.rodzajObiektuZwiazanegoZBudynkiem];
					if (rodzajObiektu) {
						tmp += rodzajObiektu;
					} else {
						tmp += '<span class="error-inline">Nieprawidłowa wartość</span>';
					}
				} else {
					tmp += '<span class="error">Brak rodzaju obiektu</span>';
				}
				tmp += "</div>";
			}
		}
	}
	if (tmp) {
		ret += '<div class="div-scroll">' + tmp + "</div>";
	} else {
		ret = "";
	}
	return ret;
}

export function pokazBudynek(id: string) {
	const obj = egbFeatures.budynki.get(id);
	if (obj) {
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getIdBudynku(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getRodzajKondygnacje(obj);
			html += getPowierzchnie(obj);
			html += getDokWlasnosciKW(obj);
			html += getDzialkeAdresInformacje(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			html = getJRB(obj);
			//html += "<br>";

			div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			//------------------------------------

			div = document.createElement("div");
			div.innerHTML = '<div class="cursor-pointer item-italic">Pokaż udziały, lokale, obiekty trwale związane z budynkiem...</div>';
			div.addEventListener("click", function onClick(e) {
				let div = e.target as HTMLElement;
				div.classList.remove("cursor-pointer");
				div.classList.remove("item-italic");
				let html = "";
				if (obj.JRBdlaBudynku) {
					html += getWlasnosciWladania(obj.JRBdlaBudynku._attributes.href);
					html += "<br>";
				}
				html += getLokale(obj._attributes.id);
				//html += "<br>";
				html += getObiektyZwiazaneZBudynkiem(obj._attributes.id);
				div.innerHTML = html;
				this.removeEventListener("click", onClick);
			});
			wrapper.appendChild(div);
		}
	}
}
