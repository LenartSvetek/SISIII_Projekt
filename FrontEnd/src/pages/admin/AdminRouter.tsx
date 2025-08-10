import React from "react";
import { Route, Routes } from "react-router";
import AdminLayout from "./AdminLayout";
import Index from "./Index/Index/Index";
import IndexDetails from "./Table/Index/IndexDetails";
import CreateItem from "./Table/CreateItem/CreateItem";
import Login from "./Login/Login";

export default function AdminRouter() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route element={<AdminLayout />}>
                <Route index element={<Index />} />
                <Route path=":TableName" element={<IndexDetails />}></Route>
                <Route path=":TableName/:Operation" element={<CreateItem />}></Route>
                <Route path=":TableName/:Operation/:Id" element={<CreateItem />}></Route>
            </Route>
        </Routes>
    )
}