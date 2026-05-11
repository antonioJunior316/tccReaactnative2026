import * as SMS from 'expo-sms';
import { ContactRepository } from '../database/contactRepository';
import { LocationService } from './locationService';

export const SmsService = {
  async sendSOS(message: string) {
    const contacts = await ContactRepository.getAll();

    if (contacts.length === 0) {
      throw new Error('Nenhum contato salvo');
    }

    const location = await LocationService.getLocation();
    const finalMessage = `${message}\n${location}`;

    // Extrair apenas os números de telefone
    const phoneNumbers = contacts.map(c => c.phone);

    // Enviar SMS para todos os contatos
    try {
      const { result } = await SMS.sendSMSAsync(
        phoneNumbers,
        finalMessage
      );

      if (result === 'sent') {
        return {
          success: true,
          message: `Mensagem SOS enviada para ${contacts.length} contato(s)`,
          contactsCount: contacts.length,
        };
      } else if (result === 'cancelled') {
        throw new Error('Envio de SMS cancelado pelo usuário');
      } else {
        throw new Error('Falha ao enviar SMS');
      }
    } catch (error: any) {
      throw new Error(`Erro ao enviar SMS: ${error.message}`);
    }
  }
};