import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_StatusPodmiotuEwid } from "../egib/udzialy";
import { tableGetAdresPodmiotu, tableGetOsobaSkr } from "./table";

function tableGetNazwa(obj: EGB_InstytucjaType) {
	return obj.nazwaPelna ? obj.nazwaPelna : "";
}

function tableGetRegon(obj: EGB_InstytucjaType) {
	return obj.regon ? obj.regon : "";
}

function tableGetStatus(obj: EGB_InstytucjaType) {
	let ret = "";
	if (obj.status) {
		if (Number(obj.status) >= 3 && Number(obj.status) <= 47 && obj.status !== "32" && obj.status !== "33" && obj.status !== "34" && obj.status !== "35") {
			ret = EGB_StatusPodmiotuEwid[obj.status];
		}
	}
	return ret;
}

function tableGetZarzad(obj: EGB_InstytucjaType) {
	let ret: string[] = [];
	if (obj.status === "41") {
		if (obj.czlonekZarzaduWspolnoty) {
			if (Array.isArray(obj.czlonekZarzaduWspolnoty)) {
				obj.czlonekZarzaduWspolnoty.forEach((key) => {
					if (key) {
						ret.push(tableGetOsobaSkr(key._attributes.href));
					}
				});
			} else {
				ret.push(tableGetOsobaSkr(obj.czlonekZarzaduWspolnoty._attributes.href));
			}
		}
	} else {
		return "";
	}
	return ret.join(", ");
}

function tableGetAdresInstytucji(obj: EGB_InstytucjaType) {
	return obj.adresSiedziby ? tableGetAdresPodmiotu(obj.adresSiedziby._attributes.href) : "";
}

export function tableInstytucje() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML = "<tr><th>" + "Nazwa" + "</th><th>" + "Regon" + "</th><th>" + "Status" + "</th><th>" + "Zarząd" + "</th><th>" + "Adres" + "</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 30%;">' +
			'<col span="1" style="width: 5%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 15%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}
	for (const obj of egbFeatures.instytucje.values()) {
		const td1 = tableGetNazwa(obj);
		const td2 = tableGetRegon(obj);
		const td3 = tableGetStatus(obj);
		const td4 = tableGetZarzad(obj);
		const td5 = tableGetAdresInstytucji(obj);
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
					htmlIDs.iInstytucja +
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
