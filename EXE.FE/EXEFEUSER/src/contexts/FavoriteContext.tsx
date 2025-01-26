import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of your context state
interface FavoriteContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

// Define the props for FavoriteProvider
interface FavoriteProviderProps {
  children: ReactNode;
}

// Create the context
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Create a custom hook to use the favorite context
export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavoriteContext must be used within a FavoriteProvider');
  return context;
};

// Update the FavoriteProvider to receive props with children
export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Get favorites from localStorage if available
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id) ? prevFavorites.filter((fav) => fav !== id) : [...prevFavorites, id]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};
