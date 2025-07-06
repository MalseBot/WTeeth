
'use server';
import PatientForm from '@/components/PatientForm';
import { getPatient } from '@/lib/fetching';

interface ParamsProps {
	params: Promise<{ id: string }>;
}

export default async function Page(props: ParamsProps) {
    const params = await props.params;
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
