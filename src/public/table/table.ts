import Clusterize from "clusterize.js";
import { egbFeatures, htmlIDs, keep, showEgbFeatureFromTable } from "../egib/features";
import { tableBlokiBudynku } from "./blok-budynku";
import { tableBudynki } from "./budynek";
import { tableDziałkiEwidencyjne } from "./dzialka-ewidencyjna";
import { tableInstytucje } from "./instytucja";
import { tableJednostkiEwidencyjne } from "./jednostka-ewidencyjna";
import { tableJRB } from "./JRB";
import { tableJRG } from "./JRG";
import { tableJRL } from "./JRL";
import { tableKonturyKlasyfikacyjne } from "./kontur-klasyfikacyjny";
import { tableKonturyUzytkuGruntowego } from "./kontur-uzytku-gruntowego";
import { tableLokale } from "./lokal";
import { tableMalzenstwa } from "./malzenstwo";
import { tableObiektyZwiazanyZBudynkiem } from "./obiekt-trwale-zwiazany-z-budynkiem";
import { tableObrebyEwidencyjne } from "./obreb-ewidencyjny";
import { tableOsobyFizyczne } from "./osoba-fizyczna";
import { tablePomieszczeniaPrzynależne } from "./pomieszczenie-przynalezne-do-lokalu";
import { tablePunktyGraniczne } from "./punkt-graniczny";
import { tablePodmiotyGrupowe } from "./podmiot-grupowy";
import { tableWspolnotyGruntowe } from "./wspolnota-gruntowa";
import { tableAdresyNieruchomosci } from "./adres-nieruchomosci";
import { tableAdresyPodmiotu } from "./adres-podmiotu";
import { tableOperatyTechniczne } from "./operat";
import { tableZmiany } from "./zmiana";
import { tableDokumenty } from "./dokument";
import { tableUdzialyWeWlasnosci } from "./udzial-we-wlasnosci";
import { tableUdzialyWeWladaniu } from "./udzial-we-wladaniu";

(document.getElementById("table-filter") as HTMLInputElement).value = "";
(document.getElementById("table-filter-form") as HTMLInputElement).addEventListener("submit", (e) => {
	e.preventDefault();
	createTable();
});

let clusterize = new Clusterize({
	rows: [],
	scrollId: "scrollArea",
	contentId: "contentArea",
	show_no_data_row: false,
});

