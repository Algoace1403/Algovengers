import '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

// Comprehensive category mapping
const categoryMapping: { [key: string]: string } = {
  // Animals - Mammals
  'dog': 'Animals/Dogs',
  'cat': 'Animals/Cats',
  'lion': 'Animals/Wild Cats',
  'tiger': 'Animals/Wild Cats',
  'leopard': 'Animals/Wild Cats',
  'cheetah': 'Animals/Wild Cats',
  'bear': 'Animals/Bears',
  'wolf': 'Animals/Wild',
  'fox': 'Animals/Wild',
  'elephant': 'Animals/Wildlife',
  'giraffe': 'Animals/Wildlife',
  'zebra': 'Animals/Wildlife',
  'horse': 'Animals/Horses',
  'cow': 'Animals/Farm',
  'pig': 'Animals/Farm',
  'sheep': 'Animals/Farm',
  'goat': 'Animals/Farm',
  'deer': 'Animals/Wild',
  'monkey': 'Animals/Primates',
  'gorilla': 'Animals/Primates',
  'chimpanzee': 'Animals/Primates',
  'kangaroo': 'Animals/Wildlife',
  'koala': 'Animals/Wildlife',
  'panda': 'Animals/Bears',
  'rabbit': 'Animals/Small Mammals',
  'squirrel': 'Animals/Small Mammals',
  'rat': 'Animals/Small Mammals',

  // Animals - Birds
  'bird': 'Animals/Birds',
  'eagle': 'Animals/Birds of Prey',
  'hawk': 'Animals/Birds of Prey',
  'owl': 'Animals/Birds of Prey',
  'parrot': 'Animals/Birds',
  'peacock': 'Animals/Birds',
  'penguin': 'Animals/Birds',
  'flamingo': 'Animals/Birds',
  'duck': 'Animals/Birds',
  'goose': 'Animals/Birds',
  'rooster': 'Animals/Farm',

  // Animals - Reptiles & Amphibians
  'snake': 'Animals/Reptiles',
  'lizard': 'Animals/Reptiles',
  'turtle': 'Animals/Reptiles',
  'crocodile': 'Animals/Reptiles',
  'alligator': 'Animals/Reptiles',
  'frog': 'Animals/Amphibians',

  // Animals - Sea Creatures
  'fish': 'Animals/Sea Life',
  'shark': 'Animals/Sea Life',
  'whale': 'Animals/Sea Life',
  'dolphin': 'Animals/Sea Life',
  'seal': 'Animals/Sea Life',
  'octopus': 'Animals/Sea Life',
  'jellyfish': 'Animals/Sea Life',

  // Animals - Insects
  'butterfly': 'Animals/Insects',
  'bee': 'Animals/Insects',
  'spider': 'Animals/Insects',
  'ant': 'Animals/Insects',

  // People
  'person': 'People/General',
  'man': 'People/General',
  'woman': 'People/General',
  'boy': 'People/Children',
  'girl': 'People/Children',
  'child': 'People/Children',
  'baby': 'People/Children',
  'face': 'People/Portraits',
  'portrait': 'People/Portraits',
  'crowd': 'People/Groups',
  'people': 'People/Groups',

  // Nature - Landscapes
  'mountain': 'Nature/Mountains',
  'beach': 'Nature/Beaches',
  'ocean': 'Nature/Water',
  'sea': 'Nature/Water',
  'lake': 'Nature/Water',
  'river': 'Nature/Water',
  'waterfall': 'Nature/Water',
  'forest': 'Nature/Forests',
  'tree': 'Nature/Trees',
  'flower': 'Nature/Flowers',
  'rose': 'Nature/Flowers',
  'sunflower': 'Nature/Flowers',
  'plant': 'Nature/Plants',
  'grass': 'Nature/Plants',
  'garden': 'Nature/Gardens',
  'desert': 'Nature/Landscapes',
  'valley': 'Nature/Landscapes',
  'canyon': 'Nature/Landscapes',
  'cliff': 'Nature/Landscapes',
  'volcano': 'Nature/Landscapes',
  'sunset': 'Nature/Sky',
  'sunrise': 'Nature/Sky',
  'sky': 'Nature/Sky',
  'cloud': 'Nature/Sky',
  'rainbow': 'Nature/Sky',

  // Food & Drinks
  'pizza': 'Food/Italian',
  'pasta': 'Food/Italian',
  'spaghetti': 'Food/Italian',
  'burger': 'Food/Fast Food',
  'hamburger': 'Food/Fast Food',
  'hotdog': 'Food/Fast Food',
  'sandwich': 'Food/Fast Food',
  'fries': 'Food/Fast Food',
  'sushi': 'Food/Japanese',
  'ramen': 'Food/Japanese',
  'taco': 'Food/Mexican',
  'burrito': 'Food/Mexican',
  'steak': 'Food/Main Dishes',
  'chicken': 'Food/Main Dishes',
  'salad': 'Food/Healthy',
  'vegetable': 'Food/Healthy',
  'fruit': 'Food/Fruits',
  'apple': 'Food/Fruits',
  'banana': 'Food/Fruits',
  'orange': 'Food/Fruits',
  'strawberry': 'Food/Fruits',
  'cake': 'Food/Desserts',
  'pie': 'Food/Desserts',
  'ice cream': 'Food/Desserts',
  'cookie': 'Food/Desserts',
  'donut': 'Food/Desserts',
  'bread': 'Food/Bakery',
  'bagel': 'Food/Bakery',
  'coffee': 'Food/Beverages',
  'tea': 'Food/Beverages',
  'wine': 'Food/Beverages',
  'beer': 'Food/Beverages',
  'juice': 'Food/Beverages',

  // Sports
  'basketball': 'Sports/Basketball',
  'football': 'Sports/Football',
  'soccer': 'Sports/Soccer',
  'tennis': 'Sports/Tennis',
  'baseball': 'Sports/Baseball',
  'golf': 'Sports/Golf',
  'volleyball': 'Sports/Volleyball',
  'cricket': 'Sports/Cricket',
  'hockey': 'Sports/Hockey',
  'skiing': 'Sports/Winter Sports',
  'snowboard': 'Sports/Winter Sports',
  'skateboard': 'Sports/Extreme',
  'surfboard': 'Sports/Water Sports',
  'ball': 'Sports/Equipment',
  'stadium': 'Sports/Venues',

  // Vehicles
  'car': 'Vehicles/Cars',
  'sedan': 'Vehicles/Cars',
  'suv': 'Vehicles/Cars',
  'truck': 'Vehicles/Trucks',
  'van': 'Vehicles/Trucks',
  'bus': 'Vehicles/Public Transport',
  'train': 'Vehicles/Trains',
  'airplane': 'Vehicles/Aircraft',
  'helicopter': 'Vehicles/Aircraft',
  'boat': 'Vehicles/Watercraft',
  'ship': 'Vehicles/Watercraft',
  'yacht': 'Vehicles/Watercraft',
  'motorcycle': 'Vehicles/Motorcycles',
  'bike': 'Vehicles/Motorcycles',
  'bicycle': 'Vehicles/Bicycles',
  'scooter': 'Vehicles/Scooters',

  // Technology
  'computer': 'Technology/Computers',
  'laptop': 'Technology/Computers',
  'desktop': 'Technology/Computers',
  'phone': 'Technology/Mobile',
  'smartphone': 'Technology/Mobile',
  'tablet': 'Technology/Mobile',
  'keyboard': 'Technology/Accessories',
  'mouse': 'Technology/Accessories',
  'monitor': 'Technology/Displays',
  'screen': 'Technology/Displays',
  'camera': 'Technology/Photography',
  'headphone': 'Technology/Audio',
  'speaker': 'Technology/Audio',
  'television': 'Technology/Entertainment',
  'remote': 'Technology/Accessories',

  // Architecture & Buildings
  'building': 'Architecture/Buildings',
  'house': 'Architecture/Residential',
  'home': 'Architecture/Residential',
  'apartment': 'Architecture/Residential',
  'skyscraper': 'Architecture/Commercial',
  'tower': 'Architecture/Landmarks',
  'castle': 'Architecture/Historical',
  'palace': 'Architecture/Historical',
  'church': 'Architecture/Religious',
  'temple': 'Architecture/Religious',
  'mosque': 'Architecture/Religious',
  'bridge': 'Architecture/Structures',
  'statue': 'Architecture/Monuments',
  'monument': 'Architecture/Monuments',

  // Interior & Furniture
  'room': 'Interior/Rooms',
  'bedroom': 'Interior/Bedrooms',
  'kitchen': 'Interior/Kitchens',
  'bathroom': 'Interior/Bathrooms',
  'chair': 'Interior/Furniture',
  'table': 'Interior/Furniture',
  'sofa': 'Interior/Furniture',
  'bed': 'Interior/Furniture',
  'desk': 'Interior/Furniture',
  'lamp': 'Interior/Lighting',

  // Fashion & Clothing
  'dress': 'Fashion/Clothing',
  'shirt': 'Fashion/Clothing',
  'pants': 'Fashion/Clothing',
  'shoe': 'Fashion/Footwear',
  'boot': 'Fashion/Footwear',
  'hat': 'Fashion/Accessories',
  'bag': 'Fashion/Accessories',
  'watch': 'Fashion/Accessories',
  'jewelry': 'Fashion/Accessories',

  // Art & Entertainment
  'painting': 'Art/Paintings',
  'sculpture': 'Art/Sculptures',
  'music': 'Entertainment/Music',
  'guitar': 'Entertainment/Instruments',
  'piano': 'Entertainment/Instruments',
  'drum': 'Entertainment/Instruments',
  'book': 'Entertainment/Books',
  'movie': 'Entertainment/Movies',

  // Objects & Items
  'bottle': 'Objects/Containers',
  'cup': 'Objects/Containers',
  'glass': 'Objects/Containers',
  'plate': 'Objects/Kitchenware',
  'bowl': 'Objects/Kitchenware',
  'fork': 'Objects/Kitchenware',
  'knife': 'Objects/Kitchenware',
  'spoon': 'Objects/Kitchenware',
  'clock': 'Objects/Time',
  'umbrella': 'Objects/Everyday',
  'backpack': 'Objects/Bags',
  'suitcase': 'Objects/Luggage',
  'toy': 'Objects/Toys',
  'tool': 'Objects/Tools',
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
    model = await mobilenet.load();
    console.log('✅ AI model loaded!');
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

    if (!model) {
      throw new Error('Model failed to load');
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

export async function categorizeImages(files: File[]): Promise<Array<{
  file: File;
  category: string;
  subcategory: string;
  confidence: number;
}>> {
  const results = [];

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const result = await categorizeImage(file);
      results.push({
        file,
        category: result.category,
        subcategory: result.subcategory,
        confidence: result.confidence
      });
    } else {
      results.push({
        file,
        category: 'Videos',
        subcategory: 'General',
        confidence: 100
      });
    }
  }

  return results;
}
