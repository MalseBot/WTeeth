/** @format */
'use server';
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
	date: Date;
	patientId: string;
	createdAt: Date;
	updatedAt: Date;
	status: string;
	payment: number;
	prescription: string;
	operation: string;
	materials: any[];
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
			media: true,
			materials: true, // include related media
		},
	});
	return appointments.map((a) => ({
		...a,
		images: a.media, // map media to images
		materials: a.materials,
	}));
}

export async function getAppointment(e: string): Promise<Appointment | null> {
	const appointment = await prisma.appointment.findUnique({
		where: {
			id: e,
		},
		include: {
			media: true,
			materials: true, // include related media
		},
	});
	return appointment
		? {
				...appointment,
				images: appointment.media,
				materials: appointment.materials, // map media to images
		  }
		: null;
}

export async function getUpdatePatient(id: string, data: any) {
	return await prisma.patient.update({
		where: { id },
		data: {
			name: data.name,
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: new Date(),
			age: data.age,
			address: data.address,
			bloodType: data.bloodType,
			phone: data.phone,
			gender: data.gender,
			note: data.note,
		},
	});
}

export async function getCreatePatient(data: any) {
	return await prisma.patient.create({
		data: {
			name: data.name,
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: new Date(),
			age: data.age,
			address: data.address,
			bloodType: data.bloodType,
			phone: data.phone,
			gender: data.gender,
			note: data.note,
		},
	});
}

export async function getCreateAppointment(data: any) {
	return await prisma.appointment.create({
		data: {
			patientId: data.patientId,
			date: new Date(data.date),
			status: data.status || 'Scheduled',
			prescription: data.prescription,
			medicine: data.medicine || '',
			operation: data.operation || '',
			payment: data.payment,
		},
	});
}

export async function getUpdateAppointment(data: any) {
	return await prisma.appointment.update({
		where: { id: data.id },
		data: {
			patientId: data.patientId,
			status: data.status,
			prescription: data.prescription,
			medicine: data.medicine,
			operation: data.operation,
			payment: data.payment,
			updatedAt: new Date(),
			id: data.id,
		},
	});
}

export async function getAllPatients() {
	return await prisma.patient.findMany();
}

export async function getStorage() {
	return await prisma.storage.findMany();
}
export async function getStorageById(id: string) {
	return await prisma.storage.findUnique({
		where: { id },
	});
}
export async function updateStorageItem(id: string, data: any) {
	return await prisma.materials.updateMany({
		where: { name: data.name },
		data: {
			type: data.type,
			name: data.name,
		}
	}),
	await prisma.storage.update({
		where: { id },
		data: {
			name: data.name,
			type: data.type,
			quantity: data.quantity,
			buyDate: new Date(data.buyDate),
			price: data.price,
			seller: data.seller,
		},
	});
}

export async function createStorageItem(data: any) {
	return await prisma.storage.create({
		data: {
			name: data.name,
			type: data.type,
			quantity: data.quantity,
			buyDate: new Date(),
			price: data.price,
			seller: data.seller,
			shortageLimit: data.shortageLimit, 
		},
	});
}

export async function getStorageNamesAndTypes() {
	const items = await prisma.storage.findMany({
		select: { name: true, type: true },
	});
	return items;
}

export async function getMaterialsByAppointment(appointmentId: string) {
	return await prisma.materials.findMany({
		where: { appointmentId },
	});
}

export async function updateMaterial(material: any) {
	
	await StorageCurrentQuantity(material);
	return await prisma.materials.update({
		where: { id: material.id },
		data: {
			quantity: material.quantity,
			createdAt: new Date(),
			// Add other fields if needed
		},
	});
}

export async function addMaterial(material: any) {
		await StorageCurrentQuantity(material);
	return await prisma.materials.create({
		data: {
			name: material.name,
			type: material.type,
			quantity: material.quantity,
			appointmentId: material.appointmentId,
		},
	});
}

// do math to calculate current quantity in storage
const StorageCurrentQuantity = async (e: any) => {
	const storageItem = await prisma.storage.findUniqueOrThrow({
		where: { name: e.name },
		select: { name: true, quantity: true },
	});

	// If e.id is not provided, this is a new material
	if (!e.id) {
		const currentQuantity = storageItem.quantity - e.quantity;
		const updateStorage = await prisma.storage.update({
			where: { name: e.name },
			data: {
				quantity: currentQuantity,
			},
		});
		return updateStorage;
	}

	// If updating an existing material
	const oldMaterial = await prisma.materials.findUniqueOrThrow({
		where: { id: e.id },
		select: { name: true, quantity: true, createdAt: true },
	});

	if (oldMaterial?.quantity !== e.quantity) {
		const diff = e.quantity - oldMaterial.quantity;
		const currentQuantity = storageItem.quantity - diff;
		const updateStorage = await prisma.storage.update({
			where: { name: e.name },
			data: {
				quantity: currentQuantity,
			},
		});
		return updateStorage;
	}
};