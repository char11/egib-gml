import { getAdresPodmiotuSkr } from "./adresy-podmiotu";
import { egbFeatures, htmlIDs } from "./features";
import { getInstytucjaSkr } from "./instytucje";
import { getMalzenstwoSkr } from "./malzenstwa";
import { EGB_Plec, getOsobaSkr } from "./osoby-fizyczne";
import { getPodmiotGrupowySkr } from "./podmioty-grupowe";
import { getWspolnotaGruntowaSkr } from "./wspolnoty-gruntowe";

const EGB_GrupaRej: { [key: string]: string } = {
	"1": "skarb państwa",
	"2": "skarb państwa ZUW",
	"3": "państwowa osoba prawna",
	"4": "gminy i związki międzygminne",
	"5": "gminy i związki międzygminne ZUW",
	"6": "JST osoba prawna",
	"7": "osoby fizyczne",
	"8": "spółdzielnie",
	"9": "kościoły i związki wyznaniowe",
	"10": "wspólnota gruntowa",
	"11": "powiaty i związki powiatów",
	"12": "powiaty i związki powiatów ZUW",
	"13": "województwa",
	"14": "województwa ZUW",
	"15": "spółki prawa handlowego",
	"16": "inne podmioty",
};

export const EGB_RodzajPrawa: { [key: string]: string } = {
	"1": "własność", // 1
	"2": "władanie samoistne", // 2
};

export const EGB_RodzajWladania: { [key: string]: string } = {
	"1": "użytkowanie wieczyste", // 1
	"2": "trwały zarząd", // 2
	"3": "zarząd", // 3
	"4": "użytkowanie", // 4
	"5": "inny rodzaj władania", // 5
	"6": "wykonywanie prawa własności SPI innych praw rzeczowych", // 6
	"7": "gospodarowanie zasobem nieruchomości SP lub gminy, powiatu, województwa", // 7
	"8": "gospodarowanie gruntem SP pokrytym wodami powierzchniowymi", // 8
	"9": "wykonywanie zadań zarządcy dróg publicznych", // 9
};

export const EGB_StatusPodmiotuEwid: { [key: string]: string } = {
	"1": "osoba fizyczna", // 1
	"3": "skarb państwa", // 3
	"4": "gmina lub związek międzygminny", // 4
	"5": "sołectwo", // 5
	"6": "państwowa osoba prawna lub jednoosobowa spółka skarbu państwa", // 6
	"7": "Państwowe Gospodarstwo Leśne Lasy Państwowe", // 7
	"8": "Krajowy Osrodek Wsparcia Rolnictwa", // 8
	"9": "Agencja Mienia Wojskowego", // 9
	"11": "państwowa jednostka organizacyjna bez osobowości prawnej", // 11
	"12": "gminna jednostka organizacyjna bez osobowości prawnej", // 12
	"13": "powiatowa jednostka organizacyjna bez osobowości prawnej", // 13
	"14": "wojewódzka jednostka organizacyjna bez osobowości prawnej", // 14
	"15": "gminna osoba prawna lub jednoosobowa spółka gminy", // 15
	"16": "powiatowa osoba prawna lub jednoosobowa spółka powiatu", // 16
	"17": "wojewódzka osoba prawna lub jednoosobowa spółka wojewodztwa", // 17
	"23": "spółdzielnia mieszkaniowa", // 23
	"24": "spółdzielnia lub zwiazek spółdzielni", // 24
	"25": "kościoły lub związki wyznaniowe", // 25
	"26": "spółka handlowa nie będaca cudzoziemcem", // 26
	"27": "spółka handlowa będaca cudzoziemcem", // 27
	"28": "osoba prawna inna niż spółka handlowa będaca cudzoziemcem", // 28
	"29": "partia polityczna", // 29
	"30": "stowarzyszenie", // 30
	"31": "jednostka organizacyjna nie będaca osobą prawną ze zdolnością prawną", // 31
	"32": "podmioty pozostające we współwlasności łacznej", // 32
	"33": "spółka cywilna", // 33
	"34": "małżenstwo obywateli polskich", // 34
	"35": "małżenstwo obywatela Polski i cudzoziemca", // 35
	"36": "województwo", // 36
	"37": "powiat", // 37
	"38": "spółdzielnia rolnicza", // 38
	"40": "właściciel nieustalony", // 40
	"41": "wspólnota gruntowa", // 41
	"42": "Minister Gospodarki Morskiej", // 42
	"43": "Prezes Państwowego Gospodarstwa Wodnego", // 43
	"44": "Generalny Dyrektor Dróg Krajowych i Autostrad", // 44
	"45": "dyrektor parku narodowego", // 45
	"46": "marszałek wojewodztwa", // 46
	"47": "inne", // 47
};

