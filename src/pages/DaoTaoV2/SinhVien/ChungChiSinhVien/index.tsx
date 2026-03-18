import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectChungChi from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChungChi/components/Select';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const ChungChiSinhVienPage = (props: { fromSinhVien?: boolean }) => {
	const intl = useIntl();
	const { fromSinhVien } = props;
	const { page, limit, deleteModel, handleEdit, getModel } = useModel('daotaov2.sinhvien.chungchi');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const columns: IColumn<SinhVien.IChungChiSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.masv' }),
			width: 120,
			render: (val, rec) => rec?.sinhVien?.ma,
			hide: fromSinhVien,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.tensinhvien' }),
			dataIndex: 'sinhVienSsoId',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectSinhVienDebounce multiple />,
			render: (val, rec) => rec?.sinhVien?.ten,
			hide: fromSinhVien,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.chungchi' }),
			dataIndex: 'maChungChi',
			width: 200,
			filterType: 'customselect',
			filterCustomSelect: <SelectChungChi multiple selectMa />,
			render: (val, rec) => `${rec.chungChi?.loaiChungChi?.ten} - ${rec.chungChi?.ten ?? val}`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.ngaycap' }),
			dataIndex: 'ngayCap',
			width: 100,
			filterType: 'date',
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.donvicap' }),
			dataIndex: 'donViCap',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.trinhdo' }),
			dataIndex: 'diem',
			width: 100,
			align: 'center',
			sortable: true,
			render: (val, rec) => {
				if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM) {
					return <span>{val}</span>;
				} else if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC) {
					const findBac = rec.chungChi.bac?.find((item) => item.order === val);
					return <span>{findBac?.ten}</span>;
				}
				return <CheckCircleOutlined className='text-success' />;
			},
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.thoihanchungchi' }),
			width: 130,
			filterType: 'date',
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi && rec.ngayCap)
					if (rec.chungChi?.chungChiCoThoiHan) {
						const endDate = dayjs(rec.ngayCap).add(rec.chungChi.thoiHanChungChi, 'y');
						return (
							<span className={dayjs().isAfter(endDate) ? 'text-error' : undefined}>
								{endDate.format('DD/MM/YYYY')}
							</span>
						);
					} else return <Tag color='green'>{intl.formatMessage({ id: 'sinhvien.chungchi.tag.khongthoihan' })}</Tag>;
				else return null;
			},
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sinhvien.chungchi.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IChungChiSinhVien) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'sinhvien.chungchi.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() =>
							deleteModel(record._id, () =>
								fromSinhVien ? getModel({ sinhVienSsoId: recSinhVien?.ssoId }) : getModel(),
							)
						}
						title={intl.formatMessage({ id: 'sinhvien.chungchi.popconfirm.title' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'sinhvien.chungchi.tooltip.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			title={intl.formatMessage({ id: 'sinhvien.chungchisinhvien.title' })}
			columns={columns}
			params={fromSinhVien ? { sinhVienSsoId: recSinhVien?.ssoId } : undefined}
			dependencies={[page, limit, fromSinhVien, recSinhVien?.ssoId]}
			modelName='daotaov2.sinhvien.chungchi'
			hideCard={fromSinhVien}
			Form={Form}
			formProps={{ fromSinhVien }}
			widthDrawer={800}
			deleteMany
			rowSelection
			buttons={{ export: true, import: true }}
		/>
	);
};

export default ChungChiSinhVienPage;
