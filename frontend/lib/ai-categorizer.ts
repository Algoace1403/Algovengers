import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

// COMPREHENSIVE WORLD CATEGORY MAPPING - 1000+ Categories
const categoryMapping: { [key: string]: string } = {
  // ===== ANIMALS - MAMMALS (Expanded) =====
  // Domestic Animals
  'dog': 'Animals/Dogs',
  'puppy': 'Animals/Dogs',
  'poodle': 'Animals/Dogs',
  'husky': 'Animals/Dogs',
  'bulldog': 'Animals/Dogs',
  'retriever': 'Animals/Dogs',
  'cat': 'Animals/Cats',
  'kitten': 'Animals/Cats',
  'persian cat': 'Animals/Cats',
  'siamese': 'Animals/Cats',
  'tabby': 'Animals/Cats',

  // Wild Cats
  'lion': 'Animals/Wild Cats',
  'tiger': 'Animals/Wild Cats',
  'leopard': 'Animals/Wild Cats',
  'cheetah': 'Animals/Wild Cats',
  'jaguar': 'Animals/Wild Cats',
  'cougar': 'Animals/Wild Cats',
  'lynx': 'Animals/Wild Cats',
  'panther': 'Animals/Wild Cats',

  // Bears
  'bear': 'Animals/Bears',
  'grizzly': 'Animals/Bears',
  'polar bear': 'Animals/Bears',
  'panda': 'Animals/Bears',
  'black bear': 'Animals/Bears',
  'brown bear': 'Animals/Bears',

  // Canines
  'wolf': 'Animals/Wild Canines',
  'fox': 'Animals/Wild Canines',
  'coyote': 'Animals/Wild Canines',
  'jackal': 'Animals/Wild Canines',
  'dingo': 'Animals/Wild Canines',

  // Large Wildlife
  'elephant': 'Animals/Large Wildlife',
  'giraffe': 'Animals/Large Wildlife',
  'zebra': 'Animals/Large Wildlife',
  'rhinoceros': 'Animals/Large Wildlife',
  'hippopotamus': 'Animals/Large Wildlife',
  'bison': 'Animals/Large Wildlife',
  'buffalo': 'Animals/Large Wildlife',
  'moose': 'Animals/Large Wildlife',
  'elk': 'Animals/Large Wildlife',

  // Primates
  'monkey': 'Animals/Primates',
  'gorilla': 'Animals/Primates',
  'chimpanzee': 'Animals/Primates',
  'orangutan': 'Animals/Primates',
  'baboon': 'Animals/Primates',
  'lemur': 'Animals/Primates',
  'gibbon': 'Animals/Primates',

  // Hoofed Animals
  'horse': 'Animals/Horses',
  'pony': 'Animals/Horses',
  'stallion': 'Animals/Horses',
  'mare': 'Animals/Horses',
  'donkey': 'Animals/Horses',
  'mule': 'Animals/Horses',
  'deer': 'Animals/Deer',
  'reindeer': 'Animals/Deer',
  'caribou': 'Animals/Deer',
  'antelope': 'Animals/Deer',

  // Farm Animals
  'cow': 'Animals/Farm',
  'pig': 'Animals/Farm',
  'sheep': 'Animals/Farm',
  'goat': 'Animals/Farm',
  'rooster': 'Animals/Farm',
  'hen': 'Animals/Farm',
  'llama': 'Animals/Farm',
  'alpaca': 'Animals/Farm',

  // Marsupials & Australian
  'kangaroo': 'Animals/Marsupials',
  'koala': 'Animals/Marsupials',
  'wallaby': 'Animals/Marsupials',
  'wombat': 'Animals/Marsupials',
  'tasmanian devil': 'Animals/Marsupials',

  // Small Mammals
  'rabbit': 'Animals/Small Mammals',
  'squirrel': 'Animals/Small Mammals',
  'rat': 'Animals/Small Mammals',
  'mouse': 'Animals/Small Mammals',
  'hamster': 'Animals/Small Mammals',
  'guinea pig': 'Animals/Small Mammals',
  'ferret': 'Animals/Small Mammals',
  'hedgehog': 'Animals/Small Mammals',
  'chipmunk': 'Animals/Small Mammals',
  'beaver': 'Animals/Small Mammals',
  'otter': 'Animals/Small Mammals',
  'badger': 'Animals/Small Mammals',
  'raccoon': 'Animals/Small Mammals',
  'skunk': 'Animals/Small Mammals',
  'meerkat': 'Animals/Small Mammals',

  // Bats & Flying Mammals
  'bat': 'Animals/Bats',
  'flying fox': 'Animals/Bats',

  // ===== ANIMALS - BIRDS (Massively Expanded) =====
  // General Birds
  'bird': 'Animals/Birds',
  'sparrow': 'Animals/Birds',
  'robin': 'Animals/Birds',
  'crow': 'Animals/Birds',
  'raven': 'Animals/Birds',
  'magpie': 'Animals/Birds',
  'jay': 'Animals/Birds',
  'cardinal': 'Animals/Birds',
  'finch': 'Animals/Birds',
  'canary': 'Animals/Birds',
  'swallow': 'Animals/Birds',
  'starling': 'Animals/Birds',

  // Birds of Prey
  'eagle': 'Animals/Birds of Prey',
  'hawk': 'Animals/Birds of Prey',
  'falcon': 'Animals/Birds of Prey',
  'owl': 'Animals/Birds of Prey',
  'vulture': 'Animals/Birds of Prey',
  'kite': 'Animals/Birds of Prey',
  'osprey': 'Animals/Birds of Prey',

  // Tropical & Exotic Birds
  'parrot': 'Animals/Exotic Birds',
  'macaw': 'Animals/Exotic Birds',
  'cockatoo': 'Animals/Exotic Birds',
  'parakeet': 'Animals/Exotic Birds',
  'toucan': 'Animals/Exotic Birds',
  'hummingbird': 'Animals/Exotic Birds',

  // Water Birds
  'goose': 'Animals/Water Birds',
  'swan': 'Animals/Water Birds',
  'pelican': 'Animals/Water Birds',
  'seagull': 'Animals/Water Birds',
  'albatross': 'Animals/Water Birds',
  'cormorant': 'Animals/Water Birds',
  'heron': 'Animals/Water Birds',
  'crane': 'Animals/Water Birds',
  'stork': 'Animals/Water Birds',
  'ibis': 'Animals/Water Birds',

  // Flightless Birds
  'penguin': 'Animals/Penguins',
  'ostrich': 'Animals/Flightless Birds',
  'emu': 'Animals/Flightless Birds',
  'cassowary': 'Animals/Flightless Birds',

  // Decorative Birds
  'peacock': 'Animals/Decorative Birds',
  'peahen': 'Animals/Decorative Birds',
  'flamingo': 'Animals/Decorative Birds',
  'pheasant': 'Animals/Decorative Birds',

  // Game Birds
  'quail': 'Animals/Game Birds',
  'partridge': 'Animals/Game Birds',
  'grouse': 'Animals/Game Birds',

  // ===== ANIMALS - REPTILES & AMPHIBIANS (Expanded) =====
  'snake': 'Animals/Reptiles',
  'cobra': 'Animals/Reptiles',
  'python': 'Animals/Reptiles',
  'viper': 'Animals/Reptiles',
  'rattlesnake': 'Animals/Reptiles',
  'anaconda': 'Animals/Reptiles',
  'lizard': 'Animals/Reptiles',
  'iguana': 'Animals/Reptiles',
  'gecko': 'Animals/Reptiles',
  'chameleon': 'Animals/Reptiles',
  'komodo dragon': 'Animals/Reptiles',
  'turtle': 'Animals/Reptiles',
  'tortoise': 'Animals/Reptiles',
  'sea turtle': 'Animals/Reptiles',
  'terrapin': 'Animals/Reptiles',
  'crocodile': 'Animals/Reptiles',
  'alligator': 'Animals/Reptiles',
  'caiman': 'Animals/Reptiles',
  'frog': 'Animals/Amphibians',
  'toad': 'Animals/Amphibians',
  'tadpole': 'Animals/Amphibians',
  'newt': 'Animals/Amphibians',
  'salamander': 'Animals/Amphibians',

  // ===== ANIMALS - SEA LIFE (Massively Expanded) =====
  // Fish
  'goldfish': 'Animals/Fish',
  'koi': 'Animals/Fish',
  'salmon': 'Animals/Fish',
  'tuna': 'Animals/Fish',
  'trout': 'Animals/Fish',
  'bass': 'Animals/Fish',
  'pike': 'Animals/Fish',
  'carp': 'Animals/Fish',
  'catfish': 'Animals/Fish',
  'eel': 'Animals/Fish',
  'swordfish': 'Animals/Fish',
  'marlin': 'Animals/Fish',
  'barracuda': 'Animals/Fish',
  'angelfish': 'Animals/Fish',
  'clownfish': 'Animals/Fish',
  'pufferfish': 'Animals/Fish',
  'stingray': 'Animals/Fish',
  'manta ray': 'Animals/Fish',

  // Sharks
  'shark': 'Animals/Sharks',
  'great white': 'Animals/Sharks',
  'hammerhead': 'Animals/Sharks',
  'tiger shark': 'Animals/Sharks',

  // Marine Mammals
  'whale': 'Animals/Marine Mammals',
  'blue whale': 'Animals/Marine Mammals',
  'humpback': 'Animals/Marine Mammals',
  'orca': 'Animals/Marine Mammals',
  'dolphin': 'Animals/Marine Mammals',
  'porpoise': 'Animals/Marine Mammals',
  'seal': 'Animals/Marine Mammals',
  'sea lion': 'Animals/Marine Mammals',
  'walrus': 'Animals/Marine Mammals',
  'manatee': 'Animals/Marine Mammals',
  'dugong': 'Animals/Marine Mammals',
  'narwhal': 'Animals/Marine Mammals',

  // Cephalopods & Mollusks
  'octopus': 'Animals/Cephalopods',
  'squid': 'Animals/Cephalopods',
  'cuttlefish': 'Animals/Cephalopods',
  'nautilus': 'Animals/Cephalopods',
  'snail': 'Animals/Mollusks',
  'slug': 'Animals/Mollusks',
  'mussel': 'Animals/Mollusks',
  'scallop': 'Animals/Mollusks',

  // Crustaceans
  'prawn': 'Animals/Crustaceans',
  'crayfish': 'Animals/Crustaceans',
  'barnacle': 'Animals/Crustaceans',

  // Other Sea Life
  'jellyfish': 'Animals/Sea Life',
  'starfish': 'Animals/Sea Life',
  'sea urchin': 'Animals/Sea Life',
  'sea anemone': 'Animals/Sea Life',
  'coral': 'Animals/Sea Life',
  'seahorse': 'Animals/Sea Life',
  'sea cucumber': 'Animals/Sea Life',

  // ===== ANIMALS - INSECTS & ARTHROPODS (Expanded) =====
  'butterfly': 'Animals/Insects',
  'moth': 'Animals/Insects',
  'bee': 'Animals/Insects',
  'bumblebee': 'Animals/Insects',
  'wasp': 'Animals/Insects',
  'hornet': 'Animals/Insects',
  'ant': 'Animals/Insects',
  'termite': 'Animals/Insects',
  'beetle': 'Animals/Insects',
  'ladybug': 'Animals/Insects',
  'firefly': 'Animals/Insects',
  'dragonfly': 'Animals/Insects',
  'damselfly': 'Animals/Insects',
  'grasshopper': 'Animals/Insects',
  'cricket': 'Animals/Insects',
  'locust': 'Animals/Insects',
  'mantis': 'Animals/Insects',
  'fly': 'Animals/Insects',
  'mosquito': 'Animals/Insects',
  'flea': 'Animals/Insects',
  'tick': 'Animals/Insects',
  'louse': 'Animals/Insects',
  'spider': 'Animals/Arachnids',
  'tarantula': 'Animals/Arachnids',
  'scorpion': 'Animals/Arachnids',
  'centipede': 'Animals/Arthropods',
  'millipede': 'Animals/Arthropods',
  'worm': 'Animals/Invertebrates',
  'earthworm': 'Animals/Invertebrates',
  'leech': 'Animals/Invertebrates',

  // ===== PEOPLE (Expanded) =====
  'person': 'People/General',
  'man': 'People/General',
  'woman': 'People/General',
  'boy': 'People/Children',
  'girl': 'People/Children',
  'child': 'People/Children',
  'baby': 'People/Children',
  'infant': 'People/Children',
  'toddler': 'People/Children',
  'teenager': 'People/Teens',
  'adolescent': 'People/Teens',
  'adult': 'People/Adults',
  'elderly': 'People/Seniors',
  'senior': 'People/Seniors',
  'face': 'People/Portraits',
  'portrait': 'People/Portraits',
  'selfie': 'People/Portraits',
  'headshot': 'People/Portraits',
  'crowd': 'People/Groups',
  'people': 'People/Groups',
  'family': 'People/Family',
  'couple': 'People/Couples',
  'wedding': 'People/Events',
  'bride': 'People/Events',
  'groom': 'People/Events',
  'graduation': 'People/Events',
  'birthday': 'People/Events',

  // ===== NATURE (Massively Expanded) =====
  // Mountains & Terrain
  'mountain': 'Nature/Mountains',
  'peak': 'Nature/Mountains',
  'summit': 'Nature/Mountains',
  'hill': 'Nature/Hills',
  'slope': 'Nature/Mountains',
  'valley': 'Nature/Valleys',
  'canyon': 'Nature/Canyons',
  'gorge': 'Nature/Canyons',
  'cliff': 'Nature/Cliffs',
  'cave': 'Nature/Caves',
  'cavern': 'Nature/Caves',
  'plateau': 'Nature/Plateaus',
  'mesa': 'Nature/Plateaus',

  // Water Features
  'ocean': 'Nature/Oceans',
  'sea': 'Nature/Seas',
  'lake': 'Nature/Lakes',
  'pond': 'Nature/Lakes',
  'river': 'Nature/Rivers',
  'stream': 'Nature/Rivers',
  'creek': 'Nature/Rivers',
  'brook': 'Nature/Rivers',
  'waterfall': 'Nature/Waterfalls',
  'cascade': 'Nature/Waterfalls',
  'rapids': 'Nature/Rivers',
  'wave': 'Nature/Oceans',
  'tide': 'Nature/Oceans',
  'island': 'Nature/Islands',
  'archipelago': 'Nature/Islands',
  'bay': 'Nature/Coasts',
  'harbor': 'Nature/Coasts',
  'inlet': 'Nature/Coasts',
  'lagoon': 'Nature/Coasts',
  'reef': 'Nature/Underwater',
  'atoll': 'Nature/Islands',

  // Beaches & Shores
  'beach': 'Nature/Beaches',
  'shore': 'Nature/Beaches',
  'coast': 'Nature/Coasts',
  'coastline': 'Nature/Coasts',
  'sand': 'Nature/Beaches',
  'dune': 'Nature/Deserts',
  'seashore': 'Nature/Beaches',

  // Forests & Trees
  'forest': 'Nature/Forests',
  'jungle': 'Nature/Jungles',
  'rainforest': 'Nature/Rainforests',
  'woodland': 'Nature/Forests',
  'grove': 'Nature/Forests',
  'tree': 'Nature/Trees',
  'oak': 'Nature/Trees',
  'pine': 'Nature/Trees',
  'maple': 'Nature/Trees',
  'birch': 'Nature/Trees',
  'willow': 'Nature/Trees',
  'palm': 'Nature/Trees',
  'redwood': 'Nature/Trees',
  'sequoia': 'Nature/Trees',
  'bamboo': 'Nature/Plants',
  'trunk': 'Nature/Trees',
  'branch': 'Nature/Trees',
  'leaf': 'Nature/Plants',
  'foliage': 'Nature/Plants',

  // Flowers & Gardens
  'flower': 'Nature/Flowers',
  'rose': 'Nature/Flowers',
  'sunflower': 'Nature/Flowers',
  'tulip': 'Nature/Flowers',
  'daisy': 'Nature/Flowers',
  'lily': 'Nature/Flowers',
  'orchid': 'Nature/Flowers',
  'lotus': 'Nature/Flowers',
  'hibiscus': 'Nature/Flowers',
  'carnation': 'Nature/Flowers',
  'peony': 'Nature/Flowers',
  'lavender': 'Nature/Flowers',
  'jasmine': 'Nature/Flowers',
  'marigold': 'Nature/Flowers',
  'dandelion': 'Nature/Flowers',
  'poppy': 'Nature/Flowers',
  'violet': 'Nature/Flowers',
  'blossom': 'Nature/Flowers',
  'bloom': 'Nature/Flowers',
  'petal': 'Nature/Flowers',
  'bouquet': 'Nature/Flowers',
  'garden': 'Nature/Gardens',
  'park': 'Nature/Parks',

  // Plants & Vegetation
  'plant': 'Nature/Plants',
  'grass': 'Nature/Plants',
  'fern': 'Nature/Plants',
  'moss': 'Nature/Plants',
  'lichen': 'Nature/Plants',
  'bush': 'Nature/Plants',
  'shrub': 'Nature/Plants',
  'hedge': 'Nature/Plants',
  'vine': 'Nature/Plants',
  'ivy': 'Nature/Plants',
  'cactus': 'Nature/Plants',
  'succulent': 'Nature/Plants',
  'weed': 'Nature/Plants',
  'herb': 'Nature/Plants',
  'seaweed': 'Nature/Plants',
  'algae': 'Nature/Plants',

  // Deserts & Arid
  'desert': 'Nature/Deserts',
  'oasis': 'Nature/Deserts',
  'badlands': 'Nature/Deserts',

  // Sky & Weather
  'sky': 'Nature/Sky',
  'cloud': 'Nature/Clouds',
  'cumulus': 'Nature/Clouds',
  'cirrus': 'Nature/Clouds',
  'storm cloud': 'Nature/Storms',
  'sunset': 'Nature/Sunsets',
  'sunrise': 'Nature/Sunrises',
  'dawn': 'Nature/Sunrises',
  'dusk': 'Nature/Sunsets',
  'twilight': 'Nature/Sunsets',
  'sun': 'Nature/Sun',
  'moon': 'Nature/Moon',
  'star': 'Nature/Stars',
  'constellation': 'Nature/Stars',
  'milky way': 'Nature/Space',
  'galaxy': 'Nature/Space',
  'aurora': 'Nature/Aurora',
  'northern lights': 'Nature/Aurora',
  'rainbow': 'Nature/Weather Phenomena',
  'lightning': 'Nature/Weather Phenomena',
  'thunder': 'Nature/Weather Phenomena',
  'storm': 'Nature/Storms',
  'hurricane': 'Nature/Storms',
  'tornado': 'Nature/Storms',
  'cyclone': 'Nature/Storms',
  'rain': 'Nature/Weather',
  'snow': 'Nature/Weather',
  'hail': 'Nature/Weather',
  'fog': 'Nature/Weather',
  'mist': 'Nature/Weather',
  'frost': 'Nature/Weather',
  'ice': 'Nature/Weather',
  'snowflake': 'Nature/Weather',
  'icicle': 'Nature/Weather',

  // Geological Features
  'volcano': 'Nature/Volcanoes',
  'lava': 'Nature/Volcanoes',
  'geyser': 'Nature/Geothermal',
  'hot spring': 'Nature/Geothermal',
  'glacier': 'Nature/Glaciers',
  'iceberg': 'Nature/Ice',
  'rock': 'Nature/Rocks',
  'boulder': 'Nature/Rocks',
  'stone': 'Nature/Rocks',
  'pebble': 'Nature/Rocks',
  'crystal': 'Nature/Minerals',
  'gem': 'Nature/Minerals',
  'diamond': 'Nature/Minerals',
  'quartz': 'Nature/Minerals',

  // ===== FOOD & DRINKS (Massively Expanded - World Cuisines) =====
  // Italian
  'pizza': 'Food/Italian',
  'pasta': 'Food/Italian',
  'spaghetti': 'Food/Italian',
  'lasagna': 'Food/Italian',
  'ravioli': 'Food/Italian',
  'gnocchi': 'Food/Italian',
  'risotto': 'Food/Italian',
  'tiramisu': 'Food/Italian',
  'gelato': 'Food/Italian',
  'focaccia': 'Food/Italian',
  'bruschetta': 'Food/Italian',
  'calzone': 'Food/Italian',
  'penne': 'Food/Italian',
  'fettuccine': 'Food/Italian',
  'carbonara': 'Food/Italian',

  // Fast Food / American
  'burger': 'Food/Fast Food',
  'hamburger': 'Food/Fast Food',
  'cheeseburger': 'Food/Fast Food',
  'hotdog': 'Food/Fast Food',
  'sandwich': 'Food/Sandwiches',
  'sub': 'Food/Sandwiches',
  'panini': 'Food/Sandwiches',
  'wrap': 'Food/Sandwiches',
  'fries': 'Food/Fast Food',
  'french fries': 'Food/Fast Food',
  'onion rings': 'Food/Fast Food',
  'nachos': 'Food/Fast Food',
  'wings': 'Food/Fast Food',
  'nuggets': 'Food/Fast Food',

  // Japanese
  'sushi': 'Food/Japanese',
  'sashimi': 'Food/Japanese',
  'ramen': 'Food/Japanese',
  'tempura': 'Food/Japanese',
  'teriyaki': 'Food/Japanese',
  'udon': 'Food/Japanese',
  'soba': 'Food/Japanese',
  'miso': 'Food/Japanese',
  'tonkatsu': 'Food/Japanese',
  'yakitori': 'Food/Japanese',
  'bento': 'Food/Japanese',
  'onigiri': 'Food/Japanese',
  'gyoza': 'Food/Japanese',
  'edamame': 'Food/Japanese',
  'matcha': 'Food/Japanese',
  'sake': 'Food/Japanese',

  // Mexican
  'taco': 'Food/Mexican',
  'burrito': 'Food/Mexican',
  'quesadilla': 'Food/Mexican',
  'enchilada': 'Food/Mexican',
  'fajita': 'Food/Mexican',
  'tamale': 'Food/Mexican',
  'guacamole': 'Food/Mexican',
  'salsa': 'Food/Mexican',
  'tortilla': 'Food/Mexican',
  'chimichanga': 'Food/Mexican',

  // Chinese
  'noodles': 'Food/Chinese',
  'dumplings': 'Food/Chinese',
  'dim sum': 'Food/Chinese',
  'fried rice': 'Food/Chinese',
  'chow mein': 'Food/Chinese',
  'wonton': 'Food/Chinese',
  'spring roll': 'Food/Chinese',
  'bao': 'Food/Chinese',
  'peking duck': 'Food/Chinese',
  'kung pao': 'Food/Chinese',

  // Indian
  'curry': 'Food/Indian',
  'biryani': 'Food/Indian',
  'tandoori': 'Food/Indian',
  'naan': 'Food/Indian',
  'samosa': 'Food/Indian',
  'tikka': 'Food/Indian',
  'masala': 'Food/Indian',
  'dal': 'Food/Indian',
  'paneer': 'Food/Indian',
  'korma': 'Food/Indian',
  'vindaloo': 'Food/Indian',
  'paratha': 'Food/Indian',

  // Thai
  'pad thai': 'Food/Thai',
  'tom yum': 'Food/Thai',
  'green curry': 'Food/Thai',
  'papaya salad': 'Food/Thai',
  'satay': 'Food/Thai',

  // Middle Eastern
  'hummus': 'Food/Middle Eastern',
  'falafel': 'Food/Middle Eastern',
  'kebab': 'Food/Middle Eastern',
  'shawarma': 'Food/Middle Eastern',
  'pita': 'Food/Middle Eastern',
  'tahini': 'Food/Middle Eastern',
  'baklava': 'Food/Middle Eastern',
  'tabouleh': 'Food/Middle Eastern',

  // French
  'croissant': 'Food/French',
  'baguette': 'Food/French',
  'crepe': 'Food/French',
  'quiche': 'Food/French',
  'souffle': 'Food/French',
  'macaron': 'Food/French',
  'eclair': 'Food/French',
  'ratatouille': 'Food/French',
  'boeuf bourguignon': 'Food/French',

  // Korean
  'kimchi': 'Food/Korean',
  'bibimbap': 'Food/Korean',
  'bulgogi': 'Food/Korean',
  'korean bbq': 'Food/Korean',

  // Main Dishes & Proteins
  'steak': 'Food/Main Dishes',
  'beef': 'Food/Main Dishes',
  'pork': 'Food/Main Dishes',
  'chicken': 'Food/Main Dishes',
  'turkey': 'Food/Main Dishes',
  'lamb': 'Food/Main Dishes',
  'duck': 'Food/Main Dishes',
  'fish': 'Food/Seafood',
  'shrimp': 'Food/Seafood',
  'lobster': 'Food/Seafood',
  'crab': 'Food/Seafood',
  'oyster': 'Food/Seafood',
  'clam': 'Food/Seafood',
  'mussels': 'Food/Seafood',
  'scallops': 'Food/Seafood',
  'caviar': 'Food/Seafood',

  // Healthy Food
  'salad': 'Food/Salads',
  'caesar salad': 'Food/Salads',
  'greek salad': 'Food/Salads',
  'cobb salad': 'Food/Salads',
  'vegetable': 'Food/Vegetables',
  'broccoli': 'Food/Vegetables',
  'carrot': 'Food/Vegetables',
  'tomato': 'Food/Vegetables',
  'potato': 'Food/Vegetables',
  'onion': 'Food/Vegetables',
  'pepper': 'Food/Vegetables',
  'lettuce': 'Food/Vegetables',
  'spinach': 'Food/Vegetables',
  'kale': 'Food/Vegetables',
  'cucumber': 'Food/Vegetables',
  'avocado': 'Food/Vegetables',
  'mushroom': 'Food/Vegetables',
  'eggplant': 'Food/Vegetables',
  'zucchini': 'Food/Vegetables',
  'asparagus': 'Food/Vegetables',
  'corn': 'Food/Vegetables',
  'peas': 'Food/Vegetables',
  'beans': 'Food/Vegetables',

  // Fruits
  'fruit': 'Food/Fruits',
  'apple': 'Food/Fruits',
  'banana': 'Food/Fruits',
  'orange': 'Food/Fruits',
  'grape': 'Food/Fruits',
  'strawberry': 'Food/Fruits',
  'blueberry': 'Food/Fruits',
  'raspberry': 'Food/Fruits',
  'blackberry': 'Food/Fruits',
  'watermelon': 'Food/Fruits',
  'melon': 'Food/Fruits',
  'pineapple': 'Food/Fruits',
  'mango': 'Food/Fruits',
  'papaya': 'Food/Fruits',
  'kiwi': 'Food/Fruits',
  'peach': 'Food/Fruits',
  'pear': 'Food/Fruits',
  'plum': 'Food/Fruits',
  'cherry': 'Food/Fruits',
  'lemon': 'Food/Fruits',
  'lime': 'Food/Fruits',
  'grapefruit': 'Food/Fruits',
  'coconut': 'Food/Fruits',
  'pomegranate': 'Food/Fruits',
  'fig': 'Food/Fruits',
  'date': 'Food/Fruits',

  // Desserts & Sweets
  'chocolate cake': 'Food/Desserts',
  'cheesecake': 'Food/Desserts',
  'cupcake': 'Food/Desserts',
  'pie': 'Food/Desserts',
  'apple pie': 'Food/Desserts',
  'pumpkin pie': 'Food/Desserts',
  'ice cream': 'Food/Desserts',
  'sorbet': 'Food/Desserts',
  'frozen yogurt': 'Food/Desserts',
  'cookie': 'Food/Desserts',
  'brownie': 'Food/Desserts',
  'donut': 'Food/Desserts',
  'muffin': 'Food/Desserts',
  'pudding': 'Food/Desserts',
  'custard': 'Food/Desserts',
  'mousse': 'Food/Desserts',
  'tart': 'Food/Desserts',
  'candy': 'Food/Sweets',
  'chocolate': 'Food/Sweets',
  'lollipop': 'Food/Sweets',
  'gummy': 'Food/Sweets',
  'caramel': 'Food/Sweets',
  'fudge': 'Food/Sweets',

  // Bakery
  'bread': 'Food/Bakery',
  'toast': 'Food/Bakery',
  'bagel': 'Food/Bakery',
  'pretzel': 'Food/Bakery',
  'roll': 'Food/Bakery',
  'scone': 'Food/Bakery',
  'danish': 'Food/Bakery',
  'waffle': 'Food/Bakery',
  'pancake': 'Food/Bakery',

  // Beverages - Hot
  'coffee': 'Food/Hot Beverages',
  'espresso': 'Food/Hot Beverages',
  'cappuccino': 'Food/Hot Beverages',
  'latte': 'Food/Hot Beverages',
  'mocha': 'Food/Hot Beverages',
  'tea': 'Food/Hot Beverages',
  'green tea': 'Food/Hot Beverages',
  'black tea': 'Food/Hot Beverages',
  'herbal tea': 'Food/Hot Beverages',
  'chai': 'Food/Hot Beverages',
  'hot chocolate': 'Food/Hot Beverages',

  // Beverages - Cold
  'juice': 'Food/Cold Beverages',
  'smoothie': 'Food/Cold Beverages',
  'milkshake': 'Food/Cold Beverages',
  'soda': 'Food/Cold Beverages',
  'cola': 'Food/Cold Beverages',
  'lemonade': 'Food/Cold Beverages',
  'iced tea': 'Food/Cold Beverages',
  'iced coffee': 'Food/Cold Beverages',

  // Alcoholic Beverages
  'wine': 'Food/Alcohol',
  'red wine': 'Food/Alcohol',
  'white wine': 'Food/Alcohol',
  'champagne': 'Food/Alcohol',
  'beer': 'Food/Alcohol',
  'ale': 'Food/Alcohol',
  'lager': 'Food/Alcohol',
  'cocktail': 'Food/Alcohol',
  'martini': 'Food/Alcohol',
  'whiskey': 'Food/Alcohol',
  'vodka': 'Food/Alcohol',
  'rum': 'Food/Alcohol',
  'tequila': 'Food/Alcohol',
  'gin': 'Food/Alcohol',

  // Breakfast
  'breakfast': 'Food/Breakfast',
  'eggs': 'Food/Breakfast',
  'omelet': 'Food/Breakfast',
  'bacon': 'Food/Breakfast',
  'sausage': 'Food/Breakfast',
  'cereal': 'Food/Breakfast',
  'oatmeal': 'Food/Breakfast',
  'granola': 'Food/Breakfast',
  'yogurt': 'Food/Breakfast',

  // Condiments & Sauces
  'sauce': 'Food/Condiments',
  'ketchup': 'Food/Condiments',
  'mustard': 'Food/Condiments',
  'mayonnaise': 'Food/Condiments',
  'soy sauce': 'Food/Condiments',
  'hot sauce': 'Food/Condiments',
  'bbq sauce': 'Food/Condiments',

  // Snacks
  'chips': 'Food/Snacks',
  'popcorn': 'Food/Snacks',
  'crackers': 'Food/Snacks',
  'nuts': 'Food/Snacks',
  'pretzels': 'Food/Snacks',

  // ===== SPORTS (Massively Expanded) =====
  // Team Sports
  'basketball': 'Sports/Basketball',
  'football': 'Sports/Football',
  'soccer': 'Sports/Soccer',
  'volleyball': 'Sports/Volleyball',
  'hockey': 'Sports/Hockey',
  'ice hockey': 'Sports/Hockey',
  'field hockey': 'Sports/Hockey',
  'rugby': 'Sports/Rugby',
  'lacrosse': 'Sports/Lacrosse',
  'polo': 'Sports/Polo',
  'water polo': 'Sports/Water Sports',

  // Racket Sports
  'tennis': 'Sports/Tennis',
  'badminton': 'Sports/Racket Sports',
  'squash': 'Sports/Racket Sports',
  'racquetball': 'Sports/Racket Sports',
  'table tennis': 'Sports/Table Tennis',
  'ping pong': 'Sports/Table Tennis',

  // Individual Sports
  'baseball': 'Sports/Baseball',
  'golf': 'Sports/Golf',
  'boxing': 'Sports/Boxing',
  'wrestling': 'Sports/Wrestling',
  'martial arts': 'Sports/Martial Arts',
  'karate': 'Sports/Martial Arts',
  'judo': 'Sports/Martial Arts',
  'taekwondo': 'Sports/Martial Arts',
  'kung fu': 'Sports/Martial Arts',
  'mma': 'Sports/MMA',
  'gymnastics': 'Sports/Gymnastics',
  'track and field': 'Sports/Track',
  'running': 'Sports/Track',
  'marathon': 'Sports/Track',
  'sprint': 'Sports/Track',
  'hurdles': 'Sports/Track',
  'javelin': 'Sports/Track',
  'shot put': 'Sports/Track',
  'pole vault': 'Sports/Track',
  'high jump': 'Sports/Track',
  'long jump': 'Sports/Track',

  // Water Sports
  'swimming': 'Sports/Swimming',
  'diving': 'Sports/Diving',
  'surfing': 'Sports/Surfing',
  'surfboard': 'Sports/Surfing',
  'kayaking': 'Sports/Water Sports',
  'rowing': 'Sports/Water Sports',
  'sailing': 'Sports/Sailing',
  'windsurfing': 'Sports/Water Sports',
  'jet ski': 'Sports/Water Sports',
  'water skiing': 'Sports/Water Sports',
  'wakeboarding': 'Sports/Water Sports',
  'snorkeling': 'Sports/Water Sports',
  'scuba diving': 'Sports/Diving',

  // Winter Sports
  'skiing': 'Sports/Skiing',
  'snowboard': 'Sports/Snowboarding',
  'snowboarding': 'Sports/Snowboarding',
  'ice skating': 'Sports/Ice Skating',
  'figure skating': 'Sports/Ice Skating',
  'speed skating': 'Sports/Ice Skating',
  'sledding': 'Sports/Winter Sports',
  'bobsled': 'Sports/Winter Sports',
  'luge': 'Sports/Winter Sports',
  'curling': 'Sports/Winter Sports',

  // Extreme Sports
  'skateboard': 'Sports/Skateboarding',
  'skateboarding': 'Sports/Skateboarding',
  'bmx': 'Sports/Extreme',
  'parkour': 'Sports/Extreme',
  'rock climbing': 'Sports/Climbing',
  'mountain climbing': 'Sports/Climbing',
  'bungee jumping': 'Sports/Extreme',
  'skydiving': 'Sports/Extreme',
  'paragliding': 'Sports/Extreme',
  'hang gliding': 'Sports/Extreme',

  // Fitness & Training
  'weightlifting': 'Sports/Weightlifting',
  'dumbbell': 'Sports/Fitness',
  'barbell': 'Sports/Fitness',
  'yoga': 'Sports/Yoga',
  'pilates': 'Sports/Fitness',
  'aerobics': 'Sports/Fitness',
  'cycling': 'Sports/Cycling',
  'spinning': 'Sports/Cycling',

  // Equipment & Venues
  'ball': 'Sports/Equipment',
  'racket': 'Sports/Equipment',
  'glove': 'Sports/Equipment',
  'helmet': 'Sports/Equipment',
  'stadium': 'Sports/Venues',
  'arena': 'Sports/Venues',
  'court': 'Sports/Venues',
  'field': 'Sports/Venues',
  'track': 'Sports/Venues',
  'gym': 'Sports/Venues',

  // ===== VEHICLES (Massively Expanded) =====
  // Cars & Automobiles
  'car': 'Vehicles/Cars',
  'sedan': 'Vehicles/Cars',
  'suv': 'Vehicles/SUVs',
  'coupe': 'Vehicles/Cars',
  'convertible': 'Vehicles/Cars',
  'hatchback': 'Vehicles/Cars',
  'wagon': 'Vehicles/Cars',
  'sports car': 'Vehicles/Sports Cars',
  'race car': 'Vehicles/Sports Cars',
  'supercar': 'Vehicles/Sports Cars',
  'limousine': 'Vehicles/Luxury',
  'taxi': 'Vehicles/Public Transport',
  'cab': 'Vehicles/Public Transport',
  'police car': 'Vehicles/Emergency',
  'ambulance': 'Vehicles/Emergency',
  'fire truck': 'Vehicles/Emergency',

  // Trucks & Commercial
  'truck': 'Vehicles/Trucks',
  'pickup': 'Vehicles/Trucks',
  'van': 'Vehicles/Vans',
  'minivan': 'Vehicles/Vans',
  'cargo van': 'Vehicles/Vans',
  'delivery truck': 'Vehicles/Commercial',
  'semi truck': 'Vehicles/Commercial',
  'tractor trailer': 'Vehicles/Commercial',
  'dump truck': 'Vehicles/Construction',
  'cement mixer': 'Vehicles/Construction',
  'bulldozer': 'Vehicles/Construction',
  'excavator': 'Vehicles/Construction',
  'forklift': 'Vehicles/Industrial',

  // Public Transport
  'bus': 'Vehicles/Public Transport',
  'school bus': 'Vehicles/Public Transport',
  'coach': 'Vehicles/Public Transport',
  'trolley': 'Vehicles/Public Transport',
  'tram': 'Vehicles/Public Transport',
  'streetcar': 'Vehicles/Public Transport',
  'metro': 'Vehicles/Public Transport',
  'subway': 'Vehicles/Public Transport',

  // Trains & Railways
  'train': 'Vehicles/Trains',
  'locomotive': 'Vehicles/Trains',
  'bullet train': 'Vehicles/Trains',
  'freight train': 'Vehicles/Trains',
  'steam train': 'Vehicles/Trains',
  'monorail': 'Vehicles/Trains',
  'railroad': 'Vehicles/Trains',
  'railway': 'Vehicles/Trains',

  // Aircraft
  'airplane': 'Vehicles/Aircraft',
  'plane': 'Vehicles/Aircraft',
  'jet': 'Vehicles/Aircraft',
  'fighter jet': 'Vehicles/Military Aircraft',
  'airliner': 'Vehicles/Aircraft',
  'private jet': 'Vehicles/Aircraft',
  'propeller plane': 'Vehicles/Aircraft',
  'seaplane': 'Vehicles/Aircraft',
  'glider': 'Vehicles/Aircraft',
  'helicopter': 'Vehicles/Helicopters',
  'chopper': 'Vehicles/Helicopters',
  'hot air balloon': 'Vehicles/Aircraft',
  'blimp': 'Vehicles/Aircraft',
  'zeppelin': 'Vehicles/Aircraft',
  'drone': 'Vehicles/Drones',
  'uav': 'Vehicles/Drones',

  // Watercraft
  'boat': 'Vehicles/Boats',
  'ship': 'Vehicles/Ships',
  'yacht': 'Vehicles/Luxury Boats',
  'sailboat': 'Vehicles/Sailing',
  'catamaran': 'Vehicles/Sailing',
  'speedboat': 'Vehicles/Boats',
  'cruise ship': 'Vehicles/Ships',
  'ferry': 'Vehicles/Ships',
  'cargo ship': 'Vehicles/Ships',
  'tanker': 'Vehicles/Ships',
  'submarine': 'Vehicles/Military Watercraft',
  'battleship': 'Vehicles/Military Watercraft',
  'aircraft carrier': 'Vehicles/Military Watercraft',
  'canoe': 'Vehicles/Small Boats',
  'kayak': 'Vehicles/Small Boats',
  'rowboat': 'Vehicles/Small Boats',
  'pontoon': 'Vehicles/Boats',
  'houseboat': 'Vehicles/Boats',
  'fishing boat': 'Vehicles/Boats',

  // Two-Wheelers
  'motorcycle': 'Vehicles/Motorcycles',
  'bike': 'Vehicles/Motorcycles',
  'cruiser': 'Vehicles/Motorcycles',
  'scooter': 'Vehicles/Scooters',
  'moped': 'Vehicles/Scooters',
  'vespa': 'Vehicles/Scooters',
  'bicycle': 'Vehicles/Bicycles',
  'mountain bike': 'Vehicles/Bicycles',
  'road bike': 'Vehicles/Bicycles',
  'bmx bike': 'Vehicles/Bicycles',
  'tricycle': 'Vehicles/Bicycles',

  // Space & Futuristic
  'rocket': 'Vehicles/Space',
  'spacecraft': 'Vehicles/Space',
  'space shuttle': 'Vehicles/Space',
  'satellite': 'Vehicles/Space',

  // Recreational
  'rv': 'Vehicles/Recreational',
  'camper': 'Vehicles/Recreational',
  'motorhome': 'Vehicles/Recreational',
  'trailer': 'Vehicles/Recreational',
  'caravan': 'Vehicles/Recreational',
  'atv': 'Vehicles/Recreational',
  'quad bike': 'Vehicles/Recreational',
  'go-kart': 'Vehicles/Recreational',
  'snowmobile': 'Vehicles/Winter Vehicles',

  // ===== TECHNOLOGY (Massively Expanded) =====
  // Computers
  'computer': 'Technology/Computers',
  'laptop': 'Technology/Laptops',
  'notebook': 'Technology/Laptops',
  'ultrabook': 'Technology/Laptops',
  'desktop': 'Technology/Desktops',
  'pc': 'Technology/Computers',
  'mac': 'Technology/Computers',
  'imac': 'Technology/Computers',
  'macbook': 'Technology/Laptops',
  'workstation': 'Technology/Computers',
  'server': 'Technology/Servers',
  'mainframe': 'Technology/Servers',

  // Mobile Devices
  'phone': 'Technology/Mobile',
  'smartphone': 'Technology/Smartphones',
  'mobile': 'Technology/Mobile',
  'iphone': 'Technology/Smartphones',
  'android': 'Technology/Smartphones',
  'cellphone': 'Technology/Mobile',
  'tablet': 'Technology/Tablets',
  'ipad': 'Technology/Tablets',
  'e-reader': 'Technology/E-Readers',
  'kindle': 'Technology/E-Readers',
  'pda': 'Technology/Mobile',
  'smartwatch': 'Technology/Wearables',
  'apple watch': 'Technology/Wearables',
  'fitbit': 'Technology/Wearables',
  'fitness tracker': 'Technology/Wearables',

  // Computer Accessories
  'keyboard': 'Technology/Input Devices',
  'trackpad': 'Technology/Input Devices',
  'touchpad': 'Technology/Input Devices',
  'stylus': 'Technology/Input Devices',
  'gamepad': 'Technology/Gaming',
  'joystick': 'Technology/Gaming',
  'controller': 'Technology/Gaming',
  'webcam': 'Technology/Peripherals',
  'microphone': 'Technology/Audio',
  'mic': 'Technology/Audio',

  // Displays
  'monitor': 'Technology/Monitors',
  'screen': 'Technology/Displays',
  'display': 'Technology/Displays',
  'projector': 'Technology/Projectors',
  'television': 'Technology/TVs',
  'tv': 'Technology/TVs',
  'smart tv': 'Technology/TVs',
  'led': 'Technology/Displays',
  'lcd': 'Technology/Displays',
  'oled': 'Technology/Displays',
  '4k': 'Technology/Displays',

  // Audio Equipment
  'headphone': 'Technology/Audio',
  'headphones': 'Technology/Audio',
  'earbuds': 'Technology/Audio',
  'airpods': 'Technology/Audio',
  'speaker': 'Technology/Speakers',
  'speakers': 'Technology/Speakers',
  'soundbar': 'Technology/Audio',
  'subwoofer': 'Technology/Audio',
  'amplifier': 'Technology/Audio',
  'receiver': 'Technology/Audio',
  'turntable': 'Technology/Audio',
  'record player': 'Technology/Audio',

  // Photography & Video
  'camera': 'Technology/Cameras',
  'dslr': 'Technology/Cameras',
  'mirrorless': 'Technology/Cameras',
  'gopro': 'Technology/Action Cameras',
  'action camera': 'Technology/Action Cameras',
  'video camera': 'Technology/Video',
  'camcorder': 'Technology/Video',
  'lens': 'Technology/Photography',
  'tripod': 'Technology/Photography',
  'flash': 'Technology/Photography',
  'gimbal': 'Technology/Video',

  // Gaming
  'console': 'Technology/Gaming Consoles',
  'playstation': 'Technology/Gaming Consoles',
  'xbox': 'Technology/Gaming Consoles',
  'nintendo': 'Technology/Gaming Consoles',
  'switch': 'Technology/Gaming Consoles',
  'vr headset': 'Technology/VR',
  'oculus': 'Technology/VR',
  'virtual reality': 'Technology/VR',

  // Storage & Memory
  'hard drive': 'Technology/Storage',
  'hdd': 'Technology/Storage',
  'ssd': 'Technology/Storage',
  'usb drive': 'Technology/Storage',
  'flash drive': 'Technology/Storage',
  'memory card': 'Technology/Storage',
  'sd card': 'Technology/Storage',
  'external drive': 'Technology/Storage',
  'nas': 'Technology/Storage',

  // Networking
  'router': 'Technology/Networking',
  'modem': 'Technology/Networking',
  'wifi': 'Technology/Networking',
  'ethernet': 'Technology/Networking',
  'access point': 'Technology/Networking',
  'firewall': 'Technology/Networking',

  // Smart Home
  'smart home': 'Technology/Smart Home',
  'alexa': 'Technology/Smart Home',
  'google home': 'Technology/Smart Home',
  'smart speaker': 'Technology/Smart Home',
  'thermostat': 'Technology/Smart Home',
  'smart lock': 'Technology/Smart Home',
  'security camera': 'Technology/Smart Home',
  'doorbell camera': 'Technology/Smart Home',

  // Other Tech
  'remote': 'Technology/Accessories',
  'remote control': 'Technology/Accessories',
  'charger': 'Technology/Accessories',
  'cable': 'Technology/Accessories',
  'adapter': 'Technology/Accessories',
  'battery': 'Technology/Power',
  'power bank': 'Technology/Power',
  'ups': 'Technology/Power',
  'printer': 'Technology/Printers',
  'scanner': 'Technology/Scanners',
  '3d printer': 'Technology/3D Printing',
  'fax': 'Technology/Office Equipment',
  'copier': 'Technology/Office Equipment',

  // ===== ARCHITECTURE & BUILDINGS (Expanded) =====
  'building': 'Architecture/Buildings',
  'house': 'Architecture/Residential',
  'home': 'Architecture/Residential',
  'apartment': 'Architecture/Apartments',
  'condo': 'Architecture/Apartments',
  'flat': 'Architecture/Apartments',
  'villa': 'Architecture/Luxury Homes',
  'mansion': 'Architecture/Luxury Homes',
  'cottage': 'Architecture/Residential',
  'cabin': 'Architecture/Residential',
  'bungalow': 'Architecture/Residential',
  'townhouse': 'Architecture/Residential',
  'skyscraper': 'Architecture/Skyscrapers',
  'tower': 'Architecture/Towers',
  'office building': 'Architecture/Commercial',
  'hotel': 'Architecture/Hospitality',
  'motel': 'Architecture/Hospitality',
  'resort': 'Architecture/Hospitality',
  'hospital': 'Architecture/Healthcare',
  'clinic': 'Architecture/Healthcare',
  'school': 'Architecture/Educational',
  'university': 'Architecture/Educational',
  'college': 'Architecture/Educational',
  'library': 'Architecture/Educational',
  'museum': 'Architecture/Cultural',
  'gallery': 'Architecture/Cultural',
  'theater': 'Architecture/Entertainment',
  'cinema': 'Architecture/Entertainment',
  'mall': 'Architecture/Commercial',
  'shopping center': 'Architecture/Commercial',
  'store': 'Architecture/Retail',
  'shop': 'Architecture/Retail',
  'restaurant': 'Architecture/Dining',
  'cafe': 'Architecture/Dining',
  'bar': 'Architecture/Dining',
  'factory': 'Architecture/Industrial',
  'warehouse': 'Architecture/Industrial',
  'castle': 'Architecture/Historical',
  'palace': 'Architecture/Historical',
  'fort': 'Architecture/Historical',
  'fortress': 'Architecture/Historical',
  'ruins': 'Architecture/Historical',
  'church': 'Architecture/Religious',
  'cathedral': 'Architecture/Religious',
  'temple': 'Architecture/Religious',
  'mosque': 'Architecture/Religious',
  'synagogue': 'Architecture/Religious',
  'shrine': 'Architecture/Religious',
  'pagoda': 'Architecture/Religious',
  'monastery': 'Architecture/Religious',
  'bridge': 'Architecture/Bridges',
  'suspension bridge': 'Architecture/Bridges',
  'arch bridge': 'Architecture/Bridges',
  'tunnel': 'Architecture/Structures',
  'dam': 'Architecture/Structures',
  'aqueduct': 'Architecture/Structures',
  'statue': 'Architecture/Monuments',
  'monument': 'Architecture/Monuments',
  'memorial': 'Architecture/Monuments',
  'obelisk': 'Architecture/Monuments',
  'arch': 'Architecture/Monuments',
  'pyramid': 'Architecture/Ancient',
  'sphinx': 'Architecture/Ancient',
  'colosseum': 'Architecture/Ancient',
  'amphitheater': 'Architecture/Ancient',
  'lighthouse': 'Architecture/Structures',
  'windmill': 'Architecture/Structures',
  'barn': 'Architecture/Agricultural',
  'silo': 'Architecture/Agricultural',
  'greenhouse': 'Architecture/Agricultural',
  'airport': 'Architecture/Transportation',
  'train station': 'Architecture/Transportation',
  'bus station': 'Architecture/Transportation',
  'parking garage': 'Architecture/Parking',

  // ===== INTERIOR & FURNITURE (Expanded) =====
  'room': 'Interior/Rooms',
  'bedroom': 'Interior/Bedrooms',
  'kitchen': 'Interior/Kitchens',
  'bathroom': 'Interior/Bathrooms',
  'living room': 'Interior/Living Rooms',
  'dining room': 'Interior/Dining Rooms',
  'office': 'Interior/Offices',
  'study': 'Interior/Studies',
  'basement': 'Interior/Basements',
  'attic': 'Interior/Attics',
  'garage': 'Interior/Garages',
  'hallway': 'Interior/Hallways',
  'foyer': 'Interior/Entryways',
  'closet': 'Interior/Storage',
  'pantry': 'Interior/Storage',
  'chair': 'Interior/Seating',
  'armchair': 'Interior/Seating',
  'recliner': 'Interior/Seating',
  'stool': 'Interior/Seating',
  'bench': 'Interior/Seating',
  'sofa': 'Interior/Seating',
  'couch': 'Interior/Seating',
  'loveseat': 'Interior/Seating',
  'sectional': 'Interior/Seating',
  'table': 'Interior/Tables',
  'coffee table': 'Interior/Tables',
  'dining table': 'Interior/Tables',
  'side table': 'Interior/Tables',
  'desk': 'Interior/Desks',
  'bed': 'Interior/Beds',
  'bunk bed': 'Interior/Beds',
  'mattress': 'Interior/Beds',
  'dresser': 'Interior/Storage Furniture',
  'nightstand': 'Interior/Bedroom Furniture',
  'wardrobe': 'Interior/Storage Furniture',
  'cabinet': 'Interior/Storage Furniture',
  'bookshelf': 'Interior/Storage Furniture',
  'shelf': 'Interior/Storage Furniture',
  'counter': 'Interior/Surfaces',
  'countertop': 'Interior/Surfaces',
  'fireplace': 'Interior/Features',
  'chandelier': 'Interior/Lighting',
  'lamp': 'Interior/Lighting',
  'ceiling light': 'Interior/Lighting',
  'floor lamp': 'Interior/Lighting',
  'table lamp': 'Interior/Lighting',
  'mirror': 'Interior/Decor',
  'curtain': 'Interior/Window Treatments',
  'blinds': 'Interior/Window Treatments',
  'rug': 'Interior/Floor Coverings',
  'carpet': 'Interior/Floor Coverings',
  'pillow': 'Interior/Textiles',
  'cushion': 'Interior/Textiles',
  'blanket': 'Interior/Textiles',

  // ===== FASHION & CLOTHING (Massively Expanded) =====
  // Tops
  'shirt': 'Fashion/Shirts',
  't-shirt': 'Fashion/T-Shirts',
  'tee': 'Fashion/T-Shirts',
  'blouse': 'Fashion/Tops',
  'top': 'Fashion/Tops',
  'tank top': 'Fashion/Tops',
  'sweater': 'Fashion/Sweaters',
  'cardigan': 'Fashion/Sweaters',
  'hoodie': 'Fashion/Hoodies',
  'sweatshirt': 'Fashion/Sweaters',
  'jersey': 'Fashion/Sports Apparel',

  // Bottoms
  'pants': 'Fashion/Pants',
  'trousers': 'Fashion/Pants',
  'jeans': 'Fashion/Jeans',
  'denim': 'Fashion/Jeans',
  'shorts': 'Fashion/Shorts',
  'skirt': 'Fashion/Skirts',
  'leggings': 'Fashion/Activewear',
  'tights': 'Fashion/Activewear',

  // Dresses & Outfits
  'dress': 'Fashion/Dresses',
  'gown': 'Fashion/Formal Wear',
  'evening dress': 'Fashion/Formal Wear',
  'cocktail dress': 'Fashion/Dresses',
  'suit': 'Fashion/Suits',
  'tuxedo': 'Fashion/Formal Wear',
  'blazer': 'Fashion/Jackets',
  'jumpsuit': 'Fashion/Outfits',
  'romper': 'Fashion/Outfits',

  // Outerwear
  'jacket': 'Fashion/Jackets',
  'coat': 'Fashion/Coats',
  'overcoat': 'Fashion/Coats',
  'trench coat': 'Fashion/Coats',
  'parka': 'Fashion/Jackets',
  'windbreaker': 'Fashion/Jackets',
  'raincoat': 'Fashion/Outerwear',
  'poncho': 'Fashion/Outerwear',
  'vest': 'Fashion/Vests',

  // Footwear
  'shoe': 'Fashion/Shoes',
  'shoes': 'Fashion/Shoes',
  'sneakers': 'Fashion/Sneakers',
  'trainers': 'Fashion/Sneakers',
  'running shoes': 'Fashion/Athletic Shoes',
  'boot': 'Fashion/Boots',
  'boots': 'Fashion/Boots',
  'ankle boots': 'Fashion/Boots',
  'sandals': 'Fashion/Sandals',
  'flip flops': 'Fashion/Sandals',
  'slippers': 'Fashion/Slippers',
  'heels': 'Fashion/High Heels',
  'high heels': 'Fashion/High Heels',
  'pumps': 'Fashion/High Heels',
  'loafers': 'Fashion/Dress Shoes',
  'oxfords': 'Fashion/Dress Shoes',
  'moccasins': 'Fashion/Casual Shoes',

  // Accessories
  'hat': 'Fashion/Hats',
  'cap': 'Fashion/Caps',
  'baseball cap': 'Fashion/Caps',
  'beanie': 'Fashion/Hats',
  'fedora': 'Fashion/Hats',
  'sun hat': 'Fashion/Hats',
  'scarf': 'Fashion/Scarves',
  'gloves': 'Fashion/Gloves',
  'mittens': 'Fashion/Gloves',
  'tie': 'Fashion/Neckwear',
  'bow tie': 'Fashion/Neckwear',
  'belt': 'Fashion/Belts',
  'bag': 'Fashion/Bags',
  'handbag': 'Fashion/Handbags',
  'purse': 'Fashion/Handbags',
  'clutch': 'Fashion/Handbags',
  'backpack': 'Fashion/Backpacks',
  'tote': 'Fashion/Tote Bags',
  'briefcase': 'Fashion/Business Bags',
  'wallet': 'Fashion/Wallets',
  'sunglasses': 'Fashion/Eyewear',
  'glasses': 'Fashion/Eyewear',
  'watch': 'Fashion/Watches',
  'wristwatch': 'Fashion/Watches',
  'bracelet': 'Fashion/Jewelry',
  'necklace': 'Fashion/Jewelry',
  'earrings': 'Fashion/Jewelry',
  'ring': 'Fashion/Jewelry',
  'jewelry': 'Fashion/Jewelry',
  'jewellery': 'Fashion/Jewelry',

  // ===== ART & ENTERTAINMENT (Expanded) =====
  'art': 'Art/General',
  'painting': 'Art/Paintings',
  'canvas': 'Art/Paintings',
  'oil painting': 'Art/Paintings',
  'watercolor': 'Art/Paintings',
  'acrylic': 'Art/Paintings',
  'mural': 'Art/Murals',
  'graffiti': 'Art/Street Art',
  'drawing': 'Art/Drawings',
  'sketch': 'Art/Drawings',
  'illustration': 'Art/Illustrations',
  'sculpture': 'Art/Sculptures',
  'bust': 'Art/Sculptures',
  'pottery': 'Art/Ceramics',
  'ceramics': 'Art/Ceramics',
  'vase': 'Art/Ceramics',
  'photography': 'Art/Photography',
  'photo': 'Art/Photography',
  'print': 'Art/Prints',
  'poster': 'Art/Posters',
  'mosaic': 'Art/Mosaics',
  'tapestry': 'Art/Textiles',
  'installation': 'Art/Installations',
  'music': 'Entertainment/Music',
  'concert': 'Entertainment/Music',
  'performance': 'Entertainment/Performances',
  'guitar': 'Entertainment/Guitars',
  'electric guitar': 'Entertainment/Guitars',
  'acoustic guitar': 'Entertainment/Guitars',
  'piano': 'Entertainment/Pianos',
  'grand piano': 'Entertainment/Pianos',
  'drum': 'Entertainment/Drums',
  'drums': 'Entertainment/Drums',
  'drum set': 'Entertainment/Drums',
  'violin': 'Entertainment/Strings',
  'cello': 'Entertainment/Strings',
  'saxophone': 'Entertainment/Instruments',
  'trumpet': 'Entertainment/Instruments',
  'flute': 'Entertainment/Instruments',
  'clarinet': 'Entertainment/Instruments',
  'harp': 'Entertainment/Instruments',
  'book': 'Entertainment/Books',
  'novel': 'Entertainment/Books',
  'textbook': 'Entertainment/Books',
  'magazine': 'Entertainment/Magazines',
  'newspaper': 'Entertainment/News',
  'comic': 'Entertainment/Comics',
  'manga': 'Entertainment/Comics',
  'movie': 'Entertainment/Movies',
  'film': 'Entertainment/Movies',
  'video game': 'Entertainment/Gaming',
  'game': 'Entertainment/Gaming',
  'board game': 'Entertainment/Games',
  'puzzle': 'Entertainment/Games',
  'cards': 'Entertainment/Games',
  'dice': 'Entertainment/Games',

  // ===== OBJECTS & ITEMS (Expanded) =====
  // Containers
  'bottle': 'Objects/Bottles',
  'water bottle': 'Objects/Bottles',
  'cup': 'Objects/Cups',
  'mug': 'Objects/Cups',
  'glass': 'Objects/Glassware',
  'wine glass': 'Objects/Glassware',
  'jar': 'Objects/Containers',
  'can': 'Objects/Containers',
  'box': 'Objects/Containers',
  'container': 'Objects/Containers',
  'basket': 'Objects/Containers',
  'bucket': 'Objects/Containers',
  'barrel': 'Objects/Containers',

  // Kitchenware
  'plate': 'Objects/Kitchenware',
  'dish': 'Objects/Kitchenware',
  'bowl': 'Objects/Kitchenware',
  'fork': 'Objects/Utensils',
  'knife': 'Objects/Utensils',
  'spoon': 'Objects/Utensils',
  'chopsticks': 'Objects/Utensils',
  'spatula': 'Objects/Cooking Tools',
  'whisk': 'Objects/Cooking Tools',
  'ladle': 'Objects/Cooking Tools',
  'pot': 'Objects/Cookware',
  'pan': 'Objects/Cookware',
  'frying pan': 'Objects/Cookware',
  'wok': 'Objects/Cookware',
  'kettle': 'Objects/Kitchenware',
  'teapot': 'Objects/Kitchenware',
  'blender': 'Objects/Appliances',
  'mixer': 'Objects/Appliances',
  'toaster': 'Objects/Appliances',
  'microwave': 'Objects/Appliances',
  'oven': 'Objects/Appliances',
  'refrigerator': 'Objects/Appliances',
  'dishwasher': 'Objects/Appliances',

  // Time & Measurement
  'clock': 'Objects/Clocks',
  'timer': 'Objects/Time',
  'hourglass': 'Objects/Time',
  'sundial': 'Objects/Time',
  'calendar': 'Objects/Time',
  'scale': 'Objects/Measurement',
  'ruler': 'Objects/Measurement',
  'measuring tape': 'Objects/Measurement',
  'thermometer': 'Objects/Measurement',

  // Everyday Items
  'umbrella': 'Objects/Everyday',
  'key': 'Objects/Everyday',
  'lock': 'Objects/Security',
  'padlock': 'Objects/Security',
  'flashlight': 'Objects/Lighting',
  'torch': 'Objects/Lighting',
  'lantern': 'Objects/Lighting',
  'candle': 'Objects/Lighting',
  'lighter': 'Objects/Everyday',
  'matches': 'Objects/Everyday',
  'pen': 'Objects/Writing',
  'pencil': 'Objects/Writing',
  'marker': 'Objects/Writing',
  'crayon': 'Objects/Writing',
  'eraser': 'Objects/Stationery',
  'paper': 'Objects/Stationery',
  'scissors': 'Objects/Tools',
  'tape': 'Objects/Stationery',
  'glue': 'Objects/Stationery',
  'stapler': 'Objects/Office Supplies',
  'paperclip': 'Objects/Office Supplies',
  'binder': 'Objects/Office Supplies',
  'folder': 'Objects/Office Supplies',

  // Bags & Luggage
  'suitcase': 'Objects/Luggage',
  'luggage': 'Objects/Luggage',
  'duffel bag': 'Objects/Bags',
  'gym bag': 'Objects/Bags',
  'shopping bag': 'Objects/Bags',

  // Tools & Hardware
  'tool': 'Objects/Tools',
  'hammer': 'Objects/Tools',
  'screwdriver': 'Objects/Tools',
  'wrench': 'Objects/Tools',
  'pliers': 'Objects/Tools',
  'saw': 'Objects/Tools',
  'drill': 'Objects/Power Tools',
  'nail': 'Objects/Hardware',
  'screw': 'Objects/Hardware',
  'bolt': 'Objects/Hardware',
  'nut': 'Objects/Hardware',
  'toolbox': 'Objects/Storage',

  // Toys & Games
  'toy': 'Objects/Toys',
  'doll': 'Objects/Toys',
  'teddy bear': 'Objects/Toys',
  'action figure': 'Objects/Toys',
  'lego': 'Objects/Toys',
  'blocks': 'Objects/Toys',

  // ===== MEDICAL & HEALTHCARE (NEW!) =====
  'stethoscope': 'Medical/Equipment',
  'syringe': 'Medical/Equipment',
  'pill': 'Medical/Medication',
  'medicine': 'Medical/Medication',
  'bandage': 'Medical/First Aid',
  'cast': 'Medical/Equipment',
  'crutches': 'Medical/Equipment',
  'wheelchair': 'Medical/Mobility',
  'x-ray': 'Medical/Imaging',
  'mri': 'Medical/Imaging',
  'ct scan': 'Medical/Imaging',
  'microscope': 'Medical/Lab Equipment',
  'test tube': 'Medical/Lab Equipment',
  'beaker': 'Medical/Lab Equipment',
  'petri dish': 'Medical/Lab Equipment',

  // ===== SCIENTIFIC (NEW!) =====
  'telescope': 'Scientific/Astronomy',
  'laboratory': 'Scientific/Lab',
  'lab': 'Scientific/Lab',
  'experiment': 'Scientific/Research',
  'atom': 'Scientific/Physics',
  'molecule': 'Scientific/Chemistry',
  'dna': 'Scientific/Biology',
  'cell': 'Scientific/Biology',
  'bacteria': 'Scientific/Microbiology',
  'virus': 'Scientific/Microbiology',
  'chemical': 'Scientific/Chemistry',

  // ===== INDUSTRIAL & CONSTRUCTION (NEW!) =====
  'machinery': 'Industrial/Machinery',
  'assembly line': 'Industrial/Manufacturing',
  'robot': 'Industrial/Robotics',
  'robotic arm': 'Industrial/Robotics',
  'gear': 'Industrial/Mechanics',
  'engine': 'Industrial/Engines',
  'turbine': 'Industrial/Power',
  'generator': 'Industrial/Power',
  'solar panel': 'Industrial/Renewable Energy',
  'wind turbine': 'Industrial/Renewable Energy',
  'oil rig': 'Industrial/Energy',
  'pipeline': 'Industrial/Infrastructure',
  'valve': 'Industrial/Components',
  'piston': 'Industrial/Components',

  // ===== MILITARY & WEAPONS (NEW!) =====
  'tank': 'Military/Vehicles',
  'soldier': 'Military/Personnel',
  'uniform': 'Military/Equipment',
  'gun': 'Military/Weapons',
  'rifle': 'Military/Weapons',
  'pistol': 'Military/Weapons',
  'cannon': 'Military/Weapons',
  'missile': 'Military/Weapons',
  'bomb': 'Military/Weapons',
  'grenade': 'Military/Weapons',
  'sword': 'Military/Melee Weapons',
  'shield': 'Military/Defense',
  'armor': 'Military/Defense',

  // ===== EDUCATION (NEW!) =====
  'classroom': 'Education/Classrooms',
  'blackboard': 'Education/Teaching Tools',
  'whiteboard': 'Education/Teaching Tools',
  'chalkboard': 'Education/Teaching Tools',
  'pencil case': 'Education/Supplies',
  'homework': 'Education/Assignments',
  'diploma': 'Education/Certificates',
  'degree': 'Education/Certificates',
  'graduation cap': 'Education/Graduation',

  // ===== SPACE & ASTRONOMY (NEW!) =====
  'planet': 'Space/Planets',
  'earth': 'Space/Planets',
  'mars': 'Space/Planets',
  'jupiter': 'Space/Planets',
  'saturn': 'Space/Planets',
  'comet': 'Space/Celestial Objects',
  'asteroid': 'Space/Celestial Objects',
  'meteor': 'Space/Celestial Objects',
  'nebula': 'Space/Deep Space',
  'black hole': 'Space/Deep Space',
  'astronaut': 'Space/Personnel',
  'space station': 'Space/Structures',

  // ===== HOLIDAYS & CELEBRATIONS (NEW!) =====
  'christmas': 'Holidays/Christmas',
  'christmas tree': 'Holidays/Christmas',
  'santa': 'Holidays/Christmas',
  'halloween': 'Holidays/Halloween',
  'pumpkin': 'Holidays/Halloween',
  'easter': 'Holidays/Easter',
  'cake': 'Celebrations/Food',
  'balloon': 'Celebrations/Decor',
  'fireworks': 'Celebrations/Fireworks',
  'confetti': 'Celebrations/Decor',
  'gift': 'Celebrations/Gifts',
  'present': 'Celebrations/Gifts',
  'wreath': 'Holidays/Decor',
  'ornament': 'Holidays/Decor',

  // ===== SIGNS & SYMBOLS (NEW!) =====
  'sign': 'Signs/General',
  'traffic light': 'Signs/Traffic',
  'stop sign': 'Signs/Traffic',
  'road sign': 'Signs/Traffic',
  'flag': 'Symbols/Flags',
  'banner': 'Symbols/Banners',
  'logo': 'Symbols/Logos',
  'emblem': 'Symbols/Emblems',
  'icon': 'Symbols/Icons',
  'symbol': 'Symbols/General',
  'arrow': 'Symbols/Arrows',
  'cross': 'Symbols/Religious',
  'heart': 'Symbols/Shapes',
  'circle': 'Symbols/Shapes',
  'square': 'Symbols/Shapes',
  'triangle': 'Symbols/Shapes',
};

