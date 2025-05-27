import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_RodzajLokalu } from "../egib/lokale";
import { EGB_RodzajPomieszczenia } from "../egib/pomieszczenia-przynalezne-do-lokalu";
import { tableGetAdresNieruchomosci, tableGetArea, tableGetDokumentWlasnosci, tableGetIdBudynku, tableGetNumerKW } from "./table";

function tableGetId(obj: EGB_LokalSamodzielnyType) {
	return obj.idLokalu ? obj.idLokalu : "";
}

function tableGetNumerPorzadkowy(obj: EGB_LokalSamodzielnyType) {
	return obj.numerPorzadkowyLokalu ? obj.numerPorzadkowyLokalu : "";
}

export function tableGetRodzajLokalu(obj: EGB_LokalSamodzielnyType) {
	let ret = "";
	if (obj.rodzajLokalu) {
		const rodzajLokalu = EGB_RodzajLokalu[obj.rodzajLokalu];
		if (rodzajLokalu) {
			ret += rodzajLokalu;
		}
	}
	return ret;
}

export function tableGetKondygnacja(obj: EGB_LokalSamodzielnyType) {
	return obj.nrKondygnacji ? obj.nrKondygnacji : "";
}

export function tableGetPowierzchnia(obj: EGB_LokalSamodzielnyType) {
	return obj.powUzytkowaLokalu ? tableGetArea(obj.powUzytkowaLokalu) : "";
}

export function tableGetLiczbaPomieszczenPrzynaleznych(obj: EGB_LokalSamodzielnyType) {
	return obj.liczbaPomieszczenPrzynaleznych ? obj.liczbaPomieszczenPrzynaleznych : "";
}

export function tableGetPowPomieszczenPrzynaleznych(obj: EGB_LokalSamodzielnyType) {
	return obj.powPomieszczenPrzynaleznychDoLokalu ? tableGetArea(obj.powPomieszczenPrzynaleznychDoLokalu) : "";
}

function tableGetPomPrzynalezne(id: string) {
	let ret = "";
	const obj = egbFeatures.pomieszczeniaPrzynalezneDoLokalu.get(id);
	if (obj) {
		if (obj.rodzajPomieszczeniaPrzynaleznego) {
			const rodzajPom = EGB_RodzajPomieszczenia[obj.rodzajPomieszczeniaPrzynaleznego];
			if (rodzajPom) {
				ret += rodzajPom;
			}
		}
	}
	return ret;
}

function tableGetPomieszczeniaPrzynalezne(obj: EGB_LokalSamodzielnyType) {
	let ret: string[] = [];
	if (obj.pomPrzynalezne) {
		if (Array.isArray(obj.pomPrzynalezne)) {
			obj.pomPrzynalezne.forEach((key) => {
				if (key) {
					ret.push(tableGetPomPrzynalezne(key._attributes.href));
				}
			});
		} else ret.push(tableGetPomPrzynalezne(obj.pomPrzynalezne._attributes.href));
	}
	return ret.join(", ");
}

export function tableGetBudynek(obj: EGB_LokalSamodzielnyType) {
	return obj.budynekZWyodrebnionymLokalem ? tableGetIdBudynku(obj.budynekZWyodrebnionymLokalem._attributes.href) : "";
}

export function tableGetAdresLokalu(obj: EGB_LokalSamodzielnyType) {
	return obj.adresLokalu ? tableGetAdresNieruchomosci(obj.adresLokalu._attributes.href) : "";
}

function tableGetJRL(obj: EGB_LokalSamodzielnyType) {
	let ret = "";
	if (obj.JRdlaLokalu) {
		const objJe = egbFeatures.jednostkiRejestroweLokali.get(obj.JRdlaLokalu._attributes.href);
		if (objJe) {
			if (objJe.idJednostkiRejestrowej) {
				ret = objJe.idJednostkiRejestrowej;
			}
		}
	}
	return ret;
}

export function tableLokale() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Identyfikator" +
			"</th><th>" +
			"Numer porządkowy" +
			"</th><th>" +
			"Rodzaj" +
			"</th><th>" +
			"Kondygnacja" +
			"</th><th>" +
			"Powierzchnia użytkowa" +
			"</th><th>" +
			"Liczba pom. przynależnych" +
			"</th><th>" +
			"Pow. pom. przynależnych" +
			"</th><th>" +
			"Pom. przynależne" +
			"</th><th>" +
			"Dokument własności" +
			"</th><th>" +
			"KW" +
			"</th><th>" +
			"Budynek" +
			"</th><th>" +
			"Adres" +
			"</th><th>" +
			"JRL" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 4%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 11%;">' +
			'<col span="1" style="width: 11%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 9%;"></colgroup>';
	}
	for (const obj of egbFeatures.lokaleSamodzielne.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetNumerPorzadkowy(obj);
		const td3 = tableGetRodzajLokalu(obj);
		const td4 = tableGetKondygnacja(obj);
		const td5 = tableGetPowierzchnia(obj);
		const td6 = tableGetLiczbaPomieszczenPrzynaleznych(obj);
		const td7 = tableGetPowPomieszczenPrzynaleznych(obj);
		const td8 = tableGetPomieszczeniaPrzynalezne(obj);
		const td9 = tableGetDokumentWlasnosci(obj);
		const td10 = tableGetNumerKW(obj);
		const td11 = tableGetBudynek(obj);
		const td12 = tableGetAdresLokalu(obj);
		const td13 = tableGetJRL(obj);
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
			td12.toLowerCase().includes(filter) ||
			td13.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iLokalSamodzielny +
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
					"</td><td>" +
					td13 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