export function getGrupaRejestrowa(obj: EGB_JednostkaRejestrowaGruntowType | EGB_JednostkaRejestrowaBudynkowType | EGB_JednostkaRejestrowaLokaliType) {
	let ret = '<div><span class="item">Grupa rejestrowa: </span>';
	if (obj.grupaRejestrowa) {
		const grupaRejestrowa = EGB_GrupaRej[obj.grupaRejestrowa];
		if (grupaRejestrowa) {
			ret += grupaRejestrowa;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak grupy rejestrowej</span>';
	}

	ret += "</div>";
	return ret;
}

export function getWladania(id: string) {
	let ret = "";
	for (const obj of egbFeatures.udzialyWeWladaniu.values()) {
		if (obj.przedmiotUdzialuWladania) {
			if (obj.przedmiotUdzialuWladania._attributes?.href === id) {
				ret += getPodmiotyWladania(obj);
			}
		}
	}
	return ret;
}

function getPodmiotyWladania(obj: EGB_UdzialWeWladaniuType) {
	let ret = '<div class="grid-item">';
	ret += '<div class="cursor-pointer expanded" id="' + htmlIDs.iUdzialWeWladaniu + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
	// rodzaj prawa
	ret += '<div><span class="item">Rodzaj prawa: </span>';
	if (obj.rodzajWladania) {
		const rodzajWladania = EGB_RodzajWladania[obj.rodzajWladania];
		if (rodzajWladania) {
			ret += rodzajWladania;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju prawa</span>';
	}
	ret += "</div>";
	// wielkość udziału
	if (obj.licznikUlamkaOkreslajacegoWartoscUdzialu && obj.mianownikUlamkaOkreslajacegoWartoscUdzialu) {
		ret +=
			'<div><span class="item">Udział: </span><sup>' +
			obj.licznikUlamkaOkreslajacegoWartoscUdzialu +
			"</sup>/<sub>" +
			obj.mianownikUlamkaOkreslajacegoWartoscUdzialu +
			"</sub></div>";
	}
	ret += "</div>";
	ret += "</div>";

	// podmioty
	ret += '<div class="grid-item">';
	if (obj.podmiotUdzialuWeWladaniu == null) {
		ret += '<div class="error-inline">Brak podmiotu</div>';
	} else if (obj.podmiotUdzialuWeWladaniu) {
		ret += getPodmiot(obj.podmiotUdzialuWeWladaniu._attributes.href);
	}
	ret += "</div>";
	return ret;
}

export function getWlasnosci(id: string) {
	let ret = "";
	for (const obj of egbFeatures.udzialyWeWlasnosci.values()) {
		if (obj.przedmiotUdzialuWlasnosci) {
			if (obj.przedmiotUdzialuWlasnosci._attributes?.href === id) {
				ret += getPodmiotyWlasnosci(obj);
			}
		}
	}
	return ret;
}

function getPodmiotyWlasnosci(obj: EGB_UdzialWeWlasnosciType) {
	let ret = '<div class="grid-item">';
	ret += '<div class="cursor-pointer expanded" id="' + htmlIDs.iUdzialWeWlasnosci + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
	// rodzaj prawa i wielkość udziału
	ret += getUdzial(obj);
	// udział w nieruchomości wspólnej
	if (obj.udzialWNieruchomosciWspolnej) {
		ret += '<br><div class="item">Udział w nieruchomości wspólnej:</div>';
		ret += getUdzialWNieruchomosciWspolnej(obj.udzialWNieruchomosciWspolnej._attributes.href);
		// ret += '</div>';
	}
	ret += "</div>";
	ret += "</div>";
	// podmioty
	ret += '<div class="grid-item">';
	if (obj.podmiotUdzialuWlasnosci == null) {
		ret += '<div class="error-inline">Brak podmiotu</div>';
	} else if (obj.podmiotUdzialuWlasnosci) {
		ret += getPodmiot(obj.podmiotUdzialuWlasnosci._attributes.href);
	}
	ret += "</div>";
	return ret;
}

function getUdzial(obj: EGB_UdzialWeWlasnosciType) {
	let ret = '<div><span class="item">Rodzaj prawa: </span>';
	if (obj.rodzajPrawa) {
		const rodzajPrawa = EGB_RodzajPrawa[obj.rodzajPrawa];
		if (rodzajPrawa) {
			ret += rodzajPrawa;
		} else {
			ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak rodzaju prawa</span>';
	}
	ret += "</div>";
	// wielkość udziału
	ret += '<div><span class="item">Udział: </span>';
	if (obj.licznikUlamkaOkreslajacegoWartoscUdzialu && obj.mianownikUlamkaOkreslajacegoWartoscUdzialu) {
		ret += "<sup>" + obj.licznikUlamkaOkreslajacegoWartoscUdzialu + "</sup>/<sub>" + obj.mianownikUlamkaOkreslajacegoWartoscUdzialu + "</sub>";
	} else {
		ret += '<span class="error-inline">Brak wielkości udziału</span>';
	}
	ret += "</div>";
	return ret;
}

function getUdzialWNieruchomosciWspolnej(id: string) {
	let ret = "";
	const obj = egbFeatures.udzialyWeWlasnosci.get(id);
	if (obj) {
		// przedmiot
		if (obj.przedmiotUdzialuWlasnosci) {
			ret += '<div><span class="item">Przedmiot: </span>' + getPrzedmiotSkr(obj.przedmiotUdzialuWlasnosci._attributes.href) + "</div>";
		}
		// rodzaj prawa i wielkość udziału
		ret += getUdzial(obj);
	} else {
		ret += '<div class="error-inline">Brak udziału we własności o podanym gml id</div>';
	}
	return ret;
}

export function getPrzedmiot(id: string) {
	let ret = "";
	if (egbFeatures.jednostkiRejestroweGruntow.has(id)) {
		ret += getJRGId(id);
	} else if (egbFeatures.jednostkiRejestroweBudynkow.has(id)) {
		ret += getJRBId(id);
	} else if (egbFeatures.jednostkiRejestroweLokali.has(id)) {
		ret += getJRLId(id);
	}
	return ret;
}

function getJRGId(id: string) {
	let ret = "<span>";
	const obj = egbFeatures.jednostkiRejestroweGruntow.get(id);
	if (obj) {
		ret += '<span class="cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaGruntow + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej;
		} else {
			ret += '<span class="error-inline">Brak id jednostki rejestrowej</span>';
		}
		ret += "</span>";
	} else {
		ret += '<span class="error-inline">Brak JRG o podanym gml id</span>';
	}
	ret += "</span>";
	return ret;
}

function getJRBId(id: string) {
	let ret = "<span>";
	const obj = egbFeatures.jednostkiRejestroweBudynkow.get(id);
	if (obj) {
		ret += '<span class="cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaBudynkow + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej;
		} else {
			ret += '<span class="error-inline">Brak id jednostki rejestrowej</span>';
		}
		ret += "</span>";
	} else {
		ret += '<span class="error-inline">Brak JRB o podanym gml id</span>';
	}
	ret += "</span>";
	return ret;
}

function getJRLId(id: string) {
	let ret = "<span>";
	const obj = egbFeatures.jednostkiRejestroweLokali.get(id);
	if (obj) {
		ret += '<span class="cursor-pointer" id="' + htmlIDs.iJednostkaRejestrowaLokali + obj._attributes.id + '" onclick="showEgbFeature(this.id)">';
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej;
		} else {
			ret += '<span class="error-inline">Brak id jednostki rejestrowej</span>';
		}
		ret += "</span>";
	} else {
		ret += '<span class="error-inline">Brak JRL o podanym gml id</span>';
	}
	ret += "</span>";
	return ret;
}

