/** @format */
'use server';
import { endOfMonth, startOfMonth } from 'date-fns';
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

export async function getStorageByDateRange(startDate: Date, endDate: Date) {
	return await prisma.storage.findMany({
		where: {
			buyDate: {
				gte: startDate,
				lte: endDate,
			},
		},
		select: {
			price: true,
			buyDate: true,
		},
	});
}

export async function getAppointmentsByDateRange(startDate: Date,endDate:Date) {
	return await prisma.appointment.findMany({
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
		select: {
			payment: true,
			createdAt: true,
		}
	});
}

export async function getBudget() {
	return await prisma.budget.findMany();
}

export async function getBudgetIncome(){
	return await prisma.budget.findMany(
		{where:{
			type : 'income'
		}}
	)
}

export async function getBudgetExpense() {
	return await prisma.budget.findMany({
		where: {
			type: 'expense',
		},
	});
}
export async function calculateBudgetTotal() {
	const budgets = await prisma.budget.findMany({
		where: { type: 'expense' },
		select: { price: true },
	});
	return budgets.reduce((total, budget) => total + budget.price, 0);
}

export async function createBudget(data: any) {
	return await prisma.budget.create({
		data: {
			name: data.name,
			type: data.type,
			price: data.price,
			info: data.info,
			createdAt: new Date(),
		},
	});
}

export async function updateBudget(id: string, data: any) {
	return await prisma.budget.update({
		where: { id },
		data: {
			name: data.name,
			type: data.type,
			price: data.price,
			info: data.info,
			updatedAt: new Date(),
		},
	});
}

export async function deleteBudget(id: string) {
	return await prisma.budget.delete({
		where: { id },
	});
}

export async function updateIncome(){
	const now = new Date();
	const firstDayOfThisMonth = startOfMonth(now);
	const lastDayOfThisMonth = endOfMonth(now);
	console.log(`Fetching data from ${firstDayOfThisMonth} to ${lastDayOfThisMonth}`);
	
		const appointments = await getAppointmentsByDateRange(
			new Date(firstDayOfThisMonth),
			new Date(lastDayOfThisMonth)
		);
		const storage = await getStorageByDateRange(new Date(firstDayOfThisMonth),new Date(lastDayOfThisMonth));
	
		const sumAppointments = appointments.reduce((acc, appointment) => {
			return acc + appointment.payment;
		}, 0);
		const sumStorage = storage.reduce((acc, item) => {
			return acc + item.price;
		}, 0);

		return await prisma.budget.update({
			where: { name: 'Appointments' },
			data: {
				type: 'income',
				price: sumAppointments ,
				info: `Total income from appointments for the month.`,
				createdAt: new Date(),
			},
		}),
		await prisma.budget.update({
			where: { name: 'Storage' },
			data: {
				type: 'expense',
				price: sumStorage,
				info: `Total income from storage for the month.`,
				createdAt: new Date(),
			},
		});
}

export async function getTotalExpense() {
	

	const budgets = await prisma.budget.findMany({
		where: { type: 'expense' },
		select: { price: true },
	});
	return budgets.reduce((total, budget) => total + budget.price, 0);
}

export async function getAllbudget(){
	const now = new Date();
	const firstDayOfThisMonth = startOfMonth(now);
	const lastDayOfThisMonth = endOfMonth(now);
	const expense = await prisma.budget.findMany({
		where: {
			createdAt: {
				gte: firstDayOfThisMonth,
				lte: lastDayOfThisMonth,
			},
			type: 'expense',
		},
		select: { price: true, createdAt: true, type: true },
	});
	const income = await prisma.appointment.findMany({
		where: {
			date: {
				gte: firstDayOfThisMonth,
				lte: lastDayOfThisMonth,
			},
		},
		select: { payment: true, createdAt: true },
	});
	// Add `type: 'income'` to each income item
	const allTransactions = [
		...expense,
		...income.map((item) => ({
			...item,
			type: 'income' as const,
			price: item.payment,
		})),
	];

	return allTransactions;
}

export async function getTotalBudget() {
	const income = await prisma.budget.findMany({
		where: { type: 'income' },
		select: { price: true },
	});
	const expense = await prisma.budget.findMany({
		where: { type: 'expense' },
		select: { price: true },
	});
	const totalBudget = income.reduce((total, item) => total + item.price, 0) -
		expense.reduce((total, item) => total + item.price, 0);
	return totalBudget
}