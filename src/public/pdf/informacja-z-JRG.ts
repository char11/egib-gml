import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { egbFeatures } from "../egib/features";
import { pdfGetJE, pdfGetOE, pdfGetWlasnosciWladania } from "./pdf";
import { tableGetAdres, tableGetKlasouzytki, tableGetPoleEwidencyjne } from "../table/dzialka-ewidencyjna";
import { pdfGetDokWlasnosci, pdfGetKW } from "./informacja-dla-dzialki";
import { tableGetAdresBudynku, tableGetIDDzialki, tableGetLiczbaKondygnacji, tableGetRodzajBudynku } from "../table/budynek";
import {
	tableGetAdresLokalu,
	tableGetBudynek,
	tableGetKondygnacja,
	tableGetLiczbaPomieszczenPrzynaleznych,
	tableGetPowierzchnia,
	tableGetPowPomieszczenPrzynaleznych,
	tableGetRodzajLokalu,
} from "../table/lokal";

export function infoDlaJRG(id: string) {
	const obj = egbFeatures.jednostkiRejestroweGruntow.get(id);
	if (obj) {
		const addFooters = () => {
			const pageCount = doc.getNumberOfPages();
			const pageSize = doc.internal.pageSize;
			const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
			doc.setFontSize(8);
			for (let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.text(String(i) + " / " + String(pageCount), doc.internal.pageSize.getWidth() / 2, pageHeight - 8, { align: "center" });
			}
		};

		const doc = new jsPDF("p", "mm", "a4");
		// doc.addFont("fonts/OpenSans-Regular.ttf", "sans", "normal");
		doc.addFont("fonts/Lato-Regular.ttf", "sans", "normal");
		doc.setFont("sans", "normal");

		doc.text("Informacja dla JRG", doc.internal.pageSize.getWidth() / 2, 10, { align: "center" });

		doc.setFontSize(10);

		let table = pdfGetLokalizacja(obj);

		autoTable(doc, {
			// head: [],
			body: table,
			styles: {
				font: "sans",
				fontStyle: "normal",
				fontSize: 10,
				// minCellHeight: 0,
				cellPadding: { bottom: 1 },
			},
			theme: "plain",
			columnStyles: {
				0: { cellWidth: 42 },
			},
		});

		doc.text("Udziały:", 14, (doc as any).lastAutoTable.finalY + 5);

		table = pdfGetWlasnosciWladania(obj._attributes.id);
		autoTable(doc, {
			head: [["Udział", "Podmiot"]],
			body: table,
			startY: (doc as any).lastAutoTable.finalY + 6,
			styles: {
				font: "sans",
				fontStyle: "normal",
				fontSize: 10,
				// minCellHeight: 0,
				cellPadding: 0.5,
			},
			// theme: "plain",
			columnStyles: {
				// 0: { cellWidth: 42 },
			},
			headStyles: { fillColor: [80, 80, 80] },
		});

		const dbl = pdfGetDzialkiBudynkiLokale(obj);

		table = dbl.dzialki;

		doc.text("Działki:", 14, (doc as any).lastAutoTable.finalY + 5);

		autoTable(doc, {
			head: [["Nr działki", "Powierzchnia", "Klasoużytki", "KW", "Dok. wł.", "Adres"]],
			body: table,
			startY: (doc as any).lastAutoTable.finalY + 6,
			styles: {
				font: "sans",
				fontStyle: "normal",
				fontSize: 10,
				// minCellHeight: 0,
				cellPadding: 0.5,
			},
			// theme: "plain",
			columnStyles: {
				// 0: { cellWidth: 42 },
			},
			headStyles: { fillColor: [80, 80, 80] },
		});

		table = dbl.budynki;
		if (table.length) {
			doc.text("Budynki:", 14, (doc as any).lastAutoTable.finalY + 5);

			autoTable(doc, {
				head: [["Nr budynku", "Działka", "Rodzaj", "Liczba kondygnacji", "Adres"]],
				body: table,
				startY: (doc as any).lastAutoTable.finalY + 6,
				styles: {
					font: "sans",
					fontStyle: "normal",
					fontSize: 10,
					// minCellHeight: 0,
					cellPadding: 0.5,
				},
				// theme: "plain",
				columnStyles: {
					// 0: { cellWidth: 42 },
				},
				headStyles: { fillColor: [80, 80, 80] },
			});
		}

		table = dbl.lokale;
		if (table.length) {
			doc.text("Lokale:", 14, (doc as any).lastAutoTable.finalY + 5);

			autoTable(doc, {
				head: [["Nr lokalu", "Budynek", "Rodzaj", "Powierzchnia", "Kondygnacja", "Liczba pom. prz.", "Pow. pom. prz.", "Adres"]],
				body: table,
				startY: (doc as any).lastAutoTable.finalY + 6,
				styles: {
					font: "sans",
					fontStyle: "normal",
					fontSize: 10,
					// minCellHeight: 0,
					cellPadding: 0.5,
				},
				// theme: "plain",
				columnStyles: {
					// 0: { cellWidth: 42 },
				},
				headStyles: { fillColor: [80, 80, 80] },
			});
		}

		addFooters();
		doc.save("informacja dla JRG.pdf");
	}
}

