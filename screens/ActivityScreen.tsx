import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface WeatherData {
  weatherDescription: string;
  temperature: number;
}

const getActivityRecommendations = (weatherData: WeatherData) => {
  const { weatherDescription, temperature } = weatherData;
  
  // Parse weather description to lowercase for easier comparison
  const weather = weatherDescription.toLowerCase();
  
  // Initialize recommendations
  let indoorActivities: string[] = [];
  let outdoorActivities: string[] = [];
  
  // Base indoor activities (generally available regardless of weather)
  const defaultIndoor = [
    'Kitap okuma veya sesli kitap dinleme',
    'Film veya dizi maratonu',
    'Evde yoga veya meditasyon',
    'Yeni bir yemek tarifi deneme',
    'Puzzle yapma veya kutu oyunları oynama',
    'Ev düzenleme ve dekorasyon',
    'Sanat veya el işi projesi',
    'Çevrimiçi bir kurs veya workshop',
  ];
  
  // Determine activities based on weather conditions and temperature
  if (temperature > 30) {
    // Very hot weather
    outdoorActivities = [
      'Havuz veya plajda yüzme',
      'Sabah veya akşam serinliğinde kısa bir yürüyüş',
      'Gölgeli bir parkta piknik',
      'Su parkı ziyareti',
      'Akşam saatlerinde bisiklet turu',
      'Botla gezinti veya su sporları',
    ];
    
    indoorActivities = [
      'Kliması olan bir müze ziyareti',
      'Alışveriş merkezinde vakit geçirme',
      'Ev sinemasında film keyfi',
      ...defaultIndoor.slice(0, 3),
    ];
  } else if (temperature >= 20 && temperature <= 30) {
    // Warm, pleasant weather
    outdoorActivities = [
      'Doğa yürüyüşü veya trekking',
      'Bisiklet turu',
      'Açık havada kahve/çay keyfi',
      'Şehir turu veya fotoğrafçılık',
      'Botanik bahçesi veya park ziyareti',
      'Açık hava pazarı veya festival',
    ];
    
    indoorActivities = [
      'Müze veya sanat galerisi ziyareti',
      'Kafe veya kitapçıda kitap okuma',
      'Yoga stüdyosunda ders alma',
      ...defaultIndoor.slice(0, 3),
    ];
  } else if (temperature >= 10 && temperature < 20) {
    // Cool weather
    outdoorActivities = [
      'Hafif tempolu yürüyüş',
      'Fotoğraf çekimi turu',
      'Açık hava kafe veya restoranda oturma',
      'Şehir keşfi veya tarihi mekanları ziyaret',
      'Güneşli saatlerde park ziyareti',
    ];
    
    indoorActivities = [
      'Müze gezisi',
      'Sıcak içeceklerin tadını çıkarabileceğiniz bir kafe',
      'Spor salonunda egzersiz',
      'Alışveriş turu',
      ...defaultIndoor.slice(0, 2),
    ];
  } else {
    // Cold weather
    outdoorActivities = [
      'Kalın giyinerek kısa bir yürüyüş',
      'Açık hava kış sporları (sıcaklık uygunsa)',
      'Fotoğrafçılık turu',
    ];
    
    indoorActivities = [
      'Sıcak bir kafede kitap okuma',
      'Müze veya sanat galerisi gezisi',
      'Kapalı spor aktiviteleri',
      'Alışveriş merkezi gezisi',
      'Tiyatro veya sinema',
      ...defaultIndoor.slice(0, 3),
    ];
  }
  
  // Adjust for specific weather conditions
  if (weather.includes('yağmur') || weather.includes('yağış') || weather.includes('yağmurlu')) {
    outdoorActivities = [
      'Şemsiye ile kısa bir yürüyüş',
      'Üstü kapalı dış mekan kafelerinde oturma',
      'Yağmur sonrası oluşan gökkuşağı izleme'
    ];
    
    indoorActivities.unshift('Pencere kenarında yağmur izlerken kitap okuma');
    indoorActivities.unshift('Sıcak bir içecek eşliğinde film izleme');
  }
  
  if (weather.includes('kar') || weather.includes('karlı')) {
    outdoorActivities = [
      'Kar fotoğrafçılığı',
      'Kızak kayma veya kardan adam yapma',
      'Kar yürüyüşü'
    ];
    
    indoorActivities.unshift('Pencereden kar manzarası izlerken sıcak çikolata içme');
  }
  
  if (weather.includes('rüzgar') || weather.includes('fırtına')) {
    outdoorActivities = [
      'Rüzgar sörfü (tecrübeli iseniz)',
      'Uçurtma uçurma (çok şiddetli değilse)',
      'Fırtına fotoğrafçılığı (güvenli bir mesafeden)'
    ];
  }
  
  // Limit to 3 activities each
  const finalIndoor = indoorActivities.slice(0, 3);
  const finalOutdoor = outdoorActivities.slice(0, 3);
  
  return { indoorActivities: finalIndoor, outdoorActivities: finalOutdoor };
};