function getPodmiot(id: string) {
	let ret = "";
	if (egbFeatures.osobyFizyczne.has(id)) {
		ret += getOsobaFizyczna(id);
	} else if (egbFeatures.malzenstwa.has(id)) {
		ret += getMalzenstwo(id);
	} else if (egbFeatures.podmiotyGrupowe.has(id)) {
		ret += getPodmiotGrupowy(id);
	} else if (egbFeatures.instytucje.has(id)) {
		ret += getInstytucja(id);
	} else if (egbFeatures.wspolnotyGruntowe.has(id)) {
		ret += getWspolnotaGruntowa(id);
	}
	return ret;
}

function getOsobaFizyczna(id: string) {
	let ret =
		'<div class="cursor-pointer expanded" id="' +
		htmlIDs.iOsobaFizyczna +
		id +
		'" onclick="showEgbFeature(this.id)"><div class="div-inline item">Osoba fizyczna:&nbsp</div>' +
		getEGBOsobaFizyczna(id) +
		"</div>";
	return ret;
}

function getEGBOsobaFizyczna(id: string) {
	let ret = "";
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		// imiona
		ret += '<div class="div-inline">';
		if (obj.pierwszeImie == null) {
			ret += '<span class="error-inline">Brak imienia&nbsp</span>';
		} else {
			ret += obj.pierwszeImie + " ";
		}
		if (obj.drugieImie) {
			ret += obj.drugieImie + " ";
		}
		// nazwiska
		if (obj.pierwszyCzlonNazwiska == null) {
			ret += '<span class="error-inline">Brak nazwiska&nbsp</span>';
		} else {
			ret += obj.pierwszyCzlonNazwiska;
		}
		if (obj.drugiCzlonNazwiska) {
			ret += "-" + obj.drugiCzlonNazwiska + " ";
		}
		// imiona rodziców
		if (obj.imieOjca || obj.imieMatki) {
			ret += ' <span class="item">Imiona rodziców: </span>';
			if (obj.imieOjca) {
				ret += obj.imieOjca + " ";
			}
			if (obj.imieMatki) {
				ret += obj.imieMatki;
			}
		}
		ret += "</div>";
		// pesel płeć informacja o śmierci
		ret += "<div>";
		if (obj.pesel) {
			ret += '<span class="item">Pesel: </span>';
			ret += obj.pesel;
		}
		ret += ' <span class="item">Płeć: </span>';
		if (obj.plec) {
			const plec = EGB_Plec[obj.plec];
			if (plec) {
				ret += plec;
			} else {
				ret += '<div class="error-inline">Nieprawidłowa wartość</div>';
			}
		} else {
			ret += '<span class="error-inline">Brak płci</span>';
		}
		if (obj.informacjaOSmierci) {
			ret += ' <span class="item">Informacja o śmierci: </span>' + obj.informacjaOSmierci;
		}
		ret += "</div>";
		// status
		ret += '<div> <span class="item">Status: </span>';
		if (obj.status) {
			if (obj.status === "1") {
				ret += EGB_StatusPodmiotuEwid[obj.status];
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
		} else {
			ret += '<span class="error-inline">Brak statusu</span>';
		}
		ret += "</div>";
		// adres zameldowania
		if (obj.adresZameldowania) {
			ret += '<div><span class="item">Adres zameldowania: </span>' + getAdresPodmiotuSkr(obj.adresZameldowania._attributes.href) + "</div>";
		}
		// adres do korespondencji
		if (obj.adresStalegoPobytu) {
			ret += '<div><span class="item">Adres do korespondencji: </span>' + getAdresPodmiotuSkr(obj.adresStalegoPobytu._attributes.href) + "</div>";
		}
	} else {
		ret += '<div class="error-inline">Brak osoby fizycznej o podanym gml id</div>';
	}
	return ret;
}