export function generateSelectOptions() {
	const selectFeatures = document.getElementById("select-features") as HTMLSelectElement;
	selectFeatures.addEventListener("change", () => {
		(document.getElementById("table-filter") as HTMLInputElement).value = "";
		createTable();
	});

	if (egbFeatures.jednostkiEwidencyjne.size) {
		selectFeatures.add(new Option("Jednostki ewidencyjne", htmlIDs.iJednostkaEwidencyjna));
	}
	if (egbFeatures.obrebyEwidencyjne.size) {
		selectFeatures.add(new Option("Obręby ewidencyjne", htmlIDs.iObrebEwidencyjny));
	}
	if (egbFeatures.dzialkiEwidencyjne.size) {
		selectFeatures.add(new Option("Działki ewidencyjne", htmlIDs.iDzialkaEwidencyjna));
	}
	if (egbFeatures.konturyUzytkuGruntowego.size) {
		selectFeatures.add(new Option("Kontury użytku gruntowego", htmlIDs.iKonturUzytkuGruntowego));
	}
	if (egbFeatures.konturyKlasyfikacyjne.size) {
		selectFeatures.add(new Option("Kontury klasyfikacyjne", htmlIDs.iKonturKlasyfikacyjny));
	}
	if (egbFeatures.budynki.size) {
		selectFeatures.add(new Option("Budynki", htmlIDs.iBudynek));
	}
	if (egbFeatures.blokiBudynku.size) {
		selectFeatures.add(new Option("Bloki budynku", htmlIDs.iBlokBudynku));
	}
	if (egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.size) {
		selectFeatures.add(new Option("Obiekty trwale związane z budynkiem", htmlIDs.iObiektTrwaleZwiazanyZBudynkiem));
	}
	if (egbFeatures.lokaleSamodzielne.size) {
		selectFeatures.add(new Option("Lokale samodzielne", htmlIDs.iLokalSamodzielny));
	}
	if (egbFeatures.pomieszczeniaPrzynalezneDoLokalu.size) {
		selectFeatures.add(new Option("Pomieszczenia przynależne do lokalu", htmlIDs.iPomieszczeniePrzynalezneDoLokalu));
	}
	if (egbFeatures.punktyGraniczne.size) {
		selectFeatures.add(new Option("Punkty graniczne", htmlIDs.iPunktGraniczny));
	}
	if (egbFeatures.jednostkiRejestroweGruntow.size) {
		selectFeatures.add(new Option("Jednostki rejestrowe gruntów", htmlIDs.iJednostkaRejestrowaGruntow));
	}
	if (egbFeatures.jednostkiRejestroweBudynkow.size) {
		selectFeatures.add(new Option("Jednostki rejestrowe budynków", htmlIDs.iJednostkaRejestrowaBudynkow));
	}
	if (egbFeatures.jednostkiRejestroweLokali.size) {
		selectFeatures.add(new Option("Jednostki rejestrowe lokali", htmlIDs.iJednostkaRejestrowaLokali));
	}
	if (egbFeatures.osobyFizyczne.size) {
		selectFeatures.add(new Option("Osoby fizyczne", htmlIDs.iOsobaFizyczna));
	}
	if (egbFeatures.malzenstwa.size) {
		selectFeatures.add(new Option("Małżeństwa", htmlIDs.iMalzenstwo));
	}
	if (egbFeatures.instytucje.size) {
		selectFeatures.add(new Option("Instytucje", htmlIDs.iInstytucja));
	}
	if (egbFeatures.podmiotyGrupowe.size) {
		selectFeatures.add(new Option("Podmioty grupowe", htmlIDs.iPodmiotGrupowy));
	}
	if (egbFeatures.wspolnotyGruntowe.size) {
		selectFeatures.add(new Option("Wspólnoty gruntowe", htmlIDs.iWspolnotaGruntowa));
	}
	if (egbFeatures.adresyNieruchomosci.size) {
		selectFeatures.add(new Option("Adresy nieruchomości", htmlIDs.iAdresNieruchomosci));
	}
	if (egbFeatures.adresyPodmiotu.size) {
		selectFeatures.add(new Option("Adresy podmiotu", htmlIDs.iAdresPodmiotu));
	}
	if (egbFeatures.operatyTechniczne.size) {
		selectFeatures.add(new Option("Operaty techniczne", htmlIDs.iOperatTechniczny));
	}
	if (egbFeatures.zmiany.size) {
		selectFeatures.add(new Option("Zmiany", htmlIDs.iZmiana));
	}
	if (egbFeatures.dokumenty.size) {
		selectFeatures.add(new Option("Dokumenty", htmlIDs.iDokument));
	}
	if (egbFeatures.udzialyWeWlasnosci.size) {
		selectFeatures.add(new Option("Udziały we własności", htmlIDs.iUdzialWeWlasnosci));
	}
	if (egbFeatures.udzialyWeWladaniu.size) {
		selectFeatures.add(new Option("Udziały we władaniu", htmlIDs.iUdzialWeWladaniu));
	}
	// if (egbFeatures.prezentacjeGraficzne.size) {
	// 	selectFeatures.add(new Option("Prezentacje graficzne", htmlIDs.iPrezentacjaGraficzna));
	// }
}

