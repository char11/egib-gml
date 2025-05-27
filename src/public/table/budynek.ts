import { EGB_RodzajWgKST } from "../egib/budynki";
import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetAdresNieruchomosci, tableGetArea, tableGetDokumentWlasnosci, tableGetNumerKW } from "./table";

function tableGetId(obj: EGB_BudynekType) {
	return obj.idBudynku ? obj.idBudynku : "";
}

export function tableGetRodzajBudynku(obj: EGB_BudynekType) {
	let ret = "";
	if (obj.rodzajWgKST) {
		const rodzajWgKST = EGB_RodzajWgKST[obj.rodzajWgKST];
		if (rodzajWgKST) {
			ret += rodzajWgKST;
		}
	}
	return ret;
}

export function tableGetLiczbaKondygnacji(obj: EGB_BudynekType) {
	let ret = obj.liczbaKondygnacjiNadziemnych ? obj.liczbaKondygnacjiNadziemnych : "";
	ret += "/";
	ret += obj.liczbaKondygnacjiPodziemnych ? obj.liczbaKondygnacjiPodziemnych : "";
	return ret;
}

function tableGetPowierzchniaZabudowy(obj: EGB_BudynekType) {
	return obj.powZabudowy ? tableGetArea(obj.powZabudowy) : "";
}

function tableGetPowierzchniaLokaliWyodrebnionych(obj: EGB_BudynekType) {
	return obj.lacznaPowUzytkowaLokaliWyodrebnionych ? tableGetArea(obj.lacznaPowUzytkowaLokaliWyodrebnionych) : "";
}

function tableGetPowierzchniaLokaliNiewyodrebnionych(obj: EGB_BudynekType) {
	return obj.lacznaPowUzytkowaLokaliNiewyodrebnionych ? tableGetArea(obj.lacznaPowUzytkowaLokaliNiewyodrebnionych) : "";
}

function tableGetPowierzchniaPomieszczenPrzynaleznych(obj: EGB_BudynekType) {
	return obj.lacznaPowUzytkowaPomieszczenPrzynaleznych ? tableGetArea(obj.lacznaPowUzytkowaPomieszczenPrzynaleznych) : "";
}

export function tableGetAdresBudynku(obj: EGB_BudynekType) {
	let ret: string[] = [];

	if (obj.adresBudynku) {
		if (Array.isArray(obj.adresBudynku)) {
			obj.adresBudynku.forEach((key) => {
				if (key) {
					ret.push(tableGetAdresNieruchomosci(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetAdresNieruchomosci(obj.adresBudynku._attributes.href));
		}
	}
	return ret.join(", ");
}

export function tableGetIDDzialki(id: string) {
	let ret = "";
	const obj = egbFeatures.dzialkiEwidencyjne.get(id);
	if (obj) {
		if (obj.idDzialki) {
			ret = obj.idDzialki;
		}
	}
	return ret;
}

function tableGetDzialka(obj: EGB_BudynekType) {
	let ret: string[] = [];

	if (obj.dzialkaZabudowana) {
		if (Array.isArray(obj.dzialkaZabudowana)) {
			obj.dzialkaZabudowana.forEach((key) => {
				if (key) {
					ret.push(tableGetIDDzialki(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetIDDzialki(obj.dzialkaZabudowana._attributes.href));
		}
	}
	return ret.join(", ");
}

function tableGetJRB(obj: EGB_BudynekType) {
	let ret = "";
	if (obj.JRBdlaBudynku) {
		const objJe = egbFeatures.jednostkiRejestroweBudynkow.get(obj.JRBdlaBudynku._attributes.href);
		if (objJe) {
			if (objJe.idJednostkiRejestrowej) {
				ret = objJe.idJednostkiRejestrowej;
			}
		}
	}
	return ret;
}

export function tableBudynki() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Identyfikator" +
			"</th><th>" +
			"Rodzaj" +
			"</th><th>" +
			"Liczba kondygnacji (n/p)" +
			"</th><th>" +
			"Pow. zabudowy" +
			"</th><th>" +
			"Pow. lok. wyodrębnionych" +
			"</th><th>" +
			"Pow. lok. niewyodrębnionych" +
			"</th><th>" +
			"Pow. pom. przynależnych" +
			"</th><th>" +
			"Dokument własności" +
			"</th><th>" +
			"KW" +
			"</th><th>" +
			"Działka" +
			"</th><th>" +
			"Adres" +
			"</th><th>" +
			"JRB" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 12%;">' +
			'<col span="1" style="width: 8%;">' +
			'<col span="1" style="width: 4%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 6%;">' +
			'<col span="1" style="width: 7%;">' +
			'<col span="1" style="width: 6%;">' +
			'<col span="1" style="width: 12%;">' +
			'<col span="1" style="width: 12%;">' +
			'<col span="1" style="width: 8%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;"></colgroup>';
	}
	for (const obj of egbFeatures.budynki.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetRodzajBudynku(obj);
		const td3 = tableGetLiczbaKondygnacji(obj);
		const td4 = tableGetPowierzchniaZabudowy(obj);
		const td5 = tableGetPowierzchniaLokaliWyodrebnionych(obj);
		const td6 = tableGetPowierzchniaLokaliNiewyodrebnionych(obj);
		const td7 = tableGetPowierzchniaPomieszczenPrzynaleznych(obj);
		const td8 = tableGetDokumentWlasnosci(obj);
		const td9 = tableGetNumerKW(obj);
		const td10 = tableGetDzialka(obj);
		const td11 = tableGetAdresBudynku(obj);
		const td12 = tableGetJRB(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter) ||
			td6.toLowerCase().includes(filter) ||
			td7.toLowerCase().includes(filter) ||
			td8.toLowerCase().includes(filter) ||
			td9.toLowerCase().includes(filter) ||
			td10.toLowerCase().includes(filter) ||
			td11.toLowerCase().includes(filter) ||
			td12.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iBudynek +
					obj._attributes.id +
					'" onclick="tableShowEgbFeature(this.id)">' +
					"<td>" +
					td1 +
					"</td><td>" +
					td2 +
					"</td><td>" +
					td3 +
					"</td><td>" +
					td4 +
					"</td><td>" +
					td5 +
					"</td><td>" +
					td6 +
					"</td><td>" +
					td7 +
					"</td><td>" +
					td8 +
					"</td><td>" +
					td9 +
					"</td><td>" +
					td10 +
					"</td><td>" +
					td11 +
					"</td><td>" +
					td12 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
