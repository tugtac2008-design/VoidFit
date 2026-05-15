import { FoodItem } from '../types'

export const FOOD_DATABASE: FoodItem[] = [
  // ─── Proteins ──────────────────────────────────────────────────────────────
  { id: 'p001', name: 'Chicken Breast (cooked)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, cholesterol: 85 },
  { id: 'p002', name: 'Turkey Breast (cooked)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sodium: 77 },
  { id: 'p003', name: 'Lean Ground Beef (93%)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 170, protein: 26, carbs: 0, fat: 7, fiber: 0, sodium: 75, cholesterol: 80 },
  { id: 'p004', name: 'Salmon Fillet', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sodium: 59, cholesterol: 63 },
  { id: 'p005', name: 'Tuna (canned in water)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 116, protein: 26, carbs: 0, fat: 0.5, fiber: 0, sodium: 337 },
  { id: 'p006', name: 'Whole Eggs', category: 'Protein', servingSize: 50, servingUnit: 'g (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fat: 5, fiber: 0, sodium: 71, cholesterol: 187 },
  { id: 'p007', name: 'Egg Whites', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, sodium: 166 },
  { id: 'p008', name: 'Tilapia Fillet', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 128, protein: 26, carbs: 0, fat: 2.7, fiber: 0, sodium: 56 },
  { id: 'p009', name: 'Cod Fillet', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 105, protein: 23, carbs: 0, fat: 0.9, fiber: 0, sodium: 78 },
  { id: 'p010', name: 'Shrimp (cooked)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, sodium: 231 },
  { id: 'p011', name: 'Lean Beef Steak (sirloin)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 207, protein: 26, carbs: 0, fat: 11, fiber: 0, sodium: 60, cholesterol: 89 },
  { id: 'p012', name: 'Pork Tenderloin', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, sodium: 58 },
  { id: 'p013', name: 'Whey Protein Isolate', category: 'Supplements', servingSize: 30, servingUnit: 'g (1 scoop)', calories: 113, protein: 25, carbs: 1, fat: 0.5, fiber: 0, sodium: 80 },
  { id: 'p014', name: 'Casein Protein', category: 'Supplements', servingSize: 33, servingUnit: 'g (1 scoop)', calories: 120, protein: 24, carbs: 4, fat: 1, fiber: 0.5, sodium: 85 },
  { id: 'p015', name: 'Plant Protein (Pea)', category: 'Supplements', servingSize: 30, servingUnit: 'g (1 scoop)', calories: 110, protein: 21, carbs: 2, fat: 1.5, fiber: 1, sodium: 260 },
  { id: 'p016', name: 'Bison (lean ground)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 160, protein: 26, carbs: 0, fat: 6, fiber: 0, sodium: 68 },
  { id: 'p017', name: 'Duck Breast (no skin)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 140, protein: 28, carbs: 0, fat: 2.5, fiber: 0, sodium: 74 },

  // ─── Dairy ─────────────────────────────────────────────────────────────────
  { id: 'd001', name: 'Greek Yogurt (0% fat)', category: 'Dairy', servingSize: 150, servingUnit: 'g', calories: 87, protein: 15, carbs: 5.4, fat: 0.4, fiber: 0, sugar: 5.4, sodium: 45 },
  { id: 'd002', name: 'Cottage Cheese (low fat)', category: 'Dairy', servingSize: 100, servingUnit: 'g', calories: 72, protein: 12.4, carbs: 2.7, fat: 1, fiber: 0, sodium: 321 },
  { id: 'd003', name: 'Whole Milk', category: 'Dairy', servingSize: 240, servingUnit: 'ml', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12, sodium: 105 },
  { id: 'd004', name: 'Skim Milk', category: 'Dairy', servingSize: 240, servingUnit: 'ml', calories: 83, protein: 8.3, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, sodium: 103 },
  { id: 'd005', name: 'Mozzarella (part-skim)', category: 'Dairy', servingSize: 30, servingUnit: 'g (1 oz)', calories: 72, protein: 6.9, carbs: 0.8, fat: 4.5, fiber: 0, sodium: 175 },
  { id: 'd006', name: 'Cheddar Cheese', category: 'Dairy', servingSize: 30, servingUnit: 'g (1 oz)', calories: 114, protein: 7, carbs: 0.4, fat: 9.4, fiber: 0, sodium: 176 },
  { id: 'd007', name: 'Ricotta (part-skim)', category: 'Dairy', servingSize: 62, servingUnit: 'g (¼ cup)', calories: 85, protein: 7, carbs: 3.2, fat: 4.9, fiber: 0, sodium: 77 },
  { id: 'd008', name: 'Kefir (low fat)', category: 'Dairy', servingSize: 240, servingUnit: 'ml', calories: 104, protein: 11, carbs: 11.6, fat: 2, fiber: 0, sugar: 11.6, sodium: 120 },

  // ─── Grains & Carbs ────────────────────────────────────────────────────────
  { id: 'g001', name: 'White Rice (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sodium: 1 },
  { id: 'g002', name: 'Brown Rice (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 123, protein: 2.6, carbs: 25.6, fat: 1, fiber: 1.8, sodium: 1 },
  { id: 'g003', name: 'Oats (rolled, dry)', category: 'Grains & Carbs', servingSize: 80, servingUnit: 'g', calories: 307, protein: 10.7, carbs: 52.4, fat: 5.3, fiber: 8, sodium: 2 },
  { id: 'g004', name: 'Sweet Potato (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 90, protein: 2, carbs: 20.7, fat: 0.1, fiber: 3.3, sodium: 36, potassium: 475 },
  { id: 'g005', name: 'White Potato (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 77, protein: 2, carbs: 17.5, fat: 0.1, fiber: 2.2, sodium: 6, potassium: 379 },
  { id: 'g006', name: 'Pasta (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 131, protein: 5, carbs: 25.1, fat: 1.1, fiber: 1.8, sodium: 1 },
  { id: 'g007', name: 'Whole Wheat Bread', category: 'Grains & Carbs', servingSize: 30, servingUnit: 'g (1 slice)', calories: 81, protein: 4, carbs: 13.8, fat: 1.1, fiber: 1.9, sodium: 134 },
  { id: 'g008', name: 'White Bread', category: 'Grains & Carbs', servingSize: 30, servingUnit: 'g (1 slice)', calories: 79, protein: 2.7, carbs: 14.7, fat: 1, fiber: 0.6, sodium: 147 },
  { id: 'g009', name: 'Quinoa (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sodium: 7 },
  { id: 'g010', name: 'Corn Tortilla', category: 'Grains & Carbs', servingSize: 26, servingUnit: 'g (1 medium)', calories: 56, protein: 1.5, carbs: 11.6, fat: 0.7, fiber: 1.6, sodium: 11 },
  { id: 'g011', name: 'Bagel (plain)', category: 'Grains & Carbs', servingSize: 98, servingUnit: 'g (1 large)', calories: 245, protein: 9.5, carbs: 47.9, fat: 1.5, fiber: 2, sodium: 470 },
  { id: 'g012', name: 'Cream of Rice (cooked)', category: 'Grains & Carbs', servingSize: 250, servingUnit: 'g', calories: 130, protein: 2.5, carbs: 28, fat: 0.2, fiber: 0.4, sodium: 2 },
  { id: 'g013', name: 'Rice Cakes (plain)', category: 'Grains & Carbs', servingSize: 9, servingUnit: 'g (1 cake)', calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3, fiber: 0.1, sodium: 28 },
  { id: 'g014', name: 'Couscous (cooked)', category: 'Grains & Carbs', servingSize: 100, servingUnit: 'g', calories: 112, protein: 3.8, carbs: 23.2, fat: 0.2, fiber: 1.4, sodium: 5 },

  // ─── Vegetables ────────────────────────────────────────────────────────────
  { id: 'v001', name: 'Broccoli', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sodium: 33, potassium: 316 },
  { id: 'v002', name: 'Spinach (raw)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sodium: 79, potassium: 558 },
  { id: 'v003', name: 'Asparagus', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, sodium: 2 },
  { id: 'v004', name: 'Green Beans', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 3.4, sodium: 6 },
  { id: 'v005', name: 'Bell Pepper (red)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sodium: 4 },
  { id: 'v006', name: 'Cucumber', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sodium: 2 },
  { id: 'v007', name: 'Onion', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sodium: 4 },
  { id: 'v008', name: 'Kale (raw)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 49, protein: 4.3, carbs: 8.8, fat: 0.9, fiber: 3.6, sodium: 38 },
  { id: 'v009', name: 'Zucchini', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sodium: 8 },
  { id: 'v010', name: 'Mushrooms (white)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sodium: 5 },
  { id: 'v011', name: 'Tomato', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5 },
  { id: 'v012', name: 'Celery', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, sodium: 80 },
  { id: 'v013', name: 'Edamame', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, sodium: 6 },
  { id: 'v014', name: 'Cauliflower', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sodium: 30 },
  { id: 'v015', name: 'Brussels Sprouts', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 43, protein: 3.4, carbs: 8.9, fat: 0.3, fiber: 3.8, sodium: 25 },

  // ─── Fruits ────────────────────────────────────────────────────────────────
  { id: 'fr001', name: 'Banana', category: 'Fruits', servingSize: 118, servingUnit: 'g (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4, potassium: 422 },
  { id: 'fr002', name: 'Apple', category: 'Fruits', servingSize: 182, servingUnit: 'g (1 medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 18.9 },
  { id: 'fr003', name: 'Blueberries', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, sugar: 10 },
  { id: 'fr004', name: 'Strawberries', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9 },
  { id: 'fr005', name: 'Orange', category: 'Fruits', servingSize: 131, servingUnit: 'g (1 medium)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, sugar: 12.2, potassium: 237 },
  { id: 'fr006', name: 'Mango', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 13.7 },
  { id: 'fr007', name: 'Pineapple', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, sugar: 9.9 },
  { id: 'fr008', name: 'Grapes', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 67, protein: 0.6, carbs: 17.2, fat: 0.4, fiber: 0.9, sugar: 16.3 },
  { id: 'fr009', name: 'Watermelon', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, sodium: 1 },
  { id: 'fr010', name: 'Kiwi', category: 'Fruits', servingSize: 76, servingUnit: 'g (1 medium)', calories: 46, protein: 0.9, carbs: 11.1, fat: 0.4, fiber: 2.3, potassium: 237 },

  // ─── Fats & Oils ───────────────────────────────────────────────────────────
  { id: 'f001', name: 'Olive Oil', category: 'Fats & Oils', servingSize: 14, servingUnit: 'g (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sodium: 0 },
  { id: 'f002', name: 'Coconut Oil', category: 'Fats & Oils', servingSize: 14, servingUnit: 'g (1 tbsp)', calories: 117, protein: 0, carbs: 0, fat: 13.6, fiber: 0, saturatedFat: 11.8, sodium: 0 },
  { id: 'f003', name: 'Peanut Butter (natural)', category: 'Fats & Oils', servingSize: 32, servingUnit: 'g (2 tbsp)', calories: 191, protein: 7.7, carbs: 6.9, fat: 16, fiber: 1.9, sodium: 147 },
  { id: 'f004', name: 'Almond Butter', category: 'Fats & Oils', servingSize: 32, servingUnit: 'g (2 tbsp)', calories: 196, protein: 6.7, carbs: 6.1, fat: 18, fiber: 3.3, sodium: 73 },
  { id: 'f005', name: 'Avocado', category: 'Fats & Oils', servingSize: 68, servingUnit: 'g (½ medium)', calories: 109, protein: 1.3, carbs: 6, fat: 10, fiber: 4.5, potassium: 345 },
  { id: 'f006', name: 'Almonds', category: 'Fats & Oils', servingSize: 28, servingUnit: 'g (1 oz)', calories: 164, protein: 6, carbs: 6.1, fat: 14.2, fiber: 3.5, sodium: 0 },
  { id: 'f007', name: 'Walnuts', category: 'Fats & Oils', servingSize: 28, servingUnit: 'g (1 oz)', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sodium: 1 },
  { id: 'f008', name: 'Cashews', category: 'Fats & Oils', servingSize: 28, servingUnit: 'g (1 oz)', calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, fiber: 0.9, sodium: 3 },
  { id: 'f009', name: 'Flaxseed (ground)', category: 'Fats & Oils', servingSize: 10, servingUnit: 'g (1 tbsp)', calories: 55, protein: 1.9, carbs: 3, fat: 4.3, fiber: 2.8, sodium: 3 },
  { id: 'f010', name: 'Chia Seeds', category: 'Fats & Oils', servingSize: 12, servingUnit: 'g (1 tbsp)', calories: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.1, sodium: 2 },
  { id: 'f011', name: 'Sunflower Seeds', category: 'Fats & Oils', servingSize: 28, servingUnit: 'g (1 oz)', calories: 165, protein: 5.5, carbs: 6.5, fat: 14.4, fiber: 3, sodium: 1 },
  { id: 'f012', name: 'Butter (unsalted)', category: 'Fats & Oils', servingSize: 14, servingUnit: 'g (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0, saturatedFat: 7.3, sodium: 2 },

  // ─── Supplements ───────────────────────────────────────────────────────────
  { id: 's001', name: 'Creatine Monohydrate', category: 'Supplements', servingSize: 5, servingUnit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  { id: 's002', name: 'Pre-Workout (C4 Original)', category: 'Supplements', servingSize: 6, servingUnit: 'g (1 scoop)', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, sodium: 150 },
  { id: 's003', name: 'BCAA Powder', category: 'Supplements', servingSize: 7, servingUnit: 'g', calories: 10, protein: 0, carbs: 1, fat: 0, fiber: 0, sodium: 35 },
  { id: 's004', name: 'Mass Gainer (generic)', category: 'Supplements', servingSize: 100, servingUnit: 'g (1 scoop)', calories: 390, protein: 25, carbs: 65, fat: 4.5, fiber: 3, sodium: 310 },
  { id: 's005', name: 'Dextrose (glucose powder)', category: 'Supplements', servingSize: 100, servingUnit: 'g', calories: 390, protein: 0, carbs: 100, fat: 0, fiber: 0, sodium: 0 },
  { id: 's006', name: 'Collagen Peptides', category: 'Supplements', servingSize: 11, servingUnit: 'g (1 scoop)', calories: 40, protein: 10, carbs: 0, fat: 0, fiber: 0, sodium: 20 },

  // ─── Beverages ─────────────────────────────────────────────────────────────
  { id: 'b001', name: 'Water', category: 'Beverages', servingSize: 240, servingUnit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  { id: 'b002', name: 'Black Coffee', category: 'Beverages', servingSize: 240, servingUnit: 'ml', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sodium: 5 },
  { id: 'b003', name: 'Green Tea', category: 'Beverages', servingSize: 240, servingUnit: 'ml', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  { id: 'b004', name: 'Orange Juice (fresh)', category: 'Beverages', servingSize: 240, servingUnit: 'ml', calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 20.8, potassium: 496 },
  { id: 'b005', name: 'Protein Shake (whole milk base)', category: 'Beverages', servingSize: 350, servingUnit: 'ml', calories: 300, protein: 32, carbs: 18, fat: 9, fiber: 0.5, sodium: 180 },
  { id: 'b006', name: 'Energy Drink (Monster original)', category: 'Beverages', servingSize: 473, servingUnit: 'ml (1 can)', calories: 210, protein: 0, carbs: 54, fat: 0, fiber: 0, sugar: 54, sodium: 370 },
  { id: 'b007', name: 'Sports Drink (Gatorade)', category: 'Beverages', servingSize: 591, servingUnit: 'ml (1 bottle)', calories: 140, protein: 0, carbs: 36, fat: 0, fiber: 0, sugar: 34, sodium: 270, potassium: 75 },

  // ─── Snacks ────────────────────────────────────────────────────────────────
  { id: 'sn001', name: 'Rice Krispies Treats', category: 'Snacks', servingSize: 22, servingUnit: 'g (1 bar)', calories: 91, protein: 0.7, carbs: 18.7, fat: 2, fiber: 0, sugar: 8.2, sodium: 75 },
  { id: 'sn002', name: 'Dark Chocolate (85%)', category: 'Snacks', servingSize: 30, servingUnit: 'g', calories: 175, protein: 2.5, carbs: 12, fat: 14, fiber: 3.1, sugar: 4.3, sodium: 8 },
  { id: 'sn003', name: 'Protein Bar (Quest)', category: 'Snacks', servingSize: 60, servingUnit: 'g (1 bar)', calories: 200, protein: 21, carbs: 22, fat: 9, fiber: 14, sugar: 1, sodium: 250 },
  { id: 'sn004', name: 'Beef Jerky (plain)', category: 'Snacks', servingSize: 28, servingUnit: 'g (1 oz)', calories: 82, protein: 13, carbs: 3.1, fat: 2.1, fiber: 0, sodium: 465 },
  { id: 'sn005', name: 'Mixed Nuts (unsalted)', category: 'Snacks', servingSize: 28, servingUnit: 'g (1 oz)', calories: 173, protein: 5, carbs: 6, fat: 16, fiber: 2.6, sodium: 4 },
  { id: 'sn006', name: 'Pretzels', category: 'Snacks', servingSize: 30, servingUnit: 'g', calories: 114, protein: 2.8, carbs: 23.8, fat: 1.1, fiber: 1, sodium: 352 },
  { id: 'sn007', name: 'Greek Yogurt Parfait (Chobani)', category: 'Snacks', servingSize: 150, servingUnit: 'g', calories: 130, protein: 11, carbs: 17, fat: 2.5, fiber: 0.5, sugar: 14, sodium: 60 },

  // ─── Condiments ────────────────────────────────────────────────────────────
  { id: 'c001', name: 'Hot Sauce (Tabasco)', category: 'Condiments', servingSize: 5, servingUnit: 'ml (1 tsp)', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 35 },
  { id: 'c002', name: 'Mustard (yellow)', category: 'Condiments', servingSize: 5, servingUnit: 'g (1 tsp)', calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, fiber: 0.1, sodium: 57 },
  { id: 'c003', name: 'Ketchup', category: 'Condiments', servingSize: 17, servingUnit: 'g (1 tbsp)', calories: 17, protein: 0.2, carbs: 4.5, fat: 0, fiber: 0, sugar: 3.7, sodium: 167 },
  { id: 'c004', name: 'Soy Sauce (light)', category: 'Condiments', servingSize: 15, servingUnit: 'ml (1 tbsp)', calories: 9, protein: 1.3, carbs: 0.8, fat: 0, fiber: 0, sodium: 902 },
  { id: 'c005', name: 'Sriracha', category: 'Condiments', servingSize: 5, servingUnit: 'g (1 tsp)', calories: 5, protein: 0, carbs: 1, fat: 0, fiber: 0, sugar: 0.5, sodium: 80 },
  { id: 'c006', name: 'BBQ Sauce', category: 'Condiments', servingSize: 34, servingUnit: 'g (2 tbsp)', calories: 70, protein: 0, carbs: 17, fat: 0, fiber: 0.4, sugar: 13, sodium: 380 },
  { id: 'c007', name: 'Ranch Dressing', category: 'Condiments', servingSize: 30, servingUnit: 'g (2 tbsp)', calories: 129, protein: 0.4, carbs: 1.4, fat: 13.7, fiber: 0, sodium: 264 },
  { id: 'c008', name: 'Hummus', category: 'Condiments', servingSize: 30, servingUnit: 'g (2 tbsp)', calories: 70, protein: 2, carbs: 4, fat: 5.5, fiber: 1.5, sodium: 105 },

  // ─── Fast Food ─────────────────────────────────────────────────────────────
  { id: 'ff001', name: "McDonald's Big Mac", category: 'Fast Food', servingSize: 205, servingUnit: 'g', calories: 550, protein: 25, carbs: 45, fat: 30, fiber: 3, sodium: 1010 },
  { id: 'ff002', name: "Chipotle Chicken Bowl (no rice/beans)", category: 'Fast Food', servingSize: 300, servingUnit: 'g', calories: 290, protein: 40, carbs: 12, fat: 10, fiber: 3, sodium: 810 },
  { id: 'ff003', name: "Subway 6\" Turkey (no dressing)", category: 'Fast Food', servingSize: 225, servingUnit: 'g', calories: 280, protein: 18, carbs: 45, fat: 4.5, fiber: 4, sodium: 640 },
  { id: 'ff004', name: "Starbucks Oatmeal", category: 'Fast Food', servingSize: 250, servingUnit: 'g', calories: 220, protein: 6, carbs: 43, fat: 2.5, fiber: 4, sugar: 13, sodium: 125 },
  { id: 'ff005', name: "Pizza (cheese, 1 slice)", category: 'Fast Food', servingSize: 107, servingUnit: 'g', calories: 272, protein: 12, carbs: 34, fat: 10, fiber: 2.3, sodium: 640 },
]

export const getFoodById = (id: string): FoodItem | undefined =>
  FOOD_DATABASE.find(f => f.id === id)

export const searchFoods = (query: string): FoodItem[] => {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.brand?.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q)
  ).slice(0, 30)
}

export const getFoodsByCategory = (category: string): FoodItem[] =>
  FOOD_DATABASE.filter(f => f.category === category)