export function tableShowEgbFeature(id: string) {
	if (window.getSelection()?.toString().length === 0) {
		const tableDialog = document.getElementById("table-dialog") as HTMLDialogElement;
		tableDialog.close();
		showEgbFeatureFromTable(id);
	}
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
keep(tableShowEgbFeature);
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function createTable() {
	let data: string[] = [];
	clusterize.clear();
	let tableHead = document.getElementById("clusterize-thead");
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML = "";
	}
	if (tableHead) {
		tableHead.innerHTML = "";
	}
	const feature = (document.getElementById("select-features") as HTMLSelectElement).value;
	switch (feature) {
		case htmlIDs.iJednostkaEwidencyjna: {
			data = tableJednostkiEwidencyjne();
			break;
		}
		case htmlIDs.iObrebEwidencyjny: {
			data = tableObrebyEwidencyjne();
			break;
		}
		case htmlIDs.iDzialkaEwidencyjna: {
			data = tableDziałkiEwidencyjne();
			break;
		}
		case htmlIDs.iKonturUzytkuGruntowego: {
			data = tableKonturyUzytkuGruntowego();
			break;
		}
		case htmlIDs.iKonturKlasyfikacyjny: {
			data = tableKonturyKlasyfikacyjne();
			break;
		}
		case htmlIDs.iBudynek: {
			data = tableBudynki();
			break;
		}
		case htmlIDs.iBlokBudynku: {
			data = tableBlokiBudynku();
			break;
		}
		case htmlIDs.iObiektTrwaleZwiazanyZBudynkiem: {
			data = tableObiektyZwiazanyZBudynkiem();
			break;
		}
		case htmlIDs.iLokalSamodzielny: {
			data = tableLokale();
			break;
		}
		case htmlIDs.iPomieszczeniePrzynalezneDoLokalu: {
			data = tablePomieszczeniaPrzynależne();
			break;
		}
		case htmlIDs.iPunktGraniczny: {
			data = tablePunktyGraniczne();
			break;
		}
		case htmlIDs.iJednostkaRejestrowaGruntow: {
			data = tableJRG();
			break;
		}
		case htmlIDs.iJednostkaRejestrowaBudynkow: {
			data = tableJRB();
			break;
		}
		case htmlIDs.iJednostkaRejestrowaLokali: {
			data = tableJRL();
			break;
		}
		case htmlIDs.iOsobaFizyczna: {
			data = tableOsobyFizyczne();
			break;
		}
		case htmlIDs.iMalzenstwo: {
			data = tableMalzenstwa();
			break;
		}
		case htmlIDs.iInstytucja: {
			data = tableInstytucje();
			break;
		}
		case htmlIDs.iPodmiotGrupowy: {
			data = tablePodmiotyGrupowe();
			break;
		}
		case htmlIDs.iWspolnotaGruntowa: {
			data = tableWspolnotyGruntowe();
			break;
		}
		case htmlIDs.iAdresNieruchomosci: {
			data = tableAdresyNieruchomosci();
			break;
		}
		case htmlIDs.iAdresPodmiotu: {
			data = tableAdresyPodmiotu();
			break;
		}
		case htmlIDs.iOperatTechniczny: {
			data = tableOperatyTechniczne();
			break;
		}
		case htmlIDs.iZmiana: {
			data = tableZmiany();
			break;
		}
		case htmlIDs.iDokument: {
			data = tableDokumenty();
			break;
		}
		case htmlIDs.iUdzialWeWlasnosci: {
			data = tableUdzialyWeWlasnosci();
			break;
		}
		case htmlIDs.iUdzialWeWladaniu: {
			data = tableUdzialyWeWladaniu();
			break;
		}
	}
	clusterize.append(data);
}

export function tableGetArea(obj: AreaType) {
	let ret = obj.value ? obj.value.replace(".", ",") : "";
	ret += obj._attributes.uom ? " " + obj._attributes.uom : "";
	return ret;
}

export function tableGetAdresNieruchomosci(id: string) {
	let ret = "";
	const obj = egbFeatures.adresyNieruchomosci.get(id);
	if (obj) {
		if (obj.nazwaMiejscowosci) {
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
		ret = "";
	}
	return ret;
}

export function tableGetIdJRG(id: string) {
	const obj = egbFeatures.jednostkiRejestroweGruntow.get(id);
	if (obj) {
		if (obj.idJednostkiRejestrowej) {
			const ret = obj.idJednostkiRejestrowej.split(".").pop();
			if (ret) {
				return ret;
			}
		}
	}
	return "";
}

export function tableGetAdresPodmiotu(id: string) {
	let ret = "";
	const obj = egbFeatures.adresyPodmiotu.get(id);
	if (obj) {
		if (obj.kraj) {
			ret += obj.kraj + " ";
		}
		if (obj.kodPocztowy) {
			ret += obj.kodPocztowy + " ";
		}
		if (obj.miejscowosc) {
			ret += obj.miejscowosc + " ";
		}
		if (obj.ulica) {
			ret += obj.ulica + " ";
		}
		if (obj.numerPorzadkowy) {
			ret += obj.numerPorzadkowy;
		}
		if (obj.numerLokalu) {
			ret += "/" + obj.numerLokalu;
		}
	}
	return ret;
}

export function tableGetOsobaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		if (obj.pierwszeImie) {
			ret += obj.pierwszeImie + " ";
		}
		//let tmp = obj.drugieImie;
		//if (tmp) {
		//	ret += tmp + " ";
		//}
		if (obj.pierwszyCzlonNazwiska) {
			ret += obj.pierwszyCzlonNazwiska;
		}
		if (obj.drugiCzlonNazwiska) {
			ret += "-" + obj.drugiCzlonNazwiska;
		}
	}
	return ret;
}

export function tableGetMalzenstwoSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		if (obj.osobaFizyczna2) {
			ret += tableGetOsobaSkr(obj.osobaFizyczna2._attributes.href);
		}
		ret += " ";
		if (obj.osobaFizyczna3) {
			ret += tableGetOsobaSkr(obj.osobaFizyczna3._attributes.href);
		}
	}
	return ret;
}

export function tableGetInstytucjaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		if (obj.nazwaPelna) {
			ret += obj.nazwaPelna;
		}
	}
	return ret;
}

