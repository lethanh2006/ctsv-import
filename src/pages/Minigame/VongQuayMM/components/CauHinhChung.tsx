import rules from "@/utils/rules";
import { Button, Col, Form, Input, InputNumber, message, Popconfirm, Row, Switch } from "antd";
import { useForm } from "antd/lib/form/Form";
import TextArea from "antd/lib/input/TextArea";
import { useEffect } from "react";
import { useModel } from "umi";

export default () => {
    const { getCauHinh, cauHinhQuay, thietLapCauHinhQuay } = useModel('minigame.cauhinhquay');
    const [form] = useForm();

    useEffect(() => {
        getCauHinh();
    }, []);
    
    useEffect(() => {
        form.setFieldsValue(cauHinhQuay);
    }, [cauHinhQuay]);

    const onFinish = (values: any) => {
        try {
            thietLapCauHinhQuay(values);
            message.success('Cập nhật cấu hình thành công');
        } catch (error) {
            message.error('Cập nhật cấu hình thất bại');
            form.setFieldsValue(cauHinhQuay);
        } finally {
        }
    };

    return <>
        <Form onFinish={onFinish} form={form} layout="vertical">
            <Row gutter={[10, 10]}>
                <Col span={24} lg={12}>
                    <Form.Item
                        name="ten"
                        label="Tên vòng quay"
                        rules={[...rules.required, ...rules.text, ...rules.length(100)]}
                    >
                        <Input placeholder="Nhập tên vòng quay" />
                    </Form.Item>
                </Col>
                <Col span={24} lg={12}>
                    <Form.Item
                        name="kichHoat"
                        label="Trạng thái kích hoạt"
                        valuePropName='checked'
                        >
                        <Switch checkedChildren="Kích hoạt" unCheckedChildren="vô hiệu hóa" defaultChecked={false}/>
                    </Form.Item>
                </Col>
                <Col span={12} lg={6}>
                    <Form.Item
                        name="soNguoiWin"
                        label="Số lần trúng tối đa/ ngày"
                        rules={[...rules.required]}
                    >
                        <InputNumber min={0} max={200} className="fullWidth" placeholder="Nhập tổng số người thắng / ngày"/>
                    </Form.Item>
                </Col>
                <Col span={12} lg={6}>
                    <Form.Item
                        name="tiLe"
                        label="Tỉ lệ thắng (%)"
                        rules={[...rules.required]}
                    >
                        <InputNumber min={0} max={100} className="fullWidth" placeholder="Nhập tỉ lệ thắng"/>
                    </Form.Item>
                </Col>
                <Col span={12} lg={6}>
                    <Form.Item
                        name="soLuotQuayTrongNgay"
                        label="Số lượt quay/ ngày"
                        rules={[...rules.required]}
                    >
                        <InputNumber min={0} className="fullWidth" placeholder="Nhập số lượt quay/ ngày"/>
                    </Form.Item>
                </Col>
                <Col span={12} lg={6}>
                    <Form.Item
                        name="soLanTrungToiDaMoiNguoi"
                        label="Số lần trúng tối đa/ người/ ngày"
                        rules={[...rules.required]}
                    >
                        <InputNumber min={0} className="fullWidth" placeholder="Nhập số lần trúng tối đa"/>
                    </Form.Item>
                </Col>
                 <Col span={24} hidden={true}>
                    <Form.Item
                        name="huongDan"
                        label="Hướng dẫn sử dụng vòng quay"
                    >
                        <TextArea placeholder="Nhập hướng dẫn sử dụng"/>
                    </Form.Item>
                </Col>
            </Row>
            <div className="form-footer">
                <Popconfirm
                    onConfirm={async () => form.submit()}
                    title="Bạn chắc chắn muốn cập nhật cấu hình quay?"
                    placement="topLeft"
                    >
                    <Button type="primary">
                        Cập nhật
                    </Button>
                </Popconfirm>
                
                <Button onClick={() => {form.setFieldsValue(cauHinhQuay)}}>Làm mới</Button>
            </div>
        </Form>
    </>
}