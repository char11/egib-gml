import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_RodzajPomieszczenia } from "../egib/pomieszczenia-przynalezne-do-lokalu";
import { tableGetArea, tableGetIdBudynku } from "./table";

function tableGetRodzaj(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	let ret = "";

	if (obj.rodzajPomieszczeniaPrzynaleznego) {
		const rodzajPomieszczeniaPrzynaleznego = EGB_RodzajPomieszczenia[obj.rodzajPomieszczeniaPrzynaleznego];
		if (rodzajPomieszczeniaPrzynaleznego) {
			ret += rodzajPomieszczeniaPrzynaleznego;
		}
	}
	return ret;
}

function tableGetPowierzchnia(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	return obj.powierzchniaPomieszczeniaPrzynaleznego ? tableGetArea(obj.powierzchniaPomieszczeniaPrzynaleznego) : "";
}

function tableGetId(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	return obj.idBudynku ? obj.idBudynku : "";
}

function tableGetBudynek(obj: EGB_PomieszczeniePrzynalezneDoLokaluType) {
	return obj.budynekZPomieszczeniemPrzynaleznym ? tableGetIdBudynku(obj.budynekZPomieszczeniemPrzynaleznym._attributes.href) : "";
}

export function tablePomieszczeniaPrzynależne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Rodzaj" + "</th><th>" + "Powierzchnia" + "</th><th>" + "Id budynku" + "</th><th>" + "Budynek" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;">' +
			'<col span="1" style="width: 25%;"></colgroup>';
	}
	for (const obj of egbFeatures.pomieszczeniaPrzynalezneDoLokalu.values()) {
		const td1 = tableGetRodzaj(obj);
		const td2 = tableGetPowierzchnia(obj);
		const td3 = tableGetId(obj);
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
					htmlIDs.iPomieszczeniePrzynalezneDoLokalu +
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