function tableGetPodmiotGrupowySkr(id: string) {
	let ret = "";
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		if (obj.nazwaPelna) {
			ret = obj.nazwaPelna;
		} else {
			ret = "Podmiot grupowy";
		}
	}
	return ret;
}

function tableGetWspolnotaGruntowaSkr(id: string) {
	let ret = "";
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		if (obj.nazwa) {
			ret = obj.nazwa;
		} else {
			ret = "Wspólnota gruntowa";
		}
	}
	return ret;
}

export function tableGetDokumentWlasnosci(obj: EGB_DzialkaEwidencyjnaType | EGB_BudynekType | EGB_LokalSamodzielnyType) {
	let ret = "";
	if (obj.dokumentWlasnosci) {
		if (Array.isArray(obj.dokumentWlasnosci)) {
			ret = obj.dokumentWlasnosci.join(", ");
		} else ret = obj.dokumentWlasnosci;
	}
	return ret;
}

export function tableGetNumerKW(obj: EGB_DzialkaEwidencyjnaType | EGB_BudynekType | EGB_LokalSamodzielnyType) {
	let ret = "";
	if (obj.numerKW) {
		if (Array.isArray(obj.numerKW)) {
			ret = obj.numerKW.join(", ");
		} else ret = obj.numerKW;
	}
	return ret;
}

export function tableGetIdBudynku(id: string) {
	let ret = "";
	const obj = egbFeatures.budynki.get(id);
	if (obj) {
		if (obj.idBudynku) {
			ret = obj.idBudynku;
		}
	}
	return ret;
}

export function tableGetOE(id: string) {
	let ret = "";
	const obj = egbFeatures.obrebyEwidencyjne.get(id);
	if (obj) {
		//if (obj.lokalizacjaObrebu) {
		//	const objJE = egbFeatures.jednostkiEwidencyjne.get(obj.lokalizacjaObrebu._attributes.href);
		//	if (objJE) {
		//		ret += "Jednostka: " + (objJE.nazwaWlasna ? objJE.nazwaWlasna : "");
		//	}
		//}
		//ret += " Obręb: " + (obj.nazwaWlasna ? obj.nazwaWlasna : "");
		if (obj.nazwaWlasna) {
			ret = obj.nazwaWlasna;
		}
	}
	return ret;
}

export function tableGetPodmiotSkr(id: string) {
	let ret = "";
	if (egbFeatures.osobyFizyczne.has(id)) {
		ret += tableGetOsobaSkr(id);
	} else if (egbFeatures.malzenstwa.has(id)) {
		ret += tableGetMalzenstwoSkr(id);
	} else if (egbFeatures.podmiotyGrupowe.has(id)) {
		ret += tableGetPodmiotGrupowySkr(id);
	} else if (egbFeatures.instytucje.has(id)) {
		ret += tableGetInstytucjaSkr(id);
	} else if (egbFeatures.wspolnotyGruntowe.has(id)) {
		ret += tableGetWspolnotaGruntowaSkr(id);
	}
	return ret;
}

function tableGetIdJR(obj: EGB_JednostkaRejestrowaGruntowType | EGB_JednostkaRejestrowaBudynkowType | EGB_JednostkaRejestrowaLokaliType | undefined) {
	let ret = "";
	if (obj) {
		if (obj.idJednostkiRejestrowej) {
			ret += obj.idJednostkiRejestrowej;
		}
	}
	return ret;
}

export function tableGetPrzedmiotSkr(id: string) {
	let ret = "";
	if (egbFeatures.jednostkiRejestroweGruntow.has(id)) {
		return tableGetIdJR(egbFeatures.jednostkiRejestroweGruntow.get(id));
	} else if (egbFeatures.jednostkiRejestroweBudynkow.has(id)) {
		return tableGetIdJR(egbFeatures.jednostkiRejestroweBudynkow.get(id));
	} else if (egbFeatures.jednostkiRejestroweLokali.has(id)) {
		return tableGetIdJR(egbFeatures.jednostkiRejestroweLokali.get(id));
	}
	return ret;
}

export function tableGetWartoscUdzialu(obj: EGB_UdzialWeWlasnosciType | EGB_UdzialWeWladaniuType) {
	let ret = obj.licznikUlamkaOkreslajacegoWartoscUdzialu ? obj.licznikUlamkaOkreslajacegoWartoscUdzialu : "";
	ret += "/";
	ret += obj.mianownikUlamkaOkreslajacegoWartoscUdzialu ? obj.mianownikUlamkaOkreslajacegoWartoscUdzialu : "";
	return ret;
}
