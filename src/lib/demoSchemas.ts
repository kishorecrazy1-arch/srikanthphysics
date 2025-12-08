import { z } from 'zod';

/**
 * Zod schema for demo form validation
 */
export const demoFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  grade: z.enum(['10', '11', '12', 'other']).optional().or(z.literal('')),
  board: z.enum(['CBSE', 'ICSE', 'AP', 'IB', 'IGCSE', 'Other']).optional().or(z.literal('')),
  city: z.string().max(100, 'City name is too long').optional().or(z.literal('')),
  country: z.string().max(100, 'Country name is too long').optional().or(z.literal('')),
  agreeToContact: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted',
  }),
});

export type DemoFormData = z.infer<typeof demoFormSchema>;

