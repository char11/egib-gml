/**
 * Konwersja obiektów GML ze schematów EGIB 1.6-1.9 do postaci zgodnej z EGIB 1.11.
 *
 * Aplikacja (parser, widoki, tabele, PDF) została napisana pod schemat EGIB 1.11.
 * Zamiast zmieniać całą aplikację, każdy wczytany obiekt ze starszego pliku jest tutaj
 * przekształcany do struktury 1.11 jeszcze przed wywołaniem checkFeature().
 *
 * Konwersja jest idempotentna - dla plików 1.11 nie zmienia nic, ponieważ
 * żadna z poniższych nazw w nich nie występuje.
 */

type XmlObject = Record<string, any>;

/** Nazwy elementów obiektów (gml:featureMember), które w 1.11 mają inne nazwy. */
const FEATURE_NAMES: Record<string, string> = {
	EGB_AdresZameldowania: "EGB_AdresPodmiotu",
	EGB_AdresStalegoPobytu: "EGB_AdresPodmiotu",
};

/** Nazwy atrybutów, które w 1.11 mają inne nazwy. */
const FIELD_NAMES: Record<string, string> = {
	// adresy podmiotów (1.9 -> 1.11)
	adresOsobyFizycznej: "adresZameldowania",
	adresKorespondencyjnyOF: "adresStalegoPobytu",
	// literówka w schemacie 1.6 ("ę" zamiast "e")
	budynekZWyodrębnionymLokalem: "budynekZWyodrebnionymLokalem",
	// jednostka rejestrowa lokali
	nieruchomoscWspolnaDlaLokalu: "czescWspolnaDlaLokalu",
	// wspólnota gruntowa
	SpolkaZarzadajaca: "spolkaZarzadajaca",
	osobaUprawniona: "osobaFizycznaUprawniona",
};

/**
 * Atrybuty 1.9, które nie mają odpowiednika w 1.11.
 * eDoreczenie zniknęło z adresu podmiotu.
 */
const REMOVED_FIELDS = new Set(["eDoreczenie"]);

/**
 * W 1.11 instytucja i podmiot grupowy mają tylko jeden adres siedziby.
 * Adres podstawowy ma pierwszeństwo, a jeśli go brak - używamy korespondencyjnego.
 */
const ADRES_SIEDZIBY_FIELDS = ["adresInstytucji", "adresPodmiotuGrupowego", "adresKorespondencyjnyI", "adresKorespondencyjnyPG"];

/**
 * W 1.6/1.7 podmiot ma jedno pole adresPodmiotu, a 1.11 wymaga nazwy zależnej
 * od rodzaju podmiotu.
 */
const ADRES_PODMIOTU_TARGETS: Record<string, string> = {
	EGB_OsobaFizyczna: "adresZameldowania",
	EGB_Instytucja: "adresSiedziby",
	EGB_PodmiotGrupowy: "adresSiedziby",
};

/** Rodziny wersji schematu rozpoznawane po nazwach pól. */
export type EgibSourceVersion = "1.6" | "1.6/1.7" | "1.8/1.9" | "1.11";

const VERSION_PRIORITY: EgibSourceVersion[] = ["1.6", "1.6/1.7", "1.8/1.9", "1.11"];

/** Pola, w których 1.6-1.9 przechowują inline obiekt EGB_Podmiot zamiast xlink:href. */
const PODMIOT_PROPERTIES = ["podmiotUdzialuWlasnosci", "podmiotUdzialuWeWladaniu"];

/** Pola, w których 1.6-1.9 przechowują inline obiekt EGB_JednostkaRejestrowa. */
const JEDNOSTKA_REJESTROWA_PROPERTIES = ["przedmiotUdzialuWlasnosci", "przedmiotUdzialuWladania"];

/** Elementy, na które może wskazywać opakowanie EGB_Podmiot. */
const PODMIOT_REFERENCE_NAMES = ["osobaFizyczna", "malzenstwo", "podmiotGrupowy", "instytucja1", "instytucja", "wspolnotaGruntowa"];

