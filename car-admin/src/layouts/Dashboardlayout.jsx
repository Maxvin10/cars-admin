import React from "react";
import {Layout, Menu, Button} from "antd"
import {Link, Outlet, useLocation} from "react-router-dom"
import { useAuthstore } from "../store/auth";

const {Sider, Header, Content} = Layout;

function Dashboardlayout() {
    const location = useLocation();
    const logout = useAuthstore((s) => s.logout);

    const selectedKey = location.pathname.includes("/users") ? "users" : "cars";

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider 
            collapsible
            width={220}
            collapsedWidth={80}
            >
                <div style={{color: "white", padding: 16, fontWeight: 700}}>
                    Admin Panel
                </div>
                <Menu
                    theme="dark"
                    mode = "inline"
                    selectedKeys={[selectedKey]}
                    items = {[
                        {key: "cars", label: <Link to={"/cars"}>Mashinalar</Link>},
                        {key: "users", label: <Link to={"/users"}>Foydalanuvchilar</Link>}
                    ]}
                />
            </Sider>

            <Layout>
                    <Header
                    style={{
                        background: "white",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "0 16px",
                    }}
                    >
                        <Button danger onClick={logout}>
                            Logout
                        </Button>
                    </Header>

                    <Content style={{ margin: 16, background: "white", padding: 16}}>
                        <Outlet/>
                    </Content>
            </Layout>

        </Layout>
    );
}

export default Dashboardlayout;