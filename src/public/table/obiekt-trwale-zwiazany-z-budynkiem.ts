import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_RodzajObiektu } from "../egib/obiekty-trwale-zwiazane-z-budynkiem";
import { tableGetIdBudynku } from "./table";

function tableGetRodzaj(obj: EGB_ObiektTrwaleZwiazanyZBudynkiemType) {
	let ret = "";
	if (obj.rodzajObiektuZwiazanegoZBudynkiem) {
		const rodzajObiektuZwiazanegoZBudynkiem = EGB_RodzajObiektu[obj.rodzajObiektuZwiazanegoZBudynkiem];
		if (rodzajObiektuZwiazanegoZBudynkiem) {
			ret = rodzajObiektuZwiazanegoZBudynkiem;
		}
	}
	return ret;
}

function tableGetBudynek(obj: EGB_ObiektTrwaleZwiazanyZBudynkiemType) {
	return obj.budynekZElementamiZwiazanymi ? tableGetIdBudynku(obj.budynekZElementamiZwiazanymi._attributes.href) : "";
}

export function tableObiektyZwiazanyZBudynkiem() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Rodzaj" + "</th><th>" + "Budynek" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML = '<colgroup><col span="1" style="width: 50%;">' + '<col span="1" style="width: 50%;"></colgroup>';
	}
	for (const obj of egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.values()) {
		const td1 = tableGetRodzaj(obj);
		const td2 = tableGetBudynek(obj);
		const filter = tableFilter.value.toLowerCase();
		if (!filter || td1.toLowerCase().includes(filter) || td2.toLowerCase().includes(filter)) {
			ret.push(
				'<tr id="' +
					htmlIDs.iObiektTrwaleZwiazanyZBudynkiem +
					obj._attributes.id +
					'" onclick="tableShowEgbFeature(this.id)">' +
					"<td>" +
					td1 +
					"</td><td>" +
					td2 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
