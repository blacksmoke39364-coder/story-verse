import { LanguageCode } from '../types';

export interface TranslationDictionary {
  brandTitle: string;
  brandTagline: string;
  explore: string;
  bookshelf: string;
  safety: string;
  createStory: string;
  owlChat: string;
  parentGate: string;
  bedtimeMode: string;
  bedtimeOn: string;
  bedtimeOff: string;
  languageSelect: string;
  
  // Home
  welcomeBack: string;
  readyForBedtime: string;
  startNewStory: string;
  minutesReadToday: string;
  dailyGoal: string;
  continueReading: string;
  featuredTales: string;
  readNow: string;
  
  // Creator
  creatorTitle: string;
  creatorSubtitle: string;
  pickTheme: string;
  characterName: string;
  characterPlaceholder: string;
  worldSetting: string;
  worldPlaceholder: string;
  bedtimeMood: string;
  artStyle: string;
  storyLength: string;
  imageQuality: string;
  generateStoryBtn: string;
  storyLanguageLabel: string;
  
  // Reader
  page: string;
  of: string;
  readAloud: string;
  pause: string;
  replay: string;
  highContrastOn: string;
  highContrastOff: string;
  askBarnaby: string;
  storyBible: string;
  nextPage: string;
  prevPage: string;
  finishStory: string;
  whatHappensNext: string;
  translating: string;
  
  // Library
  myBookshelf: string;
  librarySubtitle: string;
  searchStories: string;
  allLanguages: string;
  filterTheme: string;
  pagesUnit: string;
  emptyLibrary: string;
}

export const TRANSLATIONS: Record<'en' | 'hi' | 'te', TranslationDictionary> = {
  en: {
    brandTitle: 'StoryVerse AI',
    brandTagline: 'Every bedtime becomes a new adventure',
    explore: 'Explore',
    bookshelf: 'Bookshelf',
    safety: 'Child Safety',
    createStory: 'Create Story',
    owlChat: 'Owl Chat',
    parentGate: 'Parent',
    bedtimeMode: 'Bedtime Mode',
    bedtimeOn: 'Bedtime Calm ON',
    bedtimeOff: 'Bedtime Calm OFF',
    languageSelect: 'Language',
    
    welcomeBack: 'Welcome back,',
    readyForBedtime: 'Ready for your bedtime story adventure?',
    startNewStory: 'Create a New Story',
    minutesReadToday: 'minutes read today',
    dailyGoal: 'Daily Goal',
    continueReading: 'Continue Reading',
    featuredTales: 'Bedtime Bookshelf Favorites',
    readNow: 'Read Story',
    
    creatorTitle: 'Create Your Magical Story',
    creatorSubtitle: 'Every choice, character, and illustration crafted safely for sweet dreams.',
    pickTheme: '1. Pick a Bedtime Theme',
    characterName: '2. Hero Character Name',
    characterPlaceholder: 'e.g. Leo the Brave Bunny, Little Tara',
    worldSetting: '3. Magical World / Setting',
    worldPlaceholder: 'e.g. A whispering willow tree by a glowing pond',
    bedtimeMood: '4. Bedtime Mood & Tone',
    artStyle: '5. Illustration Art Style',
    storyLength: '6. Story Length',
    imageQuality: '7. Image Quality & Resolution',
    generateStoryBtn: 'Weave My Bedtime Story ✨',
    storyLanguageLabel: 'Story Language',
    
    page: 'Page',
    of: 'of',
    readAloud: 'Read Aloud',
    pause: 'Pause',
    replay: 'Replay',
    highContrastOn: 'High Contrast ON',
    highContrastOff: 'High Contrast OFF',
    askBarnaby: 'Ask Barnaby',
    storyBible: 'Story Bible',
    nextPage: 'Next Page',
    prevPage: 'Previous',
    finishStory: 'Finish Story',
    whatHappensNext: 'What should happen next?',
    translating: 'Translating...',
    
    myBookshelf: 'Bedtime Bookshelf',
    librarySubtitle: 'Explore your personal library of illustrated AI bedtime adventures.',
    searchStories: 'Search stories, characters, or themes...',
    allLanguages: 'All Languages',
    filterTheme: 'All Themes',
    pagesUnit: 'Pages',
    emptyLibrary: 'No stories found matching your filter.',
  },
  
  hi: {
    brandTitle: 'स्टोरीवर्स एआई',
    brandTagline: 'हर रात की नींद एक नया जादुई रोमांच',
    explore: 'एक्सप्लोर',
    bookshelf: 'किताबें',
    safety: 'बाल सुरक्षा',
    createStory: 'कहानी बनाएं',
    owlChat: 'उल्लू चैट',
    parentGate: 'अभिभावक',
    bedtimeMode: 'सोने का समय',
    bedtimeOn: 'सोने का मोड चालू',
    bedtimeOff: 'सोने का मोड बंद',
    languageSelect: 'भाषा',
    
    welcomeBack: 'स्वागत है,',
    readyForBedtime: 'क्या आप अपनी आज की जादुई कहानी के लिए तैयार हैं?',
    startNewStory: 'नई कहानी बनाएं',
    minutesReadToday: 'मिनट आज पढ़े गए',
    dailyGoal: 'दैनिक लक्ष्य',
    continueReading: 'पढ़ना जारी रखें',
    featuredTales: 'पसंदीदा परियों की कहानियाँ',
    readNow: 'कहानी पढ़ें',
    
    creatorTitle: 'अपनी जादुई कहानी बनाएं',
    creatorSubtitle: 'हर विकल्प, पात्र और सुंदर चित्र मीठे सपनों के लिए तैयार किए गए हैं।',
    pickTheme: '1. कहानी का विषय चुनें',
    characterName: '2. मुख्य नायक का नाम',
    characterPlaceholder: 'उदा. नटखट खरगोश, प्यारी तारा',
    worldSetting: '3. जादुई दुनिया या स्थान',
    worldPlaceholder: 'उदा. तारों भरा शांत जंगल और चमकती नदी',
    bedtimeMood: '4. कहानी का मिजाज (मूड)',
    artStyle: '5. सुंदर चित्रकारी शैली',
    storyLength: '6. कहानी की लंबाई',
    imageQuality: '7. चित्र गुणवत्ता (रिज़ॉल्यूशन)',
    generateStoryBtn: 'मेरी प्यारी कहानी बुनें ✨',
    storyLanguageLabel: 'कहानी की भाषा',
    
    page: 'पृष्ठ',
    of: 'का',
    readAloud: 'कहानी सुनें',
    pause: 'रोकें',
    replay: 'दोबारा सुनें',
    highContrastOn: 'उच्च कंट्रास्ट चालू',
    highContrastOff: 'उच्च कंट्रास्ट बंद',
    askBarnaby: 'बार्नाबी से पूछें',
    storyBible: 'स्टोरी बाइबिल',
    nextPage: 'अगला पृष्ठ',
    prevPage: 'पिछला पृष्ठ',
    finishStory: 'कहानी पूरी करें',
    whatHappensNext: 'आगे क्या होना चाहिए?',
    translating: 'अनुवाद हो रहा है...',
    
    myBookshelf: 'मेरी किताबों की अलमारी',
    librarySubtitle: 'अपनी सभी जादुई और सचित्र कहानियों को कभी भी पढ़ें।',
    searchStories: 'कहानियां, पात्र या विषय खोजें...',
    allLanguages: 'सभी भाषाएँ',
    filterTheme: 'सभी विषय',
    pagesUnit: 'पृष्ठ',
    emptyLibrary: 'कोई कहानी नहीं मिली।',
  },
  
  te: {
    brandTitle: 'స్టోరీవర్స్ AI',
    brandTagline: 'ప్రతి నిద్రవేళ ఒక కొత్త మాయా సాహసం',
    explore: 'అన్వేషించండి',
    bookshelf: 'పుస్తకాల అర',
    safety: 'పిల్లల భద్రత',
    createStory: 'కథను సృష్టించండి',
    owlChat: 'గుడ్లగూబ సంభాషణ',
    parentGate: 'తల్లిదండ్రులు',
    bedtimeMode: 'నిద్రవేళ మోడ్',
    bedtimeOn: 'నిద్రవేళ ప్రశాంతత ఆన్',
    bedtimeOff: 'నిద్రవేళ ప్రశాంతత ఆఫ్',
    languageSelect: 'భాష',
    
    welcomeBack: 'స్వాగతం,',
    readyForBedtime: 'ఈ రోజు మీ నిద్రవేళ కథా సాహసానికి సిద్ధంగా ఉన్నారా?',
    startNewStory: 'కొత్త కథను సృష్టించండి',
    minutesReadToday: 'నిమిషాలు ఈ రోజు చదివారు',
    dailyGoal: 'రోజువారీ లక్ష్యం',
    continueReading: 'చదవడం కొనసాగించండి',
    featuredTales: 'నిద్రవేళ కథల పుస్తకాలు',
    readNow: 'కథ చదవండి',
    
    creatorTitle: 'మీ మాయా కథను సృష్టించండి',
    creatorSubtitle: 'ప్రతి ఎంపిక, పాత్ర మరియు అందమైన చిత్రం మధురమైన నిద్రకోసం రూపొందించబడ్డాయి.',
    pickTheme: '1. కథా ఇతివృత్తాన్ని ఎంచుకోండి',
    characterName: '2. ప్రధాన పాత్ర పేరు',
    characterPlaceholder: 'ఉదా. ధైర్యవంతుడైన చిన్న కుందేలు, చిన్నారి తార',
    worldSetting: '3. మాయా ప్రపంచం / ప్రదేశం',
    worldPlaceholder: 'ఉదా. నక్షత్రాల కాంతిలో మెరిసే అందమైన అడవి',
    bedtimeMood: '4. కథా మానసిక స్థితి (మూడ్)',
    artStyle: '5. చిత్ర కళా శైలి',
    storyLength: '6. కథ నిడివి',
    imageQuality: '7. చిత్ర నాణ్యత (రిజల్యూషన్)',
    generateStoryBtn: 'నా నిద్రవేళ కథను అల్లండి ✨',
    storyLanguageLabel: 'కథ భాష',
    
    page: 'పేజీ',
    of: 'లో',
    readAloud: 'కథను వినండి',
    pause: 'ఆపండి',
    replay: 'మళ్ళీ వినండి',
    highContrastOn: 'హై కాంట్రాస్ట్ ఆన్',
    highContrastOff: 'హై కాంట్రాస్ట్ ఆఫ్',
    askBarnaby: 'బార్నబీని అడగండి',
    storyBible: 'కథా వివరాలు',
    nextPage: 'తరువాతి పేజీ',
    prevPage: 'మునుపటి పేజీ',
    finishStory: 'కథను ముగించండి',
    whatHappensNext: 'తరువాత ఏం జరగాలి?',
    translating: 'అనువదిస్తోంది...',
    
    myBookshelf: 'కథల పుస్తకాల అర',
    librarySubtitle: 'మీరు సృష్టించిన అన్ని రంగుల నిద్రవేళ కథలను ఆనందించండి.',
    searchStories: 'కథలు, పాత్రలు లేదా అంశాలను శోధించండి...',
    allLanguages: 'అన్ని భాషలు',
    filterTheme: 'అన్ని ఇతివృత్తాలు',
    pagesUnit: 'పేజీలు',
    emptyLibrary: 'కథలు ఏవీ కనుగొనబడలేదు.',
  },
};

/**
 * Returns the localized translation dictionary for the active language.
 * Defaults cleanly to English if language is not 'hi' or 'te'.
 */
export function getTranslations(lang: LanguageCode | string = 'en'): TranslationDictionary {
  if (lang === 'hi') return TRANSLATIONS.hi;
  if (lang === 'te') return TRANSLATIONS.te;
  return TRANSLATIONS.en;
}
