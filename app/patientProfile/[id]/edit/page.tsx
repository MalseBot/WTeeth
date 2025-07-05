
'use server';
import PatientForm from '@/components/PatientForm';
import { getPatient } from '@/lib/fetching';

interface ParamsProps {
	params: { id: string };
}

export default async function Page({ params }: ParamsProps) {
	const data = await getPatient(params.id);

	if (!data) {
		return <div>Patient not found</div>;
	}

	return (
		<div className='w-full my-20 flex justify-center h-screen items-center'>
			<PatientForm patient={data} />
		</div>
	);
}
