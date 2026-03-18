import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { loaiPhanCongGiangDay, type ELoaiPhanCongGiangDay } from '@/services/DaoTaoV2/HocKy/constant';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import FormNsLopHocPhan from './components/Form';

const NhanSuLopHocPhan = (props: { isView?: boolean }) => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel } = useModel('daotaov2.hocky.nhansulophocphan');
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const { isView } = props;

	const getData = () => recLopHP?._id && getModel({ lopHocPhanId: recLopHP?._id });

	const columns: IColumn<LopHocPhan.IRecordNhanSuLopHP>[] = [
		{
			title: 'Mã cán bộ',
			dataIndex: 'maNhanSu',
			width: 120,
			filterType: 'string',
			// render: (val, rec) => rec?.nhanSu?.maCanBo ?? <i>Không tìm thấy thông tin</i>,
		},
		{
			title: 'Họ tên',
			dataIndex: 'tenNhanSu',
			width: 180,
			filterType: 'string',
			// render: (val, rec) => [rec?.nhanSu?.hoDem, rec?.nhanSu?.ten].join(' '),
		},
		{
			title: 'SĐT',
			width: 120,
			render: (val, rec) => formatPhoneNumber(rec?.nhanSu?.sdtCaNhan ?? ''),
		},
		{
			title: 'Email',
			width: 150,
			render: (val, rec) => rec?.nhanSu?.email,
		},
		{
			title: 'Loại nhân sự',
			dataIndex: 'loai',
			width: 120,
			render: (val: ELoaiPhanCongGiangDay) => val && loaiPhanCongGiangDay[val],
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChuThinhGiang',
			width: 150,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			hide: isView,
			render: (record: LopHocPhan.IRecordNhanSuLopHP) => (
				<>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa giảng viên này trong lớp tín chỉ?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			params={{ lopHocPhanId: recLopHP?._id }}
			dependencies={[page, limit, recLopHP?._id]}
			getData={getData}
			modelName='daotaov2.hocky.nhansulophocphan'
			title={intl.formatMessage({ id: 'kyhoc.nhansulophocphan.title' })}
			Form={FormNsLopHocPhan}
			buttons={{ create: !isView }}
			hideCard
			rowSelection
			deleteMany
		/>
	);
};

export default NhanSuLopHocPhan;
