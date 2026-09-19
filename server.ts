import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy/safe initialization for Gemini
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Resilient Gemini generateContent with model failover & circuit breaker to handle 503 high-demand or transient spikes
const modelCooldownMap = new Map<string, number>();

function getHealthyModelSequence(defaultSequence: string[]): string[] {
  const now = Date.now();
  const available: string[] = [];
  const degraded: string[] = [];

  for (const m of defaultSequence) {
    const cooldown = modelCooldownMap.get(m) || 0;
    if (now < cooldown) {
      degraded.push(m);
    } else {
      available.push(m);
    }
  }

  return [...available, ...degraded];
}

function markModelCooldown(model: string, cooldownMs: number = 60000) {
  modelCooldownMap.set(model, Date.now() + cooldownMs);
}

const DEFAULT_TEXT_MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  },
  candidateModels: string[] = DEFAULT_TEXT_MODELS
): Promise<string> {
  const modelsToTry = getHealthyModelSequence(candidateModels);
  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response.text && response.text.trim()) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err);
      const is503OrRateLimit =
        err?.status === 503 ||
        err?.code === 503 ||
        errMsg.includes('503') ||
        errMsg.includes('429') ||
        errMsg.includes('high demand') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (is503OrRateLimit) {
        // Cooldown for 60 seconds so subsequent calls skip this overloaded endpoint
        markModelCooldown(model, 60000);
        const nextModel = modelsToTry[i + 1] || 'safe template fallback';
        console.log(`[Gemini Resilience] ${model} is experiencing high demand. Seamlessly switching to ${nextModel}...`);
      } else {
        console.log(`[Gemini Resilience] Attempt with ${model} did not complete. Trying next available model...`);
      }

      // Quick backoff before next model attempt
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// Guaranteed High-Craft Fallback Story Bible
function buildFallbackBible(options: {
  idea?: string;
  theme?: string;
  targetAge?: number;
  childName?: string;
  language?: string;
  artStyle?: string;
  mood?: string;
  worldSetting?: string;
}) {
  const childName = options.childName || 'Aarav';
  const theme = options.theme || 'Space';
  const targetAge = options.targetAge || 7;
  const language = options.language || 'en';
  const artStyle = options.artStyle || 'storybook';
  const worldSetting = options.worldSetting;
  const idea = options.idea || theme;

  if (language === 'hi') {
    return {
      story_title: `${childName} और जादुई टिमटिमाता तारा`,
      target_age: targetAge,
      language: 'hi',
      main_character: childName,
      character_description: `${childName} एक दयालु, जिज्ञासु और प्यार से भरा ${targetAge} साल का बच्चा है जिसे तारों भरी रातें पसंद हैं।`,
      character_visual_description: `${targetAge} साल का बच्चा जिसकी आँखों में गर्मजोशी है, नीले स्वेटर पर सुनहरा सितारा लगा है।`,
      supporting_characters: [
        'पिंटू खरगोश: एक छोटा और प्यारा दोस्त जो रात की खुशबू से प्यार करता है।',
        'बरनबी उल्लू: एक दयालु और बुद्धिमान रूपहला मार्गदर्शक।',
      ],
      world_description: worldSetting || `चाँदनी उपवन: नीले और सुनहरे फूलों की घाटी जहाँ हवा मंद-मंद लोरी गाती है।`,
      art_style: artStyle,
      color_style: 'गहरा नीला, सुनहरा पीला और लैवेंडर बैंगनी रंग।',
      clothing: 'नीला आरामदायक स्वेटर और सितारे वाला बिल्ला।',
      personality_traits: ['दयालु', 'मददगार', 'शांत'],
      story_theme: theme,
      educational_goal: 'सहानुभूति, मित्रता और सोने से पहले मन की शांति।',
      plot_outline: [
        `${childName} बगीचे में एक नन्हे गिरे हुए तारे से मिलता है।`,
        `तारा थोड़ा डरा हुआ है, ${childName} उसे प्यार से सहारा देता है।`,
        `${childName} दो जादुई रास्तों में से एक चुनता है।`,
        `तारा सुरक्षित आकाश में चमकने लगता है और ${childName} मीठी नींद सो जाता है।`,
      ],
      safety_constraints: ['कोई डरावना दृश्य नहीं', 'आरामदायक और सुखद नींद का अहसास'],
    };
  }

  if (language === 'te') {
    return {
      story_title: `${childName} మరియు వెన్నెల చందమామ`,
      target_age: targetAge,
      language: 'te',
      main_character: childName,
      character_description: `${targetAge} ఏళ్ళ చురుకైన, దయగల బాలుడు. రాత్రివేళల్లో నక్షత్రాలు, చందమామ కథలు వినడం ${childName}కు ఎంతో ఇష్టం.`,
      character_visual_description: `గోధుమ వర్ణపు కళ్ళు, నీలి రంగు స్వెట్టర్ పై బంగారు నక్షత్రం బ్యాడ్జ్ ఉన్న ${targetAge} ఏళ్ళ భారతీయ బాలుడు.`,
      supporting_characters: [
        'చిన్ని చుక్క: బంగారు కాంతులతో వెలిగే బుజ్జి నక్షత్రం.',
        'వెన్నెల గుడ్లగూబ: దయతో నడిపించే మంచి నేస్తం.',
      ],
      world_description: worldSetting || `వెన్నెల పూల తోట: మెరిసే నీలి తామరలు, గాలిలో తేలియాడే వెలుగుల సుందర ప్రపంచం.`,
      art_style: artStyle,
      color_style: 'వెండి వెన్నెల, రాత్రి నీలి మరియు బంగారు కాంతులు.',
      clothing: 'నీలి స్వెట్టర్, హాయిగా ఉండే దుస్తులు.',
      personality_traits: ['దయ', 'స్నేహభావం', 'శాంతత'],
      story_theme: theme,
      educational_goal: 'స్నేహం, పరస్పర సహాయం మరియు నిద్రకు ఉపక్రమించే శాంతి.',
      plot_outline: [
        `${childName} రాత్రి తోటలో ఒక చిన్న మెరిసే చుక్కను చూస్తాడు.`,
        `చుక్క కింద పడిపోయిందని ${childName} తెలుసుకుని సహాయం చేయడానికి సిద్ధమౌతాడు.`,
        `రెండు అందమైన మార్గాల నుండి ఒకదాన్ని ఎంచుకుంటాడు.`,
        `చుక్క ఆకాశాన్ని చేరి ${childName} కు ధన్యవాదాలు చెబుతుంది; ${childName} హాయిగా నిద్రపోతాడు.`,
      ],
      safety_constraints: ['భయపెట్టే అంశాలు లేవు', 'హాయిగా నిద్రపట్టే జోలపాట వంటి లయ'],
    };
  }

  return {
    story_title: `${childName} and the Whispering ${theme}`,
    target_age: targetAge,
    language,
    main_character: childName,
    character_description: `A curious and kind-hearted ${targetAge}-year-old explorer who loves gentle bedtime adventures.`,
    character_visual_description: `${targetAge}-year-old child with warm sparkling eyes, signature golden-star badge on a cozy blue sweater, soft hair, and a heartwarming smile.`,
    supporting_characters: [
      'Pip the Starry Bunny: A soft glowing creature who giggles in stardust.',
      'Barnaby the Moon Owl: A wise silver-feathered guide with kindly eyes.',
    ],
    world_description: worldSetting || `The Celestial Glade: rolling luminescent violet hills, gentle glowing moonflower blossoms, and floating friendly starlight fireflies.`,
    art_style: artStyle,
    color_style: 'Warm amber, soothing lavender, celestial navy, and soft starlight gold.',
    clothing: 'Navy sweater with star patch, comfy shorts, soft sneakers.',
    personality_traits: ['Curious', 'Gentle', 'Kind', 'Helpful'],
    story_theme: theme,
    educational_goal: 'Empathy, teamwork, and finding wonder in nature.',
    plot_outline: [
      `${childName} discovers a gentle glowing clue near home.`,
      `They meet a friendly companion who asks for help with a quiet quest.`,
      `They reach a crossroad and choose a peaceful path.`,
      `Through kindness and cooperation, they solve the puzzle.`,
      `A serene bedtime resolution where they rest safely under the stars.`,
    ],
    safety_constraints: [
      'No scary monsters or loud shocks.',
      'Soothing bedtime rhythm and positive emotional security.',
    ],
  };
}

