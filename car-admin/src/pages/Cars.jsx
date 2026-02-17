import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Typography } from "antd";
import { getCars } from "../api/car";

const { Title } = Typography;

const columns = [
  { title: "ID", dataIndex: "id", width: 60 },
  { title: "Brend", dataIndex: "brandName", key: "brandName" },
  { title: "Model", dataIndex: "modelName", key: "modelName" },
  { title: "Yil", dataIndex: "year", width: 70 },
  { title: "Rang", dataIndex: "color", width: 90 },
  {
    title: "Narx",
    dataIndex: "price",
    key: "price",
    width: 100,
    render: (price, row) => `${price} ${row.currency || "USD"}`,
  },
  { title: "Holat", dataIndex: "condition", width: 80 },
  { title: "Manzil", dataIndex: "location", width: 90 },
];

function Cars() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  return (
    // <div>Cars</div>
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Mashinalar
      </Title>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data.items}
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
    </div>
  );
}

export default Cars;