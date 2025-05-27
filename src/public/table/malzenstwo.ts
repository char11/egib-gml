import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_StatusPodmiotuEwid } from "../egib/udzialy";
import { tableGetOsobaSkr } from "./table";

function tableGetOsoba2(obj: EGB_MalzenstwoType) {
	let ret = "";
	if (obj.osobaFizyczna2) {
		ret = tableGetOsobaSkr(obj.osobaFizyczna2._attributes.href);
	}
	return ret;
}

function tableGetOsoba3(obj: EGB_MalzenstwoType) {
	let ret = "";
	if (obj.osobaFizyczna3) {
		ret = tableGetOsobaSkr(obj.osobaFizyczna3._attributes.href);
	}
	return ret;
}

function tableGetStatus(obj: EGB_MalzenstwoType) {
	let ret = "";
	if (obj.status) {
		if (obj.status === "34" || obj.status === "35") {
			ret = EGB_StatusPodmiotuEwid[obj.status];
		}
	}
	return ret;
}

export function tableMalzenstwa() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Osoba" + "</th><th>" + "Osoba" + "</th><th>" + "Status" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 30%;">' + '<col span="1" style="width: 30%;">' + '<col span="1" style="width: 40%;"></colgroup>';
	}
	for (const obj of egbFeatures.malzenstwa.values()) {
		const td1 = tableGetOsoba2(obj);
		const td2 = tableGetOsoba3(obj);
		const td3 = tableGetStatus(obj);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter) || td3.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iMalzenstwo +
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
