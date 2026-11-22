import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { egbFeatures } from "../egib/features";
import { EGB_RodzajPrawa, EGB_RodzajWladania } from "../egib/udzialy";
import { tableGetAdresPodmiotu, tableGetWartoscUdzialu } from "../table/table";

type PosiadanieKind = "JRG" | "JRB" | "JRL";

type PosiadanieRow = {
	kind: PosiadanieKind;
	id: string;
	udzial: string;
	prawo: string;
	nieruchomosci: string[];
};

type PodmiotRow = [string, string];

const kindOrder: { [key in PosiadanieKind]: number } = {
	JRG: 0,
	JRB: 1,
	JRL: 2,
};

export function posiadanieDlaOsobyFizycznej(id: string) {
	const obj = egbFeatures.osobyFizyczne.get(id);
	if (obj) {
		const dane: PodmiotRow[] = [["Podmiot:", pdfGetOsobaNazwa(obj)]];
		dane.push(["Adres zameldowania:", pdfGetOsobaAdres(obj, "adresZameldowania")]);
		dane.push(["Adres stałego pobytu:", pdfGetOsobaAdres(obj, "adresStalegoPobytu")]);
		posiadaniePdf(id, dane, "posiadanie - osoba fizyczna.pdf");
	}
}

export function posiadanieDlaMalzenstwa(id: string) {
	const obj = egbFeatures.malzenstwa.get(id);
	if (obj) {
		const osoby = pdfGetOsoby(obj.osobaFizyczna2, obj.osobaFizyczna3);
		const dane: PodmiotRow[] = [["Podmiot:", osoby.map((osoba) => pdfGetOsobaNazwa(osoba)).join(", ")]];
		dane.push(["Adres zameldowania:", pdfJoinAdresy(osoby.map((osoba) => pdfGetOsobaAdres(osoba, "adresZameldowania")))]);
		dane.push(["Adres stałego pobytu:", pdfJoinAdresy(osoby.map((osoba) => pdfGetOsobaAdres(osoba, "adresStalegoPobytu")))]);
		posiadaniePdf(id, dane, "posiadanie - małżeństwo.pdf");
	}
}

export function posiadanieDlaInstytucji(id: string) {
	const obj = egbFeatures.instytucje.get(id);
	if (obj) {
		posiadaniePdf(id, pdfGetPodmiotDane(obj.nazwaPelna, obj.nazwaSkrocona, obj.regon, obj.adresSiedziby), "posiadanie - instytucja.pdf");
	}
}

export function posiadanieDlaPodmiotuGrupowego(id: string) {
	const obj = egbFeatures.podmiotyGrupowe.get(id);
	if (obj) {
		posiadaniePdf(id, pdfGetPodmiotDane(obj.nazwaPelna, obj.nazwaSkrocona, obj.regon, obj.adresSiedziby), "posiadanie - podmiot grupowy.pdf");
	}
}

export function posiadanieDlaWspolnotyGruntowej(id: string) {
	const obj = egbFeatures.wspolnotyGruntowe.get(id);
	if (obj) {
		const dane: PodmiotRow[] = [["Podmiot:", obj.nazwa ?? ""]];
		if (obj.spolkaZarzadajaca) {
			dane.push(["Spółka zarządzająca:", pdfGetInstytucjaNazwa(obj.spolkaZarzadajaca._attributes.href)]);
		}
		posiadaniePdf(id, dane, "posiadanie - wspólnota gruntowa.pdf");
	}
}

