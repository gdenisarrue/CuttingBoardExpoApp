import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Trash2, Info, Moon, Sun, RefreshCw } from 'lucide-react-native';
import { useShoppingStore } from '../../store/shoppingStore';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [autoSort, setAutoSort] = useState(false);
  const clearAllItems = useShoppingStore(state => state.clearAllItems);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#121212', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {darkMode ? <Moon size={22} color="#00e8fc" /> : <Sun size={22} color="#ff69b4" />}
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#00e8fc50' }}
              thumbColor={darkMode ? '#00e8fc' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopping List</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <RefreshCw size={22} color="#00e8fc" />
              <Text style={styles.settingText}>Auto-sort items by department</Text>
            </View>
            <Switch
              value={autoSort}
              onValueChange={setAutoSort}
              trackColor={{ false: '#767577', true: '#00e8fc50' }}
              thumbColor={autoSort ? '#00e8fc' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={() => {
              clearAllItems();
            }}
          >
            <Trash2 size={22} color="#ff4d4d" />
            <Text style={styles.dangerButtonText}>Clear All Shopping Items</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutItem}>
            <Info size={22} color="#00e8fc" />
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>CuttingBoardAI</Text>
              <Text style={styles.aboutText}>Version 1.0.0</Text>
              <Text style={styles.aboutText}>
                A smart shopping list app that helps you organize items by department for efficient shopping.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00e8fc',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,77,0.1)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  dangerButtonText: {
    color: '#ff4d4d',
    fontSize: 16,
    marginLeft: 10,
  },
  aboutItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 8,
  },
  aboutContent: {
    marginLeft: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
    lineHeight: 20,
  },
});