// Smart category detector based on class name patterns
function getSmartCategory(className: string): string {
  const lower = className.toLowerCase();

  // Animal patterns
  if (lower.includes('dog') || lower.includes('puppy')) return 'Animals/Dogs';
  if (lower.includes('cat') || lower.includes('kitten')) return 'Animals/Cats';
  if (lower.match(/lion|tiger|leopard|cheetah|jaguar/)) return 'Animals/Wild Cats';
  if (lower.match(/bear|panda/)) return 'Animals/Bears';
  if (lower.match(/bird|parrot|eagle|hawk|owl/)) return 'Animals/Birds';
  if (lower.match(/fish|shark|whale|dolphin/)) return 'Animals/Sea Life';
  if (lower.match(/snake|lizard|turtle|crocodile/)) return 'Animals/Reptiles';
  if (lower.match(/elephant|giraffe|zebra|rhino|hippo/)) return 'Animals/Wildlife';

  // People patterns
  if (lower.match(/person|people|man|woman|boy|girl|child|baby/)) return 'People/General';
  if (lower.match(/face|portrait|selfie/)) return 'People/Portraits';

  // Nature patterns
  if (lower.match(/mountain|hill|peak/)) return 'Nature/Mountains';
  if (lower.match(/beach|shore|coast/)) return 'Nature/Beaches';
  if (lower.match(/ocean|sea|water|lake|river/)) return 'Nature/Water';
  if (lower.match(/forest|tree|woods/)) return 'Nature/Forests';
  if (lower.match(/flower|rose|tulip|lily/)) return 'Nature/Flowers';
  if (lower.match(/sunset|sunrise|sky|cloud/)) return 'Nature/Sky';

  // Food patterns
  if (lower.match(/pizza|pasta|spaghetti/)) return 'Food/Italian';
  if (lower.match(/burger|hamburger|hotdog|fries|sandwich/)) return 'Food/Fast Food';
  if (lower.match(/sushi|ramen|tempura/)) return 'Food/Japanese';
  if (lower.match(/taco|burrito|nachos/)) return 'Food/Mexican';
  if (lower.match(/cake|pie|cookie|donut|dessert/)) return 'Food/Desserts';
  if (lower.match(/coffee|espresso|latte|cappuccino/)) return 'Food/Beverages';
  if (lower.match(/fruit|apple|banana|orange|berry/)) return 'Food/Fruits';
  if (lower.match(/vegetable|salad|lettuce|carrot/)) return 'Food/Healthy';

  // Sports patterns
  if (lower.match(/basketball|hoop/)) return 'Sports/Basketball';
  if (lower.match(/football|soccer/)) return 'Sports/Football';
  if (lower.match(/tennis|racket/)) return 'Sports/Tennis';
  if (lower.match(/baseball|bat/)) return 'Sports/Baseball';
  if (lower.match(/golf|club/)) return 'Sports/Golf';
  if (lower.match(/ball|sport/)) return 'Sports/General';

  // Vehicle patterns
  if (lower.match(/car|sedan|suv|vehicle|auto/)) return 'Vehicles/Cars';
  if (lower.match(/truck|van|pickup/)) return 'Vehicles/Trucks';
  if (lower.match(/bus|coach/)) return 'Vehicles/Public Transport';
  if (lower.match(/train|locomotive|railway/)) return 'Vehicles/Trains';
  if (lower.match(/airplane|aircraft|jet|plane/)) return 'Vehicles/Aircraft';
  if (lower.match(/boat|ship|yacht/)) return 'Vehicles/Watercraft';
  if (lower.match(/motorcycle|bike|chopper/)) return 'Vehicles/Motorcycles';
  if (lower.match(/bicycle|cycle/)) return 'Vehicles/Bicycles';

  // Technology patterns
  if (lower.match(/computer|laptop|desktop|pc/)) return 'Technology/Computers';
  if (lower.match(/phone|smartphone|mobile|iphone|android/)) return 'Technology/Mobile';
  if (lower.match(/tablet|ipad/)) return 'Technology/Mobile';
  if (lower.match(/keyboard|mouse|monitor/)) return 'Technology/Accessories';
  if (lower.match(/camera|lens|photography/)) return 'Technology/Photography';
  if (lower.match(/television|tv|screen/)) return 'Technology/Entertainment';

  // Architecture patterns
  if (lower.match(/building|skyscraper|tower/)) return 'Architecture/Buildings';
  if (lower.match(/house|home|cottage/)) return 'Architecture/Residential';
  if (lower.match(/castle|palace|fortress/)) return 'Architecture/Historical';
  if (lower.match(/church|temple|mosque|cathedral/)) return 'Architecture/Religious';
  if (lower.match(/bridge|arch/)) return 'Architecture/Structures';

  // Interior patterns
  if (lower.match(/room|bedroom|kitchen|bathroom/)) return 'Interior/Rooms';
  if (lower.match(/chair|table|sofa|couch|furniture/)) return 'Interior/Furniture';

  // Fashion patterns
  if (lower.match(/dress|shirt|pants|clothing|apparel/)) return 'Fashion/Clothing';
  if (lower.match(/shoe|boot|sneaker|footwear/)) return 'Fashion/Footwear';
  if (lower.match(/bag|purse|handbag/)) return 'Fashion/Accessories';

  // Default - use first word as category
  const words = lower.split(/[\s,]+/);
  const firstWord = words[0];
  if (firstWord && firstWord.length > 2) {
    return `Other/${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)}`;
  }

  return 'Uncategorized/Other';
}

