import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Mission } from '../../types';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const response = await apiService.getUserMissions('client');
      setMissions(response.missions);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadMissions();
  };

  const handleRedButton = () => {
    // Red button for urgent help
    navigation.navigate('CreateMission', { isUrgent: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'ACCEPTED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'COMPLETED':
        return '#8BC34A';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const renderMission = ({ item }: { item: Mission }) => (
    <TouchableOpacity
      style={styles.missionCard}
      onPress={() => navigation.navigate('MissionDetails', { missionId: item.id })}
    >
      <View style={styles.missionHeader}>
        <Text style={styles.missionTitle}>{item.title}</Text>
        {item.isUrgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
      </View>
      <Text style={styles.missionDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.missionFooter}>
        <Text style={styles.missionPrice}>€{item.estimatedPrice.toFixed(2)}</Text>
        <Text style={[styles.missionStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      {item.provider && (
        <Text style={styles.providerText}>
          Provider: {item.provider.firstName} {item.provider.lastName}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.subtitle}>Your Missions</Text>
      </View>

      {/* Red Button for Urgent Help */}
      <TouchableOpacity style={styles.redButton} onPress={handleRedButton}>
        <Text style={styles.redButtonText}>URGENT HELP NEEDED</Text>
        <Text style={styles.redButtonSubtext}>Tap for immediate assistance</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateMission', { isUrgent: false })}
      >
        <Text style={styles.createButtonText}>+ Create New Mission</Text>
      </TouchableOpacity>

      {missions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No missions yet</Text>
          <Text style={styles.emptySubtext}>Create your first mission to get started</Text>
        </View>
      ) : (
        <FlatList
          data={missions}
          renderItem={renderMission}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  redButton: {
    backgroundColor: '#FF3B30',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  redButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  redButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  createButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  missionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  missionStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  providerText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
