import React, { useState } from "react"
import { useFormUIContext } from "../FormUIContext"

import { useDispatch, useSelector } from "react-redux";
import { DashboardSummaryHeader } from "./dashboardSummaryHeader";







export function DashboardSummary({ listLoading, user }) {


    const dispatch = useDispatch();
    const FormUIContext = useFormUIContext()
    const [Loading, setLoading] = useState(false)









    return (


        <>
           

              
                <DashboardSummaryHeader/>



           
        </>

    );
}

