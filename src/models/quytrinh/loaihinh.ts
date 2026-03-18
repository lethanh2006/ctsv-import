import { useState } from 'react';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';

export default () => {
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [record, setRecord] = useState<LoaiHinh.IRecord>();
	return {
		record,
		setRecord,
		visiblePreview,
		setVisiblePreview,
	};
};
