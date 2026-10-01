import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'ROMAN',
    price: 6.90,
    originalPrice: 12.00,
    rating: 4.98,
    reviewsCount: 480,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80',
    description: 'Le chef-d’œuvre universel d’Antoine de Saint-Exupéry. Égaré dans le désert du Sahara, un aviateur rencontre un petit garçon venu d’une lointaine planète. Une méditation poétique et philosophique sur l’amour, l’amitié et le sens de l’existence.',
    pages: 112,
    publishedYear: 1943,
    fileSize: '1.2 Mo',
    r2FileKey: 'ebooks/le-petit-prince.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    isNewRelease: false,
    excerpt: [
      "Lorsque j'avais six ans, j'ai vu, une fois, une magnifique image, dans un livre sur la Forêt Vierge qui s'appelait Histoires Vécues. Ça représentait un serpent boa qui avalait un fauve.",
      "J'ai alors dessiné l'intérieur du serpent boa, afin que les grandes personnes puissent comprendre. Elles ont toujours besoin d'explications.",
      "— S'il vous plaît... dessine-moi un mouton ! C'est ainsi que je fis la connaissance du petit prince."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Le serpent boa et le dessin n°1',
        paragraphs: [
          "Lorsque j'avais six ans, j'ai vu, une fois, une magnifique image, dans un livre sur la Forêt Vierge qui s'appelait Histoires Vécues. Ça représentait un serpent boa qui avalait un fauve. Voilà la copie du dessin. On disait dans le livre : « Les serpents boas avalent leur proie tout entière, sans la mâcher. Ensuite ils ne peuvent plus bouger et ils dorment pendant les six mois de leur digestion. »",
          "J'ai alors beaucoup réfléchi sur les aventures de la jungle et, à mon tour, j'ai réussi, avec un crayon de couleur, à tracer mon premier dessin. Mon dessin numéro 1. Il était comme ça. J'ai montré mon chef-d'œuvre aux grandes personnes et je leur ai demandé si mon dessin leur faisait peur.",
          "Elles m'ont répondu : « Pourquoi un chapeau ferait-il peur ? » Mon dessin ne représentait pas un chapeau. Il représentait un serpent boa qui digérait un éléphant. J'ai alors dessiné l'intérieur du serpent boa, afin que les grandes personnes puissent comprendre. Elles ont toujours besoin d'explications.",
          "Les grandes personnes m'ont conseillé de laisser de côté les dessins de serpents boas ouverts ou fermés, et de m'intéresser plutôt à la géographie, à l'histoire, au calcul et à la grammaire. C'est ainsi que j'ai abandonné, à l'âge de six ans, une magnifique carrière de peintre."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre II : La panne dans le Sahara et le mouton',
        paragraphs: [
          "J'ai ainsi vécu seul, sans personne avec qui parler véritablement, jusqu'à une panne dans le désert du Sahara, il y a six ans. Quelque chose s'était cassé dans mon moteur. Et comme je n'avais avec moi ni mécanicien, ni passagers, je me préparai à réussir, tout seul, une réparation difficile. C'était pour moi une question de vie ou de mort. J'avais à peine de l'eau à boire pour huit jours.",
          "Le premier soir je me suis donc endormi sur le sable à mille milles de toute terre habitée. J'étais bien plus isolé qu'un naufragé sur un radeau au milieu de l'Océan. Alors vous imaginez ma surprise, au lever du jour, quand une drôle de petite voix m'a réveillé. Elle disait :",
          "— S'il vous plaît... dessine-moi un mouton !",
          "— Hein !",
          "— Dessine-moi un mouton...",
          "Je sautai sur mes pieds comme si j'avais été frappé par la foudre. Je me frottai bien les yeux. Je regardai bien. Et je vis un petit bonhomme tout à fait extraordinaire qui me considérait gravement. Quand le mystère est trop impressionnant, on n'ose pas désobéir. Aussi absurde que cela me semblât à mille milles de tous les endroits habités et en danger de mort, je sortis de ma poche une feuille de papier et un stylographe."
        ]
      },
      {
        id: 'chap-3',
        title: 'Chapitre XXI : Le secret du renard',
        paragraphs: [
          "C'est alors qu'apparut le renard :",
          "— Bonjour, dit le renard.",
          "— Bonjour, répondit poliment le petit prince, qui se retourna mais ne vit rien.",
          "— Je suis là, dit la voix, sous le pommier.",
          "— Qui es-tu ? dit le petit prince. Tu es bien joli...",
          "— Je suis un renard, dit le renard.",
          "— Viens jouer avec moi, lui proposa le petit prince. Je suis tellement triste...",
          "— Je ne puis pas jouer avec toi, dit le renard. Je ne suis pas apprivoisé.",
          "— Qu'est-ce que signifie « apprivoiser » ?",
          "— C'est une chose trop oubliée, dit le renard. Ça signifie « créer des liens... » Pour moi, tu n'es encore qu'un petit garçon tout semblable à cent mille petits garçons. Et je n'ai pas besoin de toi. Et tu n'as pas besoin de moi non plus. Je ne suis pour toi qu'un renard semblable à cent mille renards. Mais, si tu m'apprivoises, nous aurons besoin l'un de l'autre. Tu seras pour moi unique au monde. Je serai pour toi unique au monde...",
          "— Voici mon secret. Il est très simple : on ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux. C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante. Tu deviens responsable pour toujours de ce que tu as apprivoisé."
        ]
      }
    ]
  },
  {
    id: 'book-2',
    title: 'Vingt Mille Lieues sous les mers',
    author: 'Jules Verne',
    category: 'SF',
    price: 8.50,
    originalPrice: 14.90,
    rating: 4.93,
    reviewsCount: 310,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    description: 'Le chef-d’œuvre pionnier de la science-fiction d’exploration marine. À bord du sous-marin Nautilus, le professeur Aronnax, son fidèle Conseil et le harponneur Ned Land découvrent les abysses sous le commandement du mystérieux capitaine Nemo.',
    pages: 580,
    publishedYear: 1870,
    fileSize: '3.4 Mo',
    r2FileKey: 'ebooks/vingt-mille-lieues-sous-les-mers.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "L'année 1866 fut marquée par un événement bizarre, un phénomène inexpliqué et inexplicable qui n'a certainement été oublié de personne.",
      "— Vous êtes monté à bord de mon navire, monsieur Aronnax. Vous y resterez libre, mais vous ne le quitterez jamais. Ici commence le domaine de Nemo : Mobilis in mobile."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Un écueil fuyant',
        paragraphs: [
          "L'année 1866 fut marquée par un événement bizarre, un phénomène inexpliqué et inexplicable qui n'a certainement été oublié de personne. Depuis quelque temps, plusieurs navires s'étaient rencontrés avec « une chose énorme », un objet long, fusiforme, parfois phosphorescent, infiniment plus vaste et plus rapide qu'une baleine.",
          "Les faits relatifs à cette apparition, consignés sur différents livres de bord, s'accordaient assez exactement sur la structure de l'objet ou de l'être en question, la vitesse inouïe de ses mouvements, la puissance surprenante de sa locomotion, la vie particulière dont il semblait doué.",
          "Le 20 juillet 1866, le steamer Governor Higginson rencontra cette masse mouvante à cinq milles de la côte orientale de l'Australie. Le monstre crachait deux colonnes d'eau à une hauteur de quarante mètres. Le monde scientifique s'émut. On crut d'abord à un cétacé gigantesque, puis à un engin sous-marin d'une puissance formidable."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre VIII : Mobilis in mobile',
        paragraphs: [
          "Cet homme était grand, le front large, le regard fier, les lèvres calmes, l'ensemble dénotant une franchise et une énergie indomptables. Était-il âgé de trente-cinq ans ? Était-il sexagénaire ? Je n'aurais su le dire.",
          "— Monsieur, dit-il d'une voix calme et d'un timbre harmonieux, je parle également le français, l'anglais, l'allemand et le latin. J'ai voulu vous observer avant de me faire connaître. Vous êtes à bord de mon sous-marin, le Nautilus.",
          "— Le Nautilus ! m'écriai-je.",
          "— Oui, monsieur. La mer est tout pour moi. Elle couvre les sept dixièmes du globe terrestre. Son souffle est pur et sain. C'est l'immense désert où l'homme n'est jamais seul, car il sent frémir la vie à ses côtés. La mer n'est que le véhicule d'une surnaturelle et prodigieuse existence. Là seulement est l'indépendance ! Là je ne reconnais pas de maîtres ! Là je suis libre ! Mobilis in mobile !"
        ]
      },
      {
        id: 'chap-3',
        title: 'Chapitre X : Les merveilles des grandes profondeurs',
        paragraphs: [
          "Les panneaux de fer s'écartèrent brusquement. Deux glaces épaisses nous séparaient seules de la mer. Quel spectacle ! Quelle plume pourrait le décrire !",
          "La lumière électrique, diffusée par une puissante lanterne, éclairait les flots à une distance de plusieurs centaines de mètres. La limpidité de cette eau était prodigieuse. Des bancs entiers de poissons scintillaient comme des pierreries vivantes. Nous contemplions les prairies sous-marines, les coraux arborescents et les vallées sous-océaniques vierges de tout pas humain.",
          "Ned Land, les yeux écarquillés, ne cessait de murmurer : « C'est merveilleux... c'est fabuleux ! » Quant à Conseil, il classait avec méthode chaque téléostéen qui passait devant la vitre blindée."
        ]
      }
    ]
  },
  {
    id: 'book-3',
    title: 'Une étude en rouge',
    author: 'Arthur Conan Doyle',
    category: 'THRILLER',
    price: 7.50,
    originalPrice: 13.50,
    rating: 4.88,
    reviewsCount: 260,
    coverUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=700&q=80',
    description: 'La première aventure historique de Sherlock Holmes et du docteur John H. Watson. Un crime mystérieux perpétré dans une maison abandonnée de Brixton, sans blessure apparente, et un mot tracé avec du sang sur le mur : RACHE.',
    pages: 220,
    publishedYear: 1887,
    fileSize: '1.9 Mo',
    r2FileKey: 'ebooks/une-etude-en-rouge.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "— De la goutte d'eau, dit Sherlock Holmes, un logicien peut inférer la possibilité d'un océan Atlantique ou d'un Niagara sans les avoir jamais vus.",
      "Sur le papier peint crasseux, tracé avec du sang encore frais, se détachait un seul mot sinistre : RACHE."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : M. Sherlock Holmes',
        paragraphs: [
          "En 1878, après avoir obtenu le diplôme de docteur en médecine à l'Université de Londres, je rejoignis le 5e régiment de fusiliers du Northumberland en tant que chirurgien-major adjoint. La campagne d'Afghanistan me valut de graves blessures et une santé irrémédiablement compromise par la fièvre typhoïde.",
          "Rapatrié en Angleterre, je débarquai à Londres sans parents, sans attaches, libre comme l'air avec un traitement quotidien de onze shillings et six pence. C'est à cette époque que je rencontrai Stamford au Criterion Bar, qui me parla d'un individu singulier cherchant quelqu'un pour partager le loyer d'un appartement situé au 221B Baker Street.",
          "— Vous ne connaissez pas encore Sherlock Holmes, me prévint-il. Ses études sont très décousues et excentriques, mais il a accumulé un tas de connaissances bizarres qui étonneraient les professeurs."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre II : La science de la déduction',
        paragraphs: [
          "Nous nous installâmes ensemble à Baker Street. Holmes ne parlait jamais de lui, mais ses facultés d'observation dépassaient tout ce que j'avais pu imaginer. Un matin, en prenant le thé, il me jeta un article intitulé « Le Livre de la Vie ».",
          "— De la goutte d'eau, disait l'article, un logicien peut déduire l'Atlantique ou le Niagara sans les avoir vus. Toute la vie est une grande chaîne dont chaque maillon révèle la nature du tout.",
          "— Quelle absurdité ! m'écriai-je en reposant la revue.",
          "— C'est moi qui ai écrit cet article, répliqua Holmes paisiblement. Lorsque je vous ai rencontré pour la première fois, j'ai su instantanément que vous arriviez d'Afghanistan. Par habitude, le raisonnement s'est fait si vite que je n'ai pas eu conscience des étapes intermédiaires : tournure militaire, bras blessé et raidi, teint hâlé sur un visage émacié... Où un médecin militaire anglais pouvait-il avoir traversé de telles épreuves ? En Afghanistan, assurément."
        ]
      },
      {
        id: 'chap-3',
        title: 'Chapitre III : Le mystère de Lauriston Gardens',
        paragraphs: [
          "Une dépêche urgente de Scotland Yard signée par l'inspecteur Tobias Gregson nous appela au numéro 3 de Lauriston Gardens. La maison, inhabitée depuis des années, respirait la désolation.",
          "Sur le parquet poussiéreux gisait le cadavre d'un homme vêtu d'un habit noir. Aucune trace de coup, aucun signe de strangulation, mais une expression d'horreur féroce figée sur ses traits.",
          "Holmes sortit une loupe et un mètre ruban de sa poche. Il s'agenouilla, renifla les lèvres du mort, examina la cendre tombée sur le tapis et s'approcha du mur nu. Là, tracé avec du sang humain, brillait un mot de cinq lettres : RACHE.",
          "— Ce n'est pas le prénom d'une femme, Watson, murmura Holmes les yeux brillants. En allemand, Rache signifie « Vengeance »."
        ]
      }
    ]
  },
  {
    id: 'book-4',
    title: 'Pensées pour moi-même',
    author: 'Marc Aurèle',
    category: 'DÉVELOPPEMENT',
    price: 8.90,
    originalPrice: 15.00,
    rating: 4.96,
    reviewsCount: 390,
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=80',
    description: 'Le journal intime et spirituel de l’empereur-philosophe romain rédigé sur les champs de bataille du Danube. Un monument universel du stoïcisme : maîtriser ses jugements, fortifier sa citadelle intérieure et vivre en harmonie avec la nature.',
    pages: 240,
    publishedYear: 180,
    fileSize: '1.6 Mo',
    r2FileKey: 'ebooks/pensees-marc-aurele.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "Dès l'aurore, dis-toi d'avance : je vais rencontrer un indiscret, un ingrat, un insolent, un trompeur, un envieux, un égoïste. Aucun d'eux ne peut me nuire, car nul ne peut m'entraîner dans la honte.",
      "Nulle retraite n'est plus paisible ni moins troublée pour l'homme que celle qu'il trouve en son âme."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Livre II : Méditations au bord du Granua',
        paragraphs: [
          "Dès le matin, prévois ce qui peut t'arriver : je vais rencontrer un indiscret, un ingrat, un insolent, un fourbe, un envieux, un égoïste. S'ils sont ainsi, c'est par ignorance du bien et du mal. Mais moi, qui ai contemplé la nature du bien, qui est beau, et celle du mal, qui est laid, nul de ces hommes ne peut me causer de tort.",
          "Nous sommes nés pour coopérer, comme les pieds, les mains, les paupières, les rangées de dents supérieures et inférieures. Agir en ennemi les uns des autres est contre nature ; or, s'irriter contre autrui et lui tourner le dos, c'est agir en ennemi.",
          "Tout ce que je suis n'est qu'un peu de chair, un souffle d'air et un principe directeur. Méprise la chair : ce n'est que sang, ossements et réseau de nerfs. Mais honore ton esprit : tu es un vieillard, ne souffre plus qu'il soit esclave, qu'il soit ballotté par des impulsions égoïstes."
        ]
      },
      {
        id: 'chap-2',
        title: 'Livre IV : La Citadelle Intérieure',
        paragraphs: [
          "Les hommes cherchent des retraites à la campagne, sur les bords de la mer, dans les montagnes ; toi-même tu as coutume de désirer vivement de tels asiles. Mais tout cela est de la plus grossière ignorance, puisqu'il t'est permis, à toute heure que tu voudras, de te retirer en toi-même.",
          "Nulle part, en effet, l'homme ne trouve de retraite plus tranquille et plus exempte de tracas que dans son âme, surtout s'il possède en lui-même de ces choses dont la contemplation suffit pour lui procurer aussitôt une parfaite sérénité.",
          "Efface l'opinion que tu as d'un événement, et le tort dont tu te plains disparaît ; efface la pensée : « On m'a fait du mal », et le mal lui-même s'évanouit. Ce qui ne rend pas l'homme plus mauvais ne rend pas non plus sa vie plus mauvaise."
        ]
      },
      {
        id: 'chap-3',
        title: 'Livre XII : De la Sérénité devant la fin',
        paragraphs: [
          "Ô homme ! Tu as été citoyen de cette grande cité du monde ; qu'importe que ce soit pendant cinq ans ou pendant cent ans ? Ce qui est conforme aux lois de la cité est égal pour tous.",
          "Qu'y a-t-il donc de tragique si celui qui te congédie de la cité n'est ni un tyran injuste ni un juge corrompu, mais la nature même qui t'y avait introduit ? C'est comme le comédien congédié du théâtre par le préteur qui l'avait engagé.",
          "— « Mais je n'ai joué que trois actes et non pas cinq ! »",
          "— C'est vrai, mais dans la vie, trois actes suffisent pour composer une pièce entière. Pars donc content et bénis la main qui te délivre, car celui qui te renvoie est lui-même plein de douceur."
        ]
      }
    ]
  },
  {
    id: 'book-5',
    title: 'L’Art de la Guerre',
    author: 'Sun Tzu',
    category: 'BUSINESS',
    price: 7.90,
    originalPrice: 13.90,
    rating: 4.95,
    reviewsCount: 512,
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80',
    description: 'Le plus célèbre traité de stratégie et d’organisation du monde, rédigé au Ve siècle avant J.-C. Les principes fondateurs de la prise de décision, de l’économie de moyens, du renseignement et de la victoire sans affrontement destructeur.',
    pages: 160,
    publishedYear: -500,
    fileSize: '1.4 Mo',
    r2FileKey: 'ebooks/l-art-de-la-guerre-sun-tzu.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "L'art suprême de la guerre, c'est de soumettre l'ennemi sans combat.",
      "Connais ton ennemi et connais-toi toi-même ; en cent batailles tu ne courras aucun danger."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : De l’Évaluation et des Fondations',
        paragraphs: [
          "Sun Tzu dit : La guerre est d'une importance vitale pour l'État ; c'est le domaine de la vie et de la mort, la route qui mène à la survie ou à l'anéantissement. Il est indispensable de l'étudier avec la plus grande rigueur.",
          "Appréciez la situation d'après cinq facteurs fondamentaux : la Voie (morale), le Ciel (climat), la Terre (terrain), le Commandement (vertus du chef) et la Doctrine (organisation et discipline).",
          "Tout l'art de la guerre est fondé sur la duperie. C'est pourquoi, lorsque nous sommes capables d'attaquer, nous devons paraître incapables ; lorsque nous manœuvrons, nous devons paraître immobiles ; lorsque nous sommes proches, nous devons faire croire que nous sommes loin."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre III : De la Stratégie Offensive',
        paragraphs: [
          "Généralement, en matière de stratégie militaire, préserver l'État ennemi intact vaut mieux que de le détruire ; capturer leur armée intacte vaut mieux que de l'exterminer.",
          "Remporter cent victoires en cent batailles n'est pas le comble de l'habileté. Le comble de l'habileté consiste à soumettre l'adversaire sans livrer combat.",
          "La meilleure politique militaire consiste à déjouer les plans de l'ennemi ; la seconde consiste à détruire ses alliances ; la troisième consiste à attaquer son armée sur le champ de bataille ; et la pire consiste à assiéger des cités fortifiées."
        ]
      },
      {
        id: 'chap-3',
        title: 'Chapitre XIII : De la Connaissance et des Éclaireurs',
        paragraphs: [
          "Ce qui permet au souverain sage et au général victorieux de frapper l'ennemi avec certitude et d'accomplir des exploits au-dessus du commun, c'est la prescience.",
          "Cette prescience ne s'obtient pas des esprits, ni des dieux, ni par le calcul astrologique : elle doit être tirée d'hommes qui connaissent la situation de l'adversaire.",
          "L'armée sans renseignement est un homme aveugle marchant vers un précipice. Connais l'adversaire, connais-toi toi-même : ta victoire ne sera jamais en péril."
        ]
      }
    ]
  },
  {
    id: 'book-6',
    title: 'La Métamorphose',
    author: 'Franz Kafka',
    category: 'ESSAI',
    price: 6.90,
    originalPrice: 11.50,
    rating: 4.85,
    reviewsCount: 198,
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
    description: 'La nouvelle magistrale de Franz Kafka. Un matin, Gregor Samsa, commis voyageur dévoué à sa famille, s’éveille transformé en un insecte monstrueux. Un récit universel sur l’aliénation moderne, la culpabilité et le regard des proches.',
    pages: 130,
    publishedYear: 1915,
    fileSize: '1.1 Mo',
    r2FileKey: 'ebooks/la-metamorphose-kafka.epub',
    formats: ['EPUB', 'PDF'],
    excerpt: [
      "En se réveillant un matin après des rêves agités, Gregor Samsa se trouva dans son lit métamorphosé en un monstrueux insecte.",
      "« Que m'est-il arrivé ? » pensa-t-il. Ce n'était pas un rêve."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Le réveil de Gregor Samsa',
        paragraphs: [
          "En se réveillant un matin après des rêves agités, Gregor Samsa se trouva dans son lit métamorphosé en un monstrueux insecte. Il était couché sur son dos dur comme une cuirasse et, en soulevant un peu la tête, il apercevait son ventre bombé, brun, divisé par des arêtes cintrées au sommet duquel la couverture, prête à glisser tout à fait, ne tenait plus qu'à peine.",
          "Ses nombreuses pattes, lamentablement grêles par comparaison avec la taille du reste de son corps, papillotaient impuissantes devant ses yeux.",
          "— « Que m'est-il arrivé ? » pensa-t-il. Ce n'était pas un rêve. Sa chambre, une vraie chambre d'être humain, un peu trop petite mais bien calme, reposait paisiblement entre les quatre murs familiers.",
          "Au-dessus de la table était suspendue l'image qu'il avait découpée récemment dans un magazine illustré et enchâssée dans un joli cadre doré. Elle représentait une dame pourvue d'une toque et d'un boa de fourrure qui tendait vers le spectateur un lourd manchon."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre II : La porte close et la famille',
        paragraphs: [
          "Gregor tourna son regard vers la fenêtre, et le temps maussade — on entendait les gouttes de pluie frapper le rebord en zinc — le rendit tout mélancolique.",
          "— « Si je me rendormais un peu et oubliais toutes ces sottises ? » se dit-il. Mais cela était complètement irréalisable, car il avait l'habitude de dormir sur le côté droit, et dans son état actuel, il ne pouvait pas se mettre dans cette position.",
          "Quel métier épuisant j'ai choisi ! pensa-t-il. Courir les routes jour après jour. Les tracas commerciaux sont bien plus rudes que les affaires au siège, et par-dessus le marché, on subit les tourments des voyages continuels, le souci des correspondances de trains, des repas irréguliers et détestables, des relations humaines changeantes et jamais sincères."
        ]
      }
    ]
  },
  {
    id: 'book-7',
    title: 'Le Dernier Jour d’un Condamné',
    author: 'Victor Hugo',
    category: 'HISTOIRE',
    price: 7.90,
    originalPrice: 12.90,
    rating: 4.91,
    reviewsCount: 235,
    coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80',
    description: 'Le vibrant plaidoyer abolitionniste de Victor Hugo. À Bicêtre puis à la Conciergerie, un condamné à mort note heure par heure les angoisses, les souvenirs et les vertiges de ses dernières heures avant l’échafaud.',
    pages: 180,
    publishedYear: 1829,
    fileSize: '1.5 Mo',
    r2FileKey: 'ebooks/dernier-jour-condamne.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "Condamné à mort ! Voilà cinq semaines que j'habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence.",
      "Grâce ! au nom du ciel, une heure encore ! Quatre heures viennent de sonner."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Bicêtre — L’Idée fixe',
        paragraphs: [
          "Condamné à mort ! Voilà cinq semaines que j'habite avec cette pensée, toujours seul avec elle, toujours glacé de sa présence, toujours courbé sous son poids !",
          "Autrefois, car il me semble qu'il y a plutôt des années que des semaines, j'étais un homme comme un autre homme. Chaque jour, chaque heure, chaque minute avait son idée. Mon esprit, jeune et riche, était plein de fantaisies. C'étaient de jeunes filles, de splendides chapes d'évêque, des batailles gagnées, des théâtres pleins de bruit et de lumière.",
          "Maintenant je suis captif. Mon corps est aux fers dans un cachot, mon esprit est en prison dans une idée. Une horrible, une sanglante, une implacable idée ! Je n'ai plus qu'une pensée, qu'une conviction, qu'une certitude : condamné à mort !"
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre VI : Pourquoi j’écris ce journal',
        paragraphs: [
          "Puisque j'ai le moyen d'écrire, pourquoi ne le ferais-je pas ? Mais quoi écrire ? Pris entre quatre murailles de plâtre nu et froid, sans liberté pour mes pas, sans horizon pour mes yeux...",
          "Se peut-il que de ce journal de mes angoisses, heure par heure, minute par minute, supplice par supplice, si j'ai la force de le mener jusqu'au moment où il me sera physiquement impossible de continuer, ne sorte pas une grande leçon ?",
          "Ces souffrances de l'esprit, ces râles de la pensée, ces sueurs d'agonie ne serviront-ils à personne ? Peut-être ceux qui jugent liront-ils ces pages avec plus de tremblement dans les mains quand il s'agira de jeter une tête dans la corbeille."
        ]
      }
    ]
  },
  {
    id: 'book-8',
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    category: 'ROMAN',
    price: 9.90,
    originalPrice: 17.00,
    rating: 4.97,
    reviewsCount: 580,
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
    description: 'Le chef-d’œuvre absolu du roman d’aventures français. Trahi par ceux qu’il croyait être ses amis le jour de ses fiançailles, le jeune marin Edmond Dantès est enfermé au terrifiant château d’If pendant quatorze ans.',
    pages: 1280,
    publishedYear: 1844,
    fileSize: '4.8 Mo',
    r2FileKey: 'ebooks/comte-de-monte-cristo.epub',
    formats: ['EPUB', 'PDF'],
    isFeatured: true,
    excerpt: [
      "Le 24 février 1815, la vigie de Notre-Dame de la Garde signala le trois-mâts le Pharaon, venant de Smyrne, Trieste et Naples.",
      "Toute la sagesse humaine est contenue dans ces deux mots : Attendre et espérer !"
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Marseille — L’Arrivée du Pharaon',
        paragraphs: [
          "Le 24 février 1815, la vigie de Notre-Dame de la Garde signala le trois-mâts le Pharaon, venant de Smyrne, Trieste et Naples.",
          "Aussitôt, un pilote côtier partit du port, rasa le château d'If et accosta le navire entre le cap Morgiou et l'île de Riou. Le rivage de la Cannebière se couvrit promptement de curieux, car l'arrivée d'un bâtiment était toujours un grand événement à Marseille.",
          "Sur le pont se tenait un jeune homme de dix-huit à vingt ans, grand, svelte, avec de beaux yeux noirs et des cheveux d'ébène. C'était Edmond Dantès, le second du bord, qui ramenait le navire après la mort subite en mer du brave capitaine Leclerc."
        ]
      },
      {
        id: 'chap-2',
        title: 'Chapitre XIV : Le Trésor de l’Abbé Faria',
        paragraphs: [
          "Faria sourit d'un air douloureux :",
          "— Edmond, mon fils, écoute-moi. Ce papier calciné que j'ai sauvé des flammes contient l'emplacement exact du trésor des Spada enfoui sur l'îlot désert de Monte-Cristo.",
          "— Un trésor ? murmura Dantès stupéfait.",
          "— Oui ! Des millions en lingots d'or, en doublons d'Espagne et en coffrets de pierreries. Je te le lègue, mon enfant, à toi qui as éclairé ma captivité. Tu seras l'homme le plus riche du monde et tu feras trembler tes persécuteurs !"
        ]
      }
    ]
  },
  {
    id: 'book-9',
    title: 'Alice au Pays des Merveilles (Édition Illustrée .CBZ)',
    author: 'Lewis Carroll & John Tenniel',
    category: 'BD_MANGA',
    price: 8.50,
    originalPrice: 14.50,
    rating: 4.94,
    reviewsCount: 340,
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80',
    description: 'L’œuvre fantastique de Lewis Carroll magnifiée par les planches restaurées en haute définition. Suivez Alice dans le terrier du Lapin Blanc, au thé des fous du Chapelier et devant le tribunal de la Reine de Cœur. Format BD .CBZ prêt pour liseuse et smartphone.',
    pages: 160,
    publishedYear: 1865,
    fileSize: '22.0 Mo',
    r2FileKey: 'comics/alice-au-pays-des-merveilles.cbz',
    formats: ['CBZ', 'CBR', 'PDF', 'EPUB'],
    isFeatured: true,
    isNewRelease: true,
    isComic: true,
    comicType: 'bd',
    comicPages: [
      { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85', caption: 'Couverture - Alice au Pays des Merveilles' },
      { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 1 : La poursuite du Lapin Blanc aux gants d’argent' },
      { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 2 : Le thé des fous avec le Chapelier toqué' },
      { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 3 : L’énigme du Chat du Cheshire' },
      { pageNumber: 5, imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 4 : Le jeu de croquet de la Reine de Cœur' },
    ],
    excerpt: [
      "— Auriez-vous l'obligeance de me dire quel chemin je dois prendre ? demanda Alice.",
      "— Cela dépend en grande partie d'où vous voulez aller, répondit le Chat."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : Au fond du terrier du lapin',
        paragraphs: [
          "Alice commençait à se fatiguer de rester assise à côté de sa sœur sur la berge et de n'avoir rien à faire. Une fois ou deux, elle avait jeté un coup d'œil sur le livre que lisait sa sœur, mais il n'y avait dedans ni images ni dialogues.",
          "— « Et à quoi bon un livre, pensait Alice, sans images ni causeries ? »",
          "Soudain, un lapin blanc aux yeux roses passa en courant tout près d'elle. Le Lapin tira une montre de son gousset, la regarda et s'écria : « Mon Dieu ! Mon Dieu ! Je vais être en retard ! »"
        ]
      }
    ]
  },
  {
    id: 'book-10',
    title: 'Le Roi Singe : La Légende de Sun Wukong (Manga .CBZ)',
    author: 'Wu Cheng’en & Studio Asie',
    category: 'BD_MANGA',
    price: 8.90,
    originalPrice: 15.00,
    rating: 4.96,
    reviewsCount: 410,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    description: 'La grande épopée mythologique chinoise adaptée en manga d’action rythmé. De sa naissance dans un roc céleste à son bâton magique Ruyi Jingu Bang capable de peser huit tonnes, découvrez les exploits du Roi des Singes.',
    pages: 210,
    publishedYear: 1592,
    fileSize: '26.4 Mo',
    r2FileKey: 'comics/roi-singe-wukong.cbz',
    formats: ['CBZ', 'CBR', 'PDF', 'EPUB'],
    isFeatured: true,
    isNewRelease: true,
    isComic: true,
    comicType: 'manga',
    comicPages: [
      { pageNumber: 1, imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85', caption: 'Couverture - Sun Wukong le Roi des Singes' },
      { pageNumber: 2, imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 1 : L’éveil du singe de pierre céleste' },
      { pageNumber: 3, imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 2 : Le Palais sous-marin du Roi-Dragon' },
      { pageNumber: 4, imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85', caption: 'Planche 3 : Le nuage magique volant Somersault' },
    ],
    excerpt: [
      "Le ciel et la terre s'unirent pour faire éclore un œuf de pierre, d'où jaillit un singe doué d'une vigueur surhumaine.",
      "— Mon bâton pèse treize mille cinq cents livres, dit Sun Wukong en souriant. Voyons si les armées célestes sauront le soulever !"
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Chapitre I : La Naissance du Singe de Pierre',
        paragraphs: [
          "Au-delà des mers de l'Est se dresse le pays d'Aolai. Au cœur de cette contrée s'élève la Montagne des Fleurs et des Fruits, sommet sacré baigné des vapeurs célestes depuis la création du monde.",
          "Sur cette cime reposait un roc magique, fécondé par le soleil et la lune. Un jour, la roche se fendit avec le fracas du tonnerre et laissa échapper un œuf de pierre qui prit la forme d'un singe.",
          "Ses premiers regards lancèrent vers la Voûte Céleste deux faisceaux d'une lueur si étincelante que l'Empereur de Jade lui-même en tressaillit sur son trône de jade."
        ]
      }
    ]
  },
  {
    id: 'book-11',
    title: 'Les Fleurs du Mal',
    author: 'Charles Baudelaire',
    category: 'ROMAN',
    price: 6.90,
    originalPrice: 11.90,
    rating: 4.89,
    reviewsCount: 290,
    coverUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80',
    description: 'Le sommet de la poésie moderne française. De l’Idéal au Spleen le plus noir, Baudelaire transcende la mélancolie parisienne et extrait la beauté pure de l’angoisse humaine. Recueil complet avec pièces condamnées.',
    pages: 280,
    publishedYear: 1857,
    fileSize: '1.4 Mo',
    r2FileKey: 'ebooks/les-fleurs-du-mal.epub',
    formats: ['EPUB', 'PDF'],
    excerpt: [
      "Souvent, pour s'amuser, les hommes d'équipage prennent des albatros, vastes oiseaux des mers...",
      "Le Poète est semblable au prince des nuées qui hante la tempête et se rit de l'archer."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Spleen et Idéal — L’Albatros & Correspondances',
        paragraphs: [
          "Souvent, pour s'amuser, les hommes d'équipage / Prennent des albatros, vastes oiseaux des mers, / Qui suivent, indolents compagnons de voyage, / Le navire glissant sur les gouffres amers.",
          "À peine les ont-ils déposés sur les planches, / Que ces rois de l'azur, maladroits et honteux, / Laissent piteusement leurs grandes ailes blanches / Comme des avirons traîner à côté d'eux.",
          "Ce voyageur ailé, comme il est gauche et veule ! / Lui, naguère si beau, qu'il est comique et laid ! / L'un agace son bec avec un brûle-gueule, / L'autre mime, en boitant, l'infirme qui volait !",
          "Le Poète est semblable au prince des nuées / Qui hante la tempête et se rit de l'archer ; / Exilé sur le sol au milieu des huées, / Ses ailes de géant l'empêchent de marcher."
        ]
      }
    ]
  },
  {
    id: 'book-12',
    title: 'Du Contrat Social',
    author: 'Jean-Jacques Rousseau',
    category: 'HISTOIRE',
    price: 7.90,
    originalPrice: 13.50,
    rating: 4.87,
    reviewsCount: 175,
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80',
    description: 'L’un des textes les plus influents de la philosophie politique universelle. Rousseau y formule les principes de souveraineté populaire, de volonté générale et de liberté civile qui ont inspiré la Déclaration des Droits de l’Homme.',
    pages: 210,
    publishedYear: 1762,
    fileSize: '1.5 Mo',
    r2FileKey: 'ebooks/du-contrat-social.epub',
    formats: ['EPUB', 'PDF'],
    excerpt: [
      "L'homme est né libre, et partout il est dans les fers. Tel se croit le maître des autres, qui ne laisse pas d'être plus esclave qu'eux.",
      "Renoncer à sa liberté, c'est renoncer à sa qualité d'homme, aux droits de l'humanité, même à ses devoirs."
    ],
    chapters: [
      {
        id: 'chap-1',
        title: 'Livre I, Chapitre I : Sujet de ce premier livre',
        paragraphs: [
          "L'homme est né libre, et partout il est dans les fers. Tel se croit le maître des autres, qui ne laisse pas d'être plus esclave qu'eux. Comment ce changement s'est-il fait ? Je l'ignore. Qu'est-ce qui peut le rendre légitime ? Je crois pouvoir résoudre cette question.",
          "Si je ne considérais que la force et l'effet qui en dérive, je dirais : « Tant qu'un peuple est contraint d'obéir et qu'il obéit, il fait bien ; sitôt qu'il peut secouer le joug et qu'il le secoue, il fait encore mieux : car, recouvrant sa liberté par le même droit qui la lui a ravie, ou il est fondé à la reprendre, ou l'on ne l'était point à la lui ôter. »",
          "Mais l'ordre social est un droit sacré qui sert de base à tous les autres. Cependant ce droit ne vient point de la nature ; il est donc fondé sur des conventions."
        ]
      }
    ]
  }
];
