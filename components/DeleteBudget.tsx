import { XSquare } from 'lucide-react';
import React, { use } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { deleteBudget } from '@/lib/fetching';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

export default function DeleteBudget({id}: {id: string}) {
	const t = useTranslations('deleteBudget')
  return (
		<Dialog>
			<DialogTrigger>
				<XSquare className='text-destructive hover:scale-105 duration-500'/>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
                        {t('title')}
					</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col items-center justify-center gap-4'>
                    <p className='text-sm text-muted-foreground'>
                        {t('sure')}
                    </p>
                    <Button
                        variant='destructive'
                        onClick={ () => (deleteBudget(id),window.location.reload()) }
                    >
                        {t('title')}
                    </Button>
                </div>
			</DialogContent>
		</Dialog>
	);
}
