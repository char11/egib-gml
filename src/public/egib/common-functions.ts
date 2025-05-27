import { getAdresNieruchomosciSkr } from "./adresy-nieruchomosci";
import { getAdresPodmiotuSkr } from "./adresy-podmiotu";
import { egbFeatures, htmlIDs } from "./features";

export function idIIPtoText(obj: IdIIP) {
	let ret = "";
	const tempId = obj.EGB_IdentyfikatorIIP;
	if (tempId) {
		if (tempId.przestrzenNazw) {
			ret += tempId.przestrzenNazw;
		} else {
			ret += '<span class="error-inline">Brak przestrzeni nazw</span>';
		}
		if (tempId.lokalnyId) {
			ret += "_" + tempId.lokalnyId;
		} else {
			ret += '<span class="error-inline">Brak lokalnego identyfikator</span>';
		}
		if (tempId.wersjaId) {
			ret = ret + "_" + tempId.wersjaId;
		}
	} else {
		ret += '<span class="error-inline">Brak identyfitora IIP</span>';
	}
	return ret;
}

export function getStartKoniecObiektu(obj: EGB_OgolnyObiektType) {
	let ret = "<div>";

	// start obiekt
	ret += '<div><span class="item">Utw. obiektu: </span>';
	if (obj.startObiekt) {
		ret += new Date(obj.startObiekt).toLocaleString("pl-PL");
	} else {
		ret += '<span class="error-inline">Brak daty utworzenia</span>';
	}
	ret += "</div>";

	// start wercja oiektu
	ret += '<div><span class="item">Utw. wersji: </span>';
	if (obj.startWersjaObiekt) {
		ret += new Date(obj.startWersjaObiekt).toLocaleString("pl-PL");
	} else {
		ret += '<span class="error-inline">Brak daty utworzenia wersji</span>';
	}
	ret += "</div>";

	// podstawa utworzenia wersji
	if (obj.podstawaUtworzeniaWersjiObiektu) {
		ret += '<div><span class="item">Podstawa utw. wersji obiektu: </span>';
		const objZm = egbFeatures.zmiany.get(obj.podstawaUtworzeniaWersjiObiektu._attributes.href);
		if (objZm) {
			const nrZmiany = objZm.nrZmiany;
			if (nrZmiany) {
				ret += '<span class="cursor-pointer" id="' + htmlIDs.iZmiana + objZm._attributes.id + '" onclick="showEgbFeature(this.id)">' + nrZmiany + "</span>";
			} else {
				ret += '<span class="error-inline">Brak numeru zmiany</span>';
			}
		} else {
			ret += '<span class="error-inline">Brak zmiany o podanym gml id</span>';
		}
		ret += "</div>";
	}
	// koniec wersja obiekt
	if (obj.koniecWersjaObiekt) {
		ret += '<div><span class="item">Koniec wersji obiektu: </span>' + new Date(obj.koniecWersjaObiekt).toLocaleString("pl-PL") + "</div>";
	}
	// koniec obiekt
	if (obj.koniecObiekt) {
		ret += '<div><span class="item">Koniec obiektu: </span>' + new Date(obj.koniecObiekt).toLocaleString("pl-PL") + "</div>";
	}
	// podstawa usunięcia obiektu
	if (obj.podstawaUsunieciaObiektu) {
		ret += '<div><span class="item">Podstawa usunięcia obiektu: </span>';
		const objZm = egbFeatures.zmiany.get(obj.podstawaUsunieciaObiektu._attributes.href);
		if (objZm) {
			const nrZmiany = objZm.nrZmiany;
			if (nrZmiany) {
				ret += '<span class="cursor-pointer" id="' + htmlIDs.iZmiana + objZm._attributes.id + '" onclick="showEgbFeature(this.id)">' + nrZmiany + "</span>";
			} else {
				ret += '<span class="error-inline">Brak numeru zmiany</span>';
			}
		} else {
			ret += '<span class="error-inline">Brak zmiany o podanym gml id</span>';
		}
		ret += "</div>";
	}
	//ret += '<div><span class="item">IIP: </span>';
	//if (obj.idIIP) {
	//	ret += idIIPtoText(obj.idIIP);
	//} else {
	//	ret += '<span class="error-inline">Brak IIP</span>';
	//}
	//ret += "</div>";
	ret += "</div>";
	return ret;
}

export function getDokumenty(obj: XlinkType | XlinkType[]) {
	let ret = "";
	if (Array.isArray(obj)) {
		obj.forEach((key) => {
			if (key) {
				ret += getEGBDokumenty(key._attributes.href);
			}
		});
	} else {
		ret += getEGBDokumenty(obj._attributes.href);
	}
	return ret;
}

function getEGBDokumenty(id: string) {
	let ret = "";
	const obj = egbFeatures.dokumenty.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iDokument + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.sygnaturaDokumentu) {
			ret += obj.sygnaturaDokumentu;
		} else {
			ret += '<span class="error-inline">Brak sygnatury dokumentu</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error-inline">Brak dokumentu o podanym gml id</div>';
	}
	return ret;
}

export function getOperaty(obj: XlinkType | XlinkType[]) {
	let ret = "";
	if (Array.isArray(obj)) {
		obj.forEach((key) => {
			if (key) {
				ret += getEGBOperaty(key._attributes.href);
			}
		});
	} else {
		ret += getEGBOperaty(obj._attributes.href);
	}
	return ret;
}

function getEGBOperaty(id: string) {
	let ret = "";
	const obj = egbFeatures.operatyTechniczne.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iOperatTechniczny + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.identyfikatorOperatuWgPZGIK) {
			ret += obj.identyfikatorOperatuWgPZGIK;
		} else {
			ret += '<span class="error-inline">Brak identyfikatora operatu dokumentu</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak operatu o podanym gml id</div>';
	}
	return ret;
}

