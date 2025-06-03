import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

interface WeatherData {
  name: string;
  weather: Array<{
    description: string;
  }>;
  main: {
    temp: number;
  };
}

export default function HomeScreen() {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!cityName.trim()) {
      toast.error('Lütfen bir şehir adı girin');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=f0161cce0b6635d4279d9d7d52ebe35d&units=metric&lang=tr`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Şehir bulunamadı');
        }
        throw new Error('Hava durumu bilgisi alınamadı');
      }
      
      const data = await response.json();
      setWeatherData(data);
      toast.success('Hava durumu başarıyla getirildi!');
    } catch (error) {
      console.error('Hata:', error);
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearWeather = () => {
    setWeatherData(null);
    setCityName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="partly-sunny" size={48} color="#4A90E2" />
            <Text style={styles.title}>Hava Durumu</Text>
            <Text style={styles.subtitle}>Şehrinizin hava durumunu öğrenin</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şehir adını girin (örn: İstanbul)"
                value={cityName}
                onChangeText={setCityName}
                placeholderTextColor="#999"
                autoCapitalize="words"
                returnKeyType="search"
                onSubmitEditing={fetchWeather}
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={fetchWeather}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Hava Durumunu Getir</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Weather Result */}
          {weatherData && (
            <View style={styles.weatherCard}>
              <View style={styles.weatherHeader}>
                <Ionicons name="location" size={24} color="#4A90E2" />
                <Text style={styles.cityName}>{weatherData.name}</Text>
              </View>
              
              <View style={styles.weatherInfo}>
                <View style={styles.tempContainer}>
                  <Text style={styles.temperature}>
                    {Math.round(weatherData.main.temp)}°C
                  </Text>
                  <Ionicons name="thermometer" size={32} color="#FF6B6B" />
                </View>
                
                <Text style={styles.description}>
                  {weatherData.weather[0].description.charAt(0).toUpperCase() + 
                   weatherData.weather[0].description.slice(1)}
                </Text>
              </View>

              <TouchableOpacity style={styles.clearButton} onPress={clearWeather}>
                <Ionicons name="refresh" size={16} color="#666" />
                <Text style={styles.clearButtonText}>Yeni Arama</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Hava durumu getiriliyor...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 8,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 8,
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D3748',
    marginRight: 12,
  },
  description: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 12,
  },
});