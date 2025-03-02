import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ShoppingCart, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>CuttingBoardAI</Text>
          <Text style={styles.subtitle}>Smart Shopping Lists</Text>
        </View>
        
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=896&q=80' }} 
            style={styles.logoImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,232,252,0.6)', 'rgba(255,105,180,0.6)']}
            style={styles.logoOverlay}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Organize by Department</Text>
          <Text style={styles.infoText}>
            Easily organize your shopping items by store department to make your shopping trip efficient.
          </Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Drag & Drop</Text>
          <Text style={styles.infoText}>
            Intuitively move items between departments with simple drag and drop functionality.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/(tabs)/shopping-list')}
        >
          <LinearGradient
            colors={['#00e8fc', '#ff69b4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <ShoppingCart size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Shopping</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#00e8fc',
    marginTop: 5,
    textAlign: 'center',
  },
  logoContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  infoSection: {
    marginBottom: 25,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00e8fc',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  startButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#00e8fc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});