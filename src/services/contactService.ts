import * as Contacts from 'expo-contacts';
import { ContactModel } from '../models/Contact';

export const ContactService = {
  async getContacts(): Promise<ContactModel[]> {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    return data
      .map(c => ({
        name: c.name || 'Sem nome',
        phone: c.phoneNumbers?.[0]?.number || '',
      }))
      .filter(c => c.phone !== '');
  }
};