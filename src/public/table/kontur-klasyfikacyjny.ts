import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetOE } from "./table";

function tableGetId(obj: EGB_KonturKlasyfikacyjnyType) {
	return obj.idKonturu ? obj.idKonturu : "";
}

function tableGetLokalizacja(obj: EGB_KonturKlasyfikacyjnyType) {
	return obj.lokalizacjaKonturu ? tableGetOE(obj.lokalizacjaKonturu._attributes.href) : "";
}

function tableGetKlasy(obj: EGB_KonturKlasyfikacyjnyType) {
	let ret = obj.OZU ? obj.OZU : "";
	ret += obj.OZK ? obj.OZK : "";
	return ret;
}

export function tableKonturyKlasyfikacyjne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Identyfikator" + "</th><th>" + "Lokalizacja" + "</th><th>" + "OZU OZK" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 30%;">' + '<col span="1" style="width: 30%;">' + '<col span="1" style="width: 40%;"></colgroup>';
	}
	for (const obj of egbFeatures.konturyKlasyfikacyjne.values()) {
		const td1 = tableGetId(obj);
		const td2 = tableGetLokalizacja(obj);
		const td3 = tableGetKlasy(obj);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter) || td3.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iKonturKlasyfikacyjny +
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
