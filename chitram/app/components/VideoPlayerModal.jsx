import React, { useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const VideoPlayerModal = ({ videoKey, title, isVisible, onClose }) => {
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&showinfo=0`;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar hidden />
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        
        <WebView
          source={{ uri: youtubeEmbedUrl }}
          style={styles.webview}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  webview: {
    width: width,
    height: height,
  },
});

export default VideoPlayerModal;