export function getDokumentyOperaty(obj: EGB_OgolnyObiektType) {
	let ret = "<div>";

	// dokument
	if (obj.dokument2) {
		ret += '<div class="item">Dokumenty:</div><div class="div-scroll-small">';
		ret += getDokumenty(obj.dokument2);
		ret += "</div>";
	}
	// operat
	if (obj.operatTechniczny2) {
		ret += '<div class="item">Operaty:</div><div class="div-scroll-small">';
		ret += getOperaty(obj.operatTechniczny2);
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

function getIdIIP(obj: EGB_OgolnyObiektType) {
	let ret = '<div><span class="item">IIP: </span>';
	if (obj.idIIP) {
		ret += idIIPtoText(obj.idIIP);
	} else {
		ret += '<span class="error-inline">Brak IIP</span>';
	}
	ret += "</div>";
	return ret;
}

export function getOgolnyObiekt(obj: EGB_OgolnyObiektType) {
	let ret = "<div>";

	ret += getStartKoniecObiektu(obj);
	ret += getDokumentyOperaty(obj);
	ret += getIdIIP(obj);

	ret += "</div>";
	return ret;
}

export function getAdresNieruchomosci(obj: XlinkType | XlinkType[]) {
	let ret = "";
	if (Array.isArray(obj)) {
		obj.forEach((key) => {
			ret +=
				'<div class="cursor-pointer" id="' +
				htmlIDs.iAdresNieruchomosci +
				key._attributes.href +
				'" onclick="showEgbFeature(this.id)">' +
				getAdresNieruchomosciSkr(key._attributes.href) +
				"</div>";
		});
	} else {
		ret +=
			'<div class="cursor-pointer" id="' +
			htmlIDs.iAdresNieruchomosci +
			obj._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getAdresNieruchomosciSkr(obj._attributes.href) +
			"</div>";
	}
	return ret;
}

export function getIdJRG(id: string) {
	let ret = "";
	const obj = egbFeatures.jednostkiRejestroweGruntow.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaGruntow + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej.split(".").pop();
		} else {
			ret += '<span class="error">Brak identyfikatora JRG</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak JRG o podanym gml id</div>';
	}
	return ret;
}

export function getArea(obj: AreaType) {
	let ret = "<span>";
	const value = obj.value;
	if (value) {
		ret += value.replace(".", ",");
	} else {
		ret += '<span class="error-inline">Brak wartości</span>';
	}
	const uom = obj._attributes.uom;
	if (uom) {
		ret += " " + uom;
	} else {
		ret += " " + '<span class="error-inline">Brak jednostki</span>';
	}
	ret += "</span>";
	return ret;
}

export function getDokWlasnosciKW(obj: EGB_DzialkaEwidencyjnaType | EGB_BudynekType | EGB_LokalSamodzielnyType) {
	let ret = "<div>";

	// dokument własności
	if (obj.dokumentWlasnosci) {
		ret += '<div class="item">Dok. własności:</div><div class="div-scroll">';
		if (Array.isArray(obj.dokumentWlasnosci)) {
			ret += "<div>";
			obj.dokumentWlasnosci.forEach((key) => {
				ret += "<div>" + key + "</div>";
			});
			ret += "</div>";
		} else ret += "<div>" + obj.dokumentWlasnosci + "</div>";
		ret += "</div>";
	}
	// nr kw
	if (obj.numerKW) {
		ret += '<div class="item">Nr KW:</div><div class="div-scroll">';
		if (Array.isArray(obj.numerKW)) {
			ret += "<div>";
			obj.numerKW.forEach((key) => {
				ret += "<div>" + key + "</div>";
			});
			ret += "</div>";
		} else ret += "<div>" + obj.numerKW + "</div>";
		ret += "</div>";
	}
	ret += "</div>";
	return ret;
}

export function getAdresSiedziby(obj: EGB_PodmiotGrupowyType | EGB_InstytucjaType) {
	let ret = "<div>";
	if (obj.adresSiedziby) {
		ret +=
			'<div><span class="item">Adres siedziby: </span>' +
			'<span class="cursor-pointer" id="' +
			htmlIDs.iAdresPodmiotu +
			obj.adresSiedziby._attributes.href +
			'" onclick="showEgbFeature(this.id)">' +
			getAdresPodmiotuSkr(obj.adresSiedziby._attributes.href) +
			"</span></div>";
	}
	ret += "</div>";
	return ret;
}

export function getNazwe(obj: EGB_JednostkaEwidencyjnaType | EGB_ObrebEwidencyjnyType) {
	let ret = "<div>";

	ret += '<span class="item">Nazwa własna: </span>';
	if (obj.nazwaWlasna == null) {
		ret += '<span class="error-inline">Brak nazwy własnej</span>';
	} else {
		ret += obj.nazwaWlasna;
	}
	ret += "</div>";
	return ret;
}

export function getIdBudynku(id: string) {
	let ret = "";
	const obj = egbFeatures.budynki.get(id);
	if (obj) {
		if (obj.idBudynku == null) {
			ret += '<span class="error-inline">Brak identyfikatora budynku</span>';
		} else {
			if (obj.idBudynku) {
				ret +=
					'<span class="cursor-pointer" id="' +
					htmlIDs.iBudynek +
					obj._attributes.id +
					'" onclick="showEgbFeature(this.id)">' +
					obj.idBudynku.split(".").pop() +
					"</span>";
			}
		}
	} else {
		ret += '<span class="error-inline">Brak budynku o podanym gml id</span>';
	}
	return ret;
}

export function getIdPunktuGranicznego(id: string) {
	let ret = "";
	const obj = egbFeatures.punktyGraniczne.get(id);
	if (obj) {
		ret += '<div class="cursor-pointer" id="' + htmlIDs.iPunktGraniczny + id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idPunktu) {
			ret += obj.idPunktu;
		} else {
			ret += '<span class="error">Brak identyfikatora punktu granicznego</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error">Brak punktu granicznego o podanym gml id</div>';
	}
	return ret;
}
