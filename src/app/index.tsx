import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SmsService } from '../services/smsService';
import { LocationService } from '../services/locationService';
import { useRouter } from 'expo-router';

export default function Home() {
  const [message, setMessage] = useState('Preciso de ajuda! Minha localização:');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    LocationService.preload();
  }, []);

  const send = async () => {
    setLoading(true);
    try {
      await SmsService.sendSOS(message);
    } catch (e: any) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>

        {/* Header */}
        <Text style={styles.title}>🚨 SOS</Text>
        <Text style={styles.subtitle}>
          Envie sua localização para contatos de emergência
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Mensagem</Text>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            multiline
            placeholder="Digite sua mensagem de emergência..."
          />
        </View>

        {/* Botão principal */}
        <TouchableOpacity
          style={[styles.sosButton, loading && { opacity: 0.7 }]}
          onPress={send}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sosText}>ENVIAR SOS</Text>
          )}
        </TouchableOpacity>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/casa')}
          >
            <Text style={styles.secondaryText}>Contatos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/apresentacao')}
          >
            <Text style={styles.secondaryText}>Sobre</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 25,
    elevation: 3,
  },

  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },

  input: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  sosButton: {
    backgroundColor: '#d32f2f',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
  },

  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },

  secondaryText: {
    fontWeight: 'bold',
    color: '#333',
  },
});