function posiadaniePdf(id: string, dane: PodmiotRow[], fileName: string) {
	const doc = new jsPDF("p", "mm", "a4");
	doc.addFont("fonts/Lato-Regular.ttf", "sans", "normal");
	doc.setFont("sans", "normal");

	const pageWidth = doc.internal.pageSize.getWidth();

	doc.setFontSize(16);
	doc.text("Posiadanie", pageWidth / 2, 10, { align: "center" });

	doc.setFontSize(10);

	autoTable(doc, {
		body: dane,
		styles: {
			font: "sans",
			fontStyle: "normal",
			fontSize: 10,
			cellPadding: { bottom: 1 },
		},
		theme: "plain",
		columnStyles: {
			0: { cellWidth: 42 },
		},
	});

	doc.text("Nieruchomości:", 14, (doc as any).lastAutoTable.finalY + 5);

	autoTable(doc, {
		head: [["Przedmiot", "Udział", "Rodzaj prawa", "Nieruchomości"]],
		body: pdfGetPosiadanie(id),
		startY: (doc as any).lastAutoTable.finalY + 6,
		styles: {
			font: "sans",
			fontStyle: "normal",
			fontSize: 10,
			cellPadding: 0.5,
		},
		columnStyles: {
			0: { cellWidth: 47 },
			1: { cellWidth: 16 },
			2: { cellWidth: 31 },
		},
		headStyles: { fillColor: [80, 80, 80] },
	});

	addFooters(doc);
	doc.save(fileName);
}

function addFooters(doc: jsPDF) {
	const pageCount = doc.getNumberOfPages();
	const pageSize = doc.internal.pageSize;
	const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
	doc.setFontSize(8);
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.text("Strona " + String(i) + " z " + String(pageCount), doc.internal.pageSize.getWidth() / 2, pageHeight - 8, { align: "center" });
	}
}

function pdfGetOsobaNazwa(obj: EGB_OsobaFizycznaType) {
	const imiona = [obj.pierwszeImie, obj.drugieImie].filter(Boolean).join(" ");
	const nazwiska = [obj.pierwszyCzlonNazwiska, obj.drugiCzlonNazwiska].filter(Boolean).join("-");
	let ret = (nazwiska + " " + imiona).trim();
	const rodzice = [obj.imieOjca, obj.imieMatki].filter(Boolean).join(" ");
	if (rodzice) {
		ret += " (" + rodzice + ")";
	}
	return ret;
}

function pdfGetOsoby(...refs: Array<{ _attributes: { href: string } } | undefined>) {
	const ret: EGB_OsobaFizycznaType[] = [];
	for (const ref of refs) {
		const obj = ref ? egbFeatures.osobyFizyczne.get(ref._attributes.href) : undefined;
		if (obj) {
			ret.push(obj);
		}
	}
	return ret;
}

function pdfGetOsobaAdres(obj: EGB_OsobaFizycznaType, pole: "adresZameldowania" | "adresStalegoPobytu") {
	const ref = obj[pole];
	return ref ? tableGetAdresPodmiotu(ref._attributes.href) : "";
}

function pdfJoinAdresy(adresy: string[]) {
	return [...new Set(adresy.filter(Boolean))].join("\n");
}

function pdfGetPodmiotDane(
	nazwaPelna: string | undefined,
	nazwaSkrocona: string | undefined,
	regon: string | undefined,
	adresSiedziby: { _attributes: { href: string } } | undefined,
): PodmiotRow[] {
	const dane: PodmiotRow[] = [["Podmiot:", nazwaPelna ?? nazwaSkrocona ?? ""]];
	if (nazwaPelna && nazwaSkrocona) {
		dane.push(["Nazwa skrócona:", nazwaSkrocona]);
	}
	if (regon) {
		dane.push(["Regon:", regon]);
	}
	dane.push(["Adres siedziby:", adresSiedziby ? tableGetAdresPodmiotu(adresSiedziby._attributes.href) : ""]);
	return dane;
}

function pdfGetInstytucjaNazwa(id: string) {
	const obj = egbFeatures.instytucje.get(id);
	return obj?.nazwaPelna ?? "";
}

