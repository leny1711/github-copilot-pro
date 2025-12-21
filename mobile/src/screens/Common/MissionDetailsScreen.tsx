import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Mission } from '../../types';

const MissionDetailsScreen = ({ navigation, route }: any) => {
  const { missionId } = route.params;
  const { user } = useAuth();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMission();
  }, []);

  const loadMission = async () => {
    try {
      const response = await apiService.getMissionById(missionId);
      setMission(response.mission);
    } catch (error) {
      console.error('Error loading mission:', error);
      Alert.alert('Error', 'Failed to load mission details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await apiService.updateMissionStatus(missionId, status);
      loadMission();
      Alert.alert('Success', `Mission status updated to ${status}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update status');
    }
  };

  const handlePayment = () => {
    navigation.navigate('Payment', { missionId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!mission) {
    return (
      <View style={styles.centerContainer}>
        <Text>Mission not found</Text>
      </View>
    );
  }

  const isClient = mission.clientId === user?.id;
  const isProvider = mission.providerId === user?.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{mission.title}</Text>
          {mission.isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
        <Text style={styles.statusText}>{mission.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{mission.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{mission.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.priceValue}>€{mission.estimatedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{mission.address}</Text>
        </View>
      </View>

      {mission.client && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text style={styles.personName}>
            {mission.client.firstName} {mission.client.lastName}
          </Text>
          {mission.client.phoneNumber && (
            <Text style={styles.personPhone}>{mission.client.phoneNumber}</Text>
          )}
        </View>
      )}

      {mission.provider && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Provider</Text>
          <Text style={styles.personName}>
            {mission.provider.firstName} {mission.provider.lastName}
          </Text>
          {mission.provider.phoneNumber && (
            <Text style={styles.personPhone}>{mission.provider.phoneNumber}</Text>
          )}
          {mission.provider.rating && (
            <Text style={styles.rating}>Rating: {mission.provider.rating.toFixed(1)} ⭐</Text>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: mission.latitude,
            longitude: mission.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: mission.latitude,
              longitude: mission.longitude,
            }}
            title={mission.title}
          />
        </MapView>
      </View>

      <View style={styles.actions}>
        {(isClient || isProvider) && mission.status !== 'COMPLETED' && (
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { missionId: mission.id })}
          >
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </TouchableOpacity>
        )}

        {isProvider && mission.status === 'ACCEPTED' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus('IN_PROGRESS')}
          >
            <Text style={styles.actionButtonText}>Start Mission</Text>
          </TouchableOpacity>
        )}

        {isProvider && mission.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleUpdateStatus('COMPLETED')}
          >
            <Text style={styles.actionButtonText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}

        {isClient && mission.status === 'PENDING' && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  personPhone: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actions: {
    padding: 20,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  completeButton: {
    backgroundColor: '#8BC34A',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MissionDetailsScreen;
