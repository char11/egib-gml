import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetKraj(obj: EGB_AdresPodmiotuType) {
	return obj.kraj ? obj.kraj : "";
}

function tableGetMiejscowosc(obj: EGB_AdresPodmiotuType) {
	return obj.miejscowosc ? obj.miejscowosc : "";
}

function tableGetKodPocztowy(obj: EGB_AdresPodmiotuType) {
	return obj.kodPocztowy ? obj.kodPocztowy : "";
}

function tableGetUlica(obj: EGB_AdresPodmiotuType) {
	return obj.ulica ? obj.ulica : "";
}

function tableGetNumery(obj: EGB_AdresPodmiotuType) {
	let ret = "";
	if (obj.numerPorzadkowy) {
		ret += obj.numerPorzadkowy;
	}
	if (obj.numerLokalu) {
		ret += "/" + obj.numerLokalu;
	}
	return ret;
}

export function tableAdresyPodmiotu() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Kraj" +
			"</th><th>" +
			"Miejscowość" +
			"</th><th>" +
			"Kod pocztowy" +
			"</th><th>" +
			"Ulica" +
			"</th><th>" +
			"Nr porządkowy/nr lokalu" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 10%;"></colgroup>';
	}
	for (const obj of egbFeatures.adresyPodmiotu.values()) {
		const td1 = tableGetKraj(obj);
		const td2 = tableGetMiejscowosc(obj);
		const td3 = tableGetKodPocztowy(obj);
		const td4 = tableGetUlica(obj);
		const td5 = tableGetNumery(obj);
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
					htmlIDs.iAdresPodmiotu +
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