function getMalzenstwo(id: string) {
	let ret =
		'<div class="cursor-pointer expanded" id="' +
		htmlIDs.iMalzenstwo +
		id +
		'" onclick="showEgbFeature(this.id)"><div class="div-inline item">Małżeństwo:&nbsp</div>' +
		getEGBMalzenstwo(id) +
		"</div>";
	return ret;
}

function getEGBMalzenstwo(id: string) {
	let ret = "";
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		if (obj.osobaFizyczna2 == null) {
			ret += '<div class="error-inline">Brak osoby płci żeńskiej</div>';
		} else if (obj.osobaFizyczna2) {
			ret += getEGBOsobaFizyczna(obj.osobaFizyczna2._attributes.href);
		}
		if (obj.osobaFizyczna3 == null) {
			ret += '<div class="error-inline">Brak osoby płci męskiej</div>';
		} else if (obj.osobaFizyczna3) {
			ret += getEGBOsobaFizyczna(obj.osobaFizyczna3._attributes.href);
		}
		ret += '<div> <span class="item">Status: </span>';
		if (obj.status) {
			if (obj.status === "34" || obj.status === "35") {
				ret += EGB_StatusPodmiotuEwid[obj.status];
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
		} else {
			ret += '<span class="error-inline">Brak statusu</span>';
		}
		ret += "</div>";
	} else {
		ret += '<div class="error-inline">Brak małżeństwa o podanym gml id</div>';
	}
	return ret;
}