export default function ActivityScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    weatherDescription: '',
    temperature: 0
  });
  
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigation = useNavigation();
  
  const handleSubmit = () => {
    if (weatherData.weatherDescription && weatherData.temperature !== null) {
      setShowRecommendations(true);
    }
  };
  
  const recommendations = getActivityRecommendations(weatherData);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Hava Durumuna Göre Aktivite Önerileri</Text>
          <Text style={styles.subtitle}>Hava durumu bilgilerini girin ve size uygun günlük aktivite önerilerini alın</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hava Durumu (örn. güneşli, yağmurlu, karlı)</Text>
          <TextInput
            style={styles.input}
            value={weatherData.weatherDescription}
            onChangeText={(text) => setWeatherData({...weatherData, weatherDescription: text})}
            placeholder="Hava durumu açıklaması"
          />
          
          <Text style={styles.inputLabel}>Sıcaklık (°C)</Text>
          <TextInput
            style={styles.input}
            value={weatherData.temperature.toString() === '0' && !showRecommendations ? '' : weatherData.temperature.toString()}
            onChangeText={(text) => {
              const temp = text ? parseFloat(text) : 0;
              setWeatherData({...weatherData, temperature: temp});
            }}
            placeholder="Sıcaklık değeri"
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Önerileri Göster</Text>
          </TouchableOpacity>
        </View>
        
        {showRecommendations && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.weatherSummary}>
              Bugün hava {weatherData.weatherDescription}, sıcaklık {weatherData.temperature}°C.
            </Text>
            
            <View style={styles.weatherImageContainer}>
              <Image 
                source={{ uri: `https://api.a0.dev/assets/image?text=Activities ${weatherData.weatherDescription} ${weatherData.temperature}C&aspect=16:9` }} 
                style={styles.weatherImage} 
              />
            </View>
            
            <Text style={styles.recommendationTitle}>Kapalı Alan Aktiviteleri:</Text>
            {recommendations.indoorActivities.map((activity, index) => (
              <View key={`indoor-${index}`} style={styles.activityItem}>
                <Text style={styles.activityNumber}>{index + 1}.</Text>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
            
            <Text style={styles.recommendationTitle}>Açık Alan Aktiviteleri:</Text>
            {recommendations.outdoorActivities.map((activity, index) => (
              <View key={`outdoor-${index}`} style={styles.activityItem}>
                <Text style={styles.activityNumber}>{index + 1}.</Text>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
            
            <View style={styles.advice}>
              <Text style={styles.adviceTitle}>Öneri:</Text>
              <Text style={styles.adviceText}>Bu aktiviteleri planlarken güncel hava durumu tahminlerini kontrol etmeyi unutmayın ve güvenliğinize dikkat edin.</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.newSearchButton]} 
                onPress={() => setShowRecommendations(false)}
              >
                <Text style={styles.buttonText}>Yeni Arama</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.homeButton]} 
                onPress={() => navigation.navigate('Home' as never)}
              >
                <Text style={styles.buttonText}>Ana Sayfaya Dön</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  recommendationsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherSummary: {
    fontSize: 18,
    color: '#2d3748',
    marginBottom: 20,
    lineHeight: 26,
  },
  weatherImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  weatherImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginTop: 16,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  activityNumber: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3182ce',
  },
  activityText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    lineHeight: 22,
  },
  advice: {
    backgroundColor: '#ebf8ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 16,
    color: '#2c5282',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newSearchButton: {
    backgroundColor: '#4299e1',
    flex: 1,
    marginRight: 8,
  },
  homeButton: {
    backgroundColor: '#63b3ed',
    flex: 1,
    marginLeft: 8,
  },
});