import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_RodzajWladania } from "../egib/udzialy";
import { tableGetPodmiotSkr, tableGetPrzedmiotSkr, tableGetWartoscUdzialu } from "./table";

export function tableGetRodzajWladania(obj: EGB_UdzialWeWladaniuType) {
	let ret = "";
	if (obj.rodzajWladania) {
		const rodzajPrawa = EGB_RodzajWladania[obj.rodzajWladania];
		if (rodzajPrawa) {
			ret += rodzajPrawa;
		}
	}
	return ret;
}

function tableGetPodmiot(obj: EGB_UdzialWeWladaniuType) {
	return obj.podmiotUdzialuWeWladaniu ? tableGetPodmiotSkr(obj.podmiotUdzialuWeWladaniu._attributes.href) : "";
}

function tableGetPrzedmiot(obj: EGB_UdzialWeWladaniuType) {
	return obj.przedmiotUdzialuWladania ? tableGetPrzedmiotSkr(obj.przedmiotUdzialuWladania._attributes.href) : "";
}

export function tableUdzialyWeWladaniu() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Rodzaj prawa" + "</th><th>" + "Wartość udziału" + "</th><th>" + "Podmiot" + "</th><th>" + "Przedmiot" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 25%;"></colgroup>';
	}
	for (const obj of egbFeatures.udzialyWeWladaniu.values()) {
		const td1 = tableGetRodzajWladania(obj);
		const td2 = tableGetWartoscUdzialu(obj);
		const td3 = tableGetPodmiot(obj);
		const td4 = tableGetPrzedmiot(obj);
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
					htmlIDs.iUdzialWeWladaniu +
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