function pdfGetPosiadanie(id: string) {
	const rows: PosiadanieRow[] = [];

	for (const obj of egbFeatures.udzialyWeWlasnosci.values()) {
		if (obj.podmiotUdzialuWlasnosci?._attributes?.href !== id) {
			continue;
		}
		const przedmiot = obj.przedmiotUdzialuWlasnosci?._attributes?.href;
		if (!przedmiot) {
			continue;
		}
		const row = pdfGetPosiadanieRow(przedmiot, tableGetWartoscUdzialu(obj), pdfGetPrawo(obj.rodzajPrawa, EGB_RodzajPrawa));
		if (row) {
			rows.push(row);
		}
	}

	for (const obj of egbFeatures.udzialyWeWladaniu.values()) {
		if (obj.podmiotUdzialuWeWladaniu?._attributes?.href !== id) {
			continue;
		}
		const przedmiot = obj.przedmiotUdzialuWladania?._attributes?.href;
		if (!przedmiot) {
			continue;
		}
		const row = pdfGetPosiadanieRow(przedmiot, tableGetWartoscUdzialu(obj), pdfGetPrawo(obj.rodzajWladania, EGB_RodzajWladania));
		if (row) {
			rows.push(row);
		}
	}

	rows.sort(
		(a, b) =>
			kindOrder[a.kind] - kindOrder[b.kind] ||
			a.id.localeCompare(b.id, "pl") ||
			a.prawo.localeCompare(b.prawo, "pl"),
	);

	return rows.map((row) => [row.id, row.udzial, row.prawo, row.nieruchomosci.join("\n")]);
}

function pdfGetPosiadanieRow(przedmiot: string, udzial: string, prawo: string): PosiadanieRow | null {
	const jrg = egbFeatures.jednostkiRejestroweGruntow.get(przedmiot);
	if (jrg) {
		return {
			kind: "JRG",
			id: jrg.idJednostkiRejestrowej ?? "",
			udzial: udzial,
			prawo: prawo,
			nieruchomosci: pdfGetDzialki(przedmiot),
		};
	}

	const jrb = egbFeatures.jednostkiRejestroweBudynkow.get(przedmiot);
	if (jrb) {
		return {
			kind: "JRB",
			id: jrb.idJednostkiRejestrowej ?? "",
			udzial: udzial,
			prawo: prawo,
			nieruchomosci: pdfGetBudynki(przedmiot),
		};
	}

	const jrl = egbFeatures.jednostkiRejestroweLokali.get(przedmiot);
	if (jrl) {
		return {
			kind: "JRL",
			id: jrl.idJednostkiRejestrowej ?? "",
			udzial: udzial,
			prawo: prawo,
			nieruchomosci: pdfGetLokale(przedmiot),
		};
	}

	return null;
}

function pdfGetPrawo(kod: string | undefined, slownik: { [key: string]: string }) {
	if (!kod) {
		return "";
	}
	return slownik[kod] ?? "";
}

function pdfGetDzialki(id: string) {
	const ret: string[] = [];
	for (const obj of egbFeatures.dzialkiEwidencyjne.values()) {
		if (obj.JRG2?._attributes?.href === id && obj.idDzialki) {
			ret.push(obj.idDzialki);
		}
	}
	return [...new Set(ret)].sort((a, b) => a.localeCompare(b, "pl"));
}

function pdfGetBudynki(id: string) {
	const ret: string[] = [];
	for (const obj of egbFeatures.budynki.values()) {
		if (obj.JRBdlaBudynku?._attributes?.href === id && obj.idBudynku) {
			ret.push(obj.idBudynku);
		}
	}
	return [...new Set(ret)].sort((a, b) => a.localeCompare(b, "pl"));
}

function pdfGetLokale(id: string) {
	const ret: string[] = [];
	for (const obj of egbFeatures.lokaleSamodzielne.values()) {
		if (obj.JRdlaLokalu?._attributes?.href === id && obj.idLokalu) {
			ret.push(obj.idLokalu);
		}
	}
	return [...new Set(ret)].sort((a, b) => a.localeCompare(b, "pl"));
}
