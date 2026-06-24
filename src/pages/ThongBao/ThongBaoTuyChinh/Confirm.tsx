import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { AppModules } from '@/services/base/constant';
import type { NotificationType } from '@/services/ThongBao/constant';
import type { ThongBao } from '@/services/ThongBao/typing';
import { formatDateTime } from '@/utils/formatDate';
import { currentRole } from '@/utils/ip';
import { Button } from 'antd';
import { useIntl, useModel } from 'umi';

const ConfirmThongBaoTuyChinh = (props: { getData: () => void; type: NotificationType }) => {
	const intl = useIntl();
	const { getData, type } = props;
	const {
		formSubmiting,
		recordThongBaoDanhSach,
		guiThongBaoDanhSachModal,
		setVisibleThongBaoDanhSach,
		danhSachThongBaoDanhSach,
	} = useModel('thongbao.thongbao');

	const handleGui = async () => {
		await guiThongBaoDanhSachModal(
			recordThongBaoDanhSach?.file,
			type,
			recordThongBaoDanhSach.title,
			recordThongBaoDanhSach.content,
			AppModules[currentRole].title,
			recordThongBaoDanhSach.vaiTroNguoiNhan,
			'1',
			getData,
		)
			.then(() => setVisibleThongBaoDanhSach(false))
			.catch((err) => console.log(err));
	};

	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'thongbao.confirm.column.title' }),
			dataIndex: 'title',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.confirm.column.receiver' }),
			width: 250,
			render: (val, rec) => `${rec?.userList[0]?.fullname} - ${rec?.userList[0]?.code}`,
		},
		{
			title: intl.formatMessage({ id: 'thongbao.confirm.column.content' }),
			dataIndex: 'content',
			width: 280,
			render: (val) => (
				<ExpandText>
					<div dangerouslySetInnerHTML={{ __html: val ?? '' }} className='notif-content' />
				</ExpandText>
			),
		},
		{
			title: intl.formatMessage({ id: 'thongbao.confirm.column.sendTime' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			render: (val) => formatDateTime(val),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSachThongBaoDanhSach ?? []}
				addStt
				hasTotal
				otherProps={{ pagination: {} }}
			/>

			<div className='form-footer'>
				<Button loading={formSubmiting} onClick={() => handleGui()} type='primary'>
					{intl.formatMessage({ id: 'thongbao.confirm.button.send' })}
				</Button>
				<Button onClick={() => setVisibleThongBaoDanhSach(false)}>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</>
	);
};

export default ConfirmThongBaoTuyChinh;
