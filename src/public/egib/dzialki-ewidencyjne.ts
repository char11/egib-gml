import { showOnMapButton, showReportButton } from "../ui/ui";
import { getLokaleIds } from "./budynki";
import { getAdresNieruchomosci, getArea, getDokWlasnosciKW, getIdPunktuGranicznego, getOgolnyObiekt } from "./common-functions";
import { getDokument } from "./dokumenty";
import { egbFeatures, htmlIDs } from "./features";
import { getWlasnosciWladania } from "./udzialy";
import { EGB_OFU, EGB_OZU } from "./kontury-uzytku-gruntowego";
import { getJE } from "./obreby-ewidencyjne";
import { getOperatTechniczny } from "./operaty";
import { getZmiana } from "./zmiany";

const EGB_ZapisPowDzialki: { [key: string]: string } = {
	"1": "do m<sup>2</sup>",
	"2": "do ara", // 2
};

export function getOE(obj: EGB_ObrebEwidencyjnyType) {
	let ret = '<span class="span-title item">Obręb ewid.: </span>';
	ret += '<span class="cursor-pointer" id="' + htmlIDs.iObrebEwidencyjny + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
	if (obj.idObrebu) {
		ret += obj.idObrebu.split(".")[1];
	} else {
		ret += '<span class="error-inline">Brak identyfikatora obrębu</span>';
	}
	ret += "</span>";
	// nazwa własna
	if (obj.nazwaWlasna) {
		ret += "<span> (" + obj.nazwaWlasna + ")</span>";
	}
	return ret;
}

function getLokalizacja(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = '<div class="div-title">';

	// id działki
	ret += '<span class="item">Identyfikator działki ewidencyjnej: </span>';
	if (obj.idDzialki) {
		ret += '<span class="bold">' + obj.idDzialki + "</span>";
	} else {
		ret += '<span class="error-inline">Brak identyfikatora działki</span>';
	}

	// lokalizacja
	if (obj.lokalizacjaDzialki == null) {
		ret += '<span class="error-inline">&nbspBrak lokalizacji działki</span>';
	} else if (obj.lokalizacjaDzialki) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaDzialki._attributes.href);
		if (objObr) {
			// jednostka ewidencyjna
			ret += getJE(objObr);
			// obręb ewidencyjny
			ret += getOE(objObr);
			// nr działki
			if (obj.idDzialki) {
				ret += '</span><span class="span-title item">Nr działki: </span><span>' + obj.idDzialki.split(".").pop() + "</span>";
			}
		} else {
			ret += '<span class="error-inline">&nbspBrak obrębu o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getKlasouzytki(obj: EGB_KlasouzytekType) {
	let ret = "<div>";

	// OFU
	if (obj.OFU) {
		ret += '<span class="cursor-default" title="' + EGB_OFU[obj.OFU] + '">' + obj.OFU + "</span>";
	} else {
		ret += '<span class="error-inline">Brak OFU.</span>';
	}
	// OZU
	if (obj.OZU) {
		if (obj.OZU.valueOf() !== obj.OFU?.valueOf()) {
			ret += "-" + '<span class="cursor-default" title="' + EGB_OZU[obj.OZU] + '">' + obj.OZU + "</span>";
		}
	}
	// OZK
	if (obj.OZK) {
		ret += obj.OZK;
	}
	// powierzchnia
	if (obj.powierzchnia) {
		ret += " " + getArea(obj.powierzchnia);
	} else {
		ret += '<span class="error-inline">Brak powierzchni klasoużytków</span>';
	}
	ret += "</div>";
	return ret;
}

