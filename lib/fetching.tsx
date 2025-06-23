/** @format */

import { prisma } from './prisma';

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
    patientId: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    prescription: string;
    payment: number;
    medicine: string;
    operation:string;
    images:string[];
    materials:string;
    // Add other appointment fields as needed
}

export async function getAppointmentsByPatientId(e: string): Promise<Appointment[]> {
    return await prisma.appointment.findMany({
        where: {
            patientId: e,
        },
    });
}