function pdfGetLokalizacja(obj: EGB_JednostkaRejestrowaGruntowType) {
	let je = ["Jednostka ewidencyjna:"];
	let oe = ["Obręb ewidencyjny:"];
	let nj = ["Numer JRG:"];
	if (obj.lokalizacjaJRG) {
		const objObr = egbFeatures.obrebyEwidencyjne.get(obj.lokalizacjaJRG._attributes.href);
		if (objObr) {
			je.push(pdfGetJE(objObr));
			oe.push(pdfGetOE(objObr));
		}
	}
	if (obj.idJednostkiRejestrowej) {
		let nr = obj.idJednostkiRejestrowej.split(".").pop();
		nj.push(nr ? nr : "");
	}
	return [je, oe, nj];
}

function pdfGetDzialkiBudynkiLokale(obj: EGB_JednostkaRejestrowaGruntowType) {
	let dzialki: string[][] = [];
	let budynki: string[][] = [];
	let lokale: string[][] = [];

	function pdfGetBudynek(obj: EGB_BudynekType) {
		if (!obj.dokumentWlasnosci && !obj.numerKW && !obj.JRBdlaBudynku) {
			let budynek: string[] = [];
			let nb: string | undefined;
			if (obj.idBudynku) {
				nb = obj.idBudynku.split(".").pop();
			}
			budynek.push(nb ? nb : "");

			let tmp: string[] = [];
			if (obj.dzialkaZabudowana) {
				if (Array.isArray(obj.dzialkaZabudowana)) {
					obj.dzialkaZabudowana.forEach((key) => {
						if (key) {
							const nd = tableGetIDDzialki(key._attributes.href).split(".").pop();
							tmp.push(nd ? nd : "");
						}
					});
				} else {
					const nd = tableGetIDDzialki(obj.dzialkaZabudowana._attributes.href).split(".").pop();
					tmp.push(nd ? nd : "");
				}
			}
			budynek.push(tmp.join(", "));

			budynek.push(tableGetRodzajBudynku(obj));
			budynek.push(tableGetLiczbaKondygnacji(obj));
			budynek.push(tableGetAdresBudynku(obj));
			budynki.push(budynek);

			pdfGetLokale(obj._attributes.id);
		}
	}

	function pdfGetLokale(id: string) {
		for (const obj of egbFeatures.lokaleSamodzielne.values()) {
			if (obj.budynekZWyodrebnionymLokalem) {
				if (obj.budynekZWyodrebnionymLokalem._attributes.href === id) {
					if (!obj.dokumentWlasnosci && !obj.numerKW && !obj.JRdlaLokalu) {
						let lokal: string[] = [];
						let nl: string | undefined;
						if (obj.idLokalu) {
							nl = obj.idLokalu.split(".").pop();
						}
						lokal.push(nl ? nl : "");

						const nb = tableGetBudynek(obj).split(".").pop();
						lokal.push(nb ? nb : "");
						lokal.push(tableGetRodzajLokalu(obj));
						lokal.push(tableGetPowierzchnia(obj));
						lokal.push(tableGetKondygnacja(obj));
						lokal.push(tableGetLiczbaPomieszczenPrzynaleznych(obj));
						lokal.push(tableGetPowPomieszczenPrzynaleznych(obj));
						lokal.push(tableGetAdresLokalu(obj));
						lokale.push(lokal);
					}
				}
			}
		}
	}

	function pdfGetBudynkiLokale(id: string) {
		for (const obj of egbFeatures.budynki.values()) {
			if (obj.dzialkaZabudowana) {
				if (Array.isArray(obj.dzialkaZabudowana)) {
					obj.dzialkaZabudowana.forEach((key) => {
						if (key._attributes.href === id) {
							pdfGetBudynek(obj);
						}
					});
				} else {
					if (obj.dzialkaZabudowana._attributes.href === id) {
						pdfGetBudynek(obj);
					}
				}
			}
		}
	}

	for (const objDe of egbFeatures.dzialkiEwidencyjne.values()) {
		if (objDe.JRG2) {
			if (objDe.JRG2._attributes.href === obj._attributes.id) {
				let de: string[] = [];
				let nd: string | undefined;
				if (objDe.idDzialki) {
					nd = objDe.idDzialki.split(".").pop();
				}
				de.push(nd ? nd : "");
				de.push(tableGetPoleEwidencyjne(objDe));
				de.push(tableGetKlasouzytki(objDe));
				de.push(pdfGetKW(objDe));
				de.push(pdfGetDokWlasnosci(objDe));
				de.push(tableGetAdres(objDe));
				dzialki.push(de);

				pdfGetBudynkiLokale(objDe._attributes.id);
			}
		}
	}
	return { dzialki: dzialki, budynki: [...new Set(budynki)], lokale: [...new Set(lokale)] };
}
