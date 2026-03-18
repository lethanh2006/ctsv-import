import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ETrangThaiQuay } from '@/services/Minigame/LichSuQuay/constant';
import { MLichSuQuay } from '@/services/Minigame/LichSuQuay/typing';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const VoucherPage = () => {
	const { page, limit } = useModel('minigame.lichsuquay');

	const columns: IColumn<MLichSuQuay.IRecord>[] = [
		{
			title: 'Thời gian quay',
			dataIndex: 'ngayQuay',
			filterType: 'datetime',
			align: 'center',
			sortable: true,
			width: 200,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY')
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'ma',
			width: 200,
            filterType: 'string',
		},
		{
			title: 'Họ tên sinh viên',
			dataIndex: 'hoTen',
			width: 200,
            filterType: 'string',
		},
		{
			title: 'Giải thưởng nhận được',
			dataIndex: 'trangThaiQuay',
			align: 'center',
			fixed: 'right',
			width: 150,
			filterType: 'select',
            filterData: [
                { label: 'Trúng thưởng', value: ETrangThaiQuay.TRUNG_THUONG },
                { label: 'Không trúng thưởng', value: ETrangThaiQuay.CHUC_MAY_MAN_LAN_SAU },
            ],
            render: (text, record: MLichSuQuay.IRecord) => <><Tag color={text === ETrangThaiQuay.TRUNG_THUONG ? 'green' : ''}>
				{text === ETrangThaiQuay.TRUNG_THUONG ? (record.voucherNguoiDung?.[0]?.cauHinhVoucher?.ten || 'Trúng thưởng') : 'Không trúng thưởng'}
			</Tag></>,
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='minigame.lichsuquay'
			title='Lich sử quay'
			buttons={{ import: false, export: true, create: false }}
		/>
	);
};

export default VoucherPage;