function getPoleKlasouzytki(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = "<div>";

	// pole ewidencyjne
	ret += '<div><span class="item">Pole ewid.: </span>';
	if (obj.poleEwidencyjne) {
		ret += getArea(obj.poleEwidencyjne);
	} else {
		ret += '<span class="error-inline">Brak wielkości pola ewidencyjnego</span>';
	}
	ret += "</div>";

	// dokładność reprezentacji pola
	ret += '<div><span class="item">Dokładność: </span>';
	if (obj.dokladnoscReprezentacjiPola) {
		const dokladnoscReprezentacjiPola = EGB_ZapisPowDzialki[obj.dokladnoscReprezentacjiPola];
		if (dokladnoscReprezentacjiPola) {
			ret += dokladnoscReprezentacjiPola;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak dokładności pola ewidencyjnego</span>';
	}
	ret += "</div>";

	// klasoużytki
	ret += '<div class="item">Klasoużytki:</div><div class="div-scroll">';
	if (obj.klasouzytek) {
		if (Array.isArray(obj.klasouzytek)) {
			obj.klasouzytek.forEach((key) => {
				if (key.EGB_Klasouzytek) {
					ret += getKlasouzytki(key.EGB_Klasouzytek);
				} else {
					ret += '<div class="error">Brak klasoużytków</div>';
				}
			});
		} else {
			if (obj.klasouzytek.EGB_Klasouzytek) {
				ret += getKlasouzytki(obj.klasouzytek.EGB_Klasouzytek);
			} else {
				ret += '<div class="error">Brak klasoużytków</div>';
			}
		}
	} else {
		ret += '<div class="error">Brak klasoużytków</div>';
	}
	ret += "</div>";
	ret += "</div>";
	return ret;
}

function getAdresInformacje(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = "<div>";

	// adres
	if (obj.adresDzialki) {
		ret += '<div class="item">Adres działki:</div><div class="div-scroll">';
		ret += getAdresNieruchomosci(obj.adresDzialki);
		ret += "</div>";
	}
	// informacje
	if (obj.dodatkoweInformacje) {
		ret += '<div class="item">Dodatkowe informacje:</div><div>' + obj.dodatkoweInformacje + "</div>";
	}
	ret += "</div>";
	return ret;
}

function getPunktyGraniczne(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = '<div><div class="item">Punkty graniczne:</div><div class="div-scroll">';

	// punkty graniczne
	if (obj.punktGranicyDzialki == null) {
		ret += '<div class="error-inline">Brak punktów granicznych</div>';
	} else if (obj.punktGranicyDzialki.length < 3) {
		ret += '<div class="error">Za mała liczba punktów granicznych</div>';
	} else {
		obj.punktGranicyDzialki.forEach((key) => {
			if (key) {
				ret += getIdPunktuGranicznego(key._attributes.href);
			}
		});
	}
	ret += "</div></div>";
	return ret;
}

function getJRG(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = '<div><span class="item">Jednostka rejestrowa gruntów: </span>';
	// JRG
	if (obj.JRG2 == null) {
		ret += '<span class="error-inline">Brak JRG</span>';
	} else if (obj.JRG2) {
		const objJe = egbFeatures.jednostkiRejestroweGruntow.get(obj.JRG2._attributes.href);
		if (objJe) {
			ret += '<span class="bold cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaGruntow + objJe._attributes.id + '" onclick="showEgbFeature(this.id)">';
			if (objJe.idJednostkiRejestrowej) {
				ret += objJe.idJednostkiRejestrowej.split(".").pop();
			} else {
				ret += '<span class="error-inline">Brak identyfikatora JRG</span>';
			}
			ret += "</span>";
		} else {
			ret += '<span class="error-inline">Brak JRG o podanym gml id</span>';
		}
	}
	ret += "</div>";
	return ret;
}

function getEGBDokumentyOperaty(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = "<div>";

	// dokument
	if (obj.dokument2) {
		ret += '<div class="item-bold bottom-line">Dokumenty:</div><div>';
		if (Array.isArray(obj.dokument2)) {
			obj.dokument2.forEach((key) => {
				if (key) {
					ret += getDokument(key._attributes.href);
				}
			});
		} else {
			ret += getDokument(obj.dokument2._attributes.href);
		}
		ret += "</div>";
	}
	// operat
	if (obj.operatTechniczny2) {
		ret += '<div class="item-bold bottom-line">Operaty:</div><div>';
		if (Array.isArray(obj.operatTechniczny2)) {
			obj.operatTechniczny2.forEach((key) => {
				if (key) {
					ret += getOperatTechniczny(key._attributes.href);
				}
			});
		} else {
			ret += getOperatTechniczny(obj.operatTechniczny2._attributes.href);
		}
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getEGBZmiany(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = "<div>";

	// zmiana
	if (obj.podstawaUtworzeniaWersjiObiektu || obj.podstawaUsunieciaObiektu) {
		ret += '<div class="item-bold bottom-line">Zmiany:</div><div>';
		if (obj.podstawaUtworzeniaWersjiObiektu) {
			ret += getZmiana(obj.podstawaUtworzeniaWersjiObiektu._attributes.href);
		}
		if (obj.podstawaUsunieciaObiektu) {
			ret += getZmiana(obj.podstawaUsunieciaObiektu._attributes.href);
		}
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getIdBudynkuLokale(obj: EGB_BudynekType) {
	let ret = '<div class="cursor-pointer" id="' + htmlIDs.iBudynek + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
	if (obj.idBudynku) {
		ret += obj.idBudynku.split(".").pop();
	} else {
		ret += '<span class="error">Brak identyfikatora budynku</span>';
	}
	ret += "</div>";
	ret += '<div class="div-scroll">' + getLokaleIds(obj._attributes.id) + "</div>";
	return ret;
}

function getBudynki(id: string) {
	let ret = '<div class="grid-container-columns"><div class="item-bold bottom-line">Budynki:</div><div class="item-bold bottom-line">Lokale:</div>';
	let tmp = "";
	for (const obj of egbFeatures.budynki.values()) {
		if (obj.dzialkaZabudowana) {
			if (Array.isArray(obj.dzialkaZabudowana)) {
				obj.dzialkaZabudowana.forEach((key) => {
					if (key._attributes.href === id) {
						tmp += getIdBudynkuLokale(obj);
					}
				});
			} else {
				if (obj.dzialkaZabudowana._attributes.href === id) {
					tmp += getIdBudynkuLokale(obj);
				}
			}
		}
	}
	if (tmp) {
		ret += tmp;
		ret += "</div>";
		ret += "<br>";
	} else {
		ret = "";
	}
	return ret;
}

export function pokazDzialkeEwidencyjna(id: string) {
	const obj = egbFeatures.dzialkiEwidencyjne.get(id);
	if (obj) {
		showReportButton();
		if (obj.geometria) {
			showOnMapButton();
		}
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			let html = getLokalizacja(obj);
			html += '<div class="grid-container">';
			html += getOgolnyObiekt(obj);
			html += getDokWlasnosciKW(obj);
			html += getPoleKlasouzytki(obj);
			html += getAdresInformacje(obj);
			html += getPunktyGraniczne(obj);

			html += "</div>";

			let div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			html = getJRG(obj);
			//html += "<br>";

			div = document.createElement("div");
			div.innerHTML = html;
			wrapper.appendChild(div);

			//------------------------------------------------

			div = document.createElement("div");
			div.innerHTML = '<div class="cursor-pointer item-italic">Pokaż udziały, budynki, lokale...</div>';
			div.addEventListener("click", function onClick(e) {
				let div = e.target as HTMLElement;
				div.classList.remove("cursor-pointer");
				div.classList.remove("item-italic");
				let html = "";
				if (obj.JRG2) {
					html += getWlasnosciWladania(obj.JRG2._attributes.href);
					html += "<br>";
				}
				html += getBudynki(obj._attributes.id);
				//html += getEGBZmiany(obj);
				//html += "<br>";
				//html += getEGBDokumentyOperaty(obj);
				div.innerHTML = html;
				this.removeEventListener("click", onClick);
			});
			wrapper.appendChild(div);
		}
	}
}
