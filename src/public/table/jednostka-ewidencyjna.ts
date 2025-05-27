import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetIdJednostki(obj: EGB_JednostkaEwidencyjnaType) {
	return obj.idJednostkiEwid ? obj.idJednostkiEwid : "";
}

function tableGetNazweJednostki(obj: EGB_JednostkaEwidencyjnaType) {
	return obj.nazwaWlasna ? obj.nazwaWlasna : "";
}

function tableGetPunktyGraniczne(obj: EGB_JednostkaEwidencyjnaType) {
	let ret: string[] = [];

	if (obj.punktGranicyJednEwid.length >= 3) {
		obj.punktGranicyJednEwid.forEach((key) => {
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

export function tableJednostkiEwidencyjne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Identyfikator" + "</th><th>" + "Nazwa" + "</th><th>" + "Punkty graniczne" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' + '<col span="1" style="width: 20%;">' + '<col span="1" style="width: 70%;"></colgroup>';
	}
	for (const obj of egbFeatures.jednostkiEwidencyjne.values()) {
		const td1 = tableGetIdJednostki(obj);
		const td2 = tableGetNazweJednostki(obj);
		const td3 = tableGetPunktyGraniczne(obj);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter) || td3.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iJednostkaEwidencyjna +
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
