import { z } from 'zod';

/**
 * Authentication validation schemas
 * Implements proper input validation to prevent injection attacks
 */
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
});

export const signupSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" }),
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  role: z.enum(['agent', 'traveler', 'vendor'], {
    errorMap: () => ({ message: "Invalid role selected" })
  })
});

/**
 * Negotiation message validation schema
 * Protects against XSS and ensures data integrity
 */
export const negotiationMessageSchema = z.object({
  message: z.string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
  price_offer: z.number()
    .positive({ message: "Price must be a positive number" })
    .max(1000000, { message: "Price must be less than 1,000,000" })
    .optional()
});

/**
 * Vendor response validation schema
 */
export const vendorResponseSchema = z.object({
  newRate: z.number()
    .positive({ message: "Rate must be a positive number" })
    .max(1000000, { message: "Rate must be less than 1,000,000" }),
  message: z.string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
  terms: z.string()
    .trim()
    .max(5000, { message: "Terms must be less than 5000 characters" })
    .optional(),
  includedServices: z.array(z.string())
    .max(20, { message: "Maximum 20 services allowed" })
    .optional(),
  responseTime: z.string().optional(),
  providerId: z.string().uuid({ message: "Invalid provider ID" }).optional()
});

/**
 * Itinerary creation validation schema
 */
export const itinerarySchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Itinerary name is required" })
    .max(200, { message: "Name must be less than 200 characters" }),
  destination: z.string()
    .trim()
    .min(1, { message: "Destination is required" })
    .max(200, { message: "Destination must be less than 200 characters" }),
  start_date: z.string()
    .min(1, { message: "Start date is required" }),
  end_date: z.string()
    .min(1, { message: "End date is required" }),
  number_of_travelers: z.number()
    .int({ message: "Number of travelers must be a whole number" })
    .positive({ message: "Must have at least 1 traveler" })
    .max(100, { message: "Maximum 100 travelers allowed" }),
  preferences: z.string()
    .max(5000, { message: "Preferences must be less than 5000 characters" })
    .optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type NegotiationMessageInput = z.infer<typeof negotiationMessageSchema>;
export type VendorResponseInput = z.infer<typeof vendorResponseSchema>;
export type ItineraryInput = z.infer<typeof itinerarySchema>;
