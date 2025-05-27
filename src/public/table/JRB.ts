import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetIdJRG } from "./table";

function tableGetId(obj: EGB_JednostkaRejestrowaBudynkowType) {
	return obj.idJednostkiRejestrowej ? obj.idJednostkiRejestrowej : "";
}

function tableGetLokalizacja(obj: EGB_JednostkaRejestrowaBudynkowType) {
	let ret = "";
	if (obj.lokalizacjaJRB) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRB._attributes.href);
		if (objObr) {
			if (objObr.nazwaWlasna) {
				ret = objObr.nazwaWlasna;
			}
		}
	}
	return ret;
}

function tableGetJRGZwiazanaZJRB(obj: EGB_JednostkaRejestrowaBudynkowType) {
	let ret: string[] = [];
	if (obj.JRGZwiazanaZJRB) {
		if (Array.isArray(obj.JRGZwiazanaZJRB)) {
			obj.JRGZwiazanaZJRB.forEach((key) => {
				if (key) {
					ret.push(tableGetIdJRG(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetIdJRG(obj.JRGZwiazanaZJRB._attributes.href));
		}
	}
	return ret.join(", ");
}

function tableGetJRBBudynki(id: string) {
	let ret: string[] = [];
	for (const obj of egbFeatures.budynki.values()) {
		if (obj.JRBdlaBudynku) {
			if (obj.JRBdlaBudynku._attributes.href === id) {
				if (obj.idBudynku) {
					const idB = obj.idBudynku.split(".").pop();
					if (idB) {
						ret.push(idB);
					}
				}
			}
		}
	}
	return ret.join(", ");
}

export function tableJRB() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Identyfikator" + "</th><th>" + "Lokalizacja" + "</th><th>" + "JRG" + "</th><th>" + "Budynki" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 40%;"></colgroup>';
	}
	for (const obj of egbFeatures.jednostkiRejestroweBudynkow.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetLokalizacja(obj);
		const td3 = tableGetJRGZwiazanaZJRB(obj);
		const td4 = tableGetJRBBudynki(obj._attributes.id);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iJednostkaRejestrowaBudynkow +
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
					"</td></tr>",
			);
		}
	}
	return ret;
}
