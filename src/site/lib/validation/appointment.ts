import { z } from "zod";

// Shared by the appointment + contact forms (client) and /api/appointment (server).
// Name and mobile are required, the rest optional.
export const appointmentSchema = z.object({
  name: z.string({ error: "Please enter your name" }).trim().min(2, "Please enter your name").max(100),
  phone: z
    .string({ error: "Please enter your mobile number" })
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/, "Please enter a valid mobile number"),
  email: z.union([z.literal(""), z.email("Please enter a valid email")]).optional(),
  date: z.union([z.literal(""), z.iso.date("Please pick a valid date")]).optional(),
  treatment: z.string().trim().max(80).optional(),
  message: z.string().trim().max(1000).optional(),
  // Contact page: what the enquiry is about, when to call back, where from.
  topic: z.string().trim().max(80).optional(),
  callTime: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  consent: z.boolean().optional(),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
