'use client';
import Link from "next/link";
import React from "react";
import { Dashboard_icon, List_icon, Car_tag_icon, Customer_icon, Employee_icon, Database_icon } from "../icons/menus";
import { usePathname } from 'next/navigation'

export function NavBar() {

  const pathname = usePathname();

  return (
    <nav className="max-md:hidden bg-blue-p max-w-48 px-8 py-5 w-full h-auto ">
      <div className="flex flex-wrap items-center ">
        <ul className=" font-medium mt-4 rounded-lg bg-gray-50 md:space-y-5 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent  md:dark:bg-transparent ">
          <li className="md:max-w-[128px] flex flex-wrap justify-center text-white  ">
          {/*${router.pathname == "/dashboard" ? " bg-bluesky-p" : "text-brand-darkblue"}*/}
            <Link
              href="/dashboard"
              className={` bg-white w-20 h-20  p-4 mb-2  rounded-full  ${pathname == "/dashboard" ? " bg-cyan-100 shadow-lg shadow-cyan-200/50" : "inner-shadow"} `}
              aria-current="page"
            >
              <div className="hover:scale-90 ">
                <Dashboard_icon />
              </div>
            </Link>
            Dashboard
          </li>
          
          <li className="md:max-w-[128px] flex flex-wrap justify-center text-white ">
            <Link
              href="/truck"
              className={`bg-white w-20 h-20  p-4 mb-2  rounded-full ${pathname == "/truck" ? " bg-cyan-100 shadow-lg shadow-cyan-200/50" : "inner-shadow"}`}
              aria-current="page"
            >
              <div className="hover:scale-90 ">
                <List_icon />
              </div>
            </Link>
            ข้อมูลรถ
          </li>
          
          <li className="md:max-w-[135px] flex flex-wrap justify-center text-white  ">
            <Link
              href="/truckprice"
              className={`bg-white w-20 h-20  p-4 mb-2  rounded-full ${pathname == "/truckprice" || pathname == "/truckprice/createTruck" ? " bg-cyan-100 shadow-lg shadow-cyan-200/50" : "inner-shadow"}`}
              aria-current="page"
            >
              <div className="hover:scale-90 ">
                <Car_tag_icon />
              </div>
            </Link>
            ตรวจสอบราคารถ
          </li>
          
          <li className="md:max-w-[128px] flex flex-wrap justify-center text-white  ">
            <Link
              href="/customer"
              className={`bg-white w-20 h-20  p-4 mb-2  rounded-full ${pathname == "/customer" ? " bg-cyan-100 shadow-lg shadow-cyan-200/50" : "inner-shadow"}`}
              aria-current="page"
            >
              <div className="hover:scale-90 ">
                <Customer_icon />
              </div>
            </Link>
            ข้อมูลลูกค้า
          </li>
          

          <li className="md:max-w-[128px] flex flex-wrap justify-center text-white  ">
            <Link
              href="/database"
              className={`bg-white w-20 h-20  p-4 mb-2  rounded-full ${pathname == "/database" ? " bg-cyan-100 shadow-lg shadow-cyan-200/50" : "inner-shadow"}`}
              aria-current="page"
            >
              <div className="hover:scale-90 ">
                <Database_icon />
              </div>
            </Link>
            ฐานข้อมูล
          </li>

        </ul>
      </div>
    </nav>
  );
}
