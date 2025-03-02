# CuttingBoardExpoApp Troubleshooting Log

## Latest Update: March 2, 2025 (Updated)

## Project Overview
- **Project Name**: CuttingBoardExpoApp
- **Main Issue**: Camera functionality not working in the New Recipe screen
- **Expo Version**: 52.0.33
- **expo-camera Version**: 14.1.3 (expected: ~16.0.17)

## Initial Errors
The app initially had multiple errors:

1. **Camera Implementation Error**:
   ```
   TypeError: Cannot read property 'back' of undefined
   ```

2. **Route Export Warning**:
   ```
   WARN Route "./(tabs)/new-recipe.tsx" is missing the required default export. Ensure a React component is exported as default.
   ```

3. **Route Navigation Warning**:
   ```
   WARN [Layout children]: No route named "new-recipe" exists in nested children: ["index", "my-recipes", "settings", "shopping-list"]
   ```

## Package Version Mismatches
The terminal shows multiple package version incompatibilities:
```
expo@52.0.33 - expected version: ~52.0.36
expo-camera@14.1.3 - expected version: ~16.0.17
expo-constants@17.0.5 - expected version: ~17.0.7
expo-font@13.0.3 - expected version: ~13.0.4
expo-image-picker@15.1.0 - expected version: ~16.0.6
expo-media-library@16.0.5 - expected version: ~17.0.6
expo-splash-screen@0.29.21 - expected version: ~0.29.22
react-native@0.76.6 - expected version: 0.76.7
react-native-gesture-handler@2.23.1 - expected version: ~2.20.2
react-native-screens@4.6.0 - expected version: ~4.4.0
react-native-svg@15.11.1 - expected version: 15.8.0
@shopify/flash-list@1.6.3 - expected version: 1.7.3
```

## Attempted Solutions

### Attempt 1: Update Camera Component API
Changed from:
```tsx
import { Camera } from 'expo-camera';
const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');
```

To:
```tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
const [facing, setFacing] = useState<CameraType>('back');
const [permission, requestPermission] = useCameraPermissions();
```

**Result**: Still got the same error: `TypeError: Cannot read property 'back' of undefined`

### Attempt 2: Revert to Previous Camera API with Constants
Changed from:
```tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
```

To:
```tsx
import { Camera } from 'expo-camera';
const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
```

**Result**: Same error: `TypeError: Cannot read property 'back' of undefined`

### Attempt 3: Fix Default Export
Changed from:
```tsx
export default function NewRecipeScreen() {
  // component code
}
```

To:
```tsx
function NewRecipeScreen() {
  // component code
}

export default NewRecipeScreen;
```

**Result**: No change in errors

### Attempt 4: Use Legacy Camera Import
Changed from:
```tsx
import { Camera, CameraType } from 'expo-camera';
```

To:
```tsx
import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';

const [cameraType, setCameraType] = useState(CameraType.back);
const [flashMode, setFlashMode] = useState(FlashMode.off);

// Updated toggle functions
const toggleCameraType = () => {
  setCameraType(current => 
    current === CameraType.back ? CameraType.front : CameraType.back
  );
};

const toggleFlashMode = () => {
  setFlashMode(current => 
    current === FlashMode.off ? FlashMode.on : FlashMode.off
  );
};
```

**Result**: Bundling appears to stall, no error messages but no successful bundling either.

### Attempt 5: Update Package Dependencies
Ran the following command to update all packages to their expected versions:

```bash
npx expo install expo@~52.0.36 expo-camera@~16.0.17 expo-constants@~17.0.7 expo-font@~13.0.4 expo-image-picker@~16.0.6 expo-media-library@~17.0.6 expo-splash-screen@~0.29.22 react-native@0.76.7 react-native-gesture-handler@~2.20.2 react-native-screens@~4.4.0 react-native-svg@15.8.0 @shopify/flash-list@1.7.3
```

**Result**: Packages were successfully updated, but the app still had the same error.

### Attempt 6: Use CameraView with New API
Changed to use the new CameraView component from expo-camera v16:

```tsx
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();
const [cameraType, setCameraType] = useState(CameraType.back);
const [flashMode, setFlashMode] = useState(FlashMode.off);
const cameraRef = useRef<CameraView>(null);
```

**Result**: Still got the error: `TypeError: Cannot read property 'back' of undefined`

### Attempt 7: Revert to Standard Camera API with Constants
Changed back to using the standard Camera API with Constants:

```tsx
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();
const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
const cameraRef = useRef(null);

const toggleCameraType = () => {
  setCameraType(current => 
    current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
  );
};

const toggleFlashMode = () => {
  setFlashMode(current => 
    current === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
  );
};
```

**Result**: Bundling appears to be working, but we're still waiting to see if the error persists.

### Attempt 8: Update to the New CameraView API (Successful)
Changed to use the new CameraView API from expo-camera v16.0.17:

```tsx
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();
const [cameraType, setCameraType] = useState<CameraType>(CameraType.Back);
const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.Off);
const cameraRef = useRef<CameraView>(null);

const toggleCameraType = () => {
  setCameraType(current => 
    current === CameraType.Back ? CameraType.Front : CameraType.Back
  );
};

const toggleFlashMode = () => {
  setFlashMode(current => 
    current === FlashMode.Off ? FlashMode.On : FlashMode.Off
  );
};
```

