import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiHocPhanDangKyTinChi, LoaiHocPhanDangKyTinChi } from '@/services/DaoTaoV2/HocKy/constant';
import type { SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { compareFullname, formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, LogoutOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalChuyenLop from './components/ModalChuyenLop';

type TData = Partial<SinhVien.IRecord> & LopHocPhan.IRecordSinhVienLopHP;

/**
 * Danh sách sinh viên trong lớp tín chỉ
 * @param props : `isView`: Chỉ xem? Sẽ đến từ thống kê Đăng ký tín chỉ
 * @returns
 */
const SinhVienLopHocPhan = (props: { isView?: boolean }) => {
	const intl = useIntl();
	const { getAllModel, setEdit, deleteModel, setRecord, record, visibleForm, setVisibleForm } = useModel(
		'daotaov2.hocky.sinhvienlophocphan',
	);
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const { handleView } = useModel('daotaov2.sinhvien.sinhvien');
	const { setVisibleForm: setVisibleChuyenLop } = useModel('daotaov2.dangkytinchi.sinhviendotdangky');
	const [data, setData] = useState<TData[]>([]);
	const { isView } = props;

	const getData = () =>
		recLopHP?._id &&
		getAllModel(undefined, undefined, { lopHocPhanId: recLopHP?._id }).then((res) => {
			const temp: TData[] = res.map((item) => ({ ...item, ...item.sinhVien }));
			setData(temp);
		});

	useEffect(() => {
		getData();
	}, [recLopHP?._id]);

	const handleChuyenLop = (rec: LopHocPhan.IRecordSinhVienLopHP) => {
		setRecord(rec);
		setVisibleChuyenLop(true);
	};

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setRecord(rec);
			handleView();
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<TData>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Họ tên',
			width: 170,
			dataIndex: 'ten',
			filterType: 'string',
			sortable: true,
			customSort: compareFullname,
			onCell,
		},
		{
			title: 'Loại đăng ký',
			dataIndex: 'loai',
			width: 100,
			render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
			filterType: 'select',
			filterData: Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
				value: item,
				label: LoaiHocPhanDangKyTinChi[item],
			})),
			onCell,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 120,
			render: (val, rec) => val && formatPhoneNumber(val),
			onCell,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Lớp hành chính',
			width: 120,
			render: (val, rec) => rec.lopHanhChinhList?.map((item) => item.ten).join(', '),
			onCell,
		},
		{
			title: 'Khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 100,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: LopHocPhan.IRecordSinhVienLopHP) => (
				<>
					<Tooltip title='Chuyển lớp'>
						<Button onClick={() => handleChuyenLop(rec)} type='link' icon={<LogoutOutlined />} />
					</Tooltip>

					{!isView ? (
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(rec._id, getData)}
								title='Bạn có chắc chắn muốn xóa sinh viên này khỏi lớp tín chỉ?'
								placement='topRight'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					) : null}
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={data} addStt hasTotal>
				<Space wrap>
					{!isView ? (
						<ButtonExtend
							icon={<PlusCircleOutlined />}
							type='primary'
							onClick={() => {
								setRecord(undefined);
								setEdit(false);
								setVisibleForm(true);
							}}
						>
							Thêm mới
						</ButtonExtend>
					) : null}
				</Space>
			</TableStaticData>

			<Modal
				maskClosable={false}
				width={600}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				styles={{ padding: 0 }}
				open={visibleForm}
				destroyOnClose={false}
			>
				<Form title={intl.formatMessage({ id: 'kyhoc.sinhvienlophocphan.title' })} getData={getData} />
			</Modal>

			<ModalChiTietSinhVien sinhVienSsoId={record?.sinhVienSsoId ?? ''} />

			<ModalChuyenLop onOk={getData} />
		</>
	);
};

export default SinhVienLopHocPhan;
