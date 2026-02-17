import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Typography } from "antd";
import { getUsers } from "../api/user";

const { Title } = Typography;

// NOTE: dataIndex'lar backend response'iga qarab o'zgaradi.
// Hozircha eng ko'p uchraydigan fieldlarni qo'ydim.
const columns = [
  { title: "ID", dataIndex: "id", width: 70 },
  { title: "Ism", dataIndex: "fullName", key: "fullName" },
  { title: "Username", dataIndex: "userName", key: "userName", width: 160 },
  { title: "Email", dataIndex: "email", key: "email", width: 220 },
  { title: "Telefon", dataIndex: "phoneNumber", key: "phoneNumber", width: 150 },
  { title: "Role", dataIndex: "role", key: "role", width: 120 },
];

function Users() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const loadUsers = async (pageNumber = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({ PageNumber: pageNumber, PageSize: pageSize });

      
      const value = res?.value ?? res;

      setData({
        items: value?.items ?? [],
        totalCount: value?.totalCount ?? 0,
        pageNumber: value?.pageNumber ?? pageNumber,
        pageSize: value?.pageSize ?? pageSize,
        totalPages: value?.totalPages ?? 0,
      });
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Ro'yxat yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTableChange = (pag) => {
    if (pag?.current && pag?.pageSize) loadUsers(pag.current, pag.pageSize);
  };

  if (error) return <Alert type="error" message={error} showIcon />;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Foydalanuvchilar
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

export default Users;
