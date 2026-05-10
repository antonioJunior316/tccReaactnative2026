import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { ContactService } from '../services/contactService';
import { ContactRepository } from '../database/contactRepository';

export default function Casa() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [savedPhones, setSavedPhones] = useState<string[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const list = await ContactService.getContacts();
    const saved = await ContactRepository.getAll();

    setContacts(list);
    setSavedPhones(saved.map(c => c.phone));
  };

  const toggle = async (c: any) => {
    const exists = savedPhones.includes(c.phone);

    if (exists) {
      await ContactRepository.delete(c.phone);
    } else {
      await ContactRepository.insert(c);
    }

    load();
  };

  const isSaved = (phone: string) => savedPhones.includes(phone);

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.phone}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => {
        const saved = isSaved(item.phone);

        return (
          <TouchableOpacity onPress={() => toggle(item)}>
            <View style={[styles.card, saved && styles.cardSaved]}>
              
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </View>

              <View style={styles.badge}>
                <Text style={{ color: saved ? 'green' : 'gray' }}>
                  {saved ? '✔ Salvo' : '+ Salvar'}
                </Text>
              </View>

            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 2,
  },

  cardSaved: {
    borderLeftWidth: 5,
    borderLeftColor: 'green',
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  phone: {
    color: '#555',
    marginTop: 3,
  },

  badge: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});