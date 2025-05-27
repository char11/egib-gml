import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetIdJRG } from "./table";

function tableGetId(obj: EGB_JednostkaRejestrowaLokaliType) {
	return obj.idJednostkiRejestrowej ? obj.idJednostkiRejestrowej : "";
}

function tableGetLokalizacja(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret = "";
	if (obj.lokalizacjaJRL) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRL._attributes.href);
		if (objObr) {
			if (objObr.nazwaWlasna) {
				ret = objObr.nazwaWlasna;
			}
		}
	}
	return ret;
}

function tableGetJRGZwiazanaZJRL(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret: string[] = [];
	if (obj.JRGZwiazanaZJRL) {
		if (Array.isArray(obj.JRGZwiazanaZJRL)) {
			obj.JRGZwiazanaZJRL.forEach((key) => {
				if (key) {
					ret.push(tableGetIdJRB(key._attributes.href));
				}
			});
		} else {
			ret.push(tableGetIdJRG(obj.JRGZwiazanaZJRL._attributes.href));
		}
	}
	return ret.join(", ");
}

function tableGetIdJRB(id: string) {
	const obj = egbFeatures.jednostkiRejestroweBudynkow.get(id);
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

function tableGetCzescWspolna(obj: EGB_JednostkaRejestrowaLokaliType) {
	let ret = "";
	ret += obj.licznikUdzialuWNieruchomWspolnej ? obj.licznikUdzialuWNieruchomWspolnej : "";
	ret += "/";
	ret += obj.mianownikUdzialuWNieruchomWspolnej ? obj.mianownikUdzialuWNieruchomWspolnej : "";
	ret += " - ";
	let bud: string[] = [];
	if (obj.czescWspolnaDlaLokalu) {
		if (Array.isArray(obj.czescWspolnaDlaLokalu)) {
			obj.czescWspolnaDlaLokalu.forEach((key) => {
				if (key) {
					bud.push(tableGetIdJRB(key._attributes.href));
				}
			});
		} else {
			bud.push(tableGetIdJRB(obj.czescWspolnaDlaLokalu._attributes.href));
		}
		ret += bud.join(", ");
	}
	return ret;
}

function tableGetJRLLokal(id: string) {
	for (const obj of egbFeatures.lokaleSamodzielne.values()) {
		if (obj.JRdlaLokalu) {
			if (obj.JRdlaLokalu._attributes.href === id) {
				if (obj.idLokalu) {
					const ret = obj.idLokalu.split(".").pop();
					if (ret) {
						return ret;
					}
				}
			}
		}
	}
	return "";
}

export function tableJRL() {
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
			"JRG" +
			"</th><th>" +
			"Cześć wspólna (l/m - budynek)" +
			"</th><th>" +
			"Lokale" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 30%;"></colgroup>';
	}
	for (const obj of egbFeatures.jednostkiRejestroweLokali.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetLokalizacja(obj);
		const td3 = tableGetJRGZwiazanaZJRL(obj);
		const td4 = tableGetCzescWspolna(obj);
		const td5 = tableGetJRLLokal(obj._attributes.id);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iJednostkaRejestrowaLokali +
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
					"</td></tr>",
			);
		}
	}
	return ret;
}
