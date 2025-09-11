/** @format */

import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
	const locale = useLocale();
	
	return (
		<LocaleSwitcherSelect
			defaultValue={locale}
			items={[
				{
					value: 'en',
					label: "English",
				},
				{
					value: 'ar',
					label: "العربية",
				},
			]}
			label="اللغة"
		/>
	);
}
