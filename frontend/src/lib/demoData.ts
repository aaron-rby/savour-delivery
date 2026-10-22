import { User, Restaurant, MenuItem, Order, DeliveryPartner } from './types';

export const INITIAL_USERS: User[] = [
  { userId: 1, fullName: 'Alex Chen', email: 'alex.chen@example.com', phone: '+91 98765 43210', role: 'CUSTOMER', address: 'Flat 402, Shanti Niketan, New Delhi' },
  { userId: 2, fullName: 'Sarah Miller', email: 'sarah.m@example.com', phone: '+91 98111 22334', role: 'CUSTOMER', address: '124 Lake View, Bengaluru' },
  { userId: 3, fullName: 'David Patel', email: 'david.p@example.com', phone: '+91 98222 33445', role: 'CUSTOMER', address: '221B Baker Enclave, Mumbai' },
  { userId: 4, fullName: 'Emma Wilson', email: 'emma.w@example.com', phone: '+91 98333 44556', role: 'CUSTOMER', address: '4 Palm Meadows, Hyderabad' },
  { userId: 5, fullName: 'Carlos Rodriguez', email: 'carlos.r@example.com', phone: '+91 98444 55667', role: 'CUSTOMER', address: '304 Ocean Avenue, Chennai' },
  { userId: 6, fullName: 'Priya Sharma', email: 'priya.s@example.com', phone: '+91 98555 66778', role: 'CUSTOMER', address: '18 MG Road, Kolkata' },
  { userId: 7, fullName: 'Marco Rossi', email: 'marco.rossi@example.com', phone: '+91 98666 77889', role: 'RESTAURANT_OPERATOR', address: '45 Via Roma, Little Italy' },
  { userId: 8, fullName: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 98777 88990', role: 'RESTAURANT_OPERATOR', address: '88 Masala Way, Downtown' },
  { userId: 9, fullName: 'Kenji Sato', email: 'kenji.s@example.com', phone: '+91 98888 99001', role: 'RESTAURANT_OPERATOR', address: '12 Sakura Way, Midtown' },
  { userId: 10, fullName: 'Elena Morales', email: 'elena.m@example.com', phone: '+91 98999 00112', role: 'RESTAURANT_OPERATOR', address: '77 Sol Plaza, Uptown' },
  { userId: 11, fullName: 'Antoine Dupont', email: 'antoine.d@example.com', phone: '+91 97111 12345', role: 'RESTAURANT_OPERATOR', address: '33 Rue de Paris, West End' },
  { userId: 12, fullName: 'Jake Morrison', email: 'jake.m@example.com', phone: '+91 97222 23456', role: 'DELIVERY_PARTNER', address: '10 Industrial Pkwy' },
  { userId: 13, fullName: 'Marcus Vance', email: 'marcus.v@example.com', phone: '+91 97333 34567', role: 'DELIVERY_PARTNER', address: '22 Hub Center' },
  { userId: 14, fullName: 'Liam O\'Connor', email: 'liam.oc@example.com', phone: '+91 97444 45678', role: 'DELIVERY_PARTNER', address: '55 Station Road' },
  { userId: 15, fullName: 'System Administrator', email: 'admin@savour.internal', phone: '+91 97555 56789', role: 'ADMIN', address: 'HQ Server Room 1' }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    restaurantId: 1,
    ownerId: 7,
    name: 'Bukhara - ITC Maurya',
    cuisineType: 'North Indian Frontier',
    address: 'Diplomatic Enclave, Sardar Patel Marg, New Delhi',
    phone: '+91 11 2611 2233',
    rating: 4.9,
    isOpen: true,
    deliveryTimeEstimate: '35-45 min',
    priceTier: '$$$$'
  },
  {
    restaurantId: 2,
    ownerId: 8,
    name: 'Karavalli - The Gateway',
    cuisineType: 'Coastal South Indian',
    address: '66 Residency Road, Bengaluru',
    phone: '+91 80 6660 4545',
    rating: 4.8,
    isOpen: true,
    deliveryTimeEstimate: '30-40 min',
    priceTier: '$$$'
  },
  {
    restaurantId: 3,
    ownerId: 9,
    name: 'Trishna Seafood Haven',
    cuisineType: 'Coastal Seafood',
    address: '7 Sai Baba Marg, Kala Ghoda, Fort, Mumbai',
    phone: '+91 22 2270 3213',
    rating: 4.9,
    isOpen: true,
    deliveryTimeEstimate: '25-35 min',
    priceTier: '$$$$'
  },
  {
    restaurantId: 4,
    ownerId: 10,
    name: 'Paradise Heritage Biryani',
    cuisineType: 'Hyderabadi Nizami',
    address: 'SD Road, Sappu Bagh, Paradise Circle, Hyderabad',
    phone: '+91 40 6666 5588',
    rating: 4.7,
    isOpen: true,
    deliveryTimeEstimate: '20-30 min',
    priceTier: '$$'
  },
  {
    restaurantId: 5,
    ownerId: 11,
    name: 'Dakshin - Crowne Plaza',
    cuisineType: 'South Indian Classical',
    address: '132 TTK Road, Alwarpet, Chennai',
    phone: '+91 44 2499 4101',
    rating: 4.8,
    isOpen: true,
    deliveryTimeEstimate: '25-35 min',
    priceTier: '$$$'
  },
  {
    restaurantId: 6,
    ownerId: 14,
    name: '6 Ballygunge Place',
    cuisineType: 'Traditional Bengali',
    address: '6 Ballygunge Place, Ballygunge, Kolkata',
    phone: '+91 33 2460 3922',
    rating: 4.6,
    isOpen: true,
    deliveryTimeEstimate: '30-40 min',
    priceTier: '$$'
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Bukhara - ITC Maurya (Restaurant 1)
  { itemId: 101, restaurantId: 1, name: 'Dal Bukhara (Slow Cooked 18h)', description: 'Black lentils, tomatoes and cream simmered overnight for 18 hours in clay tandoors', price: 650.00, category: 'Mains', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 102, restaurantId: 1, name: 'Murgh Malai Kebab', description: 'Tender chicken morsels marinated in cream cheese, malt vinegar and fresh green chilies', price: 795.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 103, restaurantId: 1, name: 'Sikandari Raan', description: 'Whole leg of spring lamb braised in rum, ginger, garlic and fragrant whole spices', price: 1450.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 104, restaurantId: 1, name: 'Bukhara Naan (Giant Tandoor)', description: 'Iconic dinner-plate sized hearth baked refined flour bread brushed with desi butter', price: 280.00, category: 'Breads', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 105, restaurantId: 1, name: 'Tandoori Jhinga (Jumbo Prawns)', description: 'Jumbo bay prawns marinated in ajwain seed, yellow chili and mustard oil', price: 1250.00, category: 'Starters', isVegetarian: false, isAvailable: false, spicyLevel: 2 },
  { itemId: 106, restaurantId: 1, name: 'Kulfi Falooda with Rose Petals', description: 'Traditional condensed milk kulfi topped with vermicelli and organic Damascus rose syrup', price: 350.00, category: 'Desserts', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 107, restaurantId: 1, name: 'Smoked Chaas with Cumin', description: 'Fresh churned spiced buttermilk tempered with charcoal smoked cumin and mint', price: 180.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },

  // Karavalli - The Gateway (Restaurant 2)
  { itemId: 201, restaurantId: 2, name: 'Mangalorean Anjal Fish Fry', description: 'Fresh Kingfish steaks pan-seared with fiery Byadagi chili and toddy vinegar paste', price: 620.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 202, restaurantId: 2, name: 'Kori Gassi with Neer Dosa', description: 'Bunt style succulent chicken simmered in rich coconut milk and roasted spices, paired with soft neer dosas', price: 580.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 203, restaurantId: 2, name: 'Alleppey Fish Curry', description: 'Catch of the day poached in raw mango, turmeric, green chilies and fresh coconut gravy', price: 690.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 204, restaurantId: 2, name: 'Malabar Parotta (Pack of 3)', description: 'Multi-layered flaky Kerala griddle bread made with refined flour and clarified butter', price: 160.00, category: 'Breads', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 205, restaurantId: 2, name: 'Tender Coconut Payasam', description: 'Elaneer pulp gently folded into sweetened jaggery, cardamom and coconut milk', price: 290.00, category: 'Desserts', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 206, restaurantId: 2, name: 'Fresh Kokum Sharbath', description: 'Tangy digestive wild mangosteen cooler infused with cumin and rock salt', price: 150.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 207, restaurantId: 2, name: 'Tiger Prawn Ghee Roast', description: 'Kundapur style succulent tiger prawns roasted in aged ghee and whole coriander masala', price: 890.00, category: 'Starters', isVegetarian: false, isAvailable: false, spicyLevel: 3 },

  // Trishna Seafood Haven (Restaurant 3)
  { itemId: 301, restaurantId: 3, name: 'Signature Butter Garlic Crab', description: 'Live mud crab simmered in emulsified white butter, freshly minced garlic and white pepper', price: 1350.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 302, restaurantId: 3, name: 'Squid Koliwada Fry', description: 'Tender calamari rings spiced with red chili batter and carom seeds, deep fried crisp', price: 520.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 303, restaurantId: 3, name: 'Kolambi (Prawn) Biryani', description: 'Coastal basmati rice preparation layered with spiced tiger prawns and caramelized shallots', price: 640.00, category: 'Biryani', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 304, restaurantId: 3, name: 'Sol Kadhi (Digestive Berry Coconut)', description: 'Traditional Konkani digestive concoction of kokum extract, freshly grated coconut milk and garlic', price: 120.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 305, restaurantId: 3, name: 'Steamed Appam (Set of 2)', description: 'Lacy fermented rice bowl pancakes with soft spongy steamed centers', price: 140.00, category: 'Breads', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 306, restaurantId: 3, name: 'Bombay Duck Crispy Fry', description: 'Semolina crusted Bombil fish fillets pan fried crisp with turmeric and lemon', price: 440.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 307, restaurantId: 3, name: 'Lobster in Chettinad Masala', description: 'Fresh sea lobster cooked in 18-spice stone ground Chettinad peppercorn gravy', price: 1850.00, category: 'Mains', isVegetarian: false, isAvailable: false, spicyLevel: 3 },

  // Paradise Heritage Biryani (Restaurant 4)
  { itemId: 401, restaurantId: 4, name: 'Royal Mutton Dum Biryani', description: 'Slow-cooked Kachchi goat meat layered with aged Daawat basmati, saffron milk and potli masala', price: 480.00, category: 'Biryani', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 402, restaurantId: 4, name: 'Special Chicken Biryani Pot', description: 'Charcoal dum-cooked fragrant basmati rice with succulent farm chicken, mint and brown onions', price: 390.00, category: 'Biryani', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 403, restaurantId: 4, name: 'Mirchi Ka Salan & Dahi Chutney', description: 'Authentic Hyderabadi Bhavnagri chili curry in roasted peanut, sesame and tamarind gravy', price: 120.00, category: 'Sides', isVegetarian: true, isAvailable: true, spicyLevel: 2 },
  { itemId: 404, restaurantId: 4, name: 'Pathar Ka Gosht (Stone Grilled Lamb)', description: 'Thinly sliced lamb fillets marinated and cooked on a heated slab of river granite stone', price: 560.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 405, restaurantId: 4, name: 'Shahi Double Ka Meetha', description: 'Crisp golden bread slices soaked in saffron rabdi, condensed milk and slivered almonds', price: 220.00, category: 'Desserts', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 406, restaurantId: 4, name: 'Irani Chai Flask (Serves 3)', description: 'Decoction brewed whole leaf tea simmered with sweet mawa condensed milk', price: 160.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 407, restaurantId: 4, name: 'Haleem with Fried Onions & Cashews', description: 'Slow-simmered pounded wheat, tender lamb and lentils garnished with golden onions and pure ghee', price: 420.00, category: 'Mains', isVegetarian: false, isAvailable: false, spicyLevel: 1 },

  // Dakshin - Crowne Plaza (Restaurant 5 - Iconic South Indian Classics)
  { itemId: 501, restaurantId: 5, name: 'Crispy Ghee Masala Dosa with Sambar & Chutneys', description: 'Golden fermented rice and lentil crepe roasted in pure cow ghee, stuffed with spiced potato masala, served with piping hot drumstick sambar and three coconut chutneys', price: 220.00, category: 'Tiffin', isVegetarian: true, isAvailable: true, spicyLevel: 1 },
  { itemId: 502, restaurantId: 5, name: 'Steamed Thatte Idli with Coconut Chutney (Set of 2)', description: 'Plate-sized fluffy steamed rice cakes made from stone-ground batter, served with spicy gun powder (podi) and fresh coconut chutney', price: 140.00, category: 'Tiffin', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 503, restaurantId: 5, name: 'Traditional Ven Pongal with Ghee & Cashews', description: 'Comforting mash of raw rice and yellow moong dal cooked with crushed black pepper, cumin seeds, ginger, curry leaves, roasted cashews and generous dollops of pure ghee', price: 190.00, category: 'Tiffin', isVegetarian: true, isAvailable: true, spicyLevel: 1 },
  { itemId: 504, restaurantId: 5, name: 'Crispy Medu Vada with Sambar (2 pcs)', description: 'Crisp golden urad dal donuts with fluffy interior, spiced with whole peppercorns and curry leaves, served immersed in sambar', price: 130.00, category: 'Tiffin', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 505, restaurantId: 5, name: 'Meen Polichathu in Banana Leaf', description: 'Pearl spot fish smeared with shallot and tomato masala, wrapped in plantain leaf and slow-griddled', price: 680.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 506, restaurantId: 5, name: 'Chettinad Chicken Varuval', description: 'Dry pan-roasted countryside chicken pieces tossed with curry leaves, kalpasi and black peppercorns', price: 490.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 3 },
  { itemId: 507, restaurantId: 5, name: 'Bisibele Bath with Ghee & Boondi', description: 'Karnataka specialty rice and toor dal preparation cooked with assorted country vegetables, tamarind, and aromatic spice blend topped with crisp boondi', price: 360.00, category: 'Mains', isVegetarian: true, isAvailable: true, spicyLevel: 1 },
  { itemId: 508, restaurantId: 5, name: 'Elaneer Souffle', description: 'Subtle and airy set dessert prepared with tender coconut water, jelly pulp and sweet cream', price: 280.00, category: 'Desserts', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 509, restaurantId: 5, name: 'Mylapore Degree Filter Coffee', description: 'Authentic South Indian frothy chicory-blended filter coffee brewed in brass dabarah and tumbler', price: 140.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 510, restaurantId: 5, name: 'Nandu Crab Pepper Fry', description: 'Fresh sea mud crab tossed dry with crushed Tellicherry black peppercorns, shallots and curry leaves', price: 750.00, category: 'Starters', isVegetarian: false, isAvailable: false, spicyLevel: 3 },

  // 6 Ballygunge Place (Restaurant 6)
  { itemId: 601, restaurantId: 6, name: 'Daab Chingri (Prawns in Tender Coconut)', description: 'Succulent river prawns cooked with mustard paste and green chilies inside a green tender coconut', price: 780.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 602, restaurantId: 6, name: 'Kolkata Bhetki Fish Fry (2 pcs)', description: 'Calcutta Bhetki fish fillets marinated in coriander mustard green paste, breadcrumb crusted and served with Kasundi', price: 460.00, category: 'Starters', isVegetarian: false, isAvailable: true, spicyLevel: 1 },
  { itemId: 603, restaurantId: 6, name: 'Kosha Mangsho (Spicy Slow Cooked Mutton)', description: 'Rich dark slow-braised mutton curry infused with mustard oil, caramelized onions and whole garam masala', price: 690.00, category: 'Mains', isVegetarian: false, isAvailable: true, spicyLevel: 2 },
  { itemId: 604, restaurantId: 6, name: 'Luchi with Chholar Dal (4 pcs)', description: 'Fluffy deep-fried golden maida flatbreads served with sweet Bengal gram dal tempered with coconut slices and hing', price: 240.00, category: 'Breads', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 605, restaurantId: 6, name: 'Baked Rosogolla (2 pcs)', description: 'Kolkata cottage cheese dumplings baked in a rich creamy condensed kheer sauce until caramelised', price: 190.00, category: 'Desserts', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 606, restaurantId: 6, name: 'Gondhoraj Lebur Ghol', description: 'Refreshing sweet-and-sour spiced curd cooler flavoured with aromatic Gondhoraj king lime', price: 130.00, category: 'Beverages', isVegetarian: true, isAvailable: true, spicyLevel: 0 },
  { itemId: 607, restaurantId: 6, name: 'Ilish Bhapa (Steamed Hilsa in Mustard)', description: 'Prime cut Padma Hilsa steamed in freshly ground yellow and black mustard paste with slit green chilies', price: 950.00, category: 'Mains', isVegetarian: false, isAvailable: false, spicyLevel: 2 }
];

export const INITIAL_ORDERS: Order[] = [
  {
    orderId: 1001,
    customerId: 1,
    customerName: 'Alex Chen',
    restaurantId: 1,
    restaurantName: 'Bukhara - ITC Maurya',
    deliveryAddress: 'Flat 402, Shanti Niketan, New Delhi',
    orderStatus: 'DELIVERED',
    subtotal: 1445.00,
    itemsSubtotal: 1445.00,
    deliveryFee: 0.00,
    taxAmount: 72.25,
    tipAmount: 50.00,
    totalAmount: 1567.25,
    createdAt: '2026-10-10 12:30:00',
    items: [
      { orderItemId: 1, orderId: 1001, itemId: 101, itemName: 'Dal Bukhara (Slow Cooked 18h)', quantity: 1, agreedUnitPrice: 650.00, subtotal: 650.00 },
      { orderItemId: 2, orderId: 1001, itemId: 102, itemName: 'Murgh Malai Kebab', quantity: 1, agreedUnitPrice: 795.00, subtotal: 795.00 }
    ],
    payment: {
      paymentId: 1,
      orderId: 1001,
      paymentMethod: 'CARD',
      paymentStatus: 'SUCCESS',
      amount: 1567.25,
      transactionRef: 'TXN-9021-001'
    },
    delivery: {
      deliveryId: 1,
      orderId: 1001,
      partnerId: 1,
      partnerName: 'Jake Morrison',
      partnerPhone: '+91 97222 23456',
      deliveryStatus: 'DELIVERED',
      pickupTime: '2026-10-10 12:50:00',
      deliveredTime: '2026-10-10 13:15:00'
    },
    review: {
      reviewId: 1,
      orderId: 1001,
      customerId: 1,
      restaurantId: 1,
      rating: 5,
      comment: 'Iconic Dal Bukhara rich beyond words. Arrived piping hot.'
    }
  },
  {
    orderId: 1002,
    customerId: 2,
    customerName: 'Sarah Miller',
    restaurantId: 2,
    restaurantName: 'Karavalli - The Gateway',
    deliveryAddress: '124 Lake View, Bengaluru',
    orderStatus: 'DELIVERED',
    subtotal: 1200.00,
    itemsSubtotal: 1200.00,
    deliveryFee: 0.00,
    taxAmount: 60.00,
    tipAmount: 40.00,
    totalAmount: 1300.00,
    createdAt: '2026-10-10 13:15:00',
    items: [
      { orderItemId: 3, orderId: 1002, itemId: 201, itemName: 'Mangalorean Anjal Fish Fry', quantity: 1, agreedUnitPrice: 620.00, subtotal: 620.00 },
      { orderItemId: 4, orderId: 1002, itemId: 202, itemName: 'Kori Gassi with Neer Dosa', quantity: 1, agreedUnitPrice: 580.00, subtotal: 580.00 }
    ],
    payment: {
      paymentId: 2,
      orderId: 1002,
      paymentMethod: 'UPI',
      paymentStatus: 'SUCCESS',
      amount: 1300.00,
      transactionRef: 'TXN-9021-002'
    },
    delivery: {
      deliveryId: 2,
      orderId: 1002,
      partnerId: 2,
      partnerName: 'Marcus Vance',
      partnerPhone: '+91 97333 34567',
      deliveryStatus: 'DELIVERED',
      pickupTime: '2026-10-10 13:40:00',
      deliveredTime: '2026-10-10 14:08:00'
    },
    review: {
      reviewId: 2,
      orderId: 1002,
      customerId: 2,
      restaurantId: 2,
      rating: 5,
      comment: 'Authentic coastal flavors and melt-in-mouth neer dosas.'
    }
  },
  {
    orderId: 1003,
    customerId: 1,
    customerName: 'Alex Chen',
    restaurantId: 1,
    restaurantName: 'Bukhara - ITC Maurya',
    deliveryAddress: 'Flat 402, Shanti Niketan, New Delhi',
    orderStatus: 'PREPARING',
    subtotal: 930.00,
    itemsSubtotal: 930.00,
    deliveryFee: 0.00,
    taxAmount: 46.50,
    tipAmount: 30.00,
    totalAmount: 1006.50,
    createdAt: '2026-10-12 18:45:00',
    items: [
      { orderItemId: 5, orderId: 1003, itemId: 101, itemName: 'Dal Bukhara (Slow Cooked 18h)', quantity: 1, agreedUnitPrice: 650.00, subtotal: 650.00 },
      { orderItemId: 6, orderId: 1003, itemId: 104, itemName: 'Bukhara Naan (Giant Tandoor)', quantity: 1, agreedUnitPrice: 280.00, subtotal: 280.00 }
    ],
    payment: {
      paymentId: 3,
      orderId: 1003,
      paymentMethod: 'CARD',
      paymentStatus: 'SUCCESS',
      amount: 1006.50,
      transactionRef: 'TXN-9021-003'
    }
  },
  {
    orderId: 1004,
    customerId: 3,
    customerName: 'David Patel',
    restaurantId: 3,
    restaurantName: 'Trishna Seafood Haven',
    deliveryAddress: '221B Baker Enclave, Mumbai',
    orderStatus: 'OUT_FOR_DELIVERY',
    subtotal: 1990.00,
    itemsSubtotal: 1990.00,
    deliveryFee: 0.00,
    taxAmount: 99.50,
    tipAmount: 60.00,
    totalAmount: 2149.50,
    createdAt: '2026-10-12 19:10:00',
    items: [
      { orderItemId: 7, orderId: 1004, itemId: 301, itemName: 'Signature Butter Garlic Crab', quantity: 1, agreedUnitPrice: 1350.00, subtotal: 1350.00 },
      { orderItemId: 8, orderId: 1004, itemId: 303, itemName: 'Kolambi (Prawn) Biryani', quantity: 1, agreedUnitPrice: 640.00, subtotal: 640.00 }
    ],
    payment: {
      paymentId: 4,
      orderId: 1004,
      paymentMethod: 'CARD',
      paymentStatus: 'SUCCESS',
      amount: 2149.50,
      transactionRef: 'TXN-9021-004'
    },
    delivery: {
      deliveryId: 3,
      orderId: 1004,
      partnerId: 1,
      partnerName: 'Jake Morrison',
      partnerPhone: '+91 97222 23456',
      deliveryStatus: 'PICKED_UP',
      pickupTime: '2026-10-12 19:30:00'
    }
  },
  {
    orderId: 1005,
    customerId: 4,
    customerName: 'Emma Wilson',
    restaurantId: 4,
    restaurantName: 'Paradise Heritage Biryani',
    deliveryAddress: '4 Palm Meadows, Hyderabad',
    orderStatus: 'PLACED',
    subtotal: 600.00,
    itemsSubtotal: 600.00,
    deliveryFee: 0.00,
    taxAmount: 30.00,
    tipAmount: 30.00,
    totalAmount: 660.00,
    createdAt: '2026-10-12 19:40:00',
    items: [
      { orderItemId: 9, orderId: 1005, itemId: 401, itemName: 'Royal Mutton Dum Biryani', quantity: 1, agreedUnitPrice: 480.00, subtotal: 480.00 },
      { orderItemId: 10, orderId: 1005, itemId: 403, itemName: 'Mirchi Ka Salan & Dahi Chutney', quantity: 1, agreedUnitPrice: 120.00, subtotal: 120.00 }
    ],
    payment: {
      paymentId: 5,
      orderId: 1005,
      paymentMethod: 'UPI',
      paymentStatus: 'SUCCESS',
      amount: 660.00,
      transactionRef: 'TXN-9021-005'
    }
  },
  {
    orderId: 1006,
    customerId: 1,
    customerName: 'Alex Chen',
    restaurantId: 5,
    restaurantName: 'Dakshin - Crowne Plaza',
    deliveryAddress: 'Flat 402, Shanti Niketan, New Delhi',
    orderStatus: 'DELIVERED',
    subtotal: 490.00,
    itemsSubtotal: 490.00,
    deliveryFee: 40.00,
    taxAmount: 24.50,
    tipAmount: 30.00,
    totalAmount: 584.50,
    createdAt: '2026-10-11 09:15:00',
    items: [
      { orderItemId: 11, orderId: 1006, itemId: 501, itemName: 'Crispy Ghee Masala Dosa with Sambar & Chutneys', quantity: 1, agreedUnitPrice: 220.00, subtotal: 220.00 },
      { orderItemId: 12, orderId: 1006, itemId: 502, itemName: 'Steamed Thatte Idli with Coconut Chutney (Set of 2)', quantity: 1, agreedUnitPrice: 140.00, subtotal: 140.00 },
      { orderItemId: 13, orderId: 1006, itemId: 504, itemName: 'Crispy Medu Vada with Sambar (2 pcs)', quantity: 1, agreedUnitPrice: 130.00, subtotal: 130.00 }
    ],
    payment: {
      paymentId: 6,
      orderId: 1006,
      paymentMethod: 'UPI',
      paymentStatus: 'SUCCESS',
      amount: 584.50,
      transactionRef: 'TXN-9021-006'
    },
    delivery: {
      deliveryId: 4,
      orderId: 1006,
      partnerId: 2,
      partnerName: 'Marcus Vance',
      partnerPhone: '+91 97333 34567',
      deliveryStatus: 'DELIVERED',
      pickupTime: '2026-10-11 09:30:00',
      deliveredTime: '2026-10-11 09:50:00'
    },
    review: {
      reviewId: 3,
      orderId: 1006,
      customerId: 1,
      restaurantId: 5,
      rating: 5,
      comment: 'The Crispy Ghee Masala Dosa and Thatte Idlis were extraordinarily authentic and fresh!'
    }
  }
];

export const INITIAL_DELIVERY_PARTNERS: DeliveryPartner[] = [
  { partnerId: 1, userId: 12, fullName: 'Jake Morrison', phone: '+91 97222 23456', vehicleType: 'Motorcycle', vehicleNumber: 'KA-05-EM-1102', isAvailable: true, rating: 4.9 },
  { partnerId: 2, userId: 13, fullName: 'Marcus Vance', phone: '+91 97333 34567', vehicleType: 'E-Scooter', vehicleNumber: 'MH-02-EE-8821', isAvailable: true, rating: 4.8 },
  { partnerId: 3, userId: 14, fullName: 'Liam O\'Connor', phone: '+91 97444 45678', vehicleType: 'Bicycle', vehicleNumber: 'DL-01-BK-4409', isAvailable: false, rating: 4.7 }
];