Also updated the Camera component to CameraView and its props:

```tsx
<CameraView
  ref={cameraRef}
  style={styles.camera}
  facing={cameraType}
  flashMode={flashMode}
>
  {/* Camera content */}
</CameraView>
```

And improved the takePicture function with better error handling:

```tsx
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
```

**Result**: The app is now bundling successfully without the previous errors.

### Attempt 9: Fix CameraType and FlashMode to Use String Literals (Final Solution)
Changed the CameraType and FlashMode values from enum-style properties to string literals:

```tsx
// Changed from
const [cameraType, setCameraType] = useState<CameraType>(CameraType.Back);
const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.Off);

// To
const [cameraType, setCameraType] = useState<CameraType>('back');
const [flashMode, setFlashMode] = useState<FlashMode>('off');
```

Also updated the toggle functions to use string literals:

```tsx
// Changed from
const toggleCameraType = () => {
  setCameraType(current => 
    current === CameraType.Back ? CameraType.Front : CameraType.Back
  );
};

// To
const toggleCameraType = () => {
  setCameraType(current => 
    current === 'back' ? 'front' : 'back'
  );
};
```

**Result**: The app is now working correctly. The issue was that in the expo-camera v16.0.17 API, CameraType and FlashMode are defined as string literal types, not as enums with properties. According to the documentation, the acceptable values for CameraType are 'front' | 'back' and for FlashMode are 'off' | 'on' | 'auto'.

### Attempt 1: Update Camera Component API
Changed from:
```tsx
import { Camera } from 'expo-camera';
const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');
```

To:
```tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
const [facing, setFacing] = useState<CameraType>('back');
const [permission, requestPermission] = useCameraPermissions();
```

**Result**: Still got the same error: `TypeError: Cannot read property 'back' of undefined`

### Attempt 2: Revert to Previous Camera API with Constants
Changed from:
```tsx
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
```

To:
```tsx
import { Camera } from 'expo-camera';
const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
```

**Result**: Same error: `TypeError: Cannot read property 'back' of undefined`

### Attempt 3: Fix Default Export
Changed from:
```tsx
export default function NewRecipeScreen() {
  // component code
}
```

To:
```tsx
function NewRecipeScreen() {
  // component code
}

export default NewRecipeScreen;
```

**Result**: No change in errors

### Attempt 4: Use Legacy Camera Import
Changed from:
```tsx
import { Camera, CameraType } from 'expo-camera';
```

To:
```tsx
import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';

const [cameraType, setCameraType] = useState(CameraType.back);
const [flashMode, setFlashMode] = useState(FlashMode.off);

// Updated toggle functions
const toggleCameraType = () => {
  setCameraType(current => 
    current === CameraType.back ? CameraType.front : CameraType.back
  );
};

const toggleFlashMode = () => {
  setFlashMode(current => 
    current === FlashMode.off ? FlashMode.on : FlashMode.off
  );
};
```

**Result**: Bundling appears to stall, no error messages but no successful bundling either.

## Current State of new-recipe.tsx
The file currently uses the legacy camera import as follows:

```tsx
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera as CameraIcon, Image as ImageIcon, Upload, X, Check, RefreshCw } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { Camera, CameraType, FlashMode } from 'expo-camera/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

function NewRecipeScreen() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  // Rest of component code...
}

export default NewRecipeScreen;
```

## File Structure
The app follows the Expo Router structure:
- `app/(tabs)/_layout.tsx` - Tab navigation setup
- `app/(tabs)/new-recipe.tsx` - Camera screen with issues
- Other tab screens: index.tsx, my-recipes.tsx, settings.tsx, shopping-list.tsx

## Possible Issues to Investigate
1. **Version Mismatch**: The expo-camera version (14.1.3) is significantly different from the expected version (~16.0.17)
2. **Expo Go Compatibility**: Need to ensure our solution works with Expo Go
3. **Legacy API Consistency**: Ensure all camera-related code uses the legacy imports consistently
4. **Bundling Issues**: The app seems to stall during bundling with the legacy imports

## Current Status

The app has been successfully fixed and is now working correctly with Expo SDK 52 and expo-camera v16.0.17. The following changes were made:

1. Changed the import from `Camera` to `CameraView, CameraType, FlashMode, useCameraPermissions` from 'expo-camera'
2. Updated the camera permission hook to use `useCameraPermissions()` instead of `Camera.useCameraPermissions()`
3. Changed the camera type and flash mode state to use string literals: `'back'/'front'` and `'off'/'on'` instead of enum values
4. Updated the Camera component to `CameraView` and changed the `type` prop to `facing`
5. Improved error handling in the `takePicture` function to better handle incomplete photo data

The app is now bundling successfully and working correctly on Expo Go.

## Next Steps to Consider
1. Test the camera functionality on physical devices to ensure it works as expected
2. Consider adding more robust error handling for camera permissions
3. Add fallback mechanisms for devices that don't support certain camera features
4. Implement proper loading states during camera operations
