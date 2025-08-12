import React from "react";
import { Route, Routes } from "react-router";
import AdminLayout from "./AdminLayout";
import IndexAdmin from "./Index/Index/IndexAdmin";
import IndexDetails from "./Table/Index/IndexDetails";
import CreateItem from "./Table/CreateItem/CreateItem";
import Login from "./Login/Login";

export default function AdminRouter() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route element={<AdminLayout />}>
                <Route index element={<IndexAdmin />} />
                <Route path=":TableName" element={<IndexDetails />}></Route>
                <Route path="View" element={<CreateItem />}></Route>
                <Route path="Modify" element={<CreateItem />}></Route>
                <Route path="Create" element={<CreateItem />}></Route>
            </Route>
        </Routes>
    )
}