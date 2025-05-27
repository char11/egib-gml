export {};

declare global {
	interface XlinkType {
		_attributes: HrefType;
	}

	interface HrefType {
		href: string;
		type: string;
	}

	interface IdType {
		id: string;
	}

	interface UomType {
		uom: string;
	}

	interface AreaType {
		value: string;
		_attributes: UomType;
	}

	interface CI_OnlineResourceType {
		linkage: { URL?: string };
	}

	interface EGB_IdentyfikatorIIPType {
		lokalnyId: string;
		przestrzenNazw: string;
		wersjaId?: string;
	}

	interface EGB_Klasouzytek {
		EGB_Klasouzytek: EGB_KlasouzytekType;
	}

	interface EGB_KlasouzytekType {
		OFU: string; // array
		OZU?: string; // array
		OZK?: string; // array
		powierzchnia: AreaType;
	}

	interface Etykieta {
		Etykieta: EtykietaType;
	}

	interface EtykietaType {
		geometria: PointPropertyType;
		justyfikacja?: string;
		katObrotu?: string;
		odnosnik?: PointPropertyType;
		parametrPrzeskalowania?: string;
		tekst?: string;
		nazwaAtrybutu?: string;
	}

	interface PrezentacjaGraficzna {
		PrezentacjaGraficzna: PrezentacjaGraficznaType;
	}

	interface PrezentacjaGraficznaType {
		_attributes: IdType;
		kodObiektu?: string;
		geometria?: GeometryPropertyType[];
		katObrotu?: string;
		parametrPrzeskalowania?: string;
		etykieta?: Etykieta | Etykieta[];
		obiektPrzedstawiany: XlinkType; // EGB_OgolnyObiektType;
	}

	interface IdIIP {
		EGB_IdentyfikatorIIP: EGB_IdentyfikatorIIPType;
	}

	interface EGB_OgolnyObiektType {
		idIIP: IdIIP;
		startObiekt: string;
		startWersjaObiekt: string;
		koniecWersjaObiekt?: string;
		koniecObiekt?: string;
		dokument2?: XlinkType | XlinkType[]; // EGB_Dokument
		operatTechniczny2?: XlinkType | XlinkType[]; // EGB_OperatTechniczny
		podstawaUtworzeniaWersjiObiektu?: XlinkType; // EGB_Zmiana
		podstawaUsunieciaObiektu?: XlinkType; // EGB_Zmiana
	}

	interface EGB_JednostkaRejestrowaType extends EGB_OgolnyObiektType {}

	interface EGB_PodmiotType extends EGB_OgolnyObiektType {}

	interface EGB_Zmiana {
		EGB_Zmiana: EGB_ZmianaType;
	}

	interface EGB_ZmianaType {
		idIIP: IdIIP;
		_attributes: IdType;
		startObiekt: string;
		koniecObiekt?: string;
		dataAkceptacjiZmiany: string;
		dataPrzyjeciaZgloszeniaZmiany: string;
		nrZmiany: string;
		opisZmiany: string;
		dokument1?: XlinkType | XlinkType[]; // EGB_Dokument
		operatTechniczny1?: XlinkType | XlinkType[]; // EGB_OperatTechniczny
	}

	interface EGB_Dokument {
		EGB_Dokument: EGB_DokumentType;
	}

	interface EGB_DokumentType {
		idIIP: IdIIP;
		_attributes: IdType;
		startObiekt: string;
		koniecObiekt?: string;
		tytul: string;
		dataDokumentu?: string;
		nazwaTworcyDokumentu: string;
		opisDokumentu: string;
		rodzajDokumentu: string; // array
		sygnaturaDokumentu: string;
		oznKancelaryjneDokumentu: string;
		zasobSieciowy?: CI_OnlineResourceType | CI_OnlineResourceType[];
		zalacznikDokumentu?: XlinkType | XlinkType[]; // EGB_Dokument
	}

	interface EGB_OperatTechniczny {
		EGB_OperatTechniczny: EGB_OperatTechnicznyType;
	}

	interface EGB_OperatTechnicznyType {
		idIIP: IdIIP;
		_attributes: IdType;
		startObiekt: string;
		koniecObiekt?: string;
		dataPrzyjeciaDoPZGIK: string;
		dataSporzadzenia: string;
		identyfikatorOperatuWgPZGIK: string;
		nazwaTworcy?: string;
		opisOperatu?: string;
		zasobSieciowy: CI_OnlineResourceType;
	}

	interface EGB_JednostkaEwidencyjna {
		EGB_JednostkaEwidencyjna: EGB_JednostkaEwidencyjnaType;
	}

	interface EGB_JednostkaEwidencyjnaType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria?: MultiSurfacePropertyType;
		idJednostkiEwid: string;
		nazwaWlasna: string;
		punktGranicyJednEwid: XlinkType[]; // EGB_PunktGraniczny
	}

	interface EGB_ObrebEwidencyjny {
		EGB_ObrebEwidencyjny: EGB_ObrebEwidencyjnyType;
	}

	interface EGB_ObrebEwidencyjnyType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria?: MultiSurfacePropertyType;
		idObrebu: string;
		nazwaWlasna: string;
		punktGranicyObrebu: XlinkType[]; // EGB_PunktGraniczny
		lokalizacjaObrebu: XlinkType; // EGB_JednostkaEwidencyjna
	}

	interface EGB_DzialkaEwidencyjna {
		EGB_DzialkaEwidencyjna: EGB_DzialkaEwidencyjnaType;
	}

	interface EGB_DzialkaEwidencyjnaType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		idDzialki: string;
		geometria: SurfacePropertyType;
		dokumentWlasnosci?: string | string[];
		numerKW?: string | string[];
		poleEwidencyjne: AreaType;
		dokladnoscReprezentacjiPola: string; // array
		klasouzytek: EGB_Klasouzytek | EGB_Klasouzytek[];
		dodatkoweInformacje?: string;
		JRG2: XlinkType; // EGB_JednostkaRejestrowaGruntow
		adresDzialki?: XlinkType | XlinkType[]; // EGB_AdresNieruchomosci
		punktGranicyDzialki: XlinkType[]; // EGB_PunktGraniczny
		lokalizacjaDzialki: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_KonturUzytkuGruntowego {
		EGB_KonturUzytkuGruntowego: EGB_KonturUzytkuGruntowegoType;
	}

	interface EGB_KonturUzytkuGruntowegoType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria: SurfacePropertyType;
		idUzytku: string;
		OFU: string; // array
		lokalizacjaUzytku: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_KonturKlasyfikacyjny {
		EGB_KonturKlasyfikacyjny: EGB_KonturKlasyfikacyjnyType;
	}

	interface EGB_KonturKlasyfikacyjnyType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria: SurfacePropertyType;
		idKonturu: string;
		OZU: string; // array
		OZK?: string; // array
		lokalizacjaKonturu: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_Budynek {
		EGB_Budynek: EGB_BudynekType;
	}

	interface EGB_BudynekType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		idBudynku: string;
		geometria?: MultiSurfacePropertyType;
		rodzajWgKST: string; // array
		liczbaKondygnacjiNadziemnych: string;
		liczbaKondygnacjiPodziemnych: string;
		powZabudowy: AreaType;
		lacznaPowUzytkowaLokaliWyodrebnionych?: AreaType;
		lacznaPowUzytkowaLokaliNiewyodrebnionych?: AreaType;
		lacznaPowUzytkowaPomieszczenPrzynaleznych?: AreaType;
		dokumentWlasnosci?: string | string[];
		numerKW?: string | string[];
		dodatkoweInformacje?: string;
		dzialkaZabudowana: XlinkType | XlinkType[]; // EGB_DzialkaEwidencyjna
		adresBudynku?: XlinkType | XlinkType[]; // EGB_AdresNieruchomosci
		JRBdlaBudynku?: XlinkType; // EGB_JednostkaRejestrowaBudynkow
	}

	interface EGB_BlokBudynku {
		EGB_BlokBudynku: EGB_BlokBudynkuType;
	}

	interface EGB_BlokBudynkuType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria: SurfacePropertyType;
		rodzajBloku: string; // array
		oznaczenieBloku?: string;
		numerNajwyzszejKondygnacji?: string;
		numerNajnizszejKondygnacji?: string;
		budynekZBlokiemBud: XlinkType; // EGB_Budynek
	}

	interface EGB_ObiektTrwaleZwiazanyZBudynkiem {
		EGB_ObiektTrwaleZwiazanyZBudynkiem: EGB_ObiektTrwaleZwiazanyZBudynkiemType;
	}

	interface EGB_ObiektTrwaleZwiazanyZBudynkiemType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria: GeometryPropertyType;
		poliliniaKierunkowa?: CurvePropertyType;
		rodzajObiektuZwiazanegoZBudynkiem: string; // array
		budynekZElementamiZwiazanymi: XlinkType; // EGB_Budynek
	}

	interface EGB_LokalSamodzielny {
		EGB_LokalSamodzielny: EGB_LokalSamodzielnyType;
	}

	interface EGB_LokalSamodzielnyType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		idLokalu: string;
		numerPorzadkowyLokalu?: string;
		rodzajLokalu: string; // array
		dokumentWlasnosci?: string | string[];
		numerKW?: string | string[];
		powUzytkowaLokalu: AreaType;
		liczbaPomieszczenPrzynaleznych?: string;
		powPomieszczenPrzynaleznychDoLokalu?: AreaType;
		nrKondygnacji?: string;
		dodatkoweInformacje?: string;
		pomPrzynalezne?: XlinkType | XlinkType[]; // EGB_PomieszczeniePrzynalezneDoLokalu
		JRdlaLokalu?: XlinkType; // EGB_JednostkaRejestrowaLokali
		budynekZWyodrebnionymLokalem: XlinkType; // EGB_BudynekType;
		adresLokalu: XlinkType; // EGB_AdresNieruchomosci
	}

	interface EGB_PomieszczeniePrzynalezneDoLokalu {
		EGB_PomieszczeniePrzynalezneDoLokalu: EGB_PomieszczeniePrzynalezneDoLokaluType;
	}

	interface EGB_PomieszczeniePrzynalezneDoLokaluType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		rodzajPomieszczeniaPrzynaleznego: string; // array
		powierzchniaPomieszczeniaPrzynaleznego: AreaType;
		idBudynku?: string;
		budynekZPomieszczeniemPrzynaleznym?: XlinkType; //EGB_Budynek
		dodatkoweInformacje?: string;
	}

	interface EGB_JednostkaRejestrowaGruntow {
		EGB_JednostkaRejestrowaGruntow: EGB_JednostkaRejestrowaGruntowType;
	}

	interface EGB_JednostkaRejestrowaGruntowType extends EGB_JednostkaRejestrowaType {
		_attributes: IdType;
		idJednostkiRejestrowej: string;
		grupaRejestrowa: string; // array
		lokalizacjaJRG: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_JednostkaRejestrowaBudynkow {
		EGB_JednostkaRejestrowaBudynkow: EGB_JednostkaRejestrowaBudynkowType;
	}

	interface EGB_JednostkaRejestrowaBudynkowType extends EGB_JednostkaRejestrowaType {
		_attributes: IdType;
		idJednostkiRejestrowej: string;
		grupaRejestrowa: string; // array
		JRGZwiazanaZJRB: XlinkType | XlinkType[]; // EGB_JednostkaRejestrowaGruntow
		lokalizacjaJRB: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_JednostkaRejestrowaLokali {
		EGB_JednostkaRejestrowaLokali: EGB_JednostkaRejestrowaLokaliType;
	}

	interface EGB_JednostkaRejestrowaLokaliType extends EGB_JednostkaRejestrowaType {
		_attributes: IdType;
		idJednostkiRejestrowej: string;
		licznikUdzialuWNieruchomWspolnej: string;
		mianownikUdzialuWNieruchomWspolnej: string;
		grupaRejestrowa: string; // array
		JRGZwiazanaZJRL: XlinkType | XlinkType[]; // EGB_JednostkaRejestrowaGruntow
		czescWspolnaDlaLokalu?: XlinkType | XlinkType[]; // EGB_JednostkaRejestrowaBudynkow
		lokalizacjaJRL: XlinkType; // EGB_ObrebEwidencyjny
	}

	interface EGB_OsobaFizyczna {
		EGB_OsobaFizyczna: EGB_OsobaFizycznaType;
	}

	interface EGB_OsobaFizycznaType extends EGB_PodmiotType {
		_attributes: IdType;
		pierwszeImie: string;
		pierwszyCzlonNazwiska: string;
		drugiCzlonNazwiska?: string;
		drugieImie?: string;
		imieOjca?: string;
		imieMatki?: string;
		pesel?: string;
		plec: string; // array
		status: string; // array
		informacjaOSmierci?: string;
		adresZameldowania?: XlinkType; // EGB_AdresPodmiotu
		adresStalegoPobytu?: XlinkType; // EGB_AdresPodmiotu
	}

	interface EGB_Malzenstwo {
		EGB_Malzenstwo: EGB_MalzenstwoType;
	}

	interface EGB_MalzenstwoType extends EGB_PodmiotType {
		_attributes: IdType;
		osobaFizyczna2: XlinkType; // EGB_OsobaFizyczna
		osobaFizyczna3: XlinkType; // EGB_OsobaFizyczna
		status: string; // array
	}

	interface EGB_Instytucja {
		EGB_Instytucja: EGB_InstytucjaType;
	}

	interface EGB_InstytucjaType extends EGB_PodmiotType {
		_attributes: IdType;
		nazwaPelna: string;
		nazwaSkrocona?: string;
		regon?: string;
		status: string; // array
		czlonekZarzaduWspolnoty?: XlinkType | XlinkType[]; // EGB_OsobaFizyczna
		adresSiedziby?: XlinkType; // EGB_AdresPodmiotu
	}

	interface EGB_PodmiotGrupowy {
		EGB_PodmiotGrupowy: EGB_PodmiotGrupowyType;
	}

	interface EGB_PodmiotGrupowyType extends EGB_PodmiotType {
		_attributes: IdType;
		nazwaPelna?: string;
		nazwaSkrocona?: string;
		regon?: string;
		status: string; // array
		instytucja?: XlinkType | XlinkType[]; // EGB_Instytucja
		osobaFizyczna4?: XlinkType | XlinkType[]; // EGB_OsobaFizyczna
		malzenstwo3?: XlinkType | XlinkType[]; // EGB_Malzenstwo
		adresSiedziby?: XlinkType; // EGB_AdresPodmiotu
	}

	interface EGB_WspolnotaGruntowa {
		EGB_WspolnotaGruntowa: EGB_WspolnotaGruntowaType;
	}

	interface EGB_WspolnotaGruntowaType extends EGB_PodmiotType {
		_attributes: IdType;
		nazwa?: string;
		status: string; // array
		spolkaZarzadajaca?: XlinkType; // EGB_Instytucja
		podmiotUprawniony?: XlinkType | XlinkType[]; //EGB_Instytucja
		malzenstwoUprawnione?: XlinkType | XlinkType[]; //EGB_Malzenstwo
		osobaFizycznaUprawniona?: XlinkType | XlinkType[]; // EGB_OsobaFizyczna
	}

	interface EGB_UdzialWeWlasnosci {
		EGB_UdzialWeWlasnosci: EGB_UdzialWeWlasnosciType;
	}

	interface EGB_UdzialWeWlasnosciType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		rodzajPrawa: string; // array
		licznikUlamkaOkreslajacegoWartoscUdzialu: string;
		mianownikUlamkaOkreslajacegoWartoscUdzialu: string;
		podmiotUdzialuWlasnosci: EGB_Podmiot; // EGB_Podmiot
		przedmiotUdzialuWlasnosci: EGB_JednostkaRejestrowa; // EGB_JednostkaRejestrowa
		udzialWNieruchomosciWspolnej?: XlinkType; // EGB_UdzialWeWlasnosci
	}

	interface EGB_UdzialWeWladaniu {
		EGB_UdzialWeWladaniu: EGB_UdzialWeWladaniuType;
	}

	interface EGB_UdzialWeWladaniuType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		rodzajWladania: string; // array
		licznikUlamkaOkreslajacegoWartoscUdzialu?: string;
		mianownikUlamkaOkreslajacegoWartoscUdzialu?: string;
		podmiotUdzialuWeWladaniu: EGB_Podmiot; // EGB_Podmiot
		przedmiotUdzialuWladania: EGB_JednostkaRejestrowa; // EGB_JednostkaRejestrowa
	}

	interface EGB_AdresPodmiotu {
		EGB_AdresPodmiotu: EGB_AdresPodmiotuType;
	}

	interface EGB_AdresPodmiotuType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		kraj: string;
		miejscowosc: string;
		kodPocztowy?: string;
		ulica?: string;
		numerPorzadkowy: string | string;
		numerLokalu?: string | string;
	}

	interface EGB_AdresNieruchomosci {
		EGB_AdresNieruchomosci: EGB_AdresNieruchomosciType;
	}

	interface EGB_AdresNieruchomosciType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		nazwaMiejscowosci: string;
		idMiejscowosci?: string;
		nazwaUlicy?: string;
		idNazwyUlicy?: string;
		numerPorzadkowy?: string | string;
		numerLokalu?: string | string;
		geometria?: PointPropertyType;
	}

	interface EGB_PunktGraniczny {
		EGB_PunktGraniczny: EGB_PunktGranicznyType;
	}

	interface EGB_PunktGranicznyType extends EGB_OgolnyObiektType {
		_attributes: IdType;
		geometria: PointPropertyType;
		idPunktu: string;
		sposobPozyskania?: string; // array
		spelnienieWarunkowDokl: string; // array
		rodzajStabilizacji: string; // array
		oznWMaterialeZrodlowym?: string;
		numerOperatuTechnicznego?: string;
		dodatkoweInformacje?: string;
	}

	type FeatureMember =
		// EGB_OgolnyObiekt,
		// EGB_IdentyfikatorIIP,
		| EGB_JednostkaEwidencyjna
		| EGB_ObrebEwidencyjny
		| EGB_DzialkaEwidencyjna
		| EGB_KonturUzytkuGruntowego
		| EGB_KonturKlasyfikacyjny
		| EGB_Klasouzytek
		| EGB_Budynek
		| EGB_BlokBudynku
		| EGB_ObiektTrwaleZwiazanyZBudynkiem
		| EGB_LokalSamodzielny
		| EGB_PomieszczeniePrzynalezneDoLokalu
		| EGB_JednostkaRejestrowaGruntow
		| EGB_JednostkaRejestrowaBudynkow
		| EGB_JednostkaRejestrowaLokali
		| EGB_JednostkaRejestrowa
		| EGB_OsobaFizyczna
		| EGB_Malzenstwo
		| EGB_Instytucja
		| EGB_PodmiotGrupowy
		| EGB_WspolnotaGruntowa
		| EGB_Podmiot
		| EGB_UdzialWeWlasnosci
		| EGB_UdzialWeWladaniu
		| EGB_AdresZameldowania
		| EGB_AdresStalegoPobytu
		| EGB_AdresNieruchomosci
		| EGB_PunktGraniczny
		| EGB_Zmiana
		| EGB_Dokument
		| EGB_OperatTechniczny
		| PrezentacjaGraficzna
		| Etykieta;
}
