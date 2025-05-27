import { egbFeatures, htmlIDs } from "../egib/features";
import { EGB_Plec } from "../egib/osoby-fizyczne";
import { tableGetAdresPodmiotu } from "./table";

function tableGetImieNazwisko(obj: EGB_OsobaFizycznaType) {
	let ret = "";
	if (obj.pierwszeImie) {
		ret += obj.pierwszeImie + " ";
	}
	let tmp = obj.drugieImie;
	if (tmp) {
		ret += tmp + " ";
	}
	if (obj.pierwszyCzlonNazwiska) {
		ret += obj.pierwszyCzlonNazwiska;
	}
	if (obj.drugiCzlonNazwiska) {
		ret += "-" + obj.drugiCzlonNazwiska;
	}
	return ret;
}

function tableGetRodzice(obj: EGB_OsobaFizycznaType) {
	let ret = "";
	if (obj.imieOjca) {
		ret += obj.imieOjca + " ";
	}
	if (obj.imieMatki) {
		ret += obj.imieMatki;
	}
	return ret;
}

function tableGetPesel(obj: EGB_OsobaFizycznaType) {
	return obj.pesel ? obj.pesel : "";
}

function tableGetPlec(obj: EGB_OsobaFizycznaType) {
	let ret = "";
	if (obj.plec) {
		const plec = EGB_Plec[obj.plec];
		if (plec) {
			ret += plec;
		}
	}
	return ret;
}

function tableGetAdresZameldowania(obj: EGB_OsobaFizycznaType) {
	return obj.adresZameldowania ? tableGetAdresPodmiotu(obj.adresZameldowania._attributes.href) : "";
}

function tableGetAdresStalegoPobytu(obj: EGB_OsobaFizycznaType) {
	return obj.adresStalegoPobytu ? tableGetAdresPodmiotu(obj.adresStalegoPobytu._attributes.href) : "";
}

export function tableOsobyFizyczne() {
	let ret: string[] = [];
	const tableFilter = document.getElementById("table-filter") as HTMLInputElement;
	let tableHead = document.getElementById("clusterize-thead");
	if (tableHead) {
		tableHead.innerHTML =
			"<tr><th>" +
			"Imiona Nazwisko" +
			"</th><th>" +
			"Rodzice" +
			"</th><th>" +
			"PESEL" +
			"</th><th>" +
			"Płeć" +
			"</th><th>" +
			"Adres zameldowania" +
			"</th><th>" +
			"Adres stałego pobytu" +
			"</th></tr>";
	}
	let tableColgroup = document.getElementById("clusterize-colgroup");
	if (tableColgroup) {
		tableColgroup.innerHTML =
			'<colgroup><col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 10%;">' +
			'<col span="1" style="width: 20%;">' +
			'<col span="1" style="width: 20%;"></colgroup>';
	}
	for (const obj of egbFeatures.osobyFizyczne.values()) {
		const td1 = tableGetImieNazwisko(obj);
		const td2 = tableGetRodzice(obj);
		const td3 = tableGetPesel(obj);
		const td4 = tableGetPlec(obj);
		const td5 = tableGetAdresZameldowania(obj);
		const td6 = tableGetAdresStalegoPobytu(obj);
		const filter = tableFilter.value.toLowerCase();
		if (
			!filter ||
			td1.toLowerCase().includes(filter) ||
			td2.toLowerCase().includes(filter) ||
			td3.toLowerCase().includes(filter) ||
			td4.toLowerCase().includes(filter) ||
			td5.toLowerCase().includes(filter) ||
			td6.toLowerCase().includes(filter)
		) {
			ret.push(
				'<tr id="' +
					htmlIDs.iOsobaFizyczna +
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
					"</td><td>" +
					td6 +
					"</td></tr>",
			);
		}
	}
	return ret;
}