export async function loadModel(): Promise<void> {
  if (!model) {
    console.log('🤖 Loading AI model...');

    try {
      // Try loading with retry logic
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && !model) {
        try {
          model = await mobilenet.load({
            version: 2,
            alpha: 1.0,
          });
          console.log('✅ AI model loaded successfully!');
          break;
        } catch (err) {
          attempts++;
          console.warn(`⚠️ Model load attempt ${attempts}/${maxAttempts} failed:`, err);

          if (attempts < maxAttempts) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          } else {
            throw err;
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to load AI model after all attempts:', error);
      // Don't throw - allow app to continue without AI categorization
      console.log('📝 Will use file-type based categorization as fallback');
    }
  }
}

export async function categorizeImage(file: File): Promise<{
  category: string;
  subcategory: string;
  predictions: Array<{ className: string; probability: number }>;
  confidence: number;
}> {
  try {
    await loadModel();

    // If model failed to load, use file-type categorization as fallback
    if (!model) {
      console.log('⚠️ AI model not available, using file-type categorization');
      const fileTypeResult = categorizeByFileType(file);
      return {
        category: fileTypeResult.category,
        subcategory: fileTypeResult.subcategory,
        predictions: [{ className: 'File Type Detection', probability: 1.0 }],
        confidence: fileTypeResult.confidence
      };
    }

    const img = document.createElement('img');
    const imageUrl = URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          const predictions = await model!.classify(img);
          URL.revokeObjectURL(imageUrl);

          console.log('🤖 AI Predictions for', file.name, ':', predictions);

          let bestCategory = '';
          let bestConfidence = 0;

          // Try exact keyword matching first
          for (const pred of predictions) {
            const lowerClass = pred.className.toLowerCase();

            for (const [keyword, category] of Object.entries(categoryMapping)) {
              const words = lowerClass.split(/[\s,]+/);
              const keywordMatch = words.some(word =>
                word.includes(keyword) || keyword.includes(word)
              );

              if (keywordMatch) {
                if (pred.probability > bestConfidence) {
                  bestCategory = category;
                  bestConfidence = pred.probability;
                  console.log('✅ Exact match!', keyword, '→', category, `(${Math.round(pred.probability * 100)}%)`);
                }
                break;
              }
            }
          }

          // If no exact match, use smart categorization
          if (!bestCategory) {
            const topPrediction = predictions[0];
            bestCategory = getSmartCategory(topPrediction.className);
            bestConfidence = topPrediction.probability;
            console.log('🔍 Smart categorization:', topPrediction.className, '→', bestCategory, `(${Math.round(topPrediction.probability * 100)}%)`);
          }

          const [mainCategory, subCategory] = bestCategory.split('/');

          resolve({
            category: mainCategory,
            subcategory: subCategory || 'General',
            predictions: predictions.map(p => ({
              className: p.className,
              probability: Math.round(p.probability * 100) / 100
            })),
            confidence: Math.round(bestConfidence * 100)
          });

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });

  } catch (error) {
    console.error('❌ Categorization error:', error);
    return {
      category: 'Uncategorized',
      subcategory: 'Other',
      predictions: [],
      confidence: 0
    };
  }
}

