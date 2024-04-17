"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Arrow_left_icon } from '@/app/icons/activeIcon';

const NameTitle = [
    { id: 1, label: "- เลือกคำนำหน้า -", value: "" },
    { id: 2, label: "นาย", value: "นาย" },
    { id: 3, label: "นาง", value: "นาง" },
    { id: 4, label: "นางสาว", value: "นางสาว" },
]

let data2 = collection(db, "Roles")


export default function CreateEmployee() {
    const router = useRouter()
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [tel, setTel] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [nametitle, setNametitle] = useState("")
    const [nickname, setNickname] = useState("")

    const auth = getAuth();

    const [items, setItems] = useState<ArrayType>([]);

    useEffect(() => {
        return onSnapshot(data2, (res) => {
            setItems(res.docs.map((item) => {
                return { ...item.data(), id: item.id }
            }))
        })
    }, [])


    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            alert("บันทึกสำเร็จ")
            createUserWithEmailAndPassword(auth, email, tel)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
            try {
                const docRef = await addDoc(collection(db, "Employees"), {
                    employee_fname: fname,
                    employee_lname: lname,
                    employee_tel: tel,
                    employee_email: email,
                    role: role,
                    employee_nametitle: nametitle,
                    employee_nickname: nickname,

                });

                router.push('/employee')

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
            router.push('/employee')
        }
    }

    //---------------
    function hasSelect(event: any) {
        setRole(event.target.value)
    }



    function hasSelectNameTitle(nt: any) {
        setNametitle(nt.target.value)
    }
     //ย้อนกลับ
     function functionBack() {
        router.back();
    }

    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen">

            {/* text header */}
            <div className="text header">
            <div className='mb-6'>
                    <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>
                <p className=" text-3xl font-bold">เพิ่มข้อมูลพนักงาน</p>
                <p className="pt-2">เพิ่มข้อมูลพนักงานภายในระบบฐานข้อมูล</p>
            </div>

            {/* tool ค้นหา */}
            <div className="pt-4 ">
                <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl  ">

                    {/* inputdata */}
                    <div className="flex flex-wrap gap-4">

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">คำนำหน้า:</p>
                            <div className="">
                                <select className="lg:w-[199.2px] pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" onChange={hasSelectNameTitle}>
                                    {
                                        NameTitle.map((option) => (
                                            <option key={option.id} value={option.value}>{option.label}</option>
                                        ))
                                    }
                                </select>
                
                            </div>

                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อจริง:</p>
                            <input type="text"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">นามสกุล:</p>
                            <input type="text"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อเล่น:</p>
                            <input type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">Email:</p>
                            <input type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">เบอร์โทร:</p>
                            <input type="text"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>




                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">สิทธิการเข้าถึง</p>
                            <select className="lg:w-[199.2px] pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" onChange={hasSelect}>
                                {items?.map((u: {
                                    role_id: "",
                                    role_name: "",
                                    id: ""
                                }) => (

                                    <option key={u.id} value={u.role_name}>{u.role_name}</option>

                                ))}
                            </select>
                            <p>{role}</p>

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
