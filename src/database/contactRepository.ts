import { db } from './db';
import { ContactModel } from '../models/Contact';

export const ContactRepository = {
  async getAll(): Promise<ContactModel[]> {
    const result = await db.getAllAsync<any>('SELECT * FROM contacts');
    return result;
  },

  async insert(contact: ContactModel) {
    await db.runAsync(
      'INSERT OR REPLACE INTO contacts (name, phone) VALUES (?, ?)',
      [contact.name, contact.phone]
    );
  },

  async delete(phone: string) {
    await db.runAsync('DELETE FROM contacts WHERE phone = ?', [phone]);
  },

  async exists(phone: string): Promise<boolean> {
    const result = await db.getFirstAsync(
      'SELECT * FROM contacts WHERE phone = ?',
      [phone]
    );
    return !!result;
  }
};