/** Elementy, na które może wskazywać opakowanie EGB_JednostkaRejestrowa. */
const JEDNOSTKA_REJESTROWA_REFERENCE_NAMES = ["JRG", "JRB", "JRL"];

/** Obiekty udziału, w których 1.6-1.9 i 1.11 różnią się liczbą dozwolonych wystąpień. */
const UDZIAL_RULES = [
	{
		featureName: "EGB_UdzialWeWlasnosci",
		podmiot: "podmiotUdzialuWlasnosci",
		przedmiot: "przedmiotUdzialuWlasnosci",
	},
	{
		featureName: "EGB_UdzialWeWladaniu",
		podmiot: "podmiotUdzialuWeWladaniu",
		przedmiot: "przedmiotUdzialuWladania",
	},
];

/** Powód, dla którego obiektu ze starszego formatu nie da się wiernie przedstawić w 1.11. */
export interface Egib19ConversionProblem {
	featureName: string;
	featureId: string;
	reason: string;
}

function firstValue(value: any) {
	return Array.isArray(value) ? value[0] : value;
}

function asArray(value: any): any[] {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

function hasValue(value: any) {
	return value != null && String(value).trim() !== "";
}

/** Odmiana rzeczownika po liczbie (1 wystąpienie, 2 wystąpienia, 5 wystąpień). */
function plural(count: number, one: string, few: string, many: string) {
	const rest = count % 10;
	const tens = count % 100;
	if (count === 1) return one;
	if (rest >= 2 && rest <= 4 && !(tens >= 12 && tens <= 14)) return few;
	return many;
}

/**
 * Zamienia obiekt/property na referencję xlink:href.
 * Obsługuje zarówno xlink:href, jak i obiekt inline (wtedy używa jego gml:id).
 */
function toReference(value: any): any {
	const item = firstValue(value);
	if (!item || typeof item !== "object") return item;

	if (item._attributes?.href) {
		return { _attributes: item._attributes };
	}

	for (const key of Object.keys(item)) {
		if (key === "_attributes") continue;
		const nested = item[key];
		if (nested && typeof nested === "object" && nested._attributes?.id) {
			return { _attributes: { href: nested._attributes.id, type: "simple" } };
		}
	}

	return item;
}

function flattenWrapper(value: any, wrapperName: string, referenceNames: string[]): any {
	const item = firstValue(value);
	if (!item || typeof item !== "object") return item;

	const wrapper = item[wrapperName];
	if (!wrapper || typeof wrapper !== "object") return item;

	for (const name of referenceNames) {
		if (wrapper[name]) {
			return toReference(wrapper[name]);
		}
	}

	return item;
}

/** Zbiera wszystkie referencje zapisane w opakowaniu EGB_Podmiot/EGB_JednostkaRejestrowa. */
function wrapperReferences(wrapper: any, referenceNames: string[]): any[] {
	const references: any[] = [];
	for (const name of referenceNames) {
		references.push(...asArray(wrapper?.[name]));
	}
	return references;
}

/**
 * Wykrywa obiekty 1.6-1.9, których nie da się wiernie skonwertować do 1.11.
 *
 * Konwersja potrafi odwzorować tylko jeden podmiot i jedną jednostkę rejestrową.
 * Starsze schematy pozwalają na wiele wystąpień obu elementów, a EGB_Podmiot/EGB_JednostkaRejestrowa
 * może zawierać więcej niż jedną referencję. W takich przypadkach dalsza konwersja
 * oznaczałaby cichą utratę danych, dlatego plik jest odrzucany.
 */
function findUdzialProblem(obj: XmlObject, rule: (typeof UDZIAL_RULES)[number]): Egib19ConversionProblem | null {
	const podmioty = asArray(obj[rule.podmiot]);
	const przedmioty = asArray(obj[rule.przedmiot]);

	const podmiotWrappers = podmioty.map((item) => item?.EGB_Podmiot).filter(Boolean);
	const przedmiotWrappers = przedmioty.map((item) => item?.EGB_JednostkaRejestrowa).filter(Boolean);

	// Obiekty 1.11 przechowują referencje bezpośrednio (xlink:href) - nie ma czego konwertować.
	if (podmiotWrappers.length === 0 && przedmiotWrappers.length === 0) return null;

	const problem = (reason: string): Egib19ConversionProblem => ({
		featureName: rule.featureName,
		featureId: obj._attributes?.id ?? "",
		reason,
	});

	if (podmioty.length > 1) {
		return problem(
			`ma ${podmioty.length} ${plural(podmioty.length, "wystąpienie", "wystąpienia", "wystąpień")} elementu ${rule.podmiot}, a EGIB 1.11 dopuszcza tylko jedno`,
		);
	}
	if (przedmioty.length > 1) {
		return problem(
			`ma ${przedmioty.length} ${plural(przedmioty.length, "wystąpienie", "wystąpienia", "wystąpień")} elementu ${rule.przedmiot}, a EGIB 1.11 dopuszcza tylko jedno`,
		);
	}
	if (podmioty.length === 0) {
		return problem(`nie ma elementu ${rule.podmiot}, wymaganego w EGIB 1.11`);
	}
	if (przedmioty.length === 0) {
		return problem(`nie ma elementu ${rule.przedmiot}, wymaganego w EGIB 1.11`);
	}

	const podmiotRefs = wrapperReferences(podmiotWrappers[0], PODMIOT_REFERENCE_NAMES);
	if (podmiotRefs.length > 1) {
		return problem(
			`ma ${podmiotRefs.length} ${plural(podmiotRefs.length, "pozycję", "pozycje", "pozycji")} w EGB_Podmiot, a konwersja obsługuje tylko jedną`,
		);
	}

	const przedmiotRefs = wrapperReferences(przedmiotWrappers[0], JEDNOSTKA_REJESTROWA_REFERENCE_NAMES);
	if (przedmiotRefs.length > 1) {
		return problem(
			`ma ${przedmiotRefs.length} ${plural(przedmiotRefs.length, "pozycję", "pozycje", "pozycji")} w EGB_JednostkaRejestrowa, a konwersja obsługuje tylko jedną`,
		);
	}

	if (!hasValue(obj.licznikUlamkaOkreslajacegoWartoscUdzialu)) {
		return problem("nie ma licznika ułamka określającego wartość udziału, wymaganego w EGIB 1.11");
	}
	if (!hasValue(obj.mianownikUlamkaOkreslajacegoWartoscUdzialu)) {
		return problem("nie ma mianownika ułamka określającego wartość udziału, wymaganego w EGIB 1.11");
	}

	return null;
}

/**
 * Sprawdza, czy pojedynczy featureMember z 1.6-1.9 można w ogóle skonwertować do 1.11.
 * Zwraca pierwszy napotkany problem albo null, gdy konwersja jest bezpieczna.
 * Wywoływać przed convertEgib19Feature(), ponieważ konwersja usuwa opakowania.
 */
export function findEgib19ConversionProblem(feature: XmlObject): Egib19ConversionProblem | null {
	if (!feature || typeof feature !== "object") return null;

	for (const rule of UDZIAL_RULES) {
		for (const obj of asArray(feature[rule.featureName])) {
			if (!obj || typeof obj !== "object") continue;
			const problem = findUdzialProblem(obj, rule);
			if (problem) return problem;
		}
	}

	return null;
}

/** Markery pól pozwalające rozpoznać rodzinę wersji schematu w danych GML. */
const VERSION_MARKERS: Array<{ version: EgibSourceVersion; keys: Set<string> }> = [
	{ version: "1.6", keys: new Set(["budynekZWyodrębnionymLokalem"]) },
	{ version: "1.6/1.7", keys: new Set(["adresPodmiotu"]) },
	{
		version: "1.8/1.9",
		keys: new Set([
			"adresOsobyFizycznej",
			"adresKorespondencyjnyOF",
			"adresInstytucji",
			"adresKorespondencyjnyI",
			"adresPodmiotuGrupowego",
			"adresKorespondencyjnyPG",
		]),
	},
	{ version: "1.11", keys: new Set(["adresZameldowania", "adresStalegoPobytu", "adresSiedziby"]) },
];

function hasKeyDeep(value: any, names: Set<string>): boolean {
	if (!value || typeof value !== "object") return false;
	if (Array.isArray(value)) {
		return value.some((item) => hasKeyDeep(item, names));
	}
	for (const key of Object.keys(value)) {
		if (names.has(key) || hasKeyDeep(value[key], names)) return true;
	}
	return false;
}

/** Rozpoznaje rodzinę wersji schematu na podstawie nazw pól w jednym obiekcie. */
export function detectEgibSourceVersion(feature: XmlObject): EgibSourceVersion | null {
	if (!feature || typeof feature !== "object") return null;

	for (const marker of VERSION_MARKERS) {
		if (hasKeyDeep(feature, marker.keys)) return marker.version;
	}
	return null;
}

/** Wybiera najbardziej szczegółową wersję z zebranych podpowiedzi. */
export function pickEgibSourceVersion(versions: Iterable<EgibSourceVersion>): EgibSourceVersion | null {
	const seen = new Set(versions);
	return VERSION_PRIORITY.find((version) => seen.has(version)) ?? null;
}

/**
 * W 1.6/1.7 podmiot ma jedno pole adresPodmiotu, a 1.11 wymaga nazwy zależnej
 * od rodzaju podmiotu.
 */
function renameAdresPodmiotu(obj: XmlObject, featureName: string) {
	const target = ADRES_PODMIOTU_TARGETS[featureName];
	if (!target) return;

	if (obj.adresPodmiotu != null && obj[target] == null) {
		obj[target] = obj.adresPodmiotu;
	}
	delete obj.adresPodmiotu;
}

function renameFields(obj: XmlObject) {
	if (obj.adresSiedziby == null) {
		for (const key of ADRES_SIEDZIBY_FIELDS) {
			if (obj[key] != null) {
				obj.adresSiedziby = obj[key];
				break;
			}
		}
	}
	for (const key of ADRES_SIEDZIBY_FIELDS) {
		delete obj[key];
	}

	for (const key of Object.keys(obj)) {
		if (REMOVED_FIELDS.has(key)) {
			delete obj[key];
			continue;
		}

		const newKey = FIELD_NAMES[key];
		if (newKey) {
			if (!(newKey in obj)) {
				obj[newKey] = obj[key];
			}
			delete obj[key];
		}
	}
}

function convertObject(obj: XmlObject) {
	renameFields(obj);

	for (const key of PODMIOT_PROPERTIES) {
		if (obj[key] != null) {
			obj[key] = flattenWrapper(obj[key], "EGB_Podmiot", PODMIOT_REFERENCE_NAMES);
		}
	}

	for (const key of JEDNOSTKA_REJESTROWA_PROPERTIES) {
		if (obj[key] != null) {
			obj[key] = flattenWrapper(obj[key], "EGB_JednostkaRejestrowa", JEDNOSTKA_REJESTROWA_REFERENCE_NAMES);
		}
	}

	for (const key of Object.keys(obj)) {
		const value = obj[key];
		if (Array.isArray(value)) {
			for (const item of value) {
				if (item && typeof item === "object") convertObject(item);
			}
		} else if (value && typeof value === "object") {
			convertObject(value);
		}
	}
}

/**
 * Konwertuje pojedynczy featureMember (już sparsowany do obiektu) z 1.6-1.9 do 1.11.
 * Modyfikuje obiekt w miejscu i zwraca go, żeby można było wywołać:
 * checkFeature(convertEgib19Feature(res.featureMember));
 */
export function convertEgib19Feature(feature: XmlObject): XmlObject {
	if (!feature || typeof feature !== "object") return feature;

	for (const oldName of Object.keys(FEATURE_NAMES)) {
		if (feature[oldName]) {
			const newName = FEATURE_NAMES[oldName];
			if (!(newName in feature)) {
				feature[newName] = feature[oldName];
			}
			delete feature[oldName];
		}
	}

	for (const key of Object.keys(feature)) {
		for (const item of asArray(feature[key])) {
			if (!item || typeof item !== "object" || Array.isArray(item)) continue;
			renameAdresPodmiotu(item, key);
			convertObject(item);
		}
	}

	return feature;
}
