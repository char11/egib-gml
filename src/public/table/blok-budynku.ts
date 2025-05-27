import { EGB_RodzajBloku } from "../egib/bloki-budynku";
import { egbFeatures, htmlIDs } from "../egib/features";
import { tableGetIdBudynku } from "./table";

function tableGetRodzaj(obj: EGB_BlokBudynkuType) {
	let ret = "";
	if (obj.rodzajBloku) {
		const rodzajBloku = EGB_RodzajBloku[obj.rodzajBloku];
		if (rodzajBloku) {
			ret += rodzajBloku;
		}
	}
	return ret;
}

function tableGetOznaczenie(obj: EGB_BlokBudynkuType) {
	return obj.oznaczenieBloku ? obj.oznaczenieBloku : "";
}

function tableGetKondygnacje(obj: EGB_BlokBudynkuType) {
	let ret = obj.numerNajwyzszejKondygnacji ? obj.numerNajwyzszejKondygnacji : "";
	ret += "/";
	ret += obj.numerNajnizszejKondygnacji ? obj.numerNajnizszejKondygnacji : "";
	return ret;
}

function tableGetBudynek(obj: EGB_BlokBudynkuType) {
	return obj.budynekZBlokiemBud ? tableGetIdBudynku(obj.budynekZBlokiemBud._attributes.href) : "";
}

export function tableBlokiBudynku() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" + "Rodzaj" + "</th><th>" + "Oznaczenie" + "</th><th>" + "Liczba kondygnacji (n/p)" + "</th><th>" + "Budynek" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;"></colgroup>';
	}
	for (const obj of egbFeatures.blokiBudynku.values()) {
		const td1 = tableGetRodzaj(obj);
		const td2 = tableGetOznaczenie(obj);
		const td3 = tableGetKondygnacje(obj);
		const td4 = tableGetBudynek(obj);
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
					htmlIDs.iBlokBudynku +
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
