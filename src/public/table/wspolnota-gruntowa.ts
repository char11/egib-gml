import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_StatusPodmiotuEwid } from "../egib/udzialy";
import { tableGetInstytucjaSkr, tableGetMalzenstwoSkr, tableGetOsobaSkr } from "./table";

function tableGetNazwa(obj: EGB_WspolnotaGruntowaType) {
	return obj.nazwa ? obj.nazwa : "";
}

function tableGetStatus(obj: EGB_WspolnotaGruntowaType) {
	let ret = "";
	if (obj.status) {
		if (obj.status === "41") {
			ret = EGB_StatusPodmiotuEwid[obj.status];
		}
	}
	return ret;
}

function tableGetSpolka(obj: EGB_WspolnotaGruntowaType) {
	return obj.spolkaZarzadajaca ? tableGetInstytucjaSkr(obj.spolkaZarzadajaca._attributes.href) : "";
}

function tableGetPodmiotyUprawnione(obj: EGB_WspolnotaGruntowaType) {
	let ret: string[] = [];

	if (obj.podmiotUprawniony) {
		if (Array.isArray(obj.podmiotUprawniony)) {
			obj.podmiotUprawniony.forEach((key) => {
				if (key) {
					ret.push(tableGetInstytucjaSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetInstytucjaSkr(obj.podmiotUprawniony._attributes.href));
		}
	} else {
		return "";
	}
	return ret.join(", ");
}

function tableGetMalzenstwaUprawnione(obj: EGB_WspolnotaGruntowaType) {
	let ret: string[] = [];

	if (obj.malzenstwoUprawnione) {
		if (Array.isArray(obj.malzenstwoUprawnione)) {
			obj.malzenstwoUprawnione.forEach((key) => {
				if (key) {
					ret.push(tableGetMalzenstwoSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetMalzenstwoSkr(obj.malzenstwoUprawnione._attributes.href));
		}
	} else {
		return "";
	}
	return ret.join(", ");
}

function tableGetOsobyUprawnione(obj: EGB_WspolnotaGruntowaType) {
	let ret: string[] = [];

	if (obj.osobaFizycznaUprawniona) {
		if (Array.isArray(obj.osobaFizycznaUprawniona)) {
			obj.osobaFizycznaUprawniona.forEach((key) => {
				if (key) {
					ret.push(tableGetOsobaSkr(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetOsobaSkr(obj.osobaFizycznaUprawniona._attributes.href));
		}
	} else {
		return "";
	}
	return ret.join(", ");
}

export function tableWspolnotyGruntowe() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Nazwa" +
			"</th><th>" +
			"Status" +
			"</th><th>" +
			"Spółka zarządzająca" +
			"</th><th>" +
			"Podmioty uprawnione" +
			"</th><th>" +
			"Małżeństwa uprawnione" +
			"</th><th>" +
			"osoby uprawnione" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}
	for (const obj of egbFeatures.wspolnotyGruntowe.values()) {
		const td1 = tableGetNazwa(obj);
		const td2 = tableGetStatus(obj);
		const td3 = tableGetSpolka(obj);
		const td4 = tableGetPodmiotyUprawnione(obj);
		const td5 = tableGetMalzenstwaUprawnione(obj);
		const td6 = tableGetOsobyUprawnione(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter) ||
			td6.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iWspolnotaGruntowa +
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
					"</td></tr>",
			);
		}
	}
	return ret;
}
