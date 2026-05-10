import * as SMS from 'expo-sms';
import { LocationService } from './locationService';
import { ContactRepository } from '../database/contactRepository';

export const SmsService = {
  async sendSOS(message: string) {
    const contacts = await ContactRepository.getAll();

    if (contacts.length === 0) {
      throw new Error('Nenhum contato salvo');
    }

    const phones = contacts.map(c => c.phone);

    const location = await LocationService.getLocation();
    const finalMessage = `${message}\n${location}`;

    const isAvailable = await SMS.isAvailableAsync();

    if (!isAvailable) {
      throw new Error('SMS não disponível');
    }

    await SMS.sendSMSAsync(phones, finalMessage);
  }
};