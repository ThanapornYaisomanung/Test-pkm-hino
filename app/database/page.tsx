'use client';
import Link from "next/link";
import React from "react";
import { BuildOption_icon, Business_icon, Employee_icon, Garage_icon, TruckType_icon} from "../icons/menus";
import { usePathname } from 'next/navigation'


export default function Database() {
    const pathname = usePathname();
    return (
        <div className="md:pt-8 md:pl-8 p-4 min-h-screen ">
            {/* text header */}
            <div className="text header">
                <p className=" text-3xl font-bold">ฐานข้อมูล</p>
                <p>ข้อมูลภายในระบบที่มีการเชื่อมโยงไปในส่วนต่างๆ</p>
            </div>

            <div className=" flex md:gap-8 gap-4 flex-wrap justify-center ">
                <div className="pt-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                        <ul>
                            <li className="md:max-w-[128px] flex flex-wrap justify-center text-black-p  ">
                                <Link
                                    href="/employee"
                                    className={`bg-white w-20 h-20  p-4 mb-2  rounded-full  shadow-md`}
                                    aria-current="page"
                                >
                                    <div className="hover:scale-90 ">
                                        <Employee_icon />
                                    </div>
                                </Link>
                                ข้อมูลพนักงาน
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                        <ul>
                            <li className="md:max-w-[128px] flex flex-wrap justify-center text-black-p  ">
                                <Link
                                    href="/database/trucktype"
                                    className={`bg-white w-20 h-20  p-4 mb-2  rounded-full  shadow-md `}
                                    aria-current="page"
                                >
                                    <div className="hover:scale-90 ">
                                        <TruckType_icon />
                                    </div>
                                </Link>
                                ข้อมูลประเภทรถ
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                        <ul>
                            <li className="md:max-w-[128px] flex flex-wrap justify-center text-black-p  ">
                                <Link
                                    href="/database/garage"
                                    className={`bg-white w-20 h-20  p-4 mb-2  rounded-full  shadow-md `}
                                    aria-current="page"
                                >
                                    <div className="hover:scale-90 ">
                                        <Garage_icon />
                                    </div>
                                </Link>
                                ข้อมูลอู่รถ
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                        <ul>
                            <li className="md:max-w-[128px] flex flex-wrap justify-center text-black-p  ">
                                <Link
                                    href="/database/equipment"
                                    className={`bg-white w-20 h-20  p-4 mb-2  rounded-full  shadow-md `}
                                    aria-current="page"
                                >
                                    <div className="hover:scale-90 ">
                                        <BuildOption_icon />
                                    </div>
                                </Link>
                                ข้อมูลอุปกรณ์รถ
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                        <ul>
                            <li className="md:max-w-[128px] flex flex-wrap justify-center text-black-p  ">
                                <Link
                                    href="/database/business"
                                    className={`bg-white w-20 h-20  p-4 mb-2  rounded-full  shadow-md `}
                                    aria-current="page"
                                >
                                    <div className="hover:scale-90 ">
                                        <Business_icon />
                                    </div>
                                </Link>
                                ข้อมูลประเภทธุรกิจ
                            </li>
                        </ul>
                    </div>
                </div>

            </div>










        </div>
    )

};
