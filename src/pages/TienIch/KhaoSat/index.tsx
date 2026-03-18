import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiBieuMau } from '@/services/TienIch/constant';
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Popconfirm, Popover } from 'antd';
import { useIntl, useModel } from 'umi';
import ViewDetailKhaoSat from './components/FormViewDetail';
import ModalKhaoSat from './components/Modal';

const KhaoSatPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, isView, deleteModel, handleEdit, handleView } = useModel('tienich.bieumau');

	const getData = () => {
		getModel({
			loai: ELoaiBieuMau.QUESTIONS,
		});
	};

	const onCell = (rec: BieuMau.Record) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	// const handleKichHoat = (rec: BieuMau.Record, val: boolean) => {
	// 	putModel(rec?._id, { ...rec, kichHoat: val })
	// 		.then()
	// 		.catch((err) => console.log(err));
	// };

	const columns: IColumn<BieuMau.Record>[] = [
		{
			title: intl.formatMessage({ id: 'questionsmanagement.column.tieude' }),
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'questionsmanagement.column.nguoitao' }),
			dataIndex: 'thongTinNguoiTao.nhanSuSsoId' as any,
			width: 180,
			filterType: 'customselect',
			render: (val, rec) => rec?.thongTinNguoiTao?.ten,
			filterCustomSelect: <SelectNhanSuDebounce multiple />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'questionsmanagement.column.mota' }),
			dataIndex: 'moTa',
			width: 250,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		// {
		// 	title: intl.formatMessage({ id: 'questionsmanagement.column.kichhoat' }),
		// 	dataIndex: 'kichHoat',
		// 	align: 'center',
		// 	width: 90,
		// 	render: (val, rec) => (
		// 		<Switch
		// 			size='small'
		// 			checked={val}
		// 			onChange={(e) => {
		// 				handleKichHoat(rec, e);
		// 			}}
		// 		/>
		// 	),
		// },
		{
			title: intl.formatMessage({ id: 'global.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (rec: BieuMau.Record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>

					<Popover
						placement='left'
						content={
							<>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'questionsmanagement.button.xemtruoc' })}
									onClick={() => handleView(rec)}
									type='link'
									icon={<EyeOutlined />}
								/>

								<Popconfirm
									onConfirm={() =>
										deleteModel(rec._id, getData, {
											messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
										})
									}
									title={intl.formatMessage({ id: 'questionsmanagement.comfirm.xoa' })}
									placement='topLeft'
								>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
										type='link'
										danger
										icon={<DeleteOutlined />}
									/>
								</Popconfirm>
							</>
						}
					>
						<ButtonExtend type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='tienich.bieumau'
			title={intl.formatMessage({ id: 'questionsmanagement.title' })}
			widthDrawer={1000}
			Form={isView ? ViewDetailKhaoSat : ModalKhaoSat}
			formProps={{ getData }}
		/>
	);
};

export default KhaoSatPage;
