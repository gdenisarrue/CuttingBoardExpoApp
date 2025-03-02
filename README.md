# Cutting Board AI

A React Native Expo application for managing recipes and cooking assistance using camera functionality.

## Overview

Cutting Board AI is a mobile application built with React Native and Expo that helps users manage recipes and provides cooking assistance. The app features camera integration for capturing images of ingredients or dishes.

## Features

- Recipe management
- Camera integration for capturing food images
- User-friendly interface
- Cross-platform support (iOS and Android)

## Technology Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router
- **UI Components**: React Native components, Expo Vector Icons
- **Camera**: Expo Camera v16.0.17
- **State Management**: Zustand

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CuttingBoardExpoApp.git
   cd CuttingBoardExpoApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Development Mode**: `npm run dev`
- **Build for Web**: `npm run build:web`
- **Lint Code**: `npm run lint`

## Camera Implementation

The app uses the latest Expo Camera API (v16.0.17) with the following features:
- Camera type switching (front/back)
- Flash mode control
- Image capture and saving

## Project Structure

- `/app`: Main application code and screens
- `/assets`: Static assets like images and fonts
- `/constants`: Application constants
- `/store`: State management using Zustand

## Requirements

- Node.js
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for mobile testing)

## License

[Your License Here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