function getPodmiotGrupowy(id: string) {
	let ret =
		'<div class="cursor-pointer expanded" id="' +
		htmlIDs.iPodmiotGrupowy +
		id +
		'" onclick="showEgbFeature(this.id)"><div class="div-inline item">Podmiot grupowy:&nbsp</div>' +
		getEGBPodmiotGrupowy(id) +
		"</div>";
	return ret;
}

function getEGBPodmiotGrupowy(id: string) {
	let ret = "";
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		// nazwa
		ret += '<div class="div-inline">';
		if (obj.nazwaPelna) {
			ret += obj.nazwaPelna;
		}
		// nazwa skrócona
		if (obj.nazwaSkrocona) {
			ret += " " + obj.nazwaSkrocona;
		}
		// regon
		if (obj.regon) {
			ret += ' <span class="item">Regon: </span>' + obj.regon;
		}
		ret += "</div>";
		// status
		if (obj.status) {
			ret += '<div> <span class="item">Status: </span>';
			if (obj.status === "32" || obj.status === "33") {
				ret += EGB_StatusPodmiotuEwid[obj.status];
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
			ret += "</div>";
		} else {
			ret += '<div class="error-inline">Brak statusu</div>';
		}
		// adres
		if (obj.adresSiedziby) {
			ret += '<div><span class="item">Adres: </span>' + getAdresPodmiotuSkr(obj.adresSiedziby._attributes.href) + "</div>";
		}
		ret += '<div class="item">Skład podmiotu grupowego:</div><div>';
		// instytucja
		if (obj.instytucja) {
			if (Array.isArray(obj.instytucja)) {
				obj.instytucja.forEach((key) => {
					if (key) {
						ret += '<div class="bottom-dashed-line"><div class="div-inline item">Instytucja:&nbsp</div>' + getEGBInstytucja(key._attributes.href) + "</div>";
					}
				});
			} else {
				ret +=
					'<div class="bottom-dashed-line"><div class="div-inline item">Instytucja:&nbsp</div>' + getEGBInstytucja(obj.instytucja._attributes.href) + "</div>";
			}
		}
		// osoba
		if (obj.osobaFizyczna4) {
			if (Array.isArray(obj.osobaFizyczna4)) {
				obj.osobaFizyczna4.forEach((key) => {
					if (key) {
						ret +=
							'<div class="bottom-dashed-line"><div class="div-inline item">Osoba fizyczna:&nbsp</div>' + getEGBOsobaFizyczna(key._attributes.href) + "</div>";
					}
				});
			} else {
				ret +=
					'<div class="bottom-dashed-line"><div class="div-inline item">Osoba fizyczna:&nbsp</div>' +
					getEGBOsobaFizyczna(obj.osobaFizyczna4._attributes.href) +
					"</div>";
			}
		}
		// małżeństwo
		if (obj.malzenstwo3) {
			if (Array.isArray(obj.malzenstwo3)) {
				obj.malzenstwo3.forEach((key) => {
					if (key) {
						ret += '<div class="bottom-dashed-line"><div class="div-inline item">Małżeństwo:&nbsp</div>' + getEGBMalzenstwo(key._attributes.href) + "</div>";
					}
				});
			} else {
				ret +=
					'<div class="bottom-dashed-line"><div class="div-inline item">Małżeństwo:&nbsp</div>' + getEGBMalzenstwo(obj.malzenstwo3._attributes.href) + "</div>";
			}
		}
		ret += "</div>";
	} else {
		ret += '<div class="error-inline">Brak podmiotu grupowego o podanym gml id</div>';
	}
	return ret;
}

function getInstytucja(id: string) {
	let ret =
		'<div class="cursor-pointer expanded" id="' +
		htmlIDs.iInstytucja +
		id +
		'" onclick="showEgbFeature(this.id)"><div class="div-inline item">Instytucja:&nbsp</div>' +
		getEGBInstytucja(id) +
		"</div>";
	return ret;
}

