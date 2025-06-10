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
            <div
                style={{
                  
                    marginTop: "15px",
                    marginBottom: "15px",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solidrgb(255, 255, 255)",
                }}
            >

              
                <DashboardSummaryHeader/>



            </div>

        </>

    );
}

