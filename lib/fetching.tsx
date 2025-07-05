/** @format */
'use server';
import EditPatientForm from '@/components/PatientForm';
import { prisma } from './prisma';
import { date } from 'zod';

interface Patient {
	name: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	age: number;
	address: string;
	bloodType: string;
	phone: string;
	gender: string;
	note: string;
	// Add other patient fields as needed
}

export async function getPatient(e: string): Promise<Patient | null> {
	const patient = await prisma.patient.findUnique({
		where: {
			id: e,
		},
	});
	return patient;
}

interface Appointment {
	id: string;
	date: Date;
	patientId: string;
	createdAt: Date;
	updatedAt: Date;
	status: string;
	payment: number;
	prescription: string;
	operation: string;
	materials: string;
	medicine: string;
	images: any[];
	// Add other appointment fields as needed
}

export async function getAppointmentsByPatientId(
	e: string
): Promise<Appointment[]> {
	const appointments = await prisma.appointment.findMany({
		where: {
			patientId: e,
		},
		include: {
			media: true, // include related media
		},
	});
	return appointments.map((a) => ({
		...a,
		images: a.media, // map media to images
	}));
}

export async function getAppointment(e: string): Promise<Appointment | null> {
	const appointment = await prisma.appointment.findUnique({
		where: {
			id: e,
		},
		include: {
			media: true, // include related media
		},
	});
	return appointment
		? {
				...appointment,
				images: appointment.media, // map media to images
		  }
		: null;
}

export async function getUpdatePatient(id: string, data: any) {
	await prisma.patient.update({
		where: { id },
		data,
	});
	return {
		name: data.name,
		id: data.id,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
		age: data.age,
		address: data.address,
		bloodType: data.bloodType,
		phone: data.phone,
		gender: data.gender,
		note: data.note,
	};
}

export async function getCreatePatient( data: any) {
	await prisma.patient.create({
		data,
	});
	return {
		name: data.name,
		id: data.id,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
		age: data.age,
		address: data.address,
		bloodType: data.bloodType,
		phone: data.phone,
		gender: data.gender,
		note: data.note,
	};
}

export async function createAppointment(data: any) {
	const appointment = await prisma.appointment.create({
		data: {
			patientId: data.patientId,
			date: new Date(data.date),
			status: data.status || 'Scheduled',
			prescription: data.prescription || '',
			medicine: data.medicine || '',
			operation: data.operation || '',
			materials: data.materials || '',
			payment: data.payment,
		},
	});
	return appointment;
}

interface UpdateAppointment {
	id: string;
	date: Date;
	patientId: string;
	updatedAt: Date;
	status: string;
	payment: number;
	prescription: string;
	operation: string;
	materials: string;
	medicine: string;
	// Add other appointment fields as needed
}

export async function updateAppointment(data: UpdateAppointment) {
	const appointment = await prisma.appointment.update({
		where:{id:data.id},
		data: {
			patientId: data.patientId,
			status: data.status || 'Scheduled',
			prescription: data.prescription || '',
			medicine: data.medicine || '',
			operation: data.operation || '',
			materials: data.materials || '',
			payment: data.payment,
			updatedAt:Date.now().toLocaleString(),
			id:data.id
		},
	});
	return appointment;
}

export async function getAllPatients() {
	return prisma.patient.findMany();
}