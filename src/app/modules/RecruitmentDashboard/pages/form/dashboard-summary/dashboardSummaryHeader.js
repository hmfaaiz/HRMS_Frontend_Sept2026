import React, { useState } from "react"
import { useFormUIContext } from "../FormUIContext"
import SVG from "react-inlinesvg";
import { useDispatch, useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";







export function DashboardSummaryHeader({ listLoading, user }) {


    const dispatch = useDispatch();
    const FormUIContext = useFormUIContext()
    const [Loading, setLoading] = useState(false)









    return (


        <>
            <div
                style={{


                }}
            >

         <h6 className="text-primary mb-5">0000 - Technical Project Manager</h6>

                <div className="d-flex justify-content-between">

                    <div className="d-flex">
                        <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
                        </span>
                        <span>Posted 4-June-2025</span>
                    </div>

                    <div>      <span className="svg-icon svg-icon-md svg-icon-primary mr-4">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Calendar.svg")} />
                    </span>
                        <span>Expiry 10-June-2025</span>
                    </div>

                    <div>
                        <span className="svg-icon svg-icon-md svg-icon-primary mr-3">
                            <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Map.svg")} />
                        </span>
                        <span>Karachi, PK</span>
                    </div>

                    <div>  <span className="svg-icon svg-icon-md svg-icon-primary mr-5">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Communication/Salary.svg")} />
                        <span className=" ml-3">PKR 300K - 400K</span> </span>
                    </div>
                </div>


            </div>

        </>

    );
}

