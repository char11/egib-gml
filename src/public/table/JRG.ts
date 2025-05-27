import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetId(obj: EGB_JednostkaRejestrowaGruntowType) {
	return obj.idJednostkiRejestrowej ? obj.idJednostkiRejestrowej : "";
}

function tableGetLokalizacja(obj: EGB_JednostkaRejestrowaGruntowType) {
	let ret = "";
	if (obj.lokalizacjaJRG) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRG._attributes.href);
		if (objObr) {
			if (objObr.nazwaWlasna) {
				ret = objObr.nazwaWlasna;
			}
		}
	}
	return ret;
}

function tableGetJRGDzialki(id: string) {
	let ret: string[] = [];
	for (const obj of egbFeatures.dzialkiEwidencyjne.values()) {
		if (obj.JRG2) {
			if (obj.JRG2._attributes.href === id) {
				if (obj.idDzialki) {
					const idD = obj.idDzialki.split(".").pop();
					if (idD) {
						ret.push(idD);
					}
				}
			}
		}
	}
	return ret.join(", ");
}

export function tableJRG() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Identyfikator" + "</th><th>" + "Lokalizacja" + "</th><th>" + "Działki" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 25%;">' + '<col span="1" style="width: 25%;">' + '<col span="1" style="width: 50%;"></colgroup>';
	}
	for (const obj of egbFeatures.jednostkiRejestroweGruntow.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetLokalizacja(obj);
		const td3 = tableGetJRGDzialki(obj._attributes.id);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter) || td3.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iJednostkaRejestrowaGruntow +
					obj._attributes.id +
					'" onclick="tableShowEgbFeature(this.id)">' +
					"<td>" +
					td1 +
					"</td><td>" +
					td2 +
					"</td><td>" +
					td3 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
