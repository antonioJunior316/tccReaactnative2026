import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ContactRepository } from '../database/contactRepository';
import { ContactModel } from '../models/Contact';
import { LocationService } from '../services/locationService';
import { SmsService } from '../services/smsService';

export default function Home() {
  const [message, setMessage] = useState('Preciso de ajuda! Minha localização:');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<ContactModel[]>([]);
  const router = useRouter();

  useEffect(() => {
    LocationService.preload();
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const savedContacts = await ContactRepository.getAll();
      setContacts(savedContacts.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) {
      console.error('Erro ao carregar contatos:', e);
    }
  };

  const send = async () => {
    if (contacts.length === 0) {
      alert('❌ Você não possui contatos salvos!\n\nVá para Contatos e selecione pelo menos um.');
      return;
    }

    setLoading(true);
    try {
      const result = await SmsService.sendSOS(message);
      alert(`✅ ${result.message}`);
    } catch (e: any) {
      alert(`❌ ${e.message}`);
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

        {/* Card da Mensagem */}
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

        {/* Card dos Contatos */}
        <View style={styles.contactsCard}>
          <View style={styles.contactsHeader}>
            <Text style={styles.contactsTitle}>📞 Contatos que receberão SMS</Text>
            <View style={styles.contactsBadge}>
              <Text style={styles.contactsBadgeText}>{contacts.length}</Text>
            </View>
          </View>

          {contacts.length > 0 ? (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.phone}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.contactItem}>
                  <View>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactPhone}>{item.phone}</Text>
                  </View>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noContacts}>Nenhum contato salvo</Text>
          )}
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
            <Text style={styles.sosText}>ENVIAR SOS AGORA</Text>
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

  contactsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
    maxHeight: 200,
  },

  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  contactsTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },

  contactsBadge: {
    backgroundColor: '#d32f2f',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  contactsBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  contactName: {
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },

  contactPhone: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },

  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },

  noContacts: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
  },
});