function getEGBInstytucja(id: string) {
	let ret = "";
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		// nazwa
		ret += '<div class="div-inline">';
		if (obj.nazwaPelna == null) {
			ret += '<span class="error-inline">Brak nazwy</span>';
		} else {
			ret += obj.nazwaPelna;
		}
		// nazwa skrócona
		if (obj.nazwaSkrocona) {
			ret += " " + obj.nazwaSkrocona;
		}
		// regon
		if (obj.regon) {
			ret += ' <span class="item">Regon: </span>' + obj.regon;
		}
		ret += "</div>";
		// status
		if (obj.status) {
			ret += '<div> <span class="item">Status: </span>';
			if (Number(obj.status) >= 3 && Number(obj.status) <= 47 && obj.status !== "32" && obj.status !== "33" && obj.status !== "34" && obj.status !== "35") {
				ret += EGB_StatusPodmiotuEwid[obj.status];
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
			ret += "</div>";
		} else {
			ret += '<div class="error-inline">Brak statusu</div>';
		}
		// członek zarządu
		if (obj.status === "41") {
			if (obj.czlonekZarzaduWspolnoty) {
				let tmp2 = "";
				if (Array.isArray(obj.czlonekZarzaduWspolnoty)) {
					obj.czlonekZarzaduWspolnoty.forEach((key) => {
						if (key) {
							if (tmp2) {
								tmp2 += ", ";
							}
							tmp2 += getOsobaSkr(key._attributes.href);
						}
					});
				} else {
					tmp2 = getOsobaSkr(obj.czlonekZarzaduWspolnoty._attributes.href);
				}
				ret += '<div><span class="item">Zarząd wspólnoty: </span>' + tmp2 + "</div>";
			}
		}
		// adres instytucji
		if (obj.adresSiedziby) {
			ret += '<div><span class="item">Adres: </span>' + getAdresPodmiotuSkr(obj.adresSiedziby._attributes.href) + "</div>";
		}
	} else {
		ret += '<div class="error-inline">Brak instytucji o podanym gml id</div>';
	}
	return ret;
}

function getWspolnotaGruntowa(id: string) {
	let ret =
		'<div class="cursor-pointer expanded" id="' +
		htmlIDs.iWspolnotaGruntowa +
		id +
		'" onclick="showEgbFeature(this.id)"><div class="div-inline item">Wspólnota gruntowa:&nbsp</div>' +
		getEGBWspolnotaGruntowa(id) +
		"</div>";
	return ret;
}

function getEGBWspolnotaGruntowa(id: string) {
	let ret = "";
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		// nazwa
		if (obj.nazwa) {
			ret += '<div class="div-inline">' + obj.nazwa + "</div>";
		}
		// status
		if (obj.status) {
			ret += '<div> <span class="item">Status: </span>';
			if (obj.status === "41") {
				ret += EGB_StatusPodmiotuEwid[obj.status];
			} else {
				ret += '<span class="error-inline">Nieprawidłowa wartość</span>';
			}
			ret += "</div>";
		} else {
			ret += '<div class="error-inline">Brak statusu</div>';
		}
		// spółka zarządzająca
		if (obj.spolkaZarzadajaca) {
			ret += '<div class="div-inline item">Spółka zarządzająca:&nbsp</div>' + getEGBInstytucja(obj.spolkaZarzadajaca._attributes.href);
		}
		// osoby uprawnione
		if (obj.osobaFizycznaUprawniona) {
			ret += '<div><span class="item">Osoby uprawnione: </span>';
			let tmp2 = "";
			if (Array.isArray(obj.osobaFizycznaUprawniona)) {
				obj.osobaFizycznaUprawniona.forEach((key) => {
					if (key) {
						if (tmp2) {
							tmp2 += ", ";
						}
						tmp2 += getOsobaSkr(key._attributes.href);
					}
				});
			} else {
				tmp2 = getOsobaSkr(obj.osobaFizycznaUprawniona._attributes.href);
			}
			ret += tmp2;
			ret += "</div>";
		}
		// malzenstwa uprawnione
		if (obj.malzenstwoUprawnione) {
			ret += '<div><span class="item">Małżeństwa uprawnione: </span>';
			let tmp2 = "";
			if (Array.isArray(obj.malzenstwoUprawnione)) {
				obj.malzenstwoUprawnione.forEach((key) => {
					if (key) {
						if (tmp2) {
							tmp2 += ", ";
						}
						tmp2 += getMalzenstwoSkr(key._attributes.href);
					}
				});
			} else {
				tmp2 = getMalzenstwoSkr(obj.malzenstwoUprawnione._attributes.href);
			}
			ret += tmp2;
			ret += "</div>";
		}
		// podmioty uprawnione
		if (obj.podmiotUprawniony) {
			ret += '<div><span class="item">Podmioty uprawnione: </span>';
			let tmp2 = "";
			if (Array.isArray(obj.podmiotUprawniony)) {
				obj.podmiotUprawniony.forEach((key) => {
					if (key) {
						if (tmp2) {
							tmp2 += ", ";
						}
						tmp2 += getInstytucjaSkr(key._attributes.href);
					}
				});
			} else {
				tmp2 = getInstytucjaSkr(obj.podmiotUprawniony._attributes.href);
			}
			ret += tmp2;
			ret += "</div>";
		}
	} else {
		ret += '<div class="error-inline">Brak wspólnoty gruntowej o podanym gml id</div>';
	}
	return ret;
}

