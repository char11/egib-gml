import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetAdresNieruchomosci, tableGetArea, tableGetDokumentWlasnosci, tableGetNumerKW, tableGetOE } from "./table";

function tableGetId(obj: EGB_DzialkaEwidencyjnaType) {
	return obj.idDzialki ? obj.idDzialki : "";
}

function tableGetLokalizacja(obj: EGB_DzialkaEwidencyjnaType) {
	return obj.lokalizacjaDzialki ? tableGetOE(obj.lokalizacjaDzialki._attributes.href) : "";
}

export function tableGetPoleEwidencyjne(obj: EGB_DzialkaEwidencyjnaType) {
	return obj.poleEwidencyjne ? tableGetArea(obj.poleEwidencyjne) : "";
}

function tableGetKlasouzytek(obj: EGB_KlasouzytekType) {
	let ret = obj.OFU ? obj.OFU : "";
	if (obj.OZU) {
		if (obj.OZU.valueOf() !== obj.OFU?.valueOf()) {
			ret += "-" + obj.OZU;
		}
	}
	ret += obj.OZK ? obj.OZK : "";
	ret += obj.powierzchnia ? " " + tableGetArea(obj.powierzchnia) : "";
	return ret;
}

export function tableGetKlasouzytki(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[] = [];

	if (obj.klasouzytek) {
		if (Array.isArray(obj.klasouzytek)) {
			obj.klasouzytek.forEach((key) => {
				if (key.EGB_Klasouzytek) {
					ret.push(tableGetKlasouzytek(key.EGB_Klasouzytek));
				}
			});
		} else {
			if (obj.klasouzytek.EGB_Klasouzytek) {
				ret.push(tableGetKlasouzytek(obj.klasouzytek.EGB_Klasouzytek));
			}
		}
	}
	return ret.join(", ");
}

export function tableGetAdres(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[] = [];

	if (obj.adresDzialki) {
		if (Array.isArray(obj.adresDzialki)) {
			obj.adresDzialki.forEach((key) => {
				if (key) {
					ret.push(tableGetAdresNieruchomosci(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetAdresNieruchomosci(obj.adresDzialki._attributes.href));
		}
	}
	return ret.join(", ");
}

export function tableGetJRG(obj: EGB_DzialkaEwidencyjnaType) {
	let ret = "";
	if (obj.JRG2) {
		const objJe = egbFeatures.jednostkiRejestroweGruntow.get(obj.JRG2._attributes.href);
		if (objJe) {
			if (objJe.idJednostkiRejestrowej) {
				ret = objJe.idJednostkiRejestrowej;
			}
		}
	}
	return ret;
}

function tableGetPunktyGraniczne(obj: EGB_DzialkaEwidencyjnaType) {
	let ret: string[] = [];

	if (obj.punktGranicyDzialki.length >= 3) {
		obj.punktGranicyDzialki.forEach((key) => {
			if (key) {
				const objPu = egbFeatures.punktyGraniczne.get(key._attributes.href);
				if (objPu) {
					if (objPu.idPunktu) {
						ret.push(objPu.idPunktu);
					}
				}
			}
		});
	}
	return ret.join(", ");
}

export function tableDziałkiEwidencyjne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Identyfikator" +
			"</th><th>" +
			"Lokalizacja" +
			"</th><th>" +
			"Dokument własności" +
			"</th><th>" +
			"Numer KW" +
			"</th><th>" +
			"Pole ewidenvyjne" +
			"</th><th>" +
			"Klasoużytki" +
			"</th><th>" +
			"Adres" +
			"</th><th>" +
			"JRG" +
			"</th><th>" +
			"Punkty graniczne" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 8%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 7%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}
	for (const obj of egbFeatures.dzialkiEwidencyjne.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetLokalizacja(obj);
		const td3 = tableGetDokumentWlasnosci(obj);
		const td4 = tableGetNumerKW(obj);
		const td5 = tableGetPoleEwidencyjne(obj);
		const td6 = tableGetKlasouzytki(obj);
		const td7 = tableGetAdres(obj);
		const td8 = tableGetJRG(obj);
		const td9 = tableGetPunktyGraniczne(obj);
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
			td9.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iDzialkaEwidencyjna +
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
					"</td></tr>",
			);
		}
	}
	return ret;
}
