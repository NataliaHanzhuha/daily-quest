export interface ServiceBasic {
  id: string;
  name: string;
  shortDescription: string;
  icon: string;
  image: string;
}

export interface ServiceDetail extends ServiceBasic {
  fullDescription: string;
  features: string[];
  images: string[];
  pricing?: string;
  additionalInfo?: string;
}

// All services data in one place for consistency
export const servicesData: ServiceDetail[] = [
  {
    id: 'space-rental',
    name: 'Space Rental',
    shortDescription: 'Host memorable events in our versatile spaces, from weddings to corporate gatherings.',
    icon: '🎉',
    image: '/assets/images/acropolis/services-events.jpg',
    fullDescription: 'Our event spaces are designed to create memorable moments for every occasion. From intimate gatherings to grand celebrations, Acropolis Park offers versatile venues that can be customized to match your vision. Our experienced event planning team will assist you throughout the process, ensuring every detail is perfect.',
    features: [
      'Multiple venue options for different event sizes',
      'Professional event planning services',
      'State-of-the-art audio-visual equipment',
      'Customizable catering options',
      'Elegant décor and setup options',
      'Dedicated event coordinator on the day',
      'Convenient parking for guests'
    ],
    images: [
      '/assets/images/acropolis/events-1.jpg',
      '/assets/images/acropolis/events-2.jpg',
      '/assets/images/acropolis/events-3.jpg'
    ],
    pricing: 'Event pricing varies based on venue selection, guest count, and services required. Please contact our events team for a personalized quote.'
  },
  {
    id: 'grill',
    name: 'Grill',
    shortDescription: 'Experience authentic flavors with our signature grilled specialties prepared by expert chefs.',
    icon: '🍖',
    image: '/assets/images/acropolis/services-grill.jpg',
    fullDescription: 'Experience the exceptional flavors of our signature grill, where our master chefs prepare delicious dishes using premium ingredients and traditional cooking methods. Our menu features a variety of grilled specialties, from succulent steaks to fresh seafood and vegetarian options, all served in an elegant and comfortable setting.',
    features: [
      'Premium quality meats and ingredients',
      'Open-flame cooking techniques',
      'Extensive wine and cocktail selection',
      'Outdoor and indoor seating options',
      'Private dining areas available',
      'Live cooking stations',
      'Special dietary accommodations'
    ],
    images: [
      '/assets/images/acropolis/grill-1.jpg',
      '/assets/images/acropolis/grill-2.jpg',
      '/assets/images/acropolis/grill-3.jpg'
    ],
    pricing: 'Menu prices range from ₦3,000 - ₦25,000 per dish. Reservations recommended, especially for weekend dining.'
  },
  {
    id: 'cafe',
    name: 'Cafe',
    shortDescription: 'Relax and enjoy premium coffee, pastries, and light meals in our cozy café setting.',
    icon: '☕',
    image: '/assets/images/acropolis/services-cafe.jpg',
    fullDescription: 'Our café offers a perfect retreat for casual dining and relaxation. Enjoy premium coffee, freshly baked pastries, and a variety of light meals in a warm and inviting atmosphere. Whether you\'re meeting friends, working remotely, or simply taking a moment for yourself, our café provides the perfect ambiance.',
    features: [
      'Specialty coffee and tea selection',
      'Freshly baked pastries and desserts',
      'Light breakfast and lunch options',
      'Comfortable seating and workspaces',
      'Outdoor patio seating',
      'Loyalty program for regular customers'
    ],
    images: [
      '/assets/images/acropolis/cafe-1.jpg',
      '/assets/images/acropolis/cafe-2.jpg',
      '/assets/images/acropolis/cafe-3.jpg'
    ],
    pricing: 'Beverages from ₦800, pastries from ₦1,200, meals from ₦2,500. Open daily from 7:00 AM to 8:00 PM.'
  },
  {
    id: 'connect',
    name: 'Connect',
    shortDescription: 'Stay connected with high-speed internet and comfortable workspaces for productivity.',
    icon: '🔌',
    image: '/assets/images/acropolis/services-connect.jpg',
    fullDescription: 'Our Connect service provides dedicated spaces for productivity and connectivity. With high-speed internet, comfortable workstations, and meeting facilities, we cater to professionals and digital nomads who need a conducive environment for work and collaboration.',
    features: [
      'High-speed fiber internet',
      'Private meeting rooms available',
      'Comfortable ergonomic workstations',
      'Printing and scanning services',
      'Complimentary coffee and refreshments',
      'Quiet zones for focused work',
      'Networking events and workshops'
    ],
    images: [
      '/assets/images/acropolis/connect-1.jpg',
      '/assets/images/acropolis/connect-2.jpg',
      '/assets/images/acropolis/connect-3.jpg'
    ],
    pricing: 'Day passes from ₦3,000, weekly memberships from ₦12,000, monthly memberships from ₦40,000. Corporate packages available.'
  },
  {
    id: 'kids',
    name: 'Kids',
    shortDescription: 'Fun and safe play areas and activities designed especially for our younger guests.',
    icon: '👶',
    image: '/assets/images/acropolis/services-kids.jpg',
    fullDescription: 'Our dedicated kids\' area is designed to provide a safe, fun, and educational environment for our youngest guests. With age-appropriate activities, play equipment, and supervised sessions, parents can relax knowing their children are happily engaged.',
    features: [
      'Safe and monitored play areas',
      'Age-appropriate activities and toys',
      'Educational games and programs',
      'Trained and friendly staff',
      'Regular sanitization of all equipment',
      'Themed activity sessions',
      'Birthday party packages available'
    ],
    images: [
      '/assets/images/acropolis/kids-1.jpg',
      '/assets/images/acropolis/kids-2.jpg',
      '/assets/images/acropolis/kids-3.jpg'
    ],
    pricing: 'Hourly rates from ₦1,500, half-day packages from ₦4,000, full-day packages from ₦7,000. Special family discounts available.'
  },
  {
    id: 'gym',
    name: 'Gym',
    shortDescription: 'State-of-the-art fitness facilities to maintain your workout routine while visiting.',
    icon: '💪',
    image: '/assets/images/acropolis/services-gym.jpg',
    fullDescription: 'Our state-of-the-art fitness center offers everything you need for a complete workout. With modern equipment, professional trainers, and specialized classes, we cater to all fitness levels and goals. Maintain your exercise routine while enjoying all that Acropolis Park has to offer.',
    features: [
      'Modern cardio and strength equipment',
      'Personal training services',
      'Group fitness classes',
      'Locker rooms with showers',
      'Nutritional counseling available',
      'Fitness assessments',
      'Towel service and amenities'
    ],
    images: [
      '/assets/images/acropolis/gym-1.jpg',
      '/assets/images/acropolis/gym-2.jpg',
      '/assets/images/acropolis/gym-3.jpg'
    ],
    pricing: 'Day passes from ₦2,500, weekly memberships from ₦10,000, monthly memberships from ₦30,000. Personal training sessions available at additional cost.'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    shortDescription: 'Browse our curated selection of products, souvenirs, and local artisanal goods.',
    icon: '🛍️',
    image: '/assets/images/acropolis/services-shopping.jpg',
    fullDescription: 'Explore our curated retail space featuring a selection of quality products, souvenirs, and local artisanal goods. From fashion accessories to handcrafted items, our shopping area offers something special for everyone, whether you\'re looking for a gift or a memento of your visit.',
    features: [
      'Curated selection of quality products',
      'Local artisanal crafts and goods',
      'Unique souvenirs and gifts',
      'Fashion accessories and apparel',
      'Specialty food items',
      'Greek-inspired merchandise',
      'Gift wrapping services'
    ],
    images: [
      '/assets/images/acropolis/shopping-1.jpg',
      '/assets/images/acropolis/shopping-2.jpg',
      '/assets/images/acropolis/shopping-3.jpg'
    ],
    additionalInfo: 'Open daily from 10:00 AM to 9:00 PM. Special promotions and seasonal collections available throughout the year.'
  }
];
