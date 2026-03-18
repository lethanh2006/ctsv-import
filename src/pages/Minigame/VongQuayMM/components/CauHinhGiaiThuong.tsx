import { useEffect, useState } from 'react';
import { Table, Input, Button, Popconfirm, Tag, message } from 'antd';
import { MCauHinhQuay } from '@/services/Minigame/CauHinhQuay/typing';
import { useModel } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import SelectVoucher from '../../Voucher/components/Select';

const EditableVongQuayTable = () => {
	const [data, setData] = useState<(MCauHinhQuay.IVongQuayInfo & { tempId: string })[]>([]);
	const { cauHinhQuay, capNhatPhanThuongVongQuay } = useModel('minigame.cauhinhquay');

	useEffect(() => {
		const danhSach = (cauHinhQuay?.danhSachPhanThuong || []).map((item) => ({
			...item,
			tempId: uuidv4(),
		}));
		setData(danhSach.filter(item => item._id));
	}, [cauHinhQuay]);

	const handleChange = (value: string, tempId: string, dataIndex: keyof MCauHinhQuay.IVongQuayInfo) => {
		const newData = data.map((item) => (item.tempId === tempId ? { ...item, [dataIndex]: value } : item));
		setData(newData);
	};

	const handleDelete = (tempId: string) => {
		setData(data.filter((item) => item.tempId !== tempId));
	};

	const handleAdd = () => {
		const newItem: MCauHinhQuay.IVongQuayInfo & { tempId: string } = {
			_id: null,
			ten: '',
			moTa: '',
			trangThai: 'Đang hoạt động',
			tempId: uuidv4(),
		};
		setData([...data, newItem]);
	};

	const columns = [
		{
			title: 'Tên giải thưởng',
			dataIndex: 'ten',
			render: (text: string, record: any) => (
				<Input
					value={text}
					placeholder='Nhập tên'
					status={!text?.trim() ? 'error' : ''}
					onChange={(e) => handleChange(e.target.value, record.tempId, 'ten')}
				/>
			),
		},
		// {
		// 	title: 'Mô tả',
		// 	dataIndex: 'moTa',
		// 	render: (text: string, record: any) => (
		// 		<Input
		// 			value={text}
		// 			placeholder='Nhập mô tả'
		// 			status={!text?.trim() ? 'error' : ''}
		// 			onChange={(e) => handleChange(e.target.value, record.tempId, 'moTa')}
		// 		/>
		// 	),
		// },
		{
			title: 'Phiếu quà tặng',
			dataIndex: '_id',
			render: (text: string, record: any) => (
				<div
					style={{
						border: !text ? '1px solid red' : undefined,
					}}
				>
					<SelectVoucher hasCreate={false} value={text} onChange={(e) => handleChange(e || '', record.tempId, '_id')} />
				</div>
			),
		},
        {
			title: 'Trạng thái kích hoạt',
			dataIndex: 'trangThai',
            width: 120,
            align: 'center',
			render: (text: string, record: any) => (
				<><Tag color={text === 'Đang hoạt động' ? 'green' : 'red'}>
                    {text}
                    
				</Tag>
                {text !== 'Đang hoạt động' && <small><i className='mt-2' style={{color: 'red', lineHeight: 0.8}}> (Không hiển thị trên vòng quay)</i></small>}</>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			render: (_: any, record: any) => (
				<Popconfirm title='Bạn chắc chắn muốn xóa?' onConfirm={() => handleDelete(record.tempId)}>
					<Button danger type='link' icon={<DeleteOutlined />} />
				</Popconfirm>
			),
		},
	];

	const onSaveAll = async () => {
		const hasEmpty = data.some((item) => !item.ten?.trim() || !item._id);
		if (hasEmpty) {
			message.error('Vui lòng nhập đầy đủ tên và chọn phiếu quà tặng cho tất cả các dòng.');
			return;
		}

		const payload: MCauHinhQuay.ICapNhatPhanThuong[] = data.map((item) => ({
			_id: item._id || '',
			ten: item.ten,
			moTa: item.moTa,
		}));

        try {
            await capNhatPhanThuongVongQuay(payload);
            message.success('Cập nhật thành công!');
        } catch (error) {
            message.error('Cập nhật thất bại!');
            return;
        }
	};

	return (
		<>
			<Table dataSource={data} columns={columns} rowKey='tempId' pagination={false} bordered />
			<div className='form-footer'>
				<Popconfirm onConfirm={onSaveAll} title='Bạn chắc chắn muốn cập nhật cấu hình giải thưởng?' placement='topLeft'>
					<Button type='primary'>Cập nhật</Button>
				</Popconfirm>
				<Button onClick={handleAdd} type='dashed'>
					+ Thêm
				</Button>
			</div>
		</>
	);
};

export default EditableVongQuayTable;
