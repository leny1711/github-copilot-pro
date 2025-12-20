import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const CATEGORIES = [
  'Home Repair',
  'Cleaning',
  'Moving',
  'Delivery',
  'Shopping',
  'Pet Care',
  'Gardening',
  'Tutoring',
  'Other',
];

const CreateMissionScreen = ({ navigation, route }: any) => {
  const { isUrgent = false } = route.params || {};
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (isUrgent) {
      setTitle('Urgent Help Needed');
    }
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        setAddress(
          `${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.country || ''}`
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCreate = async () => {
    if (!title || !description || !category || !estimatedPrice || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const price = parseFloat(estimatedPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      await apiService.createMission({
        title,
        description,
        category,
        isUrgent,
        latitude: location.latitude,
        longitude: location.longitude,
        address,
        estimatedPrice: price,
      });

      Alert.alert('Success', 'Mission created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isUrgent ? 'Urgent Mission' : 'Create New Mission'}
        </Text>
        {isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT REQUEST</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="What do you need help with?"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Provide details about your request"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Estimated Price (€)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={estimatedPrice}
          onChangeText={setEstimatedPrice}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            {loadingLocation
              ? 'Getting location...'
              : address || 'Location not available'}
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={getCurrentLocation}
            disabled={loadingLocation}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isUrgent && styles.urgentButton]}
          onPress={handleCreate}
          disabled={loading || loadingLocation}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isUrgent ? 'Request Urgent Help' : 'Create Mission'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  urgentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#007AFF',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  urgentButton: {
    backgroundColor: '#FF3B30',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateMissionScreen;
