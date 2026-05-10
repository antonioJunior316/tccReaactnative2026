import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Apresentacao() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apresentação do App</Text>

      <View style={{ height: 20 }} />

      <Card text="Este aplicativo envia um alerta de socorro via SMS com sua localização em tempo real." />

      <Card
        title="Como funciona"
        text={
          "1. Cadastre contatos\n" +
          "2. Configure mensagem\n" +
          "3. Toque no botão SOS"
        }
      />

      <View style={{ height: 20 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/casa')}
      >
        <Text style={styles.buttonText}>Configurar contatos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Card({ text, title }: { text: string; title?: string }) {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});