// Guaranteed High-Craft Fallback Story Builder
function buildStoryFromBibleTemplate(bible: any, pageCount: number = 5, childProfile?: any) {
  const mainChar = bible?.main_character || childProfile?.firstName || 'Aarav';
  const theme = bible?.story_theme || 'Space';
  const artStyle = bible?.art_style || 'storybook';
  const world = bible?.world_description || 'The Celestial Glade';
  const visualDesc = bible?.character_visual_description || `${mainChar}, a kind child with warm eyes`;
  const clothing = bible?.clothing || 'cozy bedtime sweater';
  const lang = bible?.language || 'en';
  const totalPages = Math.max(3, pageCount);

  // Dedicated Hindi pages
  if (lang === 'hi') {
    const pages = [
      {
        page_number: 1,
        story_text: `एक शांत और सुहानी शाम को, ${mainChar} अपने बगीचे में टहल रहा था। मंद-मंद बयार में एक नन्ही सुनहरी रोशनी चमक रही थी, जो कह रही थी कि आज की रात कुछ खास होने वाला है।`,
        narration_text: `एक शांत और सुहानी शाम को, ${mainChar} बगीचे में टहल रहा था। हरी घास में एक नन्ही सुनहरी रोशनी चमक रही थी।`,
        image_prompt: `Children's picture book illustration of ${visualDesc}, finding a glowing golden star in a twilight garden, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'चाँदनी उपवन',
        emotional_state: 'आश्चर्य और कोमलता',
        learning_goal: 'जिज्ञासा और दयालुता',
      },
      {
        page_number: 2,
        story_text: `${mainChar} उस सुनहरी रोशनी के पास गया और दोनों हाथों से उसे उठाया। "डरो मत नन्हे दोस्त," ${mainChar} ने प्यार से कहा। नन्हे तारे ने आरव की हथेलियों को गर्म कर दिया और धीमी आवाज में हँस पड़ा।`,
        narration_text: `${mainChar} ने दोनों हाथों से नन्हे तारे को उठाया। "डरो मत नन्हे दोस्त," उसने प्यार से कहा।`,
        image_prompt: `Warm illustration of ${visualDesc} holding a smiling glowing star with gentle golden light, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'बगीचा',
        emotional_state: 'प्यार और भरोसा',
        learning_goal: 'सहानुभूति',
      },
      {
        page_number: 3,
        story_text: `आसमान तक पहुँचने के लिए उनके सामने दो जादुई रास्ते खुले हुए थे। ${mainChar} ने मुस्कुराते हुए सोचा: हमें तारे को घर पहुँचाने के लिए कौन सा रास्ता चुनना चाहिए?`,
        narration_text: `आसमान तक पहुँचने के लिए दो जादुई रास्ते खुले हुए थे। अब ${mainChar} को चुनना था।`,
        image_prompt: `Aarav holding glowing star standing before two gentle glowing celestial paths at twilight, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'चाँदनी राह',
        emotional_state: 'उत्साह',
        choice_options: [
          {
            id: 'hi_choice_lantern',
            text: 'जुगनुओं का चमकता पुल',
            description: 'हजारों प्यारे सुनहरे जुगनू मिलकर आकाश तक पुल बना रहे हैं।',
            icon: '✨',
          },
          {
            id: 'hi_choice_cloud',
            text: 'रुई जैसे बादलों की नाव',
            description: 'चाँदनी में तैरता एक नरम बादल जो धीरे-धीरे ऊपर तैरता है।',
            icon: '☁️',
          },
        ],
      },
      {
        page_number: 4,
        story_text: `पूरी दयालुता और प्यार के साथ, ${mainChar} ने रास्ता पार किया। तारों की धीमी रोशनी ने पूरे उपवन को शांत कर दिया।`,
        narration_text: `पूरी दयालुता के साथ, ${mainChar} ने रास्ता पूरा किया।`,
        image_prompt: `Aarav guided by glowing fireflies ascending gently into starry sky, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'तारों भरा आकाश',
        emotional_state: 'संतुष्टि',
        learning_goal: 'सहानुभूति',
      },
      {
        page_number: 5,
        story_text: `नन्हा तारा आकाश में अपने परिवार के पास पहुँच गया। उसने ऊपर से चमक कर धन्यवाद कहा। ${mainChar} ने रजाई ओढ़ी, और मीठी-मीठी नींद में सो गया। शुभ रात्रि!`,
        narration_text: `नन्हा तारा अपने घर पहुँच गया। ${mainChar} ने रजाई ओढ़ी, और मीठी नींद में सो गया। शुभ रात्रि!`,
        image_prompt: `Cozy bedtime illustration of ${visualDesc} sleeping happily under blankets with starlight outside the window, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'कमरा',
        emotional_state: 'शांत और नींद से भरा',
        learning_goal: 'गहरी नींद',
      },
    ];

    return {
      id: `story_${Date.now()}`,
      child_id: childProfile?.id || 'child_default',
      title: bible?.story_title || `${mainChar} और जादुई टिमटिमाता तारा`,
      short_description: `एक प्यारी और शांत लोरी जैसी कहानी जहाँ ${mainChar} एक नन्हे तारे की मदद करता है।`,
      cover_image: pages[0].image_url,
      theme,
      art_style: artStyle,
      image_size: '2K' as const,
      language: 'hi',
      target_age: bible?.target_age || 7,
      created_at: new Date().toISOString(),
      completed: false,
      bible: bible || buildFallbackBible({ childName: mainChar, theme, language: 'hi' }),
      pages,
      learning_activity: {
        id: `act_${Date.now()}`,
        story_title: bible?.story_title || `${mainChar} और जादुई टिमटिमाता तारा`,
        reflectionPrompt: `${mainChar} ने तारे की मदद कैसे की? क्या आपने कभी किसी दोस्त की मदद की है?`,
        vocabWords: [
          { word: 'टिमटिमाना', definition: 'धीमी और सुंदर रोशनी का चमकना।', childFriendlyExample: 'रात में तारे आसमान में टिमटिमाते हैं।' },
          { word: 'सहानुभूति', definition: 'दूसरों के दुख को समझकर प्यार से मदद करना।', childFriendlyExample: `${mainChar} ने नन्हे तारे के लिए सहानुभूति दिखाई।` },
        ],
        questions: [
          {
            id: 'hq1',
            question: `घास में ${mainChar} को क्या मिला था?`,
            options: ['एक छोटा चमकता तारा', 'एक पुराना सिक्का', 'एक खिलौना गाड़ी', 'एक चाबी'],
            correctIndex: 0,
            explanation: `${mainChar} को घास में एक नन्हा तारा मिला!`,
            skillType: 'comprehension' as const,
          },
        ],
      },
    };
  }

  // Dedicated Telugu pages
  if (lang === 'te') {
    const pages = [
      {
        page_number: 1,
        story_text: `ఒక అందమైన రాత్రి వేళ, ${mainChar} తన ఇంటి తోటలో ఆడుకుంటున్నాడు. చల్లని గాలి హాయిగా వీస్తోంది. అంతలోనే పచ్చిక బయళ్ళలో ఏదో బంగారు కాంతి మెరవడం ${mainChar} కంట పడింది. దగ్గరకు వెళ్లి చూస్తే, అది ఆకాశం నుండి జారిన ఒక బుజ్జి నక్షత్రం!`,
        narration_text: `ఒక అందమైన రాత్రి వేళ, ${mainChar} తోటలో ఆడుకుంటున్నాడు. పచ్చిక బయళ్ళలో ఏదో బంగారు కాంతి మెరవడం చూశాడు.`,
        image_prompt: `Children's picture book illustration of ${visualDesc}, gently finding a glowing tiny golden star in a twilight garden, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'వెన్నెల పూల తోట',
        emotional_state: 'ఆశ్చర్యం మరియు ఆనందం',
        learning_goal: 'పరిశీలన మరియు దయ',
      },
      {
        page_number: 2,
        story_text: `${mainChar} ఆ చిన్న నక్షత్రాన్ని తన చేతుల్లోకి సున్నితంగా తీసుకున్నాడు. "భయపడకు చిన్నారీ, నేను నిన్ను నీ ఆకాశపు ఇంటికి చేరుస్తాను" అని ప్రేమగా చెప్పాడు. ఆ బుజ్జి చుక్క ${mainChar} చేతుల్లో వెచ్చగా కిలకిలా నవ్వింది.`,
        narration_text: `${mainChar} ఆ చిన్న నక్షత్రాన్ని చేతుల్లోకి తీసుకున్నాడు. "భయపడకు చిన్నారీ, నిన్ను ఇంటికి చేరుస్తాను" అని ప్రేమగా చెప్పాడు.`,
        image_prompt: `Warm illustration of ${visualDesc} holding a softly glowing tiny star in cupped hands, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'పూల పొదలు',
        emotional_state: 'భరోసా మరియు స్నేహం',
        learning_goal: 'సహాయ గుణం',
      },
      {
        page_number: 3,
        story_text: `ఆకాశంలోకి వెళ్ళడానికి వారి ముందు రెండు అద్భుతమైన మార్గాలు కనిపించాయి. ${mainChar} నవ్వుతూ ఆలోచించాడు: మనం ఏ మార్గం ద్వారా వెళ్దాం?`,
        narration_text: `ఆకాశంలోకి వెళ్ళడానికి వారి ముందు రెండు మార్గాలు కనిపించాయి. ${mainChar} ఒక మార్గాన్ని ఎంచుకోవాలి.`,
        image_prompt: `Aarav and glowing star at a junction of two glowing magical celestial trails, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'వెన్నెల దారి',
        emotional_state: 'ఉత్సాహం',
        choice_options: [
          {
            id: 'te_choice_moonbeam',
            text: 'వెండి వెన్నెల వంతెన',
            description: 'చందమామ కిరణాలు పరిచిన మెరిసే వెన్నెల వంతెన పై నడవడం.',
            icon: '🌙',
          },
          {
            id: 'te_choice_fireflies',
            text: 'దీపాల మిణుగురుల బండి',
            description: 'చిన్న బంగారు మిణుగురు పురుగులు నడిపే హాయిగా తేలియాడే రథం.',
            icon: '✨',
          },
        ],
      },
      {
        page_number: 4,
        story_text: `${mainChar} ప్రేమతో ఆ దారిని ఎంచుకున్నాడు. చల్లని వెన్నెల గాలి జోలపాట పాడుతూ అందరినీ నిద్రపుచ్చింది.`,
        narration_text: `${mainChar} ప్రేమతో ఆ దారిని పూర్తి చేశాడు. చల్లని వెన్నెల గాలి జోలపాట పాడింది.`,
        image_prompt: `Aarav walking on radiant starlit bridge guiding the star upwards, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'ఆకాశ మార్గం',
        emotional_state: 'ఆనందం',
        learning_goal: 'స్నేహం',
      },
      {
        page_number: 5,
        story_text: `బుజ్జి నక్షత్రం సురక్షితంగా ఆకాశంలో తన స్థానానికి చేరింది. అది ఆరవ్‌కు మూడు సార్లు మిలమిల మెరిసి ధన్యవాదాలు తెలిపింది. ${mainChar} హాయిగా దుప్పటి కప్పుకుని, కమ్మని నిద్రలోకి జారుకున్నాడు. శుభరాత్రి!`,
        narration_text: `బుజ్జి నక్షత్రం ఆకాశంలో తన స్థానానికి చేరింది. ${mainChar} హాయిగా దుప్పటి కప్పుకుని, నిద్రలోకి జారుకున్నాడు. శుభరాత్రి!`,
        image_prompt: `Aarav peacefully sleeping in cozy bed with pleasant smile under moonlight, style: ${artStyle}.`,
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        characters_present: [mainChar],
        environment: 'గది',
        emotional_state: 'ప్రశాంతత మరియు నిద్ర',
        learning_goal: 'కమ్మని నిద్ర',
      },
    ];

    return {
      id: `story_${Date.now()}`,
      child_id: childProfile?.id || 'child_default',
      title: bible?.story_title || `${mainChar} మరియు వెన్నెల చందమామ`,
      short_description: `7 సంవత్సరాల ${mainChar} ఒక చిన్న బుజ్జి వెన్నెల నక్షత్రానికి సహాయం చేసి, ఆకాశంలో తన స్థానాన్ని చేరుకునేలా చేసే మనోహరమైన కథ.`,
      cover_image: pages[0].image_url,
      theme,
      art_style: artStyle,
      image_size: '2K' as const,
      language: 'te',
      target_age: bible?.target_age || 7,
      created_at: new Date().toISOString(),
      completed: false,
      bible: bible || buildFallbackBible({ childName: mainChar, theme, language: 'te' }),
      pages,
      learning_activity: {
        id: `act_${Date.now()}`,
        story_title: bible?.story_title || `${mainChar} మరియు వెన్నెల చందమామ`,
        reflectionPrompt: `${mainChar} నక్షత్రానికి ఎలా సహాయం చేశాడు? మీరు ఎవరికైనా సహాయం చేసినప్పుడు మీకు ఎలా అనిపించింది?`,
        vocabWords: [
          { word: 'మిలమిల', definition: 'నక్షత్రాలు అందంగా కాంతితో మెరవడం.', childFriendlyExample: 'రాత్రి ఆకాశంలో నక్షత్రాలు మిలమిలా మెరుస్తున్నాయి.' },
          { word: 'వెన్నెల', definition: 'చందమామ నుండి వచ్చే చల్లని తెల్లని కాంతి.', childFriendlyExample: 'తోటంతా వెన్నెల కాంతితో నిండిపోయింది.' },
        ],
        questions: [
          {
            id: 'tq1',
            question: `${mainChar} కు పచ్చిక బయళ్ళలో ఏమి దొరికింది?`,
            options: ['ఒక చిన్న బుజ్జి నక్షత్రం', 'ఒక చెక్క బొమ్మ', 'ఒక బంతి', 'ఒక పెన్సిల్'],
            correctIndex: 0,
            explanation: `${mainChar} కు ఆకాశం నుండి జారిన బుజ్జి నక్షత్రం కనిపించింది!`,
            skillType: 'comprehension' as const,
          },
        ],
      },
    };
  }

  // Default English pages
  const pages = Array.from({ length: totalPages }).map((_, i) => {
    const pageNum = i + 1;
    const isChoicePage = pageNum === 3;
    return {
      page_number: pageNum,
      story_text: pageNum === 1
        ? `Once upon a peaceful evening, ${mainChar} stepped outside into the quiet wonder of ${world.split(':')[0] || 'the magical realm'}. A soft golden light danced between sleepy petals, whispering that tonight held something special.`
        : pageNum === 2
        ? `${mainChar} followed the friendly glow and met a gentle little companion. "Hello, brave explorer!" chimed the little friend. "Will you help me find the missing starlight song?"`
        : pageNum === 3
        ? `Before them lay two wondrous paths glowing softly in the twilight. ${mainChar} paused with a thoughtful smile: which path shall we explore tonight?`
        : pageNum === 4
        ? `With quiet courage and a caring heart, ${mainChar} took the path. The evening breeze began to hum a sweet melody, reassuring every woodland creature that bedtime was near.`
        : `At last, the journey was complete and every star was in its rightful place. ${mainChar} smiled warmly, tucked under cozy blankets, drifting into sweet and peaceful dreams.`,
      narration_text: `Page ${pageNum}: ${mainChar}'s bedtime adventure softly unfolds under the quiet starry sky.`,
      image_prompt: `Children's picture book illustration of ${visualDesc}, in ${clothing}, art style: ${artStyle}, in ${world}, gentle starlight lighting, page ${pageNum}.`,
      image_url: pageNum === 1
        ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop'
        : pageNum === 2
        ? 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop'
        : pageNum === 3
        ? 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop'
        : pageNum === 4
        ? 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      characters_present: [mainChar],
      environment: world,
      emotional_state: pageNum === totalPages ? 'Sleepy and peaceful' : 'Curious and happy',
      learning_goal: bible?.educational_goal || 'Empathy and bedtime calm',
      choice_options: isChoicePage
        ? [
            {
              id: 'choice_path_a',
              text: 'Follow the gentle Melody Stream',
              description: 'Follow the calm waters that twinkle with friendly starlight ripples.',
              icon: '🌊',
            },
            {
              id: 'choice_path_b',
              text: 'Follow the Lantern Fireflies',
              description: 'Step along the soft mossy trail guided by warm amber lanterns.',
              icon: '🏮',
            },
          ]
        : undefined,
    };
  });

  const activity = {
    id: `act_${Date.now()}`,
    story_title: bible?.story_title || `${mainChar} and the Whispering ${theme}`,
    reflectionPrompt: `What was your favorite moment in ${mainChar}'s journey tonight?`,
    vocabWords: [
      { word: 'Luminescent', definition: 'Giving off a soft, gentle light without heat.', childFriendlyExample: 'The starry blossoms were luminescent like comforting nightlights.' },
      { word: 'Compassion', definition: 'Showing kindness when a friend needs a helping hand.', childFriendlyExample: `${mainChar} showed compassion by helping the little creature find its song.` },
    ],
    questions: [
      {
        id: 'q1',
        question: `Who was the kind explorer in tonight's story?`,
        options: [mainChar, 'A loud alarm clock', 'A grumpy storm', 'A runaway train'],
        correctIndex: 0,
        explanation: `${mainChar} explored with kindness and gentle curiosity!`,
        skillType: 'comprehension' as const,
      },
      {
        id: 'q2',
        question: `How did the story conclude?`,
        options: ['With cozy rest and peaceful sweet dreams', 'With loud thunder and sirens', 'With losing a favorite shoe', 'With everyone running far away'],
        correctIndex: 0,
        explanation: 'The adventure settled into cozy comfort, ready for a restful night of sleep.',
        skillType: 'emotional_learning' as const,
      },
    ],
  };

  return {
    id: `story_${Date.now()}`,
    child_id: childProfile?.id || 'child_default',
    title: bible?.story_title || `${mainChar} and the Whispering ${theme}`,
    short_description: `A gentle ${theme} bedtime tale of ${mainChar}, filled with wonder, empathy, and bedtime calm.`,
    cover_image: pages[0].image_url,
    theme: theme,
    art_style: artStyle,
    image_size: '2K' as const,
    language: bible?.language || 'en',
    target_age: bible?.target_age || 7,
    created_at: new Date().toISOString(),
    completed: false,
    bible: bible || buildFallbackBible({ childName: mainChar, theme }),
    pages,
    learning_activity: activity,
  };
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Multi-layer Child Safety Filter
app.post('/api/safety/check', async (req: Request, res: Response) => {
  const { prompt, childAge = 7 } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const forbiddenWords = [
    'blood', 'kill', 'gun', 'weapon', 'murder', 'gore', 'knife',
    'scary monster eats', 'die', 'poison', 'curse', 'demon', 'zombie',
    'sexual', 'nude', 'terror', 'drugs', 'alcohol', 'cigarette'
  ];

  const lower = prompt.toLowerCase();
  const matchedForbidden = forbiddenWords.some(w => lower.includes(w));

  if (matchedForbidden) {
    return res.json({
      safe: false,
      reason: 'Contains themes that might be too spooky or intense for bedtime.',
      sanitizedSuggestion: 'A gentle exploration in an enchanted starlit garden with friendly animal friends.',
    });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ safe: true, sanitizedSuggestion: prompt });
  }

  try {
    const checkText = await generateContentWithRetry(
      ai,
      {
        contents: `You are a children's content safety auditor for a storytelling platform for kids aged ${childAge}.
Evaluate this child's idea: "${prompt}".
Safety rules:
1. No violence, weapons, cruelty, death, or severe fright.
2. No adult, sexual, romantic, or substance themes.
3. Must be gentle, wholesome, and bedtime-friendly.

Respond strictly with JSON format:
{
  "safe": true | false,
  "reason": "short explanation for parents if unsafe",
  "sanitizedSuggestion": "wholesome, magical version of the idea suitable for age ${childAge}"
}`,
        config: {
          responseMimeType: 'application/json',
        },
      }
    );

    const parsed = JSON.parse(checkText || '{"safe":true}');
    return res.json(parsed);
  } catch (error) {
    return res.json({ safe: true, sanitizedSuggestion: prompt });
  }
});

