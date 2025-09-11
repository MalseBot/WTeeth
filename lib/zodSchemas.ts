import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const editPatientSchema = z.object({
	name: z.string().min(2, 'Name is required'),
	age: z.coerce.number().min(2, 'Age must be a positive number'),
	address: z.string().min(2, 'Address is required'),
	bloodType: z.string(),
	phone: z.string().min(11, 'Phone is required'),
	gender: z.enum(['Male', 'Female'], { required_error: 'Gender is required' }),
	note: z.string().optional(),
});

export const appointmentSchema = z.object({
	patientId: z.string().min(1, 'Patient is required'),
	date: z.date(),
	status: z.string().optional(),
	prescription: z.string().min(3,'what the patient need'),
	medicine: z.string().optional(),
	operation: z.string().optional(),
	payment: z.coerce.number().min(0, 'Payment must be a positive number'),
});