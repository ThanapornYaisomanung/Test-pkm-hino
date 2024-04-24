"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot, getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Arrow_donw_icon, Arrow_left_icon, Arrow_up_icon } from '@/app/icons/activeIcon';
import Loading from '@/app/components/Loading';

const NameTitle = [
    { id: 1, label: "นาย", value: "นาย" },
    { id: 2, label: "นาง", value: "นาง" },
    { id: 3, label: "นางสาว", value: "นางสาว" },
]

let data2 = collection(db, "Roles")


export default function CreateEmployee(props: any) {
    const DataID = props.params.slug;
    const router = useRouter()
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [tel, setTel] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [Getrole, setGetRole] = useState<any>([]);
    const [nametitle, setNametitle] = useState("")
    const [nickname, setNickname] = useState("")

    const [items, setItems] = useState<any>([]);



    const getData = async () => {
        const db = getFirestore()
        const docRef = doc(db, "Employees", DataID);
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const product = { id: docSnap.id, ...docSnap.data() };
            setItems(product);
            return product;
        } else {

            console.log("No such document!");
        }

    }

    useEffect(() => {
        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return onSnapshot(data2, (res) => {
            setGetRole(res.docs.map((item) => {
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
            const SwapUpdateRef = doc(db, "Employees", DataID);

            try {
                // ชื่อรุ่น
                if (fname === "undefined" || fname === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_fname: items.employee_fname,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_fname: fname,
                    });
                }

                // นามสกุล
                if (lname === "undefined" || lname === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_lname: items.employee_lname,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_lname: lname,
                    });
                }
                // เบอร์โทร
                if (tel === "undefined" || tel === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_tel: items.employee_tel,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_tel: tel,
                    });
                }
                // เบอร์โทร
                if (email === "undefined" || email === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_email: items.employee_email,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_email: email,
                    });
                }
                // สิทธิ์
                if (role === "undefined" || role === "") {
                    await updateDoc(SwapUpdateRef, {
                        role: items.role,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        role: role,
                    });
                }

                // คำนำ
                if (nametitle === "undefined" || nametitle === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_nametitle: items.employee_nametitle,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_nametitle: nametitle,
                    });
                }

                // คำนำ
                if (nickname === "undefined" || nickname === "") {
                    await updateDoc(SwapUpdateRef, {
                        employee_nickname: items.employee_nickname,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        employee_nickname: nickname,
                    });
                }

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

    console.log(items);


    function hasSelectNameTitle(nt: any) {
        setNametitle(nt.target.value)
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [optionT, setOptionT] = useState("");

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown2 = () => {
        setIsOpen2(!isOpen2);
    };

    if (!items.employee_nickname) {
        return (
            <div className=' h-screen'>
                <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 ">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
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

                            <div className="relative md:w-[199.2px] w-full">
                                <button
                                    className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                    onClick={toggleDropdown}
                                >
                                    {nametitle == "undefined" || nametitle == "" && items.employee_nametitle == "" || items.employee_nametitle == "undefined" ? "เลือกประเภทรถ" : nametitle != "" ? nametitle : items.employee_nametitle}

                                    {isOpen == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                </button>
                                {isOpen && (
                                    <div className='bg-white text-gray-800 pt-1 absolute w-full z-10'>
                                        {
                                            NameTitle.map((option) => (
                                                // <option key={option.id} value={items.employee_nametitle == items.employee_nametitle ? items.employee_nametitle : option.value}>{items.employee_nametitle}</option>
                                                <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${nametitle == option.value ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                    setNametitle(option.value);
                                                    setIsOpen(false);
                                                }}

                                                >
                                                    {option.value}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}

                            </div>

                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อจริง:</p>
                            <input type="text"
                                defaultValue={items.employee_fname}
                                onChange={(e) => setFname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">นามสกุล:</p>
                            <input type="text"
                                defaultValue={items.employee_lname}

                                onChange={(e) => setLname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อเล่น:</p>
                            <input type="text"
                                defaultValue={items.employee_nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">Email:</p>
                            <input type="text"
                                defaultValue={items.employee_email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">เบอร์โทร:</p>
                            <input type="text"
                                defaultValue={items.employee_tel}
                                disabled
                                onChange={(e) => setTel(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>


                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">สิทธิการเข้าถึง:</p>

                            <div className="relative md:w-[199.2px] w-full">
                                <button
                                    className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                    onClick={toggleDropdown2}
                                >
                                    {role == "undefined" || role == "" && items.role == "" || items.role == "undefined" ? "เลือกประเภทรถ" : role != "" ? role : items.role}

                                    {isOpen2 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                </button>
                                {isOpen2 && (
                                    <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                        {

                                            Getrole?.map((u: {
                                                role_id: "",
                                                role_name: "",
                                                id: ""
                                            }) => (
                                                <div key={u.id} className={`hover:bg-gray-100 py-1 px-4 ${optionT == u.role_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                    setRole(u.role_name);
                                                    setIsOpen2(false);
                                                }}

                                                >
                                                    {u.role_name}
                                                </div>

                                            ))
                                        }
                                    </div>
                                )}

                            </div>

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
