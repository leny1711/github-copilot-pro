import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Mission } from '../../types';

const ProviderHomeScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [myMissions, setMyMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvailable, setShowAvailable] = useState(true);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);

  useEffect(() => {
    loadMissions();
  }, [showAvailable]);

  const loadMissions = async () => {
    try {
      if (showAvailable) {
        const response = await apiService.getMissions({ status: 'PENDING' });
        setMissions(response.missions);
      } else {
        const response = await apiService.getUserMissions('provider');
        setMyMissions(response.missions);
      }
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !isAvailable;
      await apiService.updateProfile({ isAvailable: newAvailability });
      setIsAvailable(newAvailability);
      if (user) {
        updateUser({ ...user, isAvailable: newAvailability });
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleAcceptMission = async (missionId: string) => {
    try {
      await apiService.acceptMission(missionId);
      loadMissions();
    } catch (error: any) {
      console.error('Error accepting mission:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'COMPLETED':
        return '#8BC34A';
      default:
        return '#666';
    }
  };

  const renderMission = ({ item }: { item: Mission }) => (
    <View style={styles.missionCard}>
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
      <Text style={styles.categoryText}>{item.category}</Text>
      <Text style={styles.addressText}>{item.address}</Text>
      <View style={styles.missionFooter}>
        <Text style={styles.missionPrice}>€{item.estimatedPrice.toFixed(2)}</Text>
        {showAvailable ? (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptMission(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('MissionDetails', { missionId: item.id })}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
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
        <View>
          <Text style={styles.welcomeText}>Welcome, {user?.firstName}!</Text>
          <Text style={styles.statsText}>
            Total Jobs: {user?.totalJobs || 0} | Rating: {user?.rating?.toFixed(1) || 'N/A'}
          </Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>Available</Text>
          <Switch
            value={isAvailable}
            onValueChange={toggleAvailability}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, showAvailable && styles.activeTab]}
          onPress={() => {
            setShowAvailable(true);
            setLoading(true);
          }}
        >
          <Text style={[styles.tabText, showAvailable && styles.activeTabText]}>
            Available Missions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !showAvailable && styles.activeTab]}
          onPress={() => {
            setShowAvailable(false);
            setLoading(true);
          }}
        >
          <Text style={[styles.tabText, !showAvailable && styles.activeTabText]}>
            My Missions
          </Text>
        </TouchableOpacity>
      </View>

      {(showAvailable ? missions : myMissions).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {showAvailable ? 'No available missions' : 'No missions yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={showAvailable ? missions : myMissions}
          renderItem={renderMission}
          keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  availabilityContainer: {
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
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
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#999',
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
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProviderHomeScreen;
