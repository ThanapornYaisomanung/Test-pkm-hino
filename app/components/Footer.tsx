import logo from '../../public/6f6f9279f.png';
import Image from "next/image";

export default function Footer() {
    return (


        <footer className="bg-black-p shadow ">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/dashboard" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <Image src={logo} alt="Pkmhino Logo" className="max-w-10 max-h-10" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">PKMHINO</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 ">
                        <li>
                            <a href="/dashboard" className="hover:underline me-4 md:me-6">Dashboard</a>
                        </li>
                        <li>
                            <a href="/truck" className="hover:underline me-4 md:me-6">ข้อมูลรถ</a>
                        </li>
                        <li>
                            <a href="/truckprice" className="hover:underline me-4 md:me-6">ตรวจสอบราคารถ</a>
                        </li>
                        <li>
                            <a href="/customer" className="hover:underline me-4 md:me-6">ข้อมูลลูกค้า</a>
                        </li>
                        <li>
                            <a href="/database" className="hover:underline">ฐานข้อมูล</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-white sm:text-center ">© 2024 <a href="/dashboard" className="hover:underline">PKMHINO</a>. All Rights Reserved.</span>
            </div>
        </footer>


    )
}