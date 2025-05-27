import { egbFeatures } from "../egib/features";
import { tableGetAdresPodmiotu, tableGetWartoscUdzialu } from "../table/table";
import { tableGetRodzajWladania } from "../table/udzial-we-wladaniu";
import { tableGetRodzajWlasnosci } from "../table/udzial-we-wlasnosci";

export function pdfGetOE(obj: EGB_ObrebEwidencyjnyType) {
	let ret = "";
	if (obj.idObrebu) {
		ret += obj.idObrebu.split(".")[1];
	}
	if (obj.nazwaWlasna) {
		ret += " (" + obj.nazwaWlasna + ")";
	}
	return ret;
}

export function pdfGetJE(obj: EGB_ObrebEwidencyjnyType) {
	let ret = "";
	if (obj.lokalizacjaObrebu) {
		const objJE = egbFeatures.jednostkiEwidencyjne.get(obj.lokalizacjaObrebu._attributes.href);
		if (objJE) {
			if (objJE.idJednostkiEwid) {
				ret += objJE.idJednostkiEwid;
			}
			if (objJE.nazwaWlasna) {
				ret += " (" + objJE.nazwaWlasna + ")";
			}
		}
	}
	return ret;
}

export function pdfGetWlasnosciWladania(id: string) {
	let ret: string[][] = [];
	ret.push(...pdfGetWlasnosci(id));
	ret.push(...pdfGetWladania(id));
	return ret;
}

function pdfGetWlasnosci(id: string) {
	let ret: string[][] = [];
	for (const obj of egbFeatures.udzialyWeWlasnosci.values()) {
		if (obj.przedmiotUdzialuWlasnosci) {
			if (obj.przedmiotUdzialuWlasnosci._attributes?.href === id) {
				ret.push(pdfGetPodmiotyWlasnosci(obj));
			}
		}
	}
	return ret;
}

function pdfGetWladania(id: string) {
	let ret: string[][] = [];
	for (const obj of egbFeatures.udzialyWeWladaniu.values()) {
		if (obj.przedmiotUdzialuWladania) {
			if (obj.przedmiotUdzialuWladania._attributes?.href === id) {
				ret.push(pdfGetPodmiotyWladania(obj));
			}
		}
	}
	return ret;
}

function pdfGetPodmiotyWlasnosci(obj: EGB_UdzialWeWlasnosciType) {
	let udzial = "";
	let podmiot = "";
	udzial = tableGetWartoscUdzialu(obj) + " (" + tableGetRodzajWlasnosci(obj) + ")";
	if (obj.podmiotUdzialuWlasnosci) {
		podmiot = pdfGetPodmiot(obj.podmiotUdzialuWlasnosci._attributes.href);
	}
	return [udzial, podmiot];
}

function pdfGetPodmiotyWladania(obj: EGB_UdzialWeWladaniuType) {
	let udzial = "";
	let podmiot = "";
	udzial = tableGetWartoscUdzialu(obj) + " (" + tableGetRodzajWladania(obj) + ")";
	if (obj.podmiotUdzialuWeWladaniu) {
		podmiot = pdfGetPodmiot(obj.podmiotUdzialuWeWladaniu._attributes.href);
	}
	return [udzial, podmiot];
}

function pdfGetPodmiot(id: string) {
	let ret = "";
	if (egbFeatures.osobyFizyczne.has(id)) {
		ret += pdfGetOsoba(id);
	} else if (egbFeatures.malzenstwa.has(id)) {
		ret += pdfGetMalzenstwo(id);
	} else if (egbFeatures.podmiotyGrupowe.has(id)) {
		ret += pdfGetPodmiotGrupowy(id);
	} else if (egbFeatures.instytucje.has(id)) {
		ret += pdfGetInstytucja(id);
	} else if (egbFeatures.wspolnotyGruntowe.has(id)) {
		ret += pdfGetWspolnotaGruntowa(id);
	}
	return ret;
}

function pdfGetOsoba(id: string) {
	let ret: string[] = [];
	let tmp: string[] = [];
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		if (obj.pierwszeImie) {
			ret.push(obj.pierwszeImie);
		}
		if (obj.drugieImie) {
			ret.push(obj.drugieImie);
		}
		if (obj.pierwszyCzlonNazwiska) {
			tmp.push(obj.pierwszyCzlonNazwiska);
		}
		if (obj.drugiCzlonNazwiska) {
			tmp.push(obj.drugiCzlonNazwiska);
		}
		ret.push(tmp.join("-"));
		tmp = [];
		if (obj.imieOjca || obj.imieMatki) {
			if (obj.imieOjca) {
				tmp.push(obj.imieOjca);
			}
			if (obj.imieMatki) {
				tmp.push(obj.imieMatki);
			}
			ret.push("(" + tmp.join(", ") + ")");
		}
		if (obj.pesel) {
			ret.push("\r\nPesel: " + obj.pesel);
		}
		if (obj.adresZameldowania) {
			ret.push("\r\n" + tableGetAdresPodmiotu(obj.adresZameldowania._attributes.href));
		}
	}
	return ret.join(" ");
}

function pdfGetMalzenstwo(id: string) {
	let ret = [];
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		if (obj.osobaFizyczna2) {
			ret.push(pdfGetOsoba(obj.osobaFizyczna2._attributes.href));
		}
		if (obj.osobaFizyczna3) {
			ret.push(pdfGetOsoba(obj.osobaFizyczna3._attributes.href));
		}
	}
	return ret.join("\r\n");
}

function pdfGetInstytucja(id: string) {
	let ret = "";
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		if (obj.nazwaPelna) {
			ret += obj.nazwaPelna;
		}
		if (obj.regon) {
			ret += "\r\nRegon: " + obj.regon;
		}
		if (obj.adresSiedziby) {
			ret += "\r\n" + tableGetAdresPodmiotu(obj.adresSiedziby._attributes.href);
		}
	}
	return ret;
}

function pdfGetPodmiotGrupowy(id: string) {
	let ret = "";
	let tmp: string[] = [];
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		if (obj.nazwaPelna) {
			ret += obj.nazwaPelna;
		}
		if (obj.regon) {
			ret += "\r\nRegon: " + obj.regon;
		}
		if (obj.adresSiedziby) {
			ret += "\r\n" + tableGetAdresPodmiotu(obj.adresSiedziby._attributes.href);
		}
		ret += "\r\nSkład podmiotu grupowego:";
		if (obj.instytucja) {
			ret += "\r\nInstytucje: ";
			if (Array.isArray(obj.instytucja)) {
				obj.instytucja.forEach((key) => {
					if (key) {
						tmp.push(pdfGetInstytucja(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetInstytucja(obj.instytucja._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
		if (obj.osobaFizyczna4) {
			tmp = [];
			ret += "\r\nOsoby: ";
			if (Array.isArray(obj.osobaFizyczna4)) {
				obj.osobaFizyczna4.forEach((key) => {
					if (key) {
						tmp.push(pdfGetOsoba(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetOsoba(obj.osobaFizyczna4._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
		if (obj.malzenstwo3) {
			tmp = [];
			ret += "\r\nMałżeństwa: ";
			if (Array.isArray(obj.malzenstwo3)) {
				obj.malzenstwo3.forEach((key) => {
					if (key) {
						tmp.push(pdfGetMalzenstwo(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetMalzenstwo(obj.malzenstwo3._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
	}
	return ret;
}

function pdfGetWspolnotaGruntowa(id: string) {
	let ret = "";
	let tmp: string[] = [];
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		if (obj.nazwa) {
			ret += obj.nazwa;
		}
		if (obj.spolkaZarzadajaca) {
			ret += "\r\nSpółka zarządzająca: " + pdfGetInstytucja(obj.spolkaZarzadajaca._attributes.href);
		}
		if (obj.osobaFizycznaUprawniona) {
			ret += "\r\nOsoby uprawnione: ";
			if (Array.isArray(obj.osobaFizycznaUprawniona)) {
				obj.osobaFizycznaUprawniona.forEach((key) => {
					if (key) {
						tmp.push(pdfGetOsoba(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetOsoba(obj.osobaFizycznaUprawniona._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
		if (obj.malzenstwoUprawnione) {
			ret += "\r\nMałżeństwa uprawnione: ";
			tmp = [];
			if (Array.isArray(obj.malzenstwoUprawnione)) {
				obj.malzenstwoUprawnione.forEach((key) => {
					if (key) {
						tmp.push(pdfGetMalzenstwo(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetMalzenstwo(obj.malzenstwoUprawnione._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
		if (obj.podmiotUprawniony) {
			ret += "\r\nInstytucje uprawnione: ";
			tmp = [];
			if (Array.isArray(obj.podmiotUprawniony)) {
				obj.podmiotUprawniony.forEach((key) => {
					if (key) {
						tmp.push(pdfGetInstytucja(key._attributes.href));
					}
				});
			} else {
				tmp.push(pdfGetInstytucja(obj.podmiotUprawniony._attributes.href));
			}
			ret += tmp.join("\r\n");
		}
	}
	return ret;
}