export function getWlasnosciWladania(id: string) {
	let ret = "";
	const wlasnosci = getWlasnosci(id);
	const wladania = getWladania(id);
	if (wlasnosci || wladania) {
		if (wlasnosci) {
			ret += '<div class="item-bold">Udział we własności:</div>';
			ret += '<div class="grid-container-owners">';
			ret += wlasnosci;
			ret += "</div>";
		}
		if (wladania) {
			ret += '<div class="item-bold">Udział we władaniu:</div>';
			ret += '<div class="grid-container-owners">';
			ret += wladania;
			ret += "</div>";
		}
	} else {
		ret = '<div class="error">Brak udziałów</div>';
	}
	return ret;
}

export function getPodmiotSkr(id: string) {
	let ret = "";
	if (egbFeatures.osobyFizyczne.has(id)) {
		ret =
			'<span class="cursor-pointer" id="' +
			htmlIDs.iOsobaFizyczna +
			id +
			'" onclick="showEgbFeature(this.id)">' +
			getOsobaSkr(id) +
			" (osoba fizyczna)" +
			"</span>";
	} else if (egbFeatures.malzenstwa.has(id)) {
		ret =
			'<span class="cursor-pointer" id="' +
			htmlIDs.iMalzenstwo +
			id +
			'" onclick="showEgbFeature(this.id)">' +
			getMalzenstwoSkr(id) +
			" (małżeństwo)" +
			"</span>";
	} else if (egbFeatures.podmiotyGrupowe.has(id)) {
		ret =
			'<span class="cursor-pointer" id="' +
			htmlIDs.iPodmiotGrupowy +
			id +
			'" onclick="showEgbFeature(this.id)">' +
			getPodmiotGrupowySkr(id) +
			" (podmiot grupowy)" +
			"</span>";
	} else if (egbFeatures.instytucje.has(id)) {
		ret =
			'<span class="cursor-pointer" id="' +
			htmlIDs.iInstytucja +
			id +
			'" onclick="showEgbFeature(this.id)">' +
			getInstytucjaSkr(id) +
			" (instytucja)" +
			"</span>";
	} else if (egbFeatures.wspolnotyGruntowe.has(id)) {
		ret =
			'<span class="cursor-pointer" id="' +
			htmlIDs.iWspolnotaGruntowa +
			id +
			'" onclick="showEgbFeature(this.id)">' +
			getWspolnotaGruntowaSkr(id) +
			" (wspólnota gruntowa)" +
			"</span>";
	}
	return ret;
}

function getIdJR(obj: EGB_JednostkaRejestrowaGruntowType | EGB_JednostkaRejestrowaBudynkowType | EGB_JednostkaRejestrowaLokaliType | undefined) {
	let ret = "";
	if (obj) {
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej.split(".").pop();
		} else {
			ret += '<span class="error-inline">Brak id jednostki rejestrowej</span>';
		}
	} else {
		ret += '<span class="error-inline">Brak JRG o podanym gml id</span>';
	}
	return ret;
}

export function getPrzedmiotSkr(id: string) {
	let ret = "";
	if (egbFeatures.jednostkiRejestroweGruntow.has(id)) {
		return getIdJR(egbFeatures.jednostkiRejestroweGruntow.get(id));
	} else if (egbFeatures.jednostkiRejestroweBudynkow.has(id)) {
		return getIdJR(egbFeatures.jednostkiRejestroweBudynkow.get(id));
	} else if (egbFeatures.jednostkiRejestroweLokali.has(id)) {
		return getIdJR(egbFeatures.jednostkiRejestroweLokali.get(id));
	}
	return ret;
}
