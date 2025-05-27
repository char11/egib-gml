import { sheetHighlightFeature } from "../map/mapview";
import { pokazAdresNieruchomosci } from "./adresy-nieruchomosci";
import { pokazBlokBudynku } from "./bloki-budynku";
import { pokazBudynek } from "./budynki";
import { pokazDokument } from "./dokumenty";
import { pokazDzialkeEwidencyjna } from "./dzialki-ewidencyjne";
import { pokazInstytucje } from "./instytucje";
import { pokazJednostkeEwidencyjna } from "./jednostki-ewidencyjne";
import { pokazJRB } from "./JRB";
import { pokazJRG } from "./JRG";
import { pokazJRL } from "./JRL";
import { pokazKonturKlasyfikacyjny } from "./kontury-klasyfikacyjne";
import { pokazKonturUzytkugruntowego } from "./kontury-uzytku-gruntowego";
import { pokazLokal } from "./lokale";
import { pokazMalzenstwo } from "./malzenstwa";
import { pokazObiektZwiazanyZBudynkiem } from "./obiekty-trwale-zwiazane-z-budynkiem";
import { pokazObrebEwidencyjny } from "./obreby-ewidencyjne";
import { pokazOperat } from "./operaty";
import { pokazOsobeFizyczna } from "./osoby-fizyczne";
import { pokazPodmiotGrupowy } from "./podmioty-grupowe";
import { pokazPomieszczeniePrzynalezne } from "./pomieszczenia-przynalezne-do-lokalu";
import { pokazPunkt } from "./punkty-graniczne";
import { pokazWspolnoteGruntowa } from "./wspolnoty-gruntowe";
import { pokazZmiane } from "./zmiany";
import { hideOnMapButton, hideReportButton, showModal } from "../ui/ui";
import { pokazAdresPodmiotu } from "./adresy-podmiotu";
import { pokazUdzialWeWlasnosci } from "./udzialy-we-wlasnosci";
import { pokazUdzialWeWladaniu } from "./udzialy-we-wladaniu";

export const enum htmlIDs {
	// mapa
	mJednostkaEwidencyjna = "mje", //jednosta ewidencyjna
	mObrebEwidencyjny = "moe", // obręb ewidencyjna
	mKonturKlasyfikacyjny = "mkk", // kontur klasyfikacyjny
	mKonturUzytkuGruntowego = "mku", // kontur użytku gruntowego
	mDzialkaEwidencyjna = "mde", // działka ewidencyjna
	mBudynek = "mbu", // budynek
	mBlokBudynku = "mbb", // blok budynku
	mObiektTrwaleZwiazanyZBudynkiem = "mob", // obiekt związany z budynkiem
	mPunktGraniczny = "mpg", // punkt graniczny
	mAdresNieruchomosci = "man", // adres nieruchomości
	// info
	iJednostkaEwidencyjna = "je", //jednosta ewidencyjna
	iObrebEwidencyjny = "oe", // obręb ewidencyjna
	iKonturKlasyfikacyjny = "kk", // kontur klasyfikacyjny
	iKonturUzytkuGruntowego = "ku", // kontur użytku gruntowego
	iDzialkaEwidencyjna = "de", // działka ewidencyjna
	iBudynek = "bu", // budynek
	iBlokBudynku = "bb", // blok budynku
	iObiektTrwaleZwiazanyZBudynkiem = "ob", // obiekt związany z budynkiem
	iPunktGraniczny = "pg", // punkt graniczny
	iOperatTechniczny = "ot", // operat
	iZmiana = "zm", // zmiana
	iDokument = "dk", // dokumenty
	iPrezentacjaGraficzna = "pr", // prezentacja graficzna
	iLokalSamodzielny = "ls", // lokal samodzielny
	iPomieszczeniePrzynalezneDoLokalu = "pp", // pomieszczenie przynależne do lokalu
	iJednostkaRejestrowaGruntow = "rg", // jednostka rejestrowa gruntów
	iJednostkaRejestrowaBudynkow = "rb", // jednostka rejestrowa budynków
	iJednostkaRejestrowaLokali = "rl", // jednostka rejestrowa lokali
	iOsobaFizyczna = "of", // osoba fizyczna
	iMalzenstwo = "ma", // małżeństwo
	iInstytucja = "in", // instytucja
	iPodmiotGrupowy = "pd", // podmiot grupowy
	iWspolnotaGruntowa = "wg", // wspólnota gruntowa
	iUdzialWeWlasnosci = "uw", // udział we Własności
	iUdzialWeWladaniu = "ul", // udzial we władaniu
	iAdresPodmiotu = "ap", // adres zameldowania
	iAdresNieruchomosci = "an", // adres nieruchomości
}

