import type { CircleMarkerOptions, PathOptions } from "leaflet";
import type { Feature } from "geojson";

// Znaki umowne mapy zasadniczej wg załącznika nr 4 do rozporządzenia
// Ministra Rozwoju, Pracy i Technologii z dnia 23 lipca 2021 r.
// Grubości linii podano w milimetrach dla skali 1:500. Na ekranie
// przeliczamy je na stałe grubości w pikselach, zachowując proporcje
// 0,18 mm : 0,35 mm : 0,50 mm.
const THIN = 1;
const MEDIUM = 1.5;
const THICK = 2.5;

// Skala długości elementów znaku (kresek, odstępów) na ekranie.
const MM = 5.6;

const BLACK = "#000000";
const GREEN_UG = "rgb(0, 128, 0)";
const GREEN_KK = "rgb(36, 188, 36)";

function dash(...values: number[]): string {
	return values.map((value) => Math.max(1, Math.round(value * MM))).join(",");
}

// Jednostka ewidencyjna - linia kreska-kropka, 0,35 mm.
export function stylJednostkiEwidencyjnej(): PathOptions {
	return {
		color: BLACK,
		weight: MEDIUM,
		fill: false,
		dashArray: dash(3, 2, 0.35, 2),
		lineCap: "butt",
	};
}

// Obręb ewidencyjny - linia kreskowana, 0,35 mm.
export function stylObrebuEwidencyjnego(): PathOptions {
	return {
		color: BLACK,
		weight: MEDIUM,
		fill: false,
		dashArray: dash(3, 2),
		lineCap: "butt",
	};
}

// Działka ewidencyjna - linia ciągła, 0,18 mm.
export function stylDzialkiEwidencyjnej(): PathOptions {
	return {
		color: BLACK,
		weight: THIN,
		fill: false,
	};
}

// Kontur użytku gruntowego - linia kreskowana zielona, 0,18 mm.
export function stylKonturuUzytkuGruntowego(): PathOptions {
	return {
		color: GREEN_UG,
		weight: THIN,
		fill: false,
		dashArray: dash(1, 1),
		lineCap: "butt",
	};
}

// Kontur klasyfikacyjny - linia kreskowana jasnozielona, 0,18 mm.
export function stylKonturuKlasyfikacyjnego(): PathOptions {
	return {
		color: GREEN_KK,
		weight: THIN,
		fill: false,
		dashArray: dash(3, 1),
		lineCap: "butt",
	};
}

// Budynek naziemny - linia ciągła 0,50 mm; budynek podziemny - linia
// kreskowana 0,50 mm. Wnętrze budynku jest przezroczyste, aby nie
// przesłaniało obiektów położonych pod nim.
export function stylBudynku(feature?: Feature): PathOptions {
	const podziemny = feature?.properties?.podziemny === true;
	return {
		color: BLACK,
		weight: THICK,
		fill: false,
		dashArray: podziemny ? dash(2, 1) : undefined,
		lineCap: "butt",
	};
}

// Bloki budynku. Kondygnacja podziemna, łącznik oraz przejazd przez
// budynek mają obrys kreskowany (element 2,0 mm, odstęp 1,0 mm), nawis
// kreskowaną linię 0,50 mm (element 4,0 mm, odstęp 1,0 mm), a pozostałe
// bloki ciągły obrys 0,18 mm.
export function stylBlokuBudynku(feature?: Feature): PathOptions {
	const rodzaj = feature?.properties?.rodzajBloku;
	if (rodzaj === "p" || rodzaj === "l" || rodzaj === "z") {
		return {
			color: BLACK,
			weight: THIN,
			fill: false,
			dashArray: dash(2, 1),
			lineCap: "butt",
		};
	}
	if (rodzaj === "a") {
		return {
			color: BLACK,
			weight: THICK,
			fill: false,
			dashArray: dash(4, 1),
			lineCap: "butt",
		};
	}
	return {
		color: BLACK,
		weight: THIN,
		fill: false,
	};
}

// Zewnętrzny obrys elementów trwale związanych z budynkiem. Wszystkie
// znaki mają ciągły obrys 0,18 mm. Taras, weranda/ganek i wiatrołap
// mają dodatkowo drugi, wewnętrzny element znaku, a wjazd do podziemia
// wypełnienie z kropek (rysowane osobną warstwą).
export function stylObiektuZwiazanegoZBudynkiem(): PathOptions {
	return {
		color: BLACK,
		weight: THIN,
		fill: false,
	};
}