/**
 * Categorize file by extension and type
 */
export function categorizeByFileType(file: File): {
  category: string;
  subcategory: string;
  confidence: number;
} {
  const filename = file.name.toLowerCase();
  const ext = filename.split('.').pop() || '';

  // Videos
  if (['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', 'mpeg', 'mpg'].includes(ext)) {
    return { category: 'Videos', subcategory: 'General', confidence: 100 };
  }

  // Documents
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
    return { category: 'Documents', subcategory: 'Text', confidence: 100 };
  }

  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return { category: 'Documents', subcategory: 'Spreadsheets', confidence: 100 };
  }

  // Presentations
  if (['ppt', 'pptx', 'odp', 'key'].includes(ext)) {
    return { category: 'Documents', subcategory: 'Presentations', confidence: 100 };
  }

  // Code files
  if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php', 'rb', 'go', 'rs'].includes(ext)) {
    return { category: 'Code', subcategory: 'Source Files', confidence: 100 };
  }

  // Config files
  if (['json', 'yaml', 'yml', 'xml', 'toml', 'ini', 'env'].includes(ext)) {
    return { category: 'Code', subcategory: 'Config', confidence: 100 };
  }

  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
    return { category: 'Archives', subcategory: 'Compressed', confidence: 100 };
  }

  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext)) {
    return { category: 'Audio', subcategory: 'Music', confidence: 100 };
  }

  // 3D Models
  if (['obj', 'fbx', 'blend', 'dae', 'stl', '3ds'].includes(ext)) {
    return { category: 'Models', subcategory: '3D', confidence: 100 };
  }

  // Fonts
  if (['ttf', 'otf', 'woff', 'woff2', 'eot'].includes(ext)) {
    return { category: 'Fonts', subcategory: 'Typography', confidence: 100 };
  }

  // Design files
  if (['psd', 'ai', 'sketch', 'fig', 'xd'].includes(ext)) {
    return { category: 'Design', subcategory: 'Projects', confidence: 100 };
  }

  // Default
  return { category: 'Other', subcategory: 'Miscellaneous', confidence: 100 };
}

export async function categorizeImages(files: File[]): Promise<Array<{
  file: File;
  category: string;
  subcategory: string;
  confidence: number;
}>> {
  const results = [];

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      // Use AI for images
      const result = await categorizeImage(file);
      results.push({
        file,
        category: result.category,
        subcategory: result.subcategory,
        confidence: result.confidence
      });
    } else {
      // Use file type categorization for non-images
      const result = categorizeByFileType(file);
      results.push({
        file,
        ...result
      });
    }
  }

  return results;
}
