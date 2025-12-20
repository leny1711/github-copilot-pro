import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import apiService from '../../services/api';

const AdminDashboardScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Platform Overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.users?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.users?.clients || 0}</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.users?.providers || 0}</Text>
            <Text style={styles.statLabel}>Providers</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Missions</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.missions?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Missions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#FFA500' }]}>
              {stats?.missions?.pending || 0}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#4CAF50' }]}>
              {stats?.missions?.completed || 0}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue</Text>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueValue}>
            €{stats?.revenue?.totalCommission?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.revenueLabel}>Total Commission Earned</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Management</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Manage Missions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>View Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  revenueCard: {
    backgroundColor: '#4CAF50',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  revenueLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  menuButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;
