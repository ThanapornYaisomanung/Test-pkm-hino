'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    uploadBytes,
    UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from '@/app/firebase';
import Link from 'next/link';
import { Arrow_left_icon } from '@/app/icons/activeIcon';



const TypeT = [
    { id: 1, label: "- เลือกประเภทรถ -", value: "" },
    { id: 2, label: "XZU - 4W", value: "XZU" },
    { id: 3, label: "FC - 6W", value: "FC" },
    { id: 4, label: "FG - 6W", value: "FG" },
    { id: 5, label: "FL - 10W", value: "FL" },
    { id: 6, label: "GY - 10W", value: "GY" },
    { id: 7, label: "FM - 10W", value: "FM" },
]

export default function CreateTruck() {
    const router = useRouter()
    const [typeName, setTypeName] = useState("");
    const [typeCode, setTypeCode] = useState("");


    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            alert("บันทึกสำเร็จ")
            try {
                const docRef = await addDoc(collection(db, "TruckType"), {
                    type_t_name: typeName,
                    type_t_code: typeCode,
                });

                router.push('/database/trucktype')

            } catch (e) {
                console.error("Error adding document: ", e);
            }


        }
    }

    function functionCancel() {
        const confirmBox = window.confirm(
            "Do you really want to Cancel this data?"
        )

        if (confirmBox == true) {
            alert("ยกเลิกการเพิ่มข้อมูลสำเร็จ")
            router.push('/database/trucktype')
        }
    }

    function functionBack() {
        router.back();
    }



    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen">

            {/* text header */}
            <div className="text header">
                <div className='mb-6'>
                    <button onClick={() => functionBack()}  className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>

                <p className=" text-3xl font-bold">เพิ่มข้อมูลประเภทรถ</p>
                <p className="pt-2">เพิ่มข้อมูลประเภทรถภายในระบบฐานข้อมูล</p>


            </div>

            {/* tool ค้นหา */}
            <div className="pt-4 ">
                <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl  ">

                    {/* inputdata */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อประเภทรถ:</p>
                            <input type="text"
                                value={typeName}
                                onChange={(e) => setTypeName(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อ code:</p>
                            <input type="text"
                                value={typeCode}
                                onChange={(e) => setTypeCode(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>


                        

                    </div>


                    {/* ปุ่ม */}
                    <div className="flex flex-wrap gap-8 pt-5 justify-center ">
                        <button className=" bg-green-500 hover:bg-green-600 px-5 rounded text-white" onClick={() => functionSave()}>บันทึก</button>
                        <button className=" bg-red-500 hover:bg-red-600 px-5 rounded text-white" onClick={() => functionCancel()} >ยกเลิก</button>

                    </div>

                </div>

            </div>




        </div>
    )

};
