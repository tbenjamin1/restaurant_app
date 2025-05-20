import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  location: string;
  category: string;
  price: string;
  tags?: string[];
  recommendedTag?: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  favorites: number[];
  activeCategory: string;
  currentSlides: Record<number, number>;
  searchTerm: string;
}

interface RootState {
  restaurants: RestaurantState;
}

const initialState: RestaurantState = {
  restaurants: [
    {
      id: 1,
      name: "Tempura test Yamaguchi",
      description: "Serving luxurious tempura",
      rating: 4.9,
      reviewCount: 300,
      images: [
        "https://picsum.photos/seed/picsum/200/300",
        "https://picsum.photos/200/300",
        "https://picsum.photos/id/237/200/300"
      ],
      location: "YOKOHAMA",
      category: "Tempura",
      price: "50,000-70,000 won",
      recommendedTag: "Recommended Yokohama Tempura"
    },
    {
      id: 2,
      name: "Sushi Sato teest",
      description: "You can enjoy authentic sushi made with fresh seafood.",
      rating: 4.8,
      reviewCount: 250,
      images: [
        "https://picsum.photos/200/300",
        "https://picsum.photos/200",
        "https://picsum.photos/200/300"
      ],
      location: "SAPPORO",
      category: "Sushi & Seafood",
      price: "40,000-60,000 won",
      recommendedTag: "Sapporo Sushi Restaurant"
    },
  ],
  favorites: [],
  activeCategory: "entire",
  currentSlides: {},
  searchTerm: "",
};

export const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const restaurantId = action.payload;
      if (state.favorites.includes(restaurantId)) {
        state.favorites = state.favorites.filter(id => id !== restaurantId);
      } else {
        state.favorites.push(restaurantId);
      }
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    nextSlide: (state, action: PayloadAction<{id: number, totalSlides: number}>) => {
      const { id, totalSlides } = action.payload;
      state.currentSlides[id] = ((state.currentSlides[id] || 0) + 1) % totalSlides;
    },
    prevSlide: (state, action: PayloadAction<{id: number, totalSlides: number}>) => {
      const { id, totalSlides } = action.payload;
      state.currentSlides[id] = ((state.currentSlides[id] || 0) - 1 + totalSlides) % totalSlides;
    },
    goToSlide: (state, action: PayloadAction<{id: number, slideIndex: number}>) => {
      const { id, slideIndex } = action.payload;
      state.currentSlides[id] = slideIndex;
    },
    initializeSlides: (state) => {
      state.restaurants.forEach(restaurant => {
        if (state.currentSlides[restaurant.id] === undefined) {
          state.currentSlides[restaurant.id] = 0;
        }
      });
    }
  },
});

//  actions
export const { 
  toggleFavorite, 
  setActiveCategory, 
  setSearchTerm, 
  nextSlide, 
  prevSlide, 
  goToSlide,
  initializeSlides
} = restaurantSlice.actions;

// selectors
export const selectRestaurants = (state: RootState) => state.restaurants.restaurants;
export const selectFavorites = (state: RootState) => state.restaurants.favorites;
export const selectActiveCategory = (state: RootState) => state.restaurants.activeCategory;
export const selectCurrentSlides = (state: RootState) => state.restaurants.currentSlides;
export const selectSearchTerm = (state: RootState) => state.restaurants.searchTerm;

export const selectFilteredRestaurants = (state: RootState) => {
  const { restaurants, activeCategory, searchTerm } = state.restaurants;
  
  return restaurants
    .filter(restaurant => 
      activeCategory === "entire" || restaurant.category.includes(activeCategory)
    )
    .filter(restaurant => 
      searchTerm === "" || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export default restaurantSlice.reducer;