interface EgbFeatures {
	dzialkiEwidencyjne: Map<string, EGB_DzialkaEwidencyjnaType>;
	zmiany: Map<string, EGB_ZmianaType>;
	dokumenty: Map<string, EGB_DokumentType>;
	operatyTechniczne: Map<string, EGB_OperatTechnicznyType>;
	prezentacjeGraficzne: Map<string, PrezentacjaGraficznaType>;
	jednostkiEwidencyjne: Map<string, EGB_JednostkaEwidencyjnaType>;
	obrebyEwidencyjne: Map<string, EGB_ObrebEwidencyjnyType>;
	konturyUzytkuGruntowego: Map<string, EGB_KonturUzytkuGruntowegoType>;
	konturyKlasyfikacyjne: Map<string, EGB_KonturKlasyfikacyjnyType>;
	budynki: Map<string, EGB_BudynekType>;
	blokiBudynku: Map<string, EGB_BlokBudynkuType>;
	obiektyTrwaleZwiazaneZBudynkiem: Map<string, EGB_ObiektTrwaleZwiazanyZBudynkiemType>;
	lokaleSamodzielne: Map<string, EGB_LokalSamodzielnyType>;
	pomieszczeniaPrzynalezneDoLokalu: Map<string, EGB_PomieszczeniePrzynalezneDoLokaluType>;
	jednostkiRejestroweGruntow: Map<string, EGB_JednostkaRejestrowaGruntowType>;
	jednostkiRejestroweBudynkow: Map<string, EGB_JednostkaRejestrowaBudynkowType>;
	jednostkiRejestroweLokali: Map<string, EGB_JednostkaRejestrowaLokaliType>;
	osobyFizyczne: Map<string, EGB_OsobaFizycznaType>;
	malzenstwa: Map<string, EGB_MalzenstwoType>;
	instytucje: Map<string, EGB_InstytucjaType>;
	podmiotyGrupowe: Map<string, EGB_PodmiotGrupowyType>;
	wspolnotyGruntowe: Map<string, EGB_WspolnotaGruntowaType>;
	udzialyWeWlasnosci: Map<string, EGB_UdzialWeWlasnosciType>;
	udzialyWeWladaniu: Map<string, EGB_UdzialWeWladaniuType>;
	adresyPodmiotu: Map<string, EGB_AdresPodmiotuType>;
	adresyNieruchomosci: Map<string, EGB_AdresNieruchomosciType>;
	punktyGraniczne: Map<string, EGB_PunktGranicznyType>;
}

export const egbFeatures: EgbFeatures = {
	dzialkiEwidencyjne: new Map(),
	zmiany: new Map(),
	dokumenty: new Map(),
	operatyTechniczne: new Map(),
	prezentacjeGraficzne: new Map(),
	jednostkiEwidencyjne: new Map(),
	obrebyEwidencyjne: new Map(),
	konturyUzytkuGruntowego: new Map(),
	konturyKlasyfikacyjne: new Map(),
	budynki: new Map(),
	blokiBudynku: new Map(),
	obiektyTrwaleZwiazaneZBudynkiem: new Map(),
	lokaleSamodzielne: new Map(),
	pomieszczeniaPrzynalezneDoLokalu: new Map(),
	jednostkiRejestroweGruntow: new Map(),
	jednostkiRejestroweBudynkow: new Map(),
	jednostkiRejestroweLokali: new Map(),
	osobyFizyczne: new Map(),
	malzenstwa: new Map(),
	instytucje: new Map(),
	podmiotyGrupowe: new Map(),
	wspolnotyGruntowe: new Map(),
	udzialyWeWlasnosci: new Map(),
	udzialyWeWladaniu: new Map(),
	adresyPodmiotu: new Map(),
	adresyNieruchomosci: new Map(),
	punktyGraniczne: new Map(),
};

