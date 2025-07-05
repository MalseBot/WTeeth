import UpdateAppointmentForm from '@/components/UpdateAppointmentForm';
import { getAppointment } from '@/lib/fetching';
import React from 'react'



interface ParamsProps {
	params: { id: string };
}
export default async function page({params}:ParamsProps) {
  const data = await getAppointment(params.id);
  
  
    if (!data) {
      return <div>Appointment not found</div>;
    }
  return (
		<div className='w-full my-20 flex justify-center h-screen items-center'>
			<UpdateAppointmentForm appointment={data} />
		</div>
	);
}