// Wypełnienie wjazdu do podziemia (EGBJ). Kropka ma 0,18 mm średnicy,
// a jej rozstaw wynosi 2,0 mm w poziomie i 1,0 mm w pionie. Wiersze
// kropek są przesunięte o połowę rozstawu poziomego.
export const ROZSTAW_KROPEK_WJAZDU_X = 2.0 * MM;
export const ROZSTAW_KROPEK_WJAZDU_Y = 1.0 * MM;

export function stylKropkiWjazduDoPodziemia(): CircleMarkerOptions {
	return {
		radius: 0.6,
		stroke: false,
		fillColor: BLACK,
		fillOpacity: 1,
	};
}

// Drugi, wewnętrzny obrys znaku umownego, przesunięty o 1,0 mm od
// zewnętrznej linii obiektu. Taras ma obie linie ciągłe, weranda/ganek
// linię kreskowaną, a wiatrołap linię kropkowaną.
export function stylWewnetrznegoObrysuObiektu(feature?: Feature): PathOptions {
	const rodzaj = feature?.properties?.rodzaj;
	switch (rodzaj) {
		case "w":
			return {
				color: BLACK,
				weight: THIN,
				fill: false,
				dashArray: dash(1, 1),
				lineCap: "butt",
			};
		case "i":
			return {
				color: BLACK,
				weight: THIN,
				fill: false,
				dashArray: dash(0.18, 1),
				lineCap: "round",
			};
		default:
			return {
				color: BLACK,
				weight: THIN,
				fill: false,
			};
	}
}

// Przysłanianie obiektów pod punktem granicznym. Znak EGPG przesłania
// inne obiekty w promieniu 0,5 mm, czyli ok. 3 px. Dla punktu
// niestabilizowanego (B) promień przysłaniania jest taki sam jak
// promień okręgu w znaku (A).
export function stylPrzyslanianiaPunktuGranicznego(): CircleMarkerOptions {
	return {
		radius: 3,
		stroke: false,
		fillColor: "#ffffff",
		fillOpacity: 1,
	};
}

// Podpora - okrąg o średnicy 1,0 mm.
export function stylPodpory(): CircleMarkerOptions {
	return {
		radius: 3,
		color: BLACK,
		weight: THIN,
		fillColor: "#ffffff",
		fillOpacity: 1,
	};
}

// Punkt graniczny stabilizowany (A) - okrąg o średnicy 1,0 mm;
// niestabilizowany (B) - kropka 0,18 mm.
export function stylPunktuGranicznego(stabilizowany: boolean): CircleMarkerOptions {
	if (stabilizowany) {
		return {
			radius: 3,
			color: BLACK,
			weight: THIN,
			fillColor: "#ffffff",
			fillOpacity: 1,
		};
	}
	return {
		radius: 1.2,
		color: BLACK,
		weight: THIN,
		fillColor: BLACK,
		fillOpacity: 1,
	};
}

// Adres nieruchomości - mała czarna kropka.
export function stylAdresuNieruchomosci(): CircleMarkerOptions {
	return {
		radius: 2,
		color: BLACK,
		weight: THIN,
		fillColor: BLACK,
		fillOpacity: 1,
	};
}

// Linie stopni schodów - 0,18 mm, prostopadłe do polilinii kierunkowej.
export const stylStopniSchodow: PathOptions = {
	color: BLACK,
	weight: THIN,
	opacity: 1,
	fill: false,
	lineCap: "butt",
};

export type RodzajEtykiety = "je" | "oe" | "de" | "ku" | "kk" | "bu" | "bb" | "ob" | "pg" | "ad";

// Opisy: jednostka i obręb mają wysokość 3,5 mm, pozostałe 2,0 mm.
// Kolory opisów konturów są zgodne z kolorami ich linii.
export function stylEtykiety(rodzaj: RodzajEtykiety) {
	switch (rodzaj) {
		case "je":
		case "oe":
			return {
				font: "bold 17px 'OpenSans'",
				defaultHeight: 22,
				fillStyle: "rgba(0,0,0,1)",
			};
		case "ku":
			return {
				font: "bold 11px 'OpenSans'",
				defaultHeight: 14,
				fillStyle: GREEN_UG,
			};
		case "kk":
			return {
				font: "bold 11px 'OpenSans'",
				defaultHeight: 14,
				fillStyle: GREEN_KK,
			};
		default:
			return {
				font: "bold 11px 'OpenSans'",
				defaultHeight: 14,
				fillStyle: "rgba(0,0,0,1)",
			};
	}
}
