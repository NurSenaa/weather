import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

interface WeatherData {
  weatherDescription: string;
  temperature: number;
  humidity: number;
}

const getClothingRecommendations = (weatherData: WeatherData) => {
  const { weatherDescription, temperature, humidity } = weatherData;
  
  // Default recommendations
  let clothingRecommendations = {
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessories: [],
    advice: ''
  };
  
  // Parse weather description to lowercase for easier comparison
  const weather = weatherDescription.toLowerCase();
  
  // Determine clothing based on temperature
  if (temperature > 30) {
    clothingRecommendations.topWear = 'Hafif tişört';
    clothingRecommendations.bottomWear = 'Şort veya ince etek';
    clothingRecommendations.footwear = 'Sandalet veya açık ayakkabı';
    clothingRecommendations.accessories = ['Şapka', 'Güneş gözlüğü', 'Güneş kremi'];
    clothingRecommendations.advice = 'Çok sıcak bir gün. Hafif ve açık renkli kıyafetler tercih edin.';
  } else if (temperature >= 20 && temperature <= 30) {
    clothingRecommendations.topWear = 'Tişört veya hafif gömlek';
    clothingRecommendations.bottomWear = 'Hafif pantolon veya kapri';
    clothingRecommendations.footwear = 'Spor ayakkabı veya hafif ayakkabı';
    clothingRecommendations.accessories = ['Güneş gözlüğü'];
    clothingRecommendations.advice = 'Ilıman bir hava. Rahat kıyafetler tercih edin.';
  } else if (temperature >= 10 && temperature < 20) {
    clothingRecommendations.topWear = 'Uzun kollu gömlek veya kazak';
    clothingRecommendations.bottomWear = 'Kot pantolon veya kalın kumaş pantolon';
    clothingRecommendations.footwear = 'Kapalı ayakkabı';
    clothingRecommendations.accessories = [];
    clothingRecommendations.advice = 'Serin bir gün. Katmanlı giyinin.';
  } else {
    clothingRecommendations.topWear = 'Kalın kazak ve mont';
    clothingRecommendations.bottomWear = 'Kalın pantolon';
    clothingRecommendations.footwear = 'Bot veya kalın ayakkabı';
    clothingRecommendations.accessories = ['Bere', 'Eldiven', 'Atkı'];
    clothingRecommendations.advice = 'Soğuk bir gün. Kalın giyinin ve katmanlar halinde giyinin.';
  }
  
  // Adjust for weather conditions
  if (weather.includes('yağmur') || weather.includes('yağış')) {
    clothingRecommendations.accessories.push('Şemsiye');
    clothingRecommendations.footwear = 'Su geçirmez ayakkabılar';
    clothingRecommendations.advice += ' Yanınıza şemsiye almayı unutmayın.';
  }
  
  if (weather.includes('kar')) {
    clothingRecommendations.topWear = 'Kalın mont';
    clothingRecommendations.footwear = 'Su geçirmez botlar';
    clothingRecommendations.accessories.push('Kar gözlüğü');
    clothingRecommendations.advice += ' Suya dayanıklı ayakkabılar ve mont giymeyi unutmayın.';
  }
  
  if (weather.includes('rüzgar') || weather.includes('fırtına')) {
    clothingRecommendations.topWear += ' ve rüzgarlık';
    clothingRecommendations.advice += ' Rüzgara karşı korunaklı kıyafetler giyin.';
  }
  
  if (humidity > 80) {
    clothingRecommendations.advice += ' Yüksek nem oranı nedeniyle nefes alabilen kumaşlar tercih edin.';
  }
  
  return clothingRecommendations;
};

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    weatherDescription: '',
    temperature: 0,
    humidity: 0
  });
  
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigation = useNavigation();
  
  const handleSubmit = () => {
    if (weatherData.weatherDescription && weatherData.temperature !== null && weatherData.humidity !== null) {
      setShowRecommendations(true);
    }
  };
  
  const recommendations = getClothingRecommendations(weatherData);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Hava Durumuna Göre Kıyafet Önerileri</Text>
          <Text style={styles.subtitle}>Hava durumu bilgilerini girin ve size uygun kıyafet önerilerini alın</Text>
          
          <TouchableOpacity 
            style={styles.activityButton} 
            onPress={() => navigation.navigate('Activity' as never)}
          >
            <Text style={styles.activityButtonText}>Aktivite Önerileri İçin Tıklayın</Text>
          </TouchableOpacity>
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
          
          <Text style={styles.inputLabel}>Nem Oranı (%)</Text>
          <TextInput
            style={styles.input}
            value={weatherData.humidity.toString() === '0' && !showRecommendations ? '' : weatherData.humidity.toString()}
            onChangeText={(text) => {
              const humidity = text ? parseFloat(text) : 0;
              setWeatherData({...weatherData, humidity: humidity});
            }}
            placeholder="Nem oranı"
            keyboardType="numeric"
          />
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Önerileri Göster</Text>
          </TouchableOpacity>
        </View>
        
        {showRecommendations && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.weatherSummary}>
              Bugün hava durumu {weatherData.weatherDescription}, sıcaklık {weatherData.temperature}°C, nem oranı {weatherData.humidity}%.
            </Text>
            
            <View style={styles.weatherImageContainer}>
              <Image 
                source={{ uri: `https://api.a0.dev/assets/image?text=Weather ${weatherData.weatherDescription} ${weatherData.temperature}C&aspect=1:1` }} 
                style={styles.weatherImage} 
              />
            </View>
            
            <Text style={styles.recommendationTitle}>Kıyafet Önerileri:</Text>
            
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>Üst Giyim:</Text>
              <Text style={styles.recommendationText}>{recommendations.topWear}</Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>Alt Giyim:</Text>
              <Text style={styles.recommendationText}>{recommendations.bottomWear}</Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationLabel}>Ayakkabı:</Text>
              <Text style={styles.recommendationText}>{recommendations.footwear}</Text>
            </View>
            
            {recommendations.accessories.length > 0 && (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Aksesuarlar:</Text>
                <Text style={styles.recommendationText}>{recommendations.accessories.join(', ')}</Text>
              </View>
            )}
            
            <View style={styles.advice}>
              <Text style={styles.adviceTitle}>Tavsiye:</Text>
              <Text style={styles.adviceText}>{recommendations.advice}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.newSearchButton]} 
              onPress={() => setShowRecommendations(false)}
            >
              <Text style={styles.buttonText}>Yeni Arama</Text>
            </TouchableOpacity>
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
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  recommendationLabel: {
    width: 100,
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
  },
  advice: {
    backgroundColor: '#ebf8ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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
  newSearchButton: {
    backgroundColor: '#4299e1',
  },
  activityButton: {
    backgroundColor: '#805ad5', // Different color to distinguish from the main button
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  activityButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});