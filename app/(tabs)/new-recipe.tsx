import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera as CameraIcon, Image as ImageIcon, Upload, X, Check, RefreshCw } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

function NewRecipeScreen() {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      try {
        // Request media library permissions
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setGalleryPermission(galleryStatus.status === 'granted');
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo && photo.uri) {
          setPhoto(photo.uri);
          setCameraActive(false);
        } else {
          console.error('Photo data is incomplete');
          alert('Failed to take picture: Photo data is incomplete');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        alert('Failed to take picture: ' + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      console.error('Camera reference is not available');
    }
  };

  const pickImage = async () => {
    if (galleryPermission) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } else {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo);
        alert('Photo saved to gallery!');
        // Here you would typically process the image for recipe extraction
        // For now, we'll just close the camera view
        setCameraActive(false);
      } catch (error) {
        console.error('Error saving photo:', error);
        alert('Failed to save photo');
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(current => 
      current === 'off' ? 'on' : 'off'
    );
  };

  if (cameraActive) {
    if (photo) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.photoPreviewContainer}>
            <Image 
              source={{ uri: photo }} 
              style={styles.photoPreview}
              resizeMode="cover"
            />
            <View style={styles.photoActions}>
              <TouchableOpacity 
                style={[styles.photoButton, styles.photoButtonCancel]}
                onPress={() => setPhoto(null)}
              >
                <X size={24} color="#fff" />
                <Text style={styles.photoButtonText}>Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.photoButton, styles.photoButtonConfirm]}
                onPress={savePhoto}
              >
                <Check size={24} color="#fff" />
                <Text style={styles.photoButtonText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }
    
    return (
      <SafeAreaView style={styles.container}>
        {permission?.granted ? (
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              flashMode={flashMode}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setCameraActive(false)}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.cameraButtons}>
                  <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={toggleFlashMode}
                  >
                    <Text style={styles.cameraButtonText}>
                      {flashMode === 'on' ? 'Flash On' : 'Flash Off'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={toggleCameraType}
                  >
                    <RefreshCw size={16} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.cameraButtonText}>Flip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noCameraPermission}>
            <Text style={styles.noCameraText}>No access to camera</Text>
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.permissionButton, {marginTop: 10}]}
              onPress={() => setCameraActive(false)}
            >
              <Text style={styles.permissionButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>New Recipe</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.uploadSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.uploadImage}
            resizeMode="cover"
          />
          
          <View style={styles.uploadOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.uploadTitle}>Capture Your Recipe</Text>
            <Text style={styles.uploadSubtitle}>
              Take a photo of your recipe or upload from your gallery
            </Text>
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                alert('Camera is not available on web. Please use a mobile device.');
              } else {
                setCameraActive(true);
              }
            }}
          >
            <LinearGradient
              colors={['#00f3ff', '#00a2ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <CameraIcon size={24} color="#fff" />
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={pickImage}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ff3a88']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <ImageIcon size={24} color="#fff" />
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <LinearGradient
              colors={['#a78bfa', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <Upload size={24} color="#fff" />
            <Text style={styles.optionText}>Import from URL</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            1. Take a photo of your recipe or upload from your gallery
          </Text>
          <Text style={styles.infoText}>
            2. Our AI will extract ingredients and instructions
          </Text>
          <Text style={styles.infoText}>
            3. Add items directly to your shopping list
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default NewRecipeScreen;

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
  content: {
    flex: 1,
    padding: 20,
  },
  uploadSection: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
    position: 'relative',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  optionsContainer: {
    marginBottom: 25,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00e8fc',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    paddingLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cameraButtons: {
    flexDirection: 'row',
  },
  cameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 5,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  noCameraPermission: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  noCameraText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#00e8fc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  photoPreviewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  photoPreview: {
    flex: 1,
  },
  photoActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  photoButtonCancel: {
    backgroundColor: 'rgba(255,77,77,0.8)',
  },
  photoButtonConfirm: {
    backgroundColor: 'rgba(0,232,252,0.8)',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});