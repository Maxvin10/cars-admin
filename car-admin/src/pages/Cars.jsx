import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Spin,
  Alert,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Button,
  message,
} from "antd";
import { getCars, createCar, updateCar, deleteCar } from "../api/car";

const { Title } = Typography;

const conditionOptions = [
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
];

function Cars() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [data, setData] = useState({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const loadCars = async (pageNumber = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCars({ PageNumber: pageNumber, PageSize: pageSize });
      const value = res?.value ?? res;

      setData({
        items: value?.items ?? [],
        totalCount: value?.totalCount ?? 0,
        pageNumber: value?.pageNumber ?? pageNumber,
        pageSize: value?.pageSize ?? pageSize,
        totalPages: value?.totalPages ?? 0,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ?? err?.message ?? "Ro'yxat yuklanmadi",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleTableChange = (pag) => {
    if (pag?.current && pag?.pageSize) loadCars(pag.current, pag.pageSize);
  };

  // create
  const openCreate = () => {
    setEditingCar(null);
    setModalOpen(true);
  };

  // edit
  const openEdit = (row) => {
    setEditingCar(row);
    setModalOpen(true);
    form.setFieldsValue({
      ModelId: row.modelId ?? row.ModelId,
      Year: row.year ?? row.Year,
      Seats: row.seats ?? row.Seats,
      Doors: row.doors ?? row.Doors,
      Condition: row.condition ?? row.Condition,
      EngineType: row.engineType ?? row.EngineType,
      Transmission: row.transmission ?? row.Transmission,
      Color: row.color ?? row.Color,
      Mileage: row.mileage ?? row.Mileage,
      CarNumber: row.carNumber ?? row.CarNumber,
      Location: row.location ?? row.Location,
      Description: row.description ?? row.Description,
      Price: row.price ?? row.Price,
      Currency: row.currency ?? row.Currency,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCar(null);
    form.resetFields();
  };

  // create/update
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const id = getCarId(editingCar);

      if (editingCar && id != null) {
        await updateCar(id, values);
        message.success("Mashina yangilandi");
        closeModal();
        await loadCars(data.pageNumber, data.pageSize);
      } else {
        await createCar(values);
        message.success("Mashina yaratildi");
        closeModal();
        await loadCars(1, data.pageSize);
      }
    } catch (err) {
      if (err?.errorFields) return;
      message.error(
        err?.response?.data?.message || err?.message || "Saqlashda xatolik",
      );
    } finally {
      setSaving(false);
    }
  };

  // delete
  const onDelete = (row) => {
    const id = getCarId(row);
    if (id == null) return message.error("Row ichida id yo‘q");

    Modal.confirm({
      title: "O'chirishni tasdiqlang",
      content: `ID: ${id} ni o'chirmoqchimisiz?`,
      okText: "Ha, o'chir",
      okButtonProps: { danger: true },
      cancelText: "Bekor",
      onOk: async () => {
        await deleteCar(id);
        message.success("Mashina o'chirildi");
        await loadCars(data.pageNumber, data.pageSize);
      },
    });
  };
  const getCarId = (row) => {
    if (!row) return null;

    return (
      row.id ??
      row.Id ??
      row.carId ??
      row.CarId ??
      row.carID ??
      row.CarID ??
      null
    );
  };

  const columns = useMemo(
    () => [
      { title: "ID", dataIndex: "id", width: 60 },
      {
        title: "ModelId",
        dataIndex: "modelId",
        width: 90,
        render: (_, r) => r.modelId ?? r.ModelId ?? "-",
      },
      {
        title: "Yil",
        dataIndex: "year",
        width: 80,
        render: (_, r) => r.year ?? r.Year ?? "-",
      },
      {
        title: "O'rindiqlar",
        dataIndex: "seats",
        width: 80,
        render: (_, r) => r.seats ?? r.Seats ?? "-",
      },
      {
        title: "Eshilar",
        dataIndex: "doors",
        width: 80,
        render: (_, r) => r.doors ?? r.Doors ?? "-",
      },
      {
        title: "Holati",
        dataIndex: "condition",
        width: 110,
        render: (_, r) => r.condition ?? r.Condition ?? "-",
      },
      {
        title: "Yoqilg'i turi",
        dataIndex: "engineType",
        width: 120,
        render: (_, r) => r.engineType ?? r.EngineType ?? "-",
      },
      {
        title: "Yoqish",
        dataIndex: "transmission",
        width: 130,
        render: (_, r) => r.transmission ?? r.Transmission ?? "-",
      },
      {
        title: "Rangi",
        dataIndex: "color",
        width: 100,
        render: (_, r) => r.color ?? r.Color ?? "-",
      },
      {
        title: "Masofa",
        dataIndex: "mileage",
        width: 120,
        render: (_, r) => r.mileage ?? r.Mileage ?? "-",
      },
      {
        title: "Mashina raqami",
        dataIndex: "carNumber",
        width: 140,
        render: (_, r) => r.carNumber ?? r.CarNumber ?? "-",
      },
      {
        title: "Joylashuv",
        dataIndex: "location",
        width: 140,
        render: (_, r) => r.location ?? r.Location ?? "-",
      },
      {
        title: "Ta'rif",
        dataIndex: "description",
        width: 140,
        render: (_, r) => r.description ?? r.Description ?? "-",
      },
      {
        title: "Narx",
        dataIndex: "price",
        width: 140,
        render: (_, r) => r.price ?? r.Price ?? "-",
      },
      {
        title: "Valyuta",
        dataIndex: "currency",
        width: 140,
        render: (_, r) => r.currency ?? r.Currency ?? "-",
      },
      {
        title: "Actions",
        key: "actions",
        width: 170,
        fixed: "right",
        render: (_, row) => (
          <Space>
            <Button size="small" onClick={() => openEdit(row)}>
              Edit
            </Button>
            <Button size="small" danger onClick={() => onDelete(row)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [data.items],
  );

  if (error)
    return (
      <Alert
        type="error"
        message="Xatolik yuz berdi"
        description={error}
        showIcon
      />
    );

  return (
    <div>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Mashinalar
        </Title>

        <Button type="primary" onClick={openCreate}>
          + Yangi mashina
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          rowKey={(record) => getCarId(record)}
          columns={columns}
          dataSource={data.items}
          scroll={{ x: 1100 }}
          pagination={{
            current: data.pageNumber,
            pageSize: data.pageSize,
            total: data.totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Jami: ${total} ta`,
          }}
          onChange={handleTableChange}
        />
      </Spin>

      <Modal
        title={editingCar ? "Mashina tahrirlash" : "Yangi mashina"}
        open={modalOpen}
        onCancel={closeModal}
        onOk={onSubmit}
        confirmLoading={saving}
        okText={editingCar ? "Saqlash" : "Yaratish"}
        cancelText="Bekor"
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="ModelId"
            label="ModelId"
            rules={[{ required: true, message: "ModelId kiriting" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Space style={{ display: "flex" }} size="middle">
            <Form.Item
              name="Year"
              label="Yil"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Yil kiriting" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1950} max={2100} />
            </Form.Item>

            <Form.Item
              name="Color"
              label="Rang"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Rang kiriting" }]}
            >
              <Input />
            </Form.Item>
          </Space>

          <Space style={{ display: "flex" }} size="middle">
            <Form.Item
              name="Seats"
              label="Seats"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Seats kiriting" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={100} />
            </Form.Item>

            <Form.Item
              name="Doors"
              label="Doors"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Doors kiriting" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={10} />
            </Form.Item>
          </Space>

          <Form.Item
            name="Condition"
            label="Condition"
            rules={[{ required: true, message: "Condition tanlang" }]}
          >
            <Select options={conditionOptions} />
          </Form.Item>

          <Space style={{ display: "flex" }} size="middle">
            <Form.Item
              name="EngineType"
              label="EngineType"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "EngineType kiriting" }]}
            >
              <Input placeholder="benzine/diesel/hybrid..." />
            </Form.Item>

            <Form.Item
              name="Transmission"
              label="Transmission"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Transmission kiriting" }]}
            >
              <Input placeholder="automatic/manual..." />
            </Form.Item>
          </Space>

          <Form.Item
            name="Mileage"
            label="Mileage"
            rules={[{ required: true, message: "Mileage kiriting" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="CarNumber"
            label="CarNumber"
            rules={[{ required: true, message: "CarNumber kiriting" }]}
          >
            <Input placeholder="01A123AA" />
          </Form.Item>

          <Form.Item
            name="Location"
            label="Location"
            rules={[{ required: true, message: "Joylashuvni kiriting" }]}
          >
            <Input placeholder="Toshkent shahar" />
          </Form.Item>

          <Form.Item name="Description" label="Description">
            <Input placeholder="Ta'rif kiriting" />
          </Form.Item>

          <Form.Item
            name="Price"
            label="Price"
            rules={[{ required: true, message: "Narxni kiriting" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="Currency"
            label="Currency"
            rules={[{ required: true, message: "Narxni kiriting" }]}
          >
            <Select options={[{ value: "USD", label: "USD" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Cars;
