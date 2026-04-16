// services/api.js — All API integrations and mock data

// ─── Mock Food Items ─────────────────────────────────────────────────────────
export const FOOD_ITEMS = [
  {
    id: 'f1', name: 'Grilled Salmon Bowl', price: 18.99, category: 'Protein',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    nutrition: { calories: 520, protein: 42, carbs: 35, fat: 22, fiber: 6 },
    tags: ['gluten-free', 'high-protein'], rating: 4.8, reviews: 124,
    description: 'Wild-caught Atlantic salmon over brown rice with roasted vegetables.',
    inStock: true,
  },
  {
    id: 'f2', name: 'Quinoa Power Salad', price: 14.99, category: 'Vegan',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    nutrition: { calories: 380, protein: 18, carbs: 52, fat: 12, fiber: 10 },
    tags: ['vegan', 'gluten-free'], rating: 4.6, reviews: 89,
    description: 'Tri-color quinoa with roasted chickpeas, avocado, and lemon tahini.',
    inStock: true,
  },
  {
    id: 'f3', name: 'Turkey Meatball Pasta', price: 16.49, category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    nutrition: { calories: 650, protein: 38, carbs: 72, fat: 18, fiber: 5 },
    tags: ['high-protein'], rating: 4.7, reviews: 201,
    description: 'Lean turkey meatballs in marinara sauce over whole wheat spaghetti.',
    inStock: true,
  },
  {
    id: 'f4', name: 'Acai Smoothie Bowl', price: 12.99, category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    nutrition: { calories: 320, protein: 8, carbs: 58, fat: 9, fiber: 12 },
    tags: ['vegan', 'gluten-free'], rating: 4.9, reviews: 156,
    description: 'Blended acai with banana, topped with granola, berries, and honey.',
    inStock: true,
  },
  {
    id: 'f5', name: 'Chicken Tikka Masala', price: 17.49, category: 'Indian',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    nutrition: { calories: 580, protein: 45, carbs: 42, fat: 24, fiber: 4 },
    tags: ['gluten-free', 'high-protein'], rating: 4.8, reviews: 178,
    description: 'Tender chicken in aromatic tomato-cream sauce, served with basmati rice.',
    inStock: true,
  },
  {
    id: 'f6', name: 'Avocado Toast Platter', price: 11.99, category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1603046891742-9e3e5a15f21e?w=400',
    nutrition: { calories: 290, protein: 10, carbs: 34, fat: 16, fiber: 8 },
    tags: ['vegetarian'], rating: 4.5, reviews: 93,
    description: 'Sourdough toast with smashed avocado, poached egg, and microgreens.',
    inStock: true,
  },
  {
    id: 'f7', name: 'Mediterranean Wrap', price: 13.99, category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    nutrition: { calories: 440, protein: 28, carbs: 48, fat: 14, fiber: 7 },
    tags: ['vegetarian'], rating: 4.6, reviews: 67,
    description: 'Falafel, hummus, tabbouleh, and feta wrapped in a whole wheat tortilla.',
    inStock: false,
  },
  {
    id: 'f8', name: 'Bone Broth Ramen', price: 15.99, category: 'Asian',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    nutrition: { calories: 490, protein: 32, carbs: 55, fat: 15, fiber: 3 },
    tags: ['high-protein'], rating: 4.7, reviews: 142,
    description: '12-hour simmered bone broth with noodles, soft egg, and chashu pork.',
    inStock: true,
  },
];

export const CATEGORIES = ['All', 'Protein', 'Vegan', 'Pasta', 'Breakfast', 'Lunch', 'Asian', 'Indian'];

// ─── Meal Plan Algorithm ──────────────────────────────────────────────────────
export function generateMealPlan(userGoals, dietary, days = 7) {
  const filtered = FOOD_ITEMS.filter(item => {
    if (dietary.vegan && !item.tags.includes('vegan')) return false;
    if (dietary.vegetarian && !item.tags.includes('vegetarian') && !item.tags.includes('vegan')) return false;
    if (dietary.glutenFree && !item.tags.includes('gluten-free')) return false;
    if (!item.inStock) return false;
    return true;
  });

  const plan = [];
  for (let day = 1; day <= days; day++) {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const meals = {
      day,
      breakfast: shuffled[0] || null,
      lunch: shuffled[1] || null,
      dinner: shuffled[2] || null,
    };
    const totalCalories = [meals.breakfast, meals.lunch, meals.dinner]
      .filter(Boolean)
      .reduce((sum, m) => sum + m.nutrition.calories, 0);
    meals.totalCalories = totalCalories;
    meals.targetCalories = userGoals.calories;
    plan.push(meals);
  }
  return plan;
}

// ─── PubMed API Integration ───────────────────────────────────────────────────
export async function searchPubMed(query) {
  try {
    // PubMed E-utilities API (free, no key required for basic use)
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist || [];
    
    if (ids.length === 0) return [];

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    return ids.map(id => {
      const article = summaryData.result?.[id];
      return {
        id,
        title: article?.title || 'Unknown Title',
        authors: article?.authors?.map(a => a.name).join(', ') || 'Unknown',
        journal: article?.fulljournalname || '',
        year: article?.pubdate?.split(' ')[0] || '',
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    });
  } catch (err) {
    console.error('PubMed error:', err);
    return [];
  }
}

// ─── Nutrition Calculator ─────────────────────────────────────────────────────
export function calculateDailyNutrition(cartItems) {
  return cartItems.reduce(
    (totals, item) => ({
      calories: totals.calories + item.nutrition.calories * item.quantity,
      protein: totals.protein + item.nutrition.protein * item.quantity,
      carbs: totals.carbs + item.nutrition.carbs * item.quantity,
      fat: totals.fat + item.nutrition.fat * item.quantity,
      fiber: totals.fiber + item.nutrition.fiber * item.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

// ─── Order Tracking Simulation ────────────────────────────────────────────────
export const ORDER_STATUSES = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export function simulateOrderProgress(orderId, dispatch) {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    if (step < ORDER_STATUSES.length) {
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { id: orderId, status: ORDER_STATUSES[step] },
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          message: `Order #${orderId.slice(-4)}: ${ORDER_STATUSES[step]}`,
          type: 'order',
          time: new Date().toISOString(),
        },
      });
    } else {
      clearInterval(interval);
    }
  }, 8000); // advance every 8 seconds for demo
}

// ─── Claude Chatbot Integration ───────────────────────────────────────────────
export async function chatWithClaude(messages, userContext) {
  const systemPrompt = `You are NutriMeal's AI assistant. You help users with:
- Nutrition questions and dietary advice
- Information about ingredients and food science (cite PubMed when relevant)
- Meal planning recommendations based on their goals
- Order and delivery assistance

User context:
- Daily calorie goal: ${userContext?.goals?.calories || 2000} kcal
- Dietary restrictions: ${JSON.stringify(userContext?.dietary || {})}
- Goals: High protein, balanced macros

Be concise, friendly, and science-backed. Keep responses under 150 words unless a detailed explanation is needed.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text || 'Sorry, I could not get a response.';
}
