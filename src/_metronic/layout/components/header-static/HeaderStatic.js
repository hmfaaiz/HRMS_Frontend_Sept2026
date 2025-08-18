


import { ChevronDown, CircleUserRound } from 'lucide-react';
import { Link ,useHistory} from "react-router-dom";
import { useDispatch } from "react-redux";
import React from 'react';

const HeaderStatic = () => {
    const dispatch = useDispatch();
 const history = useHistory();
    return (
        <header className="bg-transparent">
            <div className="2xl:max-w-[85vw] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4 flex flex-row justify-between items-center">
                <div
                    className="flex items-end lg:items-center cursor-pointer"
                    onClick={() => {
                      
                     history.push("/auth");
                    }}
                >
                    <img
                        src="/media/bg/Login/DSC-Logo.svg"
                        alt="Dynasoft Cloud"
                        className="h-8 lg:h-12 m-auto"
                    />
                </div>
                <div className="flex items-center space-x-4">






                    <div className="flex flex-row  gap-1 justify-center items-center space-x-2">

                        <span className="text-xs text-[#222222]">
                            <span className="max-sm:hidden">Already have an account?</span>
                            {"  "}
                            <Link
                                to="/auth"
                              
                                className={`text-xs hover:underline text-tprimary`}
                            >
                                Sign in
                            </Link>
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default HeaderStatic;
