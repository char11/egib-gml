import { egbFeatures, htmlIDs } from "../egib/features";

function tableGetDataSporzadzenia(obj: EGB_OperatTechnicznyType) {
	return obj.dataSporzadzenia ? new Date(obj.dataSporzadzenia).toLocaleDateString("pl-PL") : "";
}

function tableGetDataPrzyjeciaDoPZGIK(obj: EGB_OperatTechnicznyType) {
	return obj.dataPrzyjeciaDoPZGIK ? new Date(obj.dataPrzyjeciaDoPZGIK).toLocaleDateString("pl-PL") : "";
}

function tableGetIdentyfikatorWgPZGIK(obj: EGB_OperatTechnicznyType) {
	return obj.identyfikatorOperatuWgPZGIK ? obj.identyfikatorOperatuWgPZGIK : "";
}

function tableGetNazwaTworcy(obj: EGB_OperatTechnicznyType) {
	return obj.nazwaTworcy ? obj.nazwaTworcy : "";
}

function tableGetOpis(obj: EGB_OperatTechnicznyType) {
	return obj.opisOperatu ? obj.opisOperatu : "";
}

export function tableOperatyTechniczne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Data sporządzenia" +
			"</th><th>" +
			"Data przyjęcia do PZGIK" +
			"</th><th>" +
			"Identyfikator wg PZIGK" +
			"</th><th>" +
			"Nazwa twórcy" +
			"</th><th>" +
			"Opis" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 40%;"></colgroup>';
	}
	for (const obj of egbFeatures.operatyTechniczne.values()) {
		const td1 = tableGetDataSporzadzenia(obj);
		const td2 = tableGetDataPrzyjeciaDoPZGIK(obj);
		const td3 = tableGetIdentyfikatorWgPZGIK(obj);
		const td4 = tableGetNazwaTworcy(obj);
		const td5 = tableGetOpis(obj);
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
					htmlIDs.iOperatTechniczny +
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
