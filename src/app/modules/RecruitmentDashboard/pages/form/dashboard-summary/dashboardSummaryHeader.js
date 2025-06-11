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

                {/* job heading */}
                <h6 className="text-primary mb-5">0000 - Technical Project Manager</h6>


                {/* job filters */}
                <div className="d-flex justify-content-between mb-5">

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


                {/* job summary container */}
                <div className="d-flex justify-content-between mt-5">

                    <div className="d-flex justify-content-between mt-5  w-100" >
                        <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '65px', height: '50px' }}>
                            340
                        </div>
                        <div className="d-flex flex-column  w-100 ml-3">
                            <div className="mb-0"> <strong> Phase 1</strong></div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#d4d5d6'


                                }}
                            ></div>
                        </div>


                    </div>


                    <div className="d-flex justify-content-between mt-5  w-100 ml-20" >
                        <div className="bg-warning rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '65px', height: '50px' }}>
                            340
                        </div>
                        <div className="d-flex flex-column  w-100 ml-3">
                            <div className="mb-0"> <strong> Phase 2</strong></div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#d4d5d6'


                                }}
                            ></div>
                        </div>


                    </div>



                    <div className="d-flex justify-content-between mt-5  w-100 ml-20" >
                        <div className=" rounded-circle d-flex justify-content-center align-items-center text-white" style={{ backgroundColor: 'purple', width: '65px', height: '50px' }}>
                            340
                        </div>
                        <div className="d-flex flex-column  w-100 ml-3">
                            <div className="mb-0"> <strong> Phase 3</strong></div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#d4d5d6'


                                }}
                            ></div>
                        </div>


                    </div>
                    <div className="d-flex justify-content-between mt-5  w-100 ml-20" >
                        <div className="bg-success rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '65px', height: '50px' }}>
                            340
                        </div>
                        <div className="d-flex flex-column  w-100 ml-3">
                            <div className="mb-0"> <strong> Phase 4</strong></div>
                            <div
                                style={{
                                    width: '100%',
                                    height: '2px',
                                    backgroundColor: '#d4d5d6'


                                }}
                            ></div>
                        </div>


                    </div>





                </div>


            </div>

        </>

    );
}