//export function clearFeatures() {
//	egbFeatures.dzialkiEwidencyjne.clear();
//	egbFeatures.zmiany.clear();
//	egbFeatures.dokumenty.clear();
//	egbFeatures.operatyTechniczne.clear();
//	egbFeatures.prezentacjeGraficzne.clear();
//	egbFeatures.jednostkiEwidencyjne.clear();
//	egbFeatures.obrebyEwidencyjne.clear();
//	egbFeatures.konturyUzytkuGruntowego.clear();
//	egbFeatures.konturyKlasyfikacyjne.clear();
//	egbFeatures.budynki.clear();
//	egbFeatures.blokiBudynku.clear();
//	egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.clear();
//	egbFeatures.lokaleSamodzielne.clear();
//	egbFeatures.pomieszczeniaPrzynalezneDoLokalu.clear();
//	egbFeatures.jednostkiRejestroweGruntow.clear();
//	egbFeatures.jednostkiRejestroweBudynkow.clear();
//	egbFeatures.jednostkiRejestroweLokali.clear();
//	egbFeatures.osobyFizyczne.clear();
//	egbFeatures.malzenstwa.clear();
//	egbFeatures.instytucje.clear();
//	egbFeatures.podmiotyGrupowe.clear();
//	egbFeatures.wspolnotyGruntowe.clear();
//	egbFeatures.udzialyWeWlasnosci.clear();
//	egbFeatures.udzialyWeWladaniu.clear();
//	egbFeatures.adresyPodmiotu.clear();
//	egbFeatures.adresyNieruchomosci.clear();
//	egbFeatures.punktyGraniczne.clear();
//}

class idsStackClass {
	ids: string[] = [];
	position = 0; // od 1

	constructor() {
		this.clear();
	}

	get() {
		return this.ids[this.position - 1];
	}

	push(id: string) {
		this.ids.length = this.position;
		this.ids.push(id);
		this.position++;
	}

	clear() {
		this.ids = [];
		this.position = 0;
	}

	getPrev() {
		if (this.position > 1) {
			this.position--;
		}
		return this.ids[this.position - 1];
	}

	getNext() {
		if (this.position < this.ids.length) {
			this.position++;
		}
		return this.ids[this.position - 1];
	}
}

export const idsStack = new idsStackClass();

function isDzialkaEwidencyjna(feature: FeatureMember): feature is EGB_DzialkaEwidencyjna {
	return (feature as EGB_DzialkaEwidencyjna).EGB_DzialkaEwidencyjna !== undefined;
}

function isZmiana(feature: FeatureMember): feature is EGB_Zmiana {
	return (feature as EGB_Zmiana).EGB_Zmiana !== undefined;
}

function isDokument(feature: FeatureMember): feature is EGB_Dokument {
	return (feature as EGB_Dokument).EGB_Dokument !== undefined;
}

function isOperatTechniczny(feature: FeatureMember): feature is EGB_OperatTechniczny {
	return (feature as EGB_OperatTechniczny).EGB_OperatTechniczny !== undefined;
}

function isPrezentacjaGraficzna(feature: FeatureMember): feature is PrezentacjaGraficzna {
	return (feature as PrezentacjaGraficzna).PrezentacjaGraficzna !== undefined;
}

