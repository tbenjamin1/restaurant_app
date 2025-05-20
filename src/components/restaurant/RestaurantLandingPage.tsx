import { useEffect } from "react";
import { Heart, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFilteredRestaurants,
  selectFavorites,
  selectActiveCategory,
  selectCurrentSlides,
  selectSearchTerm,
  toggleFavorite,
  setActiveCategory,
  setSearchTerm,
  goToSlide,
  initializeSlides,
} from "../../store/restaurantSlice";

const RestaurantLandingPage = () => {
  const dispatch = useDispatch();

  //  selectors
  const filteredRestaurants = useSelector(selectFilteredRestaurants);
  const favorites = useSelector(selectFavorites);
  const activeCategory = useSelector(selectActiveCategory);
  const currentSlides = useSelector(selectCurrentSlides);
  const searchTerm = useSelector(selectSearchTerm);

  // initialize
  useEffect(() => {
    dispatch(initializeSlides());
  }, [dispatch]);

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  const handleSetActiveCategory = (category: string) => {
    dispatch(setActiveCategory(category));
  };

  const handleSetSearchTerm = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const handleGoToSlide = (id: number, slideIndex: number) => {
    dispatch(goToSlide({ id, slideIndex }));
  };

  // categories 
  const categories = [
    "entire",
    "Ramen/Tsukemen",
    "Tonkatsu/Kushikatsu",
    "Soba/Udon",
    "Okonomiyaki/Takoyaki",
    "Sukiyaki/Shabu Shabu",
    "Tempura",
    "Eel",
    "Yakitori/Skewer",
    "Sushi & Seafood",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* filter/search */}
      <div className="mb-6 relative">
        <div className="relative rounded-lg">
          <input
            type="text"
            placeholder="Search for the name of the restaurant"
            className="w-full p-4 rounded-lg text-sm border border-gray-300 pl-10"
            value={searchTerm}
            onChange={(e) => handleSetSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* category tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleSetActiveCategory(category)}
            className={`px-4 py-2 whitespace-nowrap rounded-md font-bold text-sm ${
              activeCategory === category
                ? "bg-gray-200 text-gray-500"
                : "bg-gray-50 text-gray-500"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* manin container with grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-2xl overflow-hidden"
          >
            {/* restaurant food image slider */}
            <div className="relative h-48">
              <div className="relative h-full overflow-hidden rounded-2xl">
                {restaurant.images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ease-in-out ${
                      currentSlides[restaurant.id] === index ||
                      (currentSlides[restaurant.id] === undefined &&
                        index === 0)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${restaurant.name} image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* favorite/like futton */}
              <button
                onClick={() => handleToggleFavorite(restaurant.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/30 hover:bg-white z-10"
              >
                <Heart
                  className="text-white stroke-2"
                  size={20}
                  fill={favorites.includes(restaurant.id) ? "#f43f5e" : "none"}
                  color={
                    favorites.includes(restaurant.id) ? "#f43f5e" : "white"
                  }
                  strokeWidth={2}
                />
              </button>

              {/*image slider navigation ots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10 px-2 py-1 rounded-3xl bg-black/50">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGoToSlide(restaurant.id, index);
                    }}
                    className={`w-2 h-2 cursor-pointer rounded-full ${
                      currentSlides[restaurant.id] === index ||
                      (currentSlides[restaurant.id] === undefined &&
                        index === 0)
                        ? "bg-white"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* restaurant info */}
            <div className="p-4">
              {restaurant.recommendedTag && (
                <div className="flex items-center mb-2">
                  <span className="text-yellow-300 mr-1">★</span>
                  <span className="text-red-300 text-sm">
                    {restaurant.recommendedTag}
                  </span>
                </div>
              )}

              {/* restaurant name and rating */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">{restaurant.name}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-300 mr-1">★</span>
                  <span className="font-medium text-sm">
                    {restaurant.rating}
                  </span>
                  <span className="text-gray-500 ml-1 text-sm">
                    ({restaurant.reviewCount})
                  </span>
                </div>
              </div>

              {/* description */}
              <div className="text-gray-600 mb-2 text-sm flex text-start">
                {restaurant.description}
              </div>

              {/* location, category , Price */}
              <div className="text-gray-500 text-sm text-start">
                {restaurant.location} · {restaurant.category} ·{" "}
                {restaurant.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantLandingPage;