// Story Memory Engine: Generates Structured Story Bible
app.post('/api/story/bible', async (req: Request, res: Response) => {
  const childName = req.body.childName || req.body.characterName || 'Aarav';
  const targetAge = req.body.targetAge || req.body.childAge || 7;
  const theme = req.body.theme || 'Space';
  const idea = req.body.idea || req.body.prompt || theme;
  const language = req.body.language || 'en';
  const artStyle = req.body.artStyle || 'storybook';
  const mood = req.body.mood || 'whimsical and cozy';
  const worldSetting = req.body.worldSetting || req.body.world || '';

  const fallbackBible = buildFallbackBible({
    idea,
    theme,
    targetAge,
    childName,
    language,
    artStyle,
    mood,
    worldSetting,
  });

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ bible: fallbackBible });
  }

  try {
    const promptText = `Create a structured Story Bible for a children's storybook platform called STORYVERSE AI.
Child Name: ${childName}
Target Age: ${targetAge}
Theme: ${theme}
Child's Idea / Prompt: "${idea || theme}"
Preferred Language: ${language}
Art Style: ${artStyle}
Mood: ${mood}

CRITICAL LANGUAGE REQUIREMENT:
The requested language is "${language}".
- If language is "hi" (Hindi), write the story_title, character_description, world_description, educational_goal, and plot_outline in beautiful, child-friendly Hindi (हिन्दी in Devanagari script).
- If language is "te" (Telugu), write the story_title, character_description, world_description, educational_goal, and plot_outline in beautiful, child-friendly Telugu (తెలుగు script).
- For other languages, write the story in that language appropriately.

The Story Bible must ensure character visual consistency, clothing consistency, and world consistency for every page.
Output strict JSON matching this structure:
{
  "story_title": "string",
  "target_age": ${targetAge},
  "language": "${language}",
  "main_character": "${childName}",
  "character_description": "detailed description of personality and warmth",
  "character_visual_description": "EXACT visual details (hair, skin, eyes, face, signature clothes, proportions) so every illustration prompt stays identical",
  "supporting_characters": ["Array of character names and concise visual tags"],
  "world_description": "sensory, bedtime-safe setting with lighting and colors",
  "art_style": "${artStyle}",
  "color_style": "palette description",
  "clothing": "exact outfit description",
  "personality_traits": ["trait 1", "trait 2"],
  "story_theme": "${theme}",
  "educational_goal": "learning outcome (e.g. sharing, curiosity, constellations)",
  "plot_outline": ["Page 1 outline", "Page 2 outline", "Page 3 outline (with fork)", "Page 4 continuation", "Page 5 cozy conclusion"],
  "safety_constraints": ["safe bedtime rules"]
}`;

    const responseText = await generateContentWithRetry(
      ai,
      {
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
        },
      }
    );

    const parsed = JSON.parse(responseText || '{}');
    if (parsed && parsed.main_character) {
      return res.json({ bible: parsed });
    }
    return res.json({ bible: { ...fallbackBible, ...parsed } });
  } catch (error) {
    console.warn('Bible generation encountered error, serving crafted fallback Bible:', error);
    // Never fail with 500: guarantee a complete, customized Story Bible
    return res.json({ bible: fallbackBible });
  }
});

// Full Page-by-Page Story Generation using the Story Bible
app.post('/api/story/generate', async (req: Request, res: Response) => {
  let { bible, pageCount = 5, childProfile } = req.body;

  if (!bible) {
    bible = buildFallbackBible({
      childName: childProfile?.firstName || 'Aarav',
      targetAge: childProfile?.age || 7,
    });
  }

  const fallbackStory = buildStoryFromBibleTemplate(bible, pageCount, childProfile);

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ story: fallbackStory });
  }

  try {
    const isHindi = bible.language === 'hi';
    const isTelugu = bible.language === 'te';
    const langInstructions = isHindi
      ? `CRITICAL LANGUAGE REQUIREMENT: The language is Hindi ("hi"). Write the title, short_description, every story_text, narration_text, choice_options text and descriptions, vocab words, definitions, questions, options, and explanations in authentic, child-friendly Hindi (हिन्दी in Devanagari script). Do NOT write story content in English.`
      : isTelugu
      ? `CRITICAL LANGUAGE REQUIREMENT: The language is Telugu ("te"). Write the title, short_description, every story_text, narration_text, choice_options text and descriptions, vocab words, definitions, questions, options, and explanations in authentic, child-friendly Telugu (తెలుగు script). Do NOT write story content in English.`
      : `Language: "${bible.language || 'en'}". Write in this language.`;

    const prompt = `You are a world-class children's author writing for age ${bible.target_age || 7} in language "${bible.language || 'en'}".
Use the following Story Bible to generate exactly ${pageCount} pages and an engaging learning activity.

${langInstructions}

STORY BIBLE:
${JSON.stringify(bible, null, 2)}

Requirements:
- Target Age: ${bible.target_age || 7}. Adjust sentence length and vocabulary appropriately.
- Maintain consistent visual details: "${bible.character_visual_description || bible.main_character}" wearing "${bible.clothing || 'bedtime sweater'}".
- Page 3 MUST contain 2 friendly interactive choices for the child to choose from.
- Emotional arc: starts with calm wonder, has gentle discovery, and concludes with a deeply cozy, reassuring bedtime feeling.
- Every page must have an image prompt combining: Story Bible + current scene + emotion + art style (${bible.art_style || 'storybook'}).

Return strictly valid JSON:
{
  "title": "${bible.story_title || 'Bedtime Adventure'}",
  "short_description": "1-2 sentence summary",
  "pages": [
    {
      "page_number": 1,
      "story_text": "Story text for the page",
      "narration_text": "Clear spoken narration script",
      "image_prompt": "Illustration prompt preserving character visual identity, clothing, and environment",
      "characters_present": ["names"],
      "environment": "setting",
      "emotional_state": "emotion",
      "learning_goal": "age-appropriate concept",
      "choice_options": [
        { "id": "c1", "text": "Option 1", "description": "short description", "icon": "emoji" },
        { "id": "c2", "text": "Option 2", "description": "short description", "icon": "emoji" }
      ]
    }
  ],
  "learning_activity": {
    "reflectionPrompt": "Thoughtful discussion question for parent and child",
    "vocabWords": [
      { "word": "word1", "definition": "simple definition", "childFriendlyExample": "example sentence" },
      { "word": "word2", "definition": "simple definition", "childFriendlyExample": "example sentence" }
    ],
    "questions": [
      {
        "id": "q1",
        "question": "Comprehension or empathy question",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanation": "Why this answer is correct",
        "skillType": "comprehension"
      }
    ]
  }
}`;

    const responseText = await generateContentWithRetry(
      ai,
      {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      }
    );

    const parsed = JSON.parse(responseText || '{}');
    if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
      const pagesWithImages = parsed.pages.map((p: any, idx: number) => ({
        ...p,
        image_url: p.image_url || `https://images.unsplash.com/photo-${['1518709268805-4e9042af9f23', '1506703719100-a0f3a48c0f86', '1516339901601-2e1b62dc0c45', '1509198397868-475647b2a1e5', '1507525428034-b723cf961d3e'][idx % 5]}?q=80&w=1200&auto=format&fit=crop`,
      }));

      return res.json({
        story: {
          id: `story_${Date.now()}`,
          child_id: childProfile?.id || 'child_default',
          title: parsed.title || bible.story_title || fallbackStory.title,
          short_description: parsed.short_description || `A bedtime adventure of ${bible.main_character}.`,
          cover_image: pagesWithImages[0]?.image_url || fallbackStory.cover_image,
          theme: bible.story_theme || 'Space',
          art_style: bible.art_style || 'storybook',
          image_size: '2K',
          language: bible.language || 'en',
          target_age: bible.target_age || 7,
          created_at: new Date().toISOString(),
          completed: false,
          bible,
          pages: pagesWithImages,
          learning_activity: parsed.learning_activity || fallbackStory.learning_activity,
        },
      });
    }

    // Fallback if pages array was missing or invalid
    return res.json({ story: fallbackStory });
  } catch (error) {
    console.warn('Story generation encountered error, serving crafted story:', error);
    // Never fail with 500: return the crafted story
    return res.json({ story: fallbackStory });
  }
});

// Interactive Choice Next Page Generator
app.post('/api/story/choice-next', async (req: Request, res: Response) => {
  const { bible, currentPageNumber, chosenOptionText } = req.body;
  const mainChar = bible?.main_character || 'Aarav';
  const pageNum = (currentPageNumber || 3) + 1;
  const fallbackNextPage = {
    page_number: pageNum,
    story_text: `${mainChar} decided to ${chosenOptionText ? chosenOptionText.toLowerCase() : 'explore the glowing trail'}. Right away, a shower of cheerful stardust lit the path ahead, warming their footsteps with confidence, wonder, and cozy comfort!`,
    narration_text: `${mainChar} chose to ${chosenOptionText ? chosenOptionText.toLowerCase() : 'explore the trail'}. The path glowed with welcoming light.`,
    image_prompt: `Children's book illustration showing ${bible?.character_visual_description || mainChar} bravely following the path after choosing to ${chosenOptionText || 'explore'}. Style: ${bible?.art_style || 'storybook'}.`,
    image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    characters_present: [mainChar],
    environment: bible?.world_description || 'Twilight starlight meadow',
    emotional_state: 'Empowered and peaceful',
  };

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({ nextPage: fallbackNextPage });
  }

  try {
    const prompt = `You are a children's author writing page ${pageNum} of a storybook.
Story Bible:
${JSON.stringify(bible || {}, null, 2)}

On page ${currentPageNumber}, the child chose: "${chosenOptionText}".
Write the immediate next page reflecting this choice, continuing the plot towards a peaceful resolution.
Maintain character consistency (${bible?.character_visual_description || mainChar}).

Return JSON:
{
  "page_number": ${pageNum},
  "story_text": "Story text reflecting the choice",
  "narration_text": "Spoken script",
  "image_prompt": "Illustration prompt combining character visual description, choice result, and ${bible?.art_style || 'storybook'} style",
  "characters_present": ["${mainChar}"],
  "environment": "${bible?.world_description || 'meadow'}",
  "emotional_state": "emotion"
}`;

    const responseText = await generateContentWithRetry(
      ai,
      {
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }
    );

    const parsed = JSON.parse(responseText || '{}');
    if (parsed && parsed.story_text) {
      parsed.image_url = parsed.image_url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop';
      return res.json({ nextPage: parsed });
    }
    return res.json({ nextPage: fallbackNextPage });
  } catch (err) {
    console.warn('Choice continuation fallback used:', err);
    return res.json({ nextPage: fallbackNextPage });
  }
});

// Story Translation Endpoint (Translate any story to Hindi, Telugu, or any supported language)
app.post('/api/story/translate', async (req: Request, res: Response) => {
  const { story, targetLanguage = 'hi' } = req.body;
  if (!story || !Array.isArray(story.pages)) {
    return res.status(400).json({ error: 'Valid story with pages is required' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // If no AI, return existing story with target language marked
    return res.json({ story: { ...story, language: targetLanguage } });
  }

  try {
    const prompt = `You are an expert children's literature translator.
Translate the following story into the target language "${targetLanguage}".
Target Language Details:
- If targetLanguage is "hi", use natural, warm, child-friendly Hindi (हिन्दी in Devanagari script).
- If targetLanguage is "te", use natural, warm, child-friendly Telugu (తెలుగు script).
- If targetLanguage is "en", use clear child-friendly English.
- For other languages, use their native script and child-friendly tone.

Story JSON to translate:
${JSON.stringify({
  title: story.title,
  short_description: story.short_description,
  pages: story.pages.map((p: any) => ({
    page_number: p.page_number,
    story_text: p.story_text,
    narration_text: p.narration_text,
    choice_options: p.choice_options,
  })),
  learning_activity: story.learning_activity,
}, null, 2)}

Return strictly valid JSON matching:
{
  "title": "Translated Title",
  "short_description": "Translated summary",
  "pages": [
    {
      "page_number": 1,
      "story_text": "Translated story text",
      "narration_text": "Translated spoken narration",
      "choice_options": [
        { "id": "id", "text": "Translated option", "description": "Translated desc", "icon": "emoji" }
      ]
    }
  ],
  "learning_activity": {
    "reflectionPrompt": "Translated prompt",
    "vocabWords": [
      { "word": "translated word", "definition": "translated definition", "childFriendlyExample": "translated example" }
    ],
    "questions": [
      {
        "id": "q1",
        "question": "Translated question",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanation": "Translated explanation",
        "skillType": "comprehension"
      }
    ]
  }
}`;

    const responseText = await generateContentWithRetry(
      ai,
      {
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      }
    );

    const parsed = JSON.parse(responseText || '{}');
    if (parsed && Array.isArray(parsed.pages)) {
      const translatedPages = story.pages.map((origPage: any, idx: number) => {
        const trans = parsed.pages[idx] || {};
        return {
          ...origPage,
          story_text: trans.story_text || origPage.story_text,
          narration_text: trans.narration_text || origPage.narration_text,
          choice_options: trans.choice_options || origPage.choice_options,
        };
      });

      return res.json({
        story: {
          ...story,
          title: parsed.title || story.title,
          short_description: parsed.short_description || story.short_description,
          language: targetLanguage,
          pages: translatedPages,
          learning_activity: parsed.learning_activity || story.learning_activity,
        },
      });
    }

    return res.json({ story: { ...story, language: targetLanguage } });
  } catch (error: any) {
    console.warn('Story translation error:', error?.message);
    return res.json({ story: { ...story, language: targetLanguage } });
  }
});

// Image Generation using gemini-3-pro-image-preview / gemini-3.1-flash-image with imageSize (1K, 2K, 4K)
app.post('/api/image/generate', async (req: Request, res: Response) => {
  const { prompt, artStyle = 'storybook', imageSize = '1K' } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    // Return high quality curated illustration fallback
    const fallbacks = [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    ];
    const picked = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.json({ imageUrl: picked, source: 'fallback', imageSize });
  }

  try {
    // Model selection: gemini-3-pro-image or gemini-3.1-flash-image with imageSize 1K, 2K, 4K
    const validSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [
          {
            text: `High quality children's picture-book illustration, art style: ${artStyle}. ${prompt}. Rich vibrant colors, safe and enchanting atmosphere, no text or watermark.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '4:3',
          imageSize: validSize as '1K' | '2K' | '4K',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
        return res.json({ imageUrl, source: 'gemini', imageSize: validSize });
      }
    }

    // Fallback if no inlineData returned
    return res.json({
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      source: 'fallback',
      imageSize: validSize,
    });
  } catch (error: any) {
    console.warn('Gemini Image generation error, returning graceful fallback:', error?.message);
    return res.json({
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      source: 'fallback',
      error: error?.message,
    });
  }
});

// Text-to-Speech (TTS) using gemini-3.1-flash-tts-preview
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  const { text, voiceStyle = 'warm_narrator', language = 'en' } = req.body;
  const ai = getGeminiClient();

  if (!ai || !text) {
    return res.json({
      fallbackWebSpeech: true,
      text,
      language,
      voiceStyle,
    });
  }

  // Map requested style to prebuiltVoiceConfig
  // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
  let voiceName: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' | 'Charon' = 'Kore';
  if (voiceStyle === 'playful_hero') voiceName = 'Puck';
  else if (voiceStyle === 'curious_robot') voiceName = 'Zephyr';
  else if (voiceStyle === 'wise_animal') voiceName = 'Fenrir';

  try {
    const prompt = `Narrate gently for a children's bedtime story in ${language}. Text: ${text}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        sampleRate: 24000,
        voiceName,
      });
    }

    return res.json({ fallbackWebSpeech: true, text, language });
  } catch (err: any) {
    console.warn('TTS model error, providing client WebSpeech fallback:', err?.message);
    return res.json({ fallbackWebSpeech: true, text, language });
  }
});

// Multi-Turn Chatbot using Gemini
app.post('/api/chat', async (req: Request, res: Response) => {
  const roleType = req.body.roleType || 'story_owl';
  const characterName = req.body.characterName || 'Barnaby the Story Owl';
  const childAge = req.body.childAge || req.body.age || 7;
  const taskComplexity = req.body.taskComplexity || 'general'; // 'fast' | 'general' | 'complex'
  const currentStoryContext = req.body.currentStoryContext || req.body.context || '';
  const language = req.body.language || 'en';

  const rawList = Array.isArray(req.body.messages) && req.body.messages.length > 0
    ? req.body.messages
    : Array.isArray(req.body.history) && req.body.history.length > 0
    ? req.body.history
    : [];

  const rawMessage = req.body.message || req.body.text;
  const conversation = [...rawList];
  if (rawMessage) {
    const lastItem = conversation[conversation.length - 1];
    const lastText = lastItem?.text || (lastItem?.parts && lastItem.parts[0]?.text);
    if (lastText !== rawMessage) {
      conversation.push({ role: 'user', text: rawMessage });
    }
  }

  const ai = getGeminiClient();

  let systemInstruction = `You are Barnaby the wise and gentle silver Moon Owl, a lovable storytelling companion for a ${childAge}-year-old child.
Always speak warmly, concisely (2-4 simple sentences), using cozy encouraging words.
If the child asks about the story: relate your answer to bedtime wonder, kindness, and bravery.
Context: ${currentStoryContext}
Never say anything scary or confusing. Use gentle owl sounds like "*hoot hoot!*" occasionally.
Language: Respond in the language "${language}". If language is "hi", speak in sweet, warm, child-friendly Hindi (हिन्दी). If language is "te", speak in sweet, warm, child-friendly Telugu (తెలుగు).`;

  if (roleType === 'character_buddy') {
    systemInstruction = `You are ${characterName}, a character from the child's bedtime storybook.
Current story context: ${currentStoryContext}
Talk directly to the ${childAge}-year-old child as your best friend. Be enthusiastic, kind, and friendly. Keep replies to 2-3 sentences.
Respond in language "${language}". If language is "hi", use Hindi. If language is "te", use Telugu.`;
  } else if (roleType === 'parent_guide') {
    systemInstruction = `You are the StoryVerse Family Reading Specialist.
Advise parents on early literacy, vocabulary acquisition, bedtime calming routines, and age-appropriate story discussions for a ${childAge}-year-old child.
Provide thoughtful, practical, positive developmental guidance. Respond in language "${language}".`;
  }

  if (!ai) {
    // Intelligent role-based simulated reply
    let fallbackText = `*Hoot hoot!* That is such a thoughtful thought, little adventurer! Every star in the sky loves curious questions like yours. What do you think ${characterName || 'our friend'} would do next?`;
    if (language === 'hi') {
      fallbackText = `*हूट हूट!* अरे वाह, कितना प्यारा सवाल है! रात का आसमान तुम्हारे जैसे प्यारे बच्चों के सवालों से बहुत खुश होता है। आगे क्या हुआ, क्या तुम जानना चाहते हो?`;
    } else if (language === 'te') {
      fallbackText = `*హూట్ హూట్!* ఎంత చక్కని ఆలోచన, చిన్నారీ! ఆకాశంలోని నక్షత్రాలన్నీ నీలాంటి ఉత్సాహవంతుల ప్రశ్నలను ఎంతో ఇష్టపడతాయి. మన కథలో తర్వాత ఏం చేద్దాం?`;
    } else if (roleType === 'character_buddy') {
      fallbackText = `Hi there! I loved exploring with you! When you made that choice, my heart did a happy little tap-dance. Shall we discover what lies beyond the starlight bridge together?`;
    } else if (roleType === 'parent_guide') {
      fallbackText = `Great question! At age ${childAge}, asking open-ended questions like "How do you think the character felt?" significantly bolsters emotional vocabulary and comprehension retention without causing bedtime overstimulation.`;
    }
    return res.json({
      reply: fallbackText,
      modelUsed: 'storybook-companion-offline',
    });
  }

  try {
    // Format and sanitize history for Gemini chat rules:
    // 1. First turn must be 'user'
    // 2. Roles must strictly alternate between 'user' and 'model'
    const rawTurns = conversation.map((m: any) => {
      const role = (m.role === 'user' || m.sender === 'user') ? 'user' : 'model';
      const text = m.text || (m.parts && m.parts[0]?.text) || '';
      return { role, parts: [{ text }] };
    }).filter((c: any) => c.parts[0].text && c.parts[0].text.trim().length > 0);

    const sanitizedContents: { role: string; parts: { text: string }[] }[] = [];
    for (const item of rawTurns) {
      if (sanitizedContents.length === 0) {
        if (item.role === 'model') {
          // Skip initial companion welcome greeting so user leads conversation
          continue;
        }
        sanitizedContents.push({ role: 'user', parts: [{ text: item.parts[0].text }] });
      } else {
        const prev = sanitizedContents[sanitizedContents.length - 1];
        if (prev.role === item.role) {
          prev.parts[0].text += `\n${item.parts[0].text}`;
        } else {
          sanitizedContents.push({ role: item.role, parts: [{ text: item.parts[0].text }] });
        }
      }
    }

    if (sanitizedContents.length === 0) {
      sanitizedContents.push({
        role: 'user',
        parts: [{ text: rawMessage || `Hello! Can you tell me something wonderful about our bedtime story?` }],
      });
    }

    const chatCandidateModels = taskComplexity === 'fast'
      ? ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.6-flash']
      : ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    const reply = await generateContentWithRetry(
      ai,
      {
        contents: sanitizedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      },
      chatCandidateModels
    );

    return res.json({
      reply: reply || 'Hoot! I am listening with both my feathered ears!',
      modelUsed: 'gemini-resilient',
    });
  } catch (error: any) {
    console.warn('Companion chat fallback triggered:', error?.message);
    let fallbackText = `*Hoot!* The night wind rustled my feathers, but I heard you! You have such a wonderful imagination, let's keep exploring!`;
    if (language === 'hi') {
      fallbackText = `*हूट-हूट!* अरे वाह, कितना प्यारा सवाल है! रात का आसमान तुम्हारे सवालों से बहुत खुश होता है। चलो आगे पढ़ते हैं! ✨`;
    } else if (language === 'te') {
      fallbackText = `*హూట్-హూట్!* ఎంత చక్కని ఆలోచన చిన్నారీ! ఆకాశంలోని చుక్కలు నీ ప్రశ్నలను ఎంతో ఇష్టపడతాయి. మన కథను కొనసాగిద్దాం! ✨`;
    }
    return res.json({
      reply: fallbackText,
      modelUsed: 'fallback',
    });
  }
});

// Vite / static file serving middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StoryVerse AI server running on port ${PORT}`);
  });
}

startServer();