function isJednostkaEwidencyjna(feature: FeatureMember): feature is EGB_JednostkaEwidencyjna {
	return (feature as EGB_JednostkaEwidencyjna).EGB_JednostkaEwidencyjna !== undefined;
}

function isObrebEwidencyjny(feature: FeatureMember): feature is EGB_ObrebEwidencyjny {
	return (feature as EGB_ObrebEwidencyjny).EGB_ObrebEwidencyjny !== undefined;
}

function isKonturUzytkuGruntowego(feature: FeatureMember): feature is EGB_KonturUzytkuGruntowego {
	return (feature as EGB_KonturUzytkuGruntowego).EGB_KonturUzytkuGruntowego !== undefined;
}

function isKonturKlasyfikacyjny(feature: FeatureMember): feature is EGB_KonturKlasyfikacyjny {
	return (feature as EGB_KonturKlasyfikacyjny).EGB_KonturKlasyfikacyjny !== undefined;
}

function isBudynek(feature: FeatureMember): feature is EGB_Budynek {
	return (feature as EGB_Budynek).EGB_Budynek !== undefined;
}

function isBlokBudynku(feature: FeatureMember): feature is EGB_BlokBudynku {
	return (feature as EGB_BlokBudynku).EGB_BlokBudynku !== undefined;
}

function isObiektTrwaleZwiazanyZBudynkiem(feature: FeatureMember): feature is EGB_ObiektTrwaleZwiazanyZBudynkiem {
	return (feature as EGB_ObiektTrwaleZwiazanyZBudynkiem).EGB_ObiektTrwaleZwiazanyZBudynkiem !== undefined;
}

function isLokalSamodzielny(feature: FeatureMember): feature is EGB_LokalSamodzielny {
	return (feature as EGB_LokalSamodzielny).EGB_LokalSamodzielny !== undefined;
}

function isPomieszczeniePrzynalezneDoLokalu(feature: FeatureMember): feature is EGB_PomieszczeniePrzynalezneDoLokalu {
	return (feature as EGB_PomieszczeniePrzynalezneDoLokalu).EGB_PomieszczeniePrzynalezneDoLokalu !== undefined;
}

function isJednostkaRejestrowaGruntow(feature: FeatureMember): feature is EGB_JednostkaRejestrowaGruntow {
	return (feature as EGB_JednostkaRejestrowaGruntow).EGB_JednostkaRejestrowaGruntow !== undefined;
}

function isJednostkaRejestrowaBudynkow(feature: FeatureMember): feature is EGB_JednostkaRejestrowaBudynkow {
	return (feature as EGB_JednostkaRejestrowaBudynkow).EGB_JednostkaRejestrowaBudynkow !== undefined;
}

function isJednostkaRejestrowaLokali(feature: FeatureMember): feature is EGB_JednostkaRejestrowaLokali {
	return (feature as EGB_JednostkaRejestrowaLokali).EGB_JednostkaRejestrowaLokali !== undefined;
}

function isOsobaFizyczna(feature: FeatureMember): feature is EGB_OsobaFizyczna {
	return (feature as EGB_OsobaFizyczna).EGB_OsobaFizyczna !== undefined;
}

function isMalzenstwo(feature: FeatureMember): feature is EGB_Malzenstwo {
	return (feature as EGB_Malzenstwo).EGB_Malzenstwo !== undefined;
}

function isInstytucja(feature: FeatureMember): feature is EGB_Instytucja {
	return (feature as EGB_Instytucja).EGB_Instytucja !== undefined;
}

function isPodmiotGrupowy(feature: FeatureMember): feature is EGB_PodmiotGrupowy {
	return (feature as EGB_PodmiotGrupowy).EGB_PodmiotGrupowy !== undefined;
}

function isWspolnotaGruntowa(feature: FeatureMember): feature is EGB_WspolnotaGruntowa {
	return (feature as EGB_WspolnotaGruntowa).EGB_WspolnotaGruntowa !== undefined;
}

