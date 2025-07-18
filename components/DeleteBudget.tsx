import { XSquare } from 'lucide-react';
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { deleteBudget } from '@/lib/fetching';
import { Button } from './ui/button';

export default function DeleteBudget({id}: {id: string}) {
  return (
		<Dialog>
			<DialogTrigger>
				<XSquare className='text-destructive hover:scale-105 duration-500'/>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
                        Delete Budget
					</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col items-center justify-center gap-4'>
                    <p className='text-sm text-muted-foreground'>
                        Are you sure you want to delete this budget?
                    </p>
                    <Button
                        variant='destructive'
                        onClick={ () => (deleteBudget(id),window.location.reload()) }
                    >
                        Delete
                    </Button>
                </div>
			</DialogContent>
		</Dialog>
	);
}
