import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, X, GripHorizontal, Check } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useShoppingStore } from '../../store/shoppingStore';
import { DEPARTMENTS } from '../../constants/departments';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ShoppingListScreen() {
  const [newItemText, setNewItemText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const departmentRefs = useRef<{ [key: string]: { y: number, height: number } }>({});
  
  const { items, addItem, toggleItem, removeItem, moveItem } = useShoppingStore();

  // Store department positions for drag detection
  const measureDepartments = () => {
    DEPARTMENTS.forEach((dept) => {
      const deptElement = departmentRefs.current[dept];
      if (deptElement) {
        // We already have measurements
        return;
      }
      
      // Initialize with default values
      departmentRefs.current[dept] = { y: 0, height: 0 };
    });
  };

  useEffect(() => {
    // Measure departments on mount
    measureDepartments();
  }, []);

  const updateDepartmentMeasurement = (department: string, y: number, height: number) => {
    departmentRefs.current[department] = { y, height };
  };

  const renderDepartmentItems = (department: string) => {
    const departmentItems = items.filter(item => item.department === department);
    
    if (departmentItems.length === 0) {
      return (
        <View style={styles.emptyDepartment}>
          <Text style={styles.emptyText}>No items in this department</Text>
        </View>
      );
    }
    
    return departmentItems.map((item) => (
      <DraggableItem 
        key={item.id} 
        item={item} 
        onToggle={toggleItem}
        onRemove={removeItem}
        onMove={(toCategory) => moveItem(item.id, toCategory)}
        departmentRefs={departmentRefs.current}
        onHoverDepartment={setHoveredDepartment}
      />
    ));
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addItem({
        id: Date.now().toString(),
        name: newItemText.trim(),
        completed: false,
        department: selectedDepartment,
      });
      setNewItemText('');
      setIsAddingItem(false);
    }
  };

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
          <Text style={styles.headerTitle}>Shopping List</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButtonContainer}
          onPress={() => setIsAddingItem(true)}
        >
          <LinearGradient
            colors={['#00f3ff', '#ff6b6b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.plusIconContainer}>
            <Plus size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
      
      {isAddingItem && (
        <View style={styles.addItemContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter item name"
              placeholderTextColor="#aaa"
              value={newItemText}
              onChangeText={setNewItemText}
              autoFocus
            />
            <TouchableOpacity onPress={() => setIsAddingItem(false)}>
              <X size={24} color="#aaa" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.departmentSelector}
          >
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.departmentOption,
                  selectedDepartment === dept && styles.selectedDepartment
                ]}
                onPress={() => setSelectedDepartment(dept)}
              >
                <Text 
                  style={[
                    styles.departmentText,
                    selectedDepartment === dept && styles.selectedDepartmentText
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleAddItem}
          >
            <LinearGradient
              colors={['#00f3ff', '#ff6b6b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmGradient}
            >
              <Text style={styles.confirmText}>Add Item</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.content}
      >
        {DEPARTMENTS.map((department) => (
          <View 
            key={department} 
            style={[
              styles.departmentSection,
              hoveredDepartment === department && styles.highlightedDepartment
            ]}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              updateDepartmentMeasurement(department, y, height);
            }}
          >
            <Text style={[
              styles.departmentTitle,
              hoveredDepartment === department && styles.highlightedDepartmentTitle
            ]}>
              {department}
            </Text>
            <View style={[
              styles.itemsContainer,
              hoveredDepartment === department && styles.highlightedItemsContainer
            ]}>
              {renderDepartmentItems(department)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

interface Item {
  id: string;
  name: string;
  completed: boolean;
  department: string;
}

interface DepartmentRef {
  y: number;
  height: number;
}

interface DraggableItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (toDepartment: string) => void;
  departmentRefs: { [key: string]: DepartmentRef };
  onHoverDepartment: (department: string | null) => void;
}

function DraggableItem({ 
  item, 
  onToggle, 
  onRemove, 
  onMove, 
  departmentRefs,
  onHoverDepartment
}: DraggableItemProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const scrollOffset = useSharedValue(0);
  
  const findDepartmentAtPosition = (y: number): string | null => {
    // Add scroll offset to get the absolute position
    const absoluteY = y + scrollOffset.value;
    
    for (const [dept, { y: deptY, height }] of Object.entries(departmentRefs)) {
      // Check if the y position is within this department's bounds
      if (absoluteY >= deptY && absoluteY <= deptY + height) {
        return dept;
      }
    }
    
    return null;
  };
  
  const endDrag = useCallback((toCategory: string | null) => {
    'worklet';
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    elevation.value = withTiming(0);
    opacity.value = withTiming(1);
    isDragging.value = false;
    
    // Clear the hovered department
    runOnJS(onHoverDepartment)(null);
    
    if (toCategory && toCategory !== item.department) {
      runOnJS(onMove)(toCategory);
    }
  }, [item.department, onMove, onHoverDepartment]);
  
  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      isDragging.value = true;
      scale.value = withSpring(1.05);
      elevation.value = withTiming(10);
      opacity.value = withTiming(0.9);
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
      
      // Find which department we're hovering over
      const hoveredDept = findDepartmentAtPosition(event.absoluteY);
      if (hoveredDept) {
        runOnJS(onHoverDepartment)(hoveredDept);
      } else {
        runOnJS(onHoverDepartment)(null);
      }
    })
    .onEnd((event) => {
      // Find which department we're over
      const targetDepartment = findDepartmentAtPosition(event.absoluteY);
      endDrag(targetDepartment);
    });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      zIndex: isDragging.value ? 1000 : 1,
      elevation: elevation.value,
      opacity: opacity.value,
      shadowOpacity: isDragging.value ? 0.3 : 0,
      shadowRadius: isDragging.value ? 10 : 0,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.itemContainer, animatedStyle]}>
        <TouchableOpacity 
          style={styles.checkbox}
          onPress={() => onToggle(item.id)}
        >
          {item.completed ? (
            <Check size={18} color="#00f3ff" />
          ) : (
            <View style={styles.unchecked} />
          )}
        </TouchableOpacity>
        
        <Text 
          style={[
            styles.itemText,
            item.completed && styles.completedText
          ]}
        >
          {item.name}
        </Text>
        
        <View style={styles.itemActions}>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
          >
            <X size={18} color="#ff4d4d" />
          </TouchableOpacity>
          
          <View style={styles.dragHandle}>
            <GripHorizontal size={18} color="#aaa" />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
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
  addButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  plusIconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 100,
  },
  departmentSection: {
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  highlightedDepartment: {
    transform: [{ scale: 1.01 }],
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 5,
    transition: 'all 0.3s ease',
  },
  highlightedDepartmentTitle: {
    color: '#00f3ff',
    fontSize: 20,
  },
  itemsContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  highlightedItemsContainer: {
    backgroundColor: 'rgba(0,243,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,243,255,0.3)',
  },
  emptyDepartment: {
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#1a1a1a',
    shadowColor: '#00f3ff',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unchecked: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 5,
    marginRight: 5,
  },
  dragHandle: {
    padding: 5,
    marginLeft: 5,
  },
  addItemContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  departmentSelector: {
    paddingVertical: 10,
  },
  departmentOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginRight: 10,
  },
  selectedDepartment: {
    backgroundColor: '#00f3ff',
  },
  departmentText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedDepartmentText: {
    color: '#000',
    fontWeight: 'bold',
  },
  confirmButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 15,
  },
  confirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});