function isUdzialWeWlasnosci(feature: FeatureMember): feature is EGB_UdzialWeWlasnosci {
	return (feature as EGB_UdzialWeWlasnosci).EGB_UdzialWeWlasnosci !== undefined;
}

function isUdzialWeWladaniu(feature: FeatureMember): feature is EGB_UdzialWeWladaniu {
	return (feature as EGB_UdzialWeWladaniu).EGB_UdzialWeWladaniu !== undefined;
}

function isAdresPodmiotu(feature: FeatureMember): feature is EGB_AdresPodmiotu {
	return (feature as EGB_AdresPodmiotu).EGB_AdresPodmiotu !== undefined;
}

function isAdresNieruchomosci(feature: FeatureMember): feature is EGB_AdresNieruchomosci {
	return (feature as EGB_AdresNieruchomosci).EGB_AdresNieruchomosci !== undefined;
}

function isPunktGraniczny(feature: FeatureMember): feature is EGB_PunktGraniczny {
	return (feature as EGB_PunktGraniczny).EGB_PunktGraniczny !== undefined;
}

export function checkFeature(obj: FeatureMember) {
	if (isDzialkaEwidencyjna(obj)) {
		egbFeatures.dzialkiEwidencyjne.set(obj.EGB_DzialkaEwidencyjna._attributes.id, obj.EGB_DzialkaEwidencyjna);
		return;
	}
	if (isZmiana(obj)) {
		egbFeatures.zmiany.set(obj.EGB_Zmiana._attributes.id, obj.EGB_Zmiana);
		return;
	}
	if (isDokument(obj)) {
		egbFeatures.dokumenty.set(obj.EGB_Dokument._attributes.id, obj.EGB_Dokument);
		return;
	}
	if (isOperatTechniczny(obj)) {
		egbFeatures.operatyTechniczne.set(obj.EGB_OperatTechniczny._attributes.id, obj.EGB_OperatTechniczny);
		return;
	}
	if (isPrezentacjaGraficzna(obj)) {
		egbFeatures.prezentacjeGraficzne.set(obj.PrezentacjaGraficzna._attributes.id, obj.PrezentacjaGraficzna);
		return;
	}
	if (isJednostkaEwidencyjna(obj)) {
		egbFeatures.jednostkiEwidencyjne.set(obj.EGB_JednostkaEwidencyjna._attributes.id, obj.EGB_JednostkaEwidencyjna);
		return;
	}
	if (isObrebEwidencyjny(obj)) {
		egbFeatures.obrebyEwidencyjne.set(obj.EGB_ObrebEwidencyjny._attributes.id, obj.EGB_ObrebEwidencyjny);
		return;
	}
	if (isKonturUzytkuGruntowego(obj)) {
		egbFeatures.konturyUzytkuGruntowego.set(obj.EGB_KonturUzytkuGruntowego._attributes.id, obj.EGB_KonturUzytkuGruntowego);
		return;
	}
	if (isKonturKlasyfikacyjny(obj)) {
		egbFeatures.konturyKlasyfikacyjne.set(obj.EGB_KonturKlasyfikacyjny._attributes.id, obj.EGB_KonturKlasyfikacyjny);
		return;
	}
	if (isBudynek(obj)) {
		egbFeatures.budynki.set(obj.EGB_Budynek._attributes.id, obj.EGB_Budynek);
		return;
	}
	if (isBlokBudynku(obj)) {
		egbFeatures.blokiBudynku.set(obj.EGB_BlokBudynku._attributes.id, obj.EGB_BlokBudynku);
		return;
	}
	if (isObiektTrwaleZwiazanyZBudynkiem(obj)) {
		egbFeatures.obiektyTrwaleZwiazaneZBudynkiem.set(obj.EGB_ObiektTrwaleZwiazanyZBudynkiem._attributes.id, obj.EGB_ObiektTrwaleZwiazanyZBudynkiem);
		return;
	}
	if (isLokalSamodzielny(obj)) {
		egbFeatures.lokaleSamodzielne.set(obj.EGB_LokalSamodzielny._attributes.id, obj.EGB_LokalSamodzielny);
		return;
	}
	if (isPomieszczeniePrzynalezneDoLokalu(obj)) {
		egbFeatures.pomieszczeniaPrzynalezneDoLokalu.set(obj.EGB_PomieszczeniePrzynalezneDoLokalu._attributes.id, obj.EGB_PomieszczeniePrzynalezneDoLokalu);
		return;
	}
	if (isJednostkaRejestrowaGruntow(obj)) {
		egbFeatures.jednostkiRejestroweGruntow.set(obj.EGB_JednostkaRejestrowaGruntow._attributes.id, obj.EGB_JednostkaRejestrowaGruntow);
		return;
	}
	if (isJednostkaRejestrowaBudynkow(obj)) {
		egbFeatures.jednostkiRejestroweBudynkow.set(obj.EGB_JednostkaRejestrowaBudynkow._attributes.id, obj.EGB_JednostkaRejestrowaBudynkow);
		return;
	}
	if (isJednostkaRejestrowaLokali(obj)) {
		egbFeatures.jednostkiRejestroweLokali.set(obj.EGB_JednostkaRejestrowaLokali._attributes.id, obj.EGB_JednostkaRejestrowaLokali);
		return;
	}
	if (isOsobaFizyczna(obj)) {
		egbFeatures.osobyFizyczne.set(obj.EGB_OsobaFizyczna._attributes.id, obj.EGB_OsobaFizyczna);
		return;
	}
	if (isMalzenstwo(obj)) {
		egbFeatures.malzenstwa.set(obj.EGB_Malzenstwo._attributes.id, obj.EGB_Malzenstwo);
		return;
	}
	if (isInstytucja(obj)) {
		egbFeatures.instytucje.set(obj.EGB_Instytucja._attributes.id, obj.EGB_Instytucja);
		return;
	}
	if (isPodmiotGrupowy(obj)) {
		egbFeatures.podmiotyGrupowe.set(obj.EGB_PodmiotGrupowy._attributes.id, obj.EGB_PodmiotGrupowy);
		return;
	}
	if (isWspolnotaGruntowa(obj)) {
		egbFeatures.wspolnotyGruntowe.set(obj.EGB_WspolnotaGruntowa._attributes.id, obj.EGB_WspolnotaGruntowa);
		return;
	}
	if (isUdzialWeWlasnosci(obj)) {
		egbFeatures.udzialyWeWlasnosci.set(obj.EGB_UdzialWeWlasnosci._attributes.id, obj.EGB_UdzialWeWlasnosci);
		return;
	}
	if (isUdzialWeWladaniu(obj)) {
		egbFeatures.udzialyWeWladaniu.set(obj.EGB_UdzialWeWladaniu._attributes.id, obj.EGB_UdzialWeWladaniu);
		return;
	}
	if (isAdresPodmiotu(obj)) {
		egbFeatures.adresyPodmiotu.set(obj.EGB_AdresPodmiotu._attributes.id, obj.EGB_AdresPodmiotu);
		return;
	}
	if (isAdresNieruchomosci(obj)) {
		egbFeatures.adresyNieruchomosci.set(obj.EGB_AdresNieruchomosci._attributes.id, obj.EGB_AdresNieruchomosci);
		return;
	}
	if (isPunktGraniczny(obj)) {
		egbFeatures.punktyGraniczne.set(obj.EGB_PunktGraniczny._attributes.id, obj.EGB_PunktGraniczny);
		return;
	}
}

function showEgbFeatureInfo(id: string) {
	if (id.length > 2) {
		const wrapper = document.getElementById("main-wrapper");
		if (wrapper) {
			wrapper.innerHTML = "";
			const i = id.slice(2);
			const feature = id.slice(0, 2);
			hideOnMapButton();
			hideReportButton();
			switch (feature) {
				case htmlIDs.iJednostkaEwidencyjna: {
					pokazJednostkeEwidencyjna(i);
					break;
				}
				case htmlIDs.iObrebEwidencyjny: {
					pokazObrebEwidencyjny(i);
					break;
				}
				case htmlIDs.iKonturKlasyfikacyjny: {
					pokazKonturKlasyfikacyjny(i);
					break;
				}
				case htmlIDs.iKonturUzytkuGruntowego: {
					pokazKonturUzytkugruntowego(i);
					break;
				}
				case htmlIDs.iDzialkaEwidencyjna: {
					pokazDzialkeEwidencyjna(i);
					break;
				}
				case htmlIDs.iBudynek: {
					pokazBudynek(i);
					break;
				}
				case htmlIDs.iBlokBudynku: {
					pokazBlokBudynku(i);
					break;
				}
				case htmlIDs.iObiektTrwaleZwiazanyZBudynkiem: {
					pokazObiektZwiazanyZBudynkiem(i);
					break;
				}
				case htmlIDs.iPunktGraniczny: {
					pokazPunkt(i);
					break;
				}
				case htmlIDs.iJednostkaRejestrowaGruntow: {
					pokazJRG(i);
					break;
				}
				case htmlIDs.iJednostkaRejestrowaBudynkow: {
					pokazJRB(i);
					break;
				}
				case htmlIDs.iJednostkaRejestrowaLokali: {
					pokazJRL(i);
					break;
				}
				case htmlIDs.iZmiana: {
					pokazZmiane(i);
					break;
				}
				case htmlIDs.iOperatTechniczny: {
					pokazOperat(i);
					break;
				}
				case htmlIDs.iDokument: {
					pokazDokument(i);
					break;
				}
				case htmlIDs.iLokalSamodzielny: {
					pokazLokal(i);
					break;
				}
				case htmlIDs.iPomieszczeniePrzynalezneDoLokalu: {
					pokazPomieszczeniePrzynalezne(i);
					break;
				}
				case htmlIDs.iOsobaFizyczna: {
					pokazOsobeFizyczna(i);
					break;
				}
				case htmlIDs.iMalzenstwo: {
					pokazMalzenstwo(i);
					break;
				}
				case htmlIDs.iInstytucja: {
					pokazInstytucje(i);
					break;
				}
				case htmlIDs.iPodmiotGrupowy: {
					pokazPodmiotGrupowy(i);
					break;
				}
				case htmlIDs.iWspolnotaGruntowa: {
					pokazWspolnoteGruntowa(i);
					break;
				}
				case htmlIDs.iAdresPodmiotu: {
					pokazAdresPodmiotu(i);
					break;
				}
				case htmlIDs.iAdresNieruchomosci: {
					pokazAdresNieruchomosci(i);
					break;
				}
				case htmlIDs.iUdzialWeWlasnosci: {
					pokazUdzialWeWlasnosci(i);
					break;
				}
				case htmlIDs.iUdzialWeWladaniu: {
					pokazUdzialWeWladaniu(i);
					break;
				}
			}
		}
	}
}

export function showEgbFeatureFromMap(id: string) {
	idsStack.clear();
	idsStack.push(id);
	showEgbFeatureInfo(id);
	showModal();
}

export function showEgbFeatureFromTable(id: string) {
	idsStack.clear();
	idsStack.push(id);
	showEgbFeatureInfo(id);
	if ((document.getElementById("modal") as HTMLDialogElement).style.display === "none") {
		showModal();
	}
}

export function showEgbFeature(id: string) {
	idsStack.push(id);
	showEgbFeatureInfo(id);
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const keep = (fn: Function) => fn;
keep(showEgbFeature);
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function showEgbPrevFeature() {
	showEgbFeatureInfo(idsStack.getPrev());
}

export function showEgbNextFeature() {
	showEgbFeatureInfo(idsStack.getNext());
}

export function showEgbFeatureOnMap() {
	//zmiana htmlID info na mapy
	sheetHighlightFeature("m" + idsStack.get());
}
