import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetDataPrzyjecia(obj: EGB_ZmianaType) {
	return obj.dataPrzyjeciaZgloszeniaZmiany ? new Date(obj.dataPrzyjeciaZgloszeniaZmiany).toLocaleDateString("pl-PL") : "";
}

function tableGetDataAkceptacji(obj: EGB_ZmianaType) {
	return obj.dataAkceptacjiZmiany ? new Date(obj.dataAkceptacjiZmiany).toLocaleDateString("pl-PL") : "";
}

function tableGetNr(obj: EGB_ZmianaType) {
	return obj.nrZmiany ? obj.nrZmiany : "";
}

function tableGetOpis(obj: EGB_ZmianaType) {
	return obj.opisZmiany ? obj.opisZmiany : "";
}

export function tableZmiany() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Data przyjecia" + "</th><th>" + "Data akceptacji" + "</th><th>" + "Nr" + "</th><th>" + "Opis" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 60%;"></colgroup>';
	}
	for (const obj of egbFeatures.zmiany.values()) {
		const td1 = tableGetDataPrzyjecia(obj);
		const td2 = tableGetDataAkceptacji(obj);
		const td3 = tableGetNr(obj);
		const td4 = tableGetOpis(obj);
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
					htmlIDs.iZmiana +
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
