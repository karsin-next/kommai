import { supabaseAdmin } from '@/lib/supabase';
import { Business } from '@/types/business';

export class ConfigService {
  /**
   * Loads a business by its WhatsApp API number.
   */
  static async getBusinessByPhone(whatsappPhone: string): Promise<Business | null> {
    const { data } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('whatsapp_phone', whatsappPhone)
      .single();
    
    return data;
  }

  /**
   * Loads a business by ID.
   */
  static async getBusinessById(id: string): Promise<Business | null> {
    const { data } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
  }

  /**
   * Updates business configuration.
   */
  static async updateConfig(id: string, config: any): Promise<void> {
    const { error } = await supabaseAdmin
      .from('businesses')
      .update({ config })
      .eq('id', id);
    
    if (error) throw error;
  }
}
