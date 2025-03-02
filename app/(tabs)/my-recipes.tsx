import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, Star, Plus, Search } from 'lucide-react-native';
import { useState } from 'react';

// Sample recipe data
const SAMPLE_RECIPES = [
  {
    id: '1',
    title: 'Homemade Pasta Carbonara',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: '25 min',
    servings: 4,
    rating: 4.8,
    tags: ['Italian', 'Pasta', 'Dinner']
  },
  {
    id: '2',
    title: 'Avocado & Egg Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: '10 min',
    servings: 2,
    rating: 4.5,
    tags: ['Breakfast', 'Quick', 'Healthy']
  },
  {
    id: '3',
    title: 'Grilled Salmon with Vegetables',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: '30 min',
    servings: 2,
    rating: 4.9,
    tags: ['Seafood', 'Dinner', 'Healthy']
  },
  {
    id: '4',
    title: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    prepTime: '15 min',
    servings: 1,
    rating: 4.6,
    tags: ['Breakfast', 'Vegan', 'Healthy']
  }
];

interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: string;
  servings: number;
  rating: number;
  tags: string[];
}

export default function MyRecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>(SAMPLE_RECIPES);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Favorites', 'Recent', 'Breakfast', 'Lunch', 'Dinner'];

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.recipeImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.recipeGradient}
      />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        
        <View style={styles.recipeMetaContainer}>
          <View style={styles.recipeMeta}>
            <Clock size={14} color="#00e8fc" />
            <Text style={styles.recipeMetaText}>{item.prepTime}</Text>
          </View>
          
          <View style={styles.recipeMeta}>
            <Users size={14} color="#00e8fc" />
            <Text style={styles.recipeMetaText}>{item.servings}</Text>
          </View>
          
          <View style={styles.recipeMeta}>
            <Star size={14} color="#00e8fc" />
            <Text style={styles.recipeMetaText}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTitleWrapper}>
          <View style={styles.gradientBackground}>
            <LinearGradient
              colors={['#00f3ff', '#ff6b6b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { opacity: 0.75, borderRadius: 8 }]}
            />
          </View>
          <Text style={styles.headerTitle}>My Recipes</Text>
        </View>
        
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.filterButton,
                selectedFilter === item && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text 
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>
      
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeCard}
        contentContainerStyle={styles.recipeList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.recipeRow}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <LinearGradient
          colors={['#00f3ff', '#ff6b6b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitleWrapper: {
    position: 'relative',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  gradientBackground: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // Changed from 'transparent' to white
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  filterList: {
    paddingHorizontal: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  filterButtonActive: {
    backgroundColor: '#00e8fc',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  recipeList: {
    padding: 10,
    paddingBottom: 80,
  },
  recipeRow: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  recipeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  recipeContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  recipeTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeMetaText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(0,232,252,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00e8fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    overflow: 'hidden',
  },
});