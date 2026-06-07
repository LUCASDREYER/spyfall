"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "pt-BR" | "es" | "fr" | "de";

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "en",    flag: "🇺🇸", label: "English"    },
  { code: "pt-BR", flag: "🇧🇷", label: "Português"  },
  { code: "es",    flag: "🇪🇸", label: "Español"    },
  { code: "fr",    flag: "🇫🇷", label: "Français"   },
  { code: "de",    flag: "🇩🇪", label: "Deutsch"    },
];

type Strings = Record<string, string>;

const T: Record<Lang, Strings> = {
  en: {
    subtitle:       "Who among you is the spy?",
    players:        "Players",
    addPlayer:      "Add player",
    spies:          "Spies",
    spy:            "spy",
    spiesPlural:    "spies",
    locations:      "Locations",
    selectAll:      "Select all",
    deselectAll:    "Deselect all",
    dealCards:      "Deal Cards",
    errMinPlayers:  "Add at least 2 players.",
    errSpyCount:    "Spy count must be less than player count.",
    passPhoneTo:    "Pass the phone to",
    playerOf:       "{{n}} of {{total}} players",
    iHavePhone:     "I have the phone",
    yourCard:       "YOUR CARD",
    tapReveal:      "Tap reveal — make sure only you can see!",
    youAre:         "YOU ARE",
    theSpy:         "THE SPY",
    spyHint:        "Figure out the location without getting caught!",
    reveal:         "Reveal",
    hide:           "Hide",
    allLocations:   "All possible locations ({{n}})",
    location:       "Location",
    yourRole:       "Your role",
    passTo:         "Pass to {{name}}",
    donePlaying:    "Done — start playing!",
    allDealt:       "All cards dealt!",
    everyoneReady:  "Everyone knows their role. Start asking questions!",
    newGame:        "New Game",
    home:           "Home",
    noGame:         "No game found",
    startNew:       "Start a new game",
  },
  "pt-BR": {
    subtitle:       "Quem é o espião?",
    players:        "Jogadores",
    addPlayer:      "Adicionar jogador",
    spies:          "Espiões",
    spy:            "espião",
    spiesPlural:    "espiões",
    locations:      "Locais",
    selectAll:      "Selecionar todos",
    deselectAll:    "Desmarcar todos",
    dealCards:      "Distribuir Cartas",
    errMinPlayers:  "Adicione pelo menos 2 jogadores.",
    errSpyCount:    "O número de espiões deve ser menor que o de jogadores.",
    passPhoneTo:    "Passe o celular para",
    playerOf:       "{{n}} de {{total}} jogadores",
    iHavePhone:     "Estou com o celular",
    yourCard:       "SUA CARTA",
    tapReveal:      "Toque em revelar — certifique-se de que só você veja!",
    youAre:         "VOCÊ É",
    theSpy:         "O ESPIÃO",
    spyHint:        "Descubra o local sem ser pego!",
    reveal:         "Revelar",
    hide:           "Ocultar",
    allLocations:   "Todos os locais possíveis ({{n}})",
    location:       "Local",
    yourRole:       "Seu papel",
    passTo:         "Passar para {{name}}",
    donePlaying:    "Pronto — comecem a jogar!",
    allDealt:       "Todas as cartas foram distribuídas!",
    everyoneReady:  "Todos sabem seu papel. Comecem a fazer perguntas!",
    newGame:        "Novo Jogo",
    home:           "Início",
    noGame:         "Nenhum jogo encontrado",
    startNew:       "Iniciar novo jogo",
  },
  es: {
    subtitle:       "¿Quién es el espía?",
    players:        "Jugadores",
    addPlayer:      "Añadir jugador",
    spies:          "Espías",
    spy:            "espía",
    spiesPlural:    "espías",
    locations:      "Lugares",
    selectAll:      "Seleccionar todos",
    deselectAll:    "Deseleccionar todos",
    dealCards:      "Repartir Cartas",
    errMinPlayers:  "Añade al menos 2 jugadores.",
    errSpyCount:    "El número de espías debe ser menor que el de jugadores.",
    passPhoneTo:    "Pasa el móvil a",
    playerOf:       "{{n}} de {{total}} jugadores",
    iHavePhone:     "Tengo el móvil",
    yourCard:       "TU CARTA",
    tapReveal:      "Toca revelar — ¡asegúrate de que solo tú puedas ver!",
    youAre:         "ERES",
    theSpy:         "EL ESPÍA",
    spyHint:        "¡Descubre el lugar sin que te pillen!",
    reveal:         "Revelar",
    hide:           "Ocultar",
    allLocations:   "Todos los lugares posibles ({{n}})",
    location:       "Lugar",
    yourRole:       "Tu papel",
    passTo:         "Pasar a {{name}}",
    donePlaying:    "¡Listo — a jugar!",
    allDealt:       "¡Todas las cartas repartidas!",
    everyoneReady:  "Todos conocen su papel. ¡Empezad a hacer preguntas!",
    newGame:        "Nueva Partida",
    home:           "Inicio",
    noGame:         "No se encontró ninguna partida",
    startNew:       "Iniciar nueva partida",
  },
  fr: {
    subtitle:       "Qui est l'espion parmi vous ?",
    players:        "Joueurs",
    addPlayer:      "Ajouter un joueur",
    spies:          "Espions",
    spy:            "espion",
    spiesPlural:    "espions",
    locations:      "Lieux",
    selectAll:      "Tout sélectionner",
    deselectAll:    "Tout désélectionner",
    dealCards:      "Distribuer les cartes",
    errMinPlayers:  "Ajoutez au moins 2 joueurs.",
    errSpyCount:    "Le nombre d'espions doit être inférieur au nombre de joueurs.",
    passPhoneTo:    "Passe le téléphone à",
    playerOf:       "{{n}} sur {{total}} joueurs",
    iHavePhone:     "J'ai le téléphone",
    yourCard:       "VOTRE CARTE",
    tapReveal:      "Appuyez sur révéler — assurez-vous d'être seul à voir !",
    youAre:         "VOUS ÊTES",
    theSpy:         "L'ESPION",
    spyHint:        "Découvrez le lieu sans vous faire attraper !",
    reveal:         "Révéler",
    hide:           "Masquer",
    allLocations:   "Tous les lieux possibles ({{n}})",
    location:       "Lieu",
    yourRole:       "Votre rôle",
    passTo:         "Passer à {{name}}",
    donePlaying:    "Terminé — commencez à jouer !",
    allDealt:       "Toutes les cartes distribuées !",
    everyoneReady:  "Tout le monde connaît son rôle. Commencez à poser des questions !",
    newGame:        "Nouvelle partie",
    home:           "Accueil",
    noGame:         "Aucune partie trouvée",
    startNew:       "Démarrer une nouvelle partie",
  },
  de: {
    subtitle:       "Wer ist der Spion unter euch?",
    players:        "Spieler",
    addPlayer:      "Spieler hinzufügen",
    spies:          "Spione",
    spy:            "Spion",
    spiesPlural:    "Spione",
    locations:      "Orte",
    selectAll:      "Alle auswählen",
    deselectAll:    "Alle abwählen",
    dealCards:      "Karten austeilen",
    errMinPlayers:  "Füge mindestens 2 Spieler hinzu.",
    errSpyCount:    "Die Anzahl der Spione muss kleiner als die Spieleranzahl sein.",
    passPhoneTo:    "Gib das Handy an",
    playerOf:       "{{n}} von {{total}} Spielern",
    iHavePhone:     "Ich habe das Handy",
    yourCard:       "DEINE KARTE",
    tapReveal:      "Tippe auf Aufdecken — stell sicher, dass nur du es siehst!",
    youAre:         "DU BIST",
    theSpy:         "DER SPION",
    spyHint:        "Finde den Ort heraus, ohne erwischt zu werden!",
    reveal:         "Aufdecken",
    hide:           "Verbergen",
    allLocations:   "Alle möglichen Orte ({{n}})",
    location:       "Ort",
    yourRole:       "Deine Rolle",
    passTo:         "Weiter an {{name}}",
    donePlaying:    "Fertig — jetzt spielen!",
    allDealt:       "Alle Karten ausgeteilt!",
    everyoneReady:  "Jeder kennt seine Rolle. Fangt an, Fragen zu stellen!",
    newGame:        "Neues Spiel",
    home:           "Startseite",
    noGame:         "Kein Spiel gefunden",
    startNew:       "Neues Spiel starten",
  },
};

function interpolate(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("spyfall-lang") as Lang | null;
    if (saved && T[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("spyfall-lang", l);
  };

  const t = (key: string, vars?: Record<string, string | number>) =>
    interpolate(T[lang]?.[key] ?? T.en[key] ?? key, vars);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
