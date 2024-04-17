"use client";

import Link from "next/link"
import { Arrow_donw_icon, Arrow_up_icon, Delete_icon, Edit_icon, View_icon } from "../icons/activeIcon";
import { useState, useEffect, SetStateAction, useRef } from "react";
import { useRouter } from 'next/navigation'
import { collection, query, getDocs, limit, where, onSnapshot, startAfter, deleteDoc, doc, count } from "firebase/firestore";
import { db } from "../firebase";
import Pagination2 from "../components/Pagination2";
import { utils, writeFileXLSX } from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";


let data = collection(db, "Truck")
let data2 = collection(db, "Status")


export default function Truck() {
    const [items, setItems] = useState<ArrayType>([]);
    const [totalP, setTotalP] = useState<ArrayType>([]);
    const [typeS, setTypeS] = useState<ArrayType>([]);
    const [afterThis, setAfterThis] = useState(null);
    const [slug, setSlug] = useState(null);
    const [beforeThis, setBeforeThis] = useState(null);
    const [page, setPage] = useState(0);
    const router = useRouter();
    const tbl = useRef(null);
    const now = new Date();

    const [isOpen2, setIsOpen2] = useState(false);
    const [optionS, setOptionS] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [endDate2, setEndDate2] = useState("");
    const [startDate2, setStartDate2] = useState("");
    const [role, setRole] = useState("");
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const email = user.email;
            // console.log("This account:", uid, email);

            const q = query(collection(db, "Employees"), where("employee_email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {

                // console.log(doc.id, " => ", doc.id);
                // setUserName(doc.id);
                setRole(doc.data().role);
            });
        } else {
            // User is signed out
            // alert("sign in Error!");
            router.push("/")
            setRole("")

        }
    });



    // const loadRealtime = () => {
    const q = query(collection(db, "Truck"), where("t_status", "==", optionS));
    const unsubscribe = onSnapshot((optionS == "" ? data : q), (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setItems(newData);
        // setPage(newData.length)
    });

    const getStatus = () => {
        const sub = onSnapshot(data2, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTypeS(newData);
        });
        return () => {
            sub();
        };
    };

    useEffect(() => {
        // const unsubscribe = loadRealtime();
        const sub = getStatus();
        return () => {
            // unsubscribe();
            sub();
        };
    }, []);

    const [input, setInput] = useState("");
    const [value, setValue] = useState([]);
    const [valueStatus, setValueStatus] = useState([]);

    const fetchData = (value: any) => {
        const results = items.filter((Truck: { m_name: string; t_serial_num: string; t_chassis: string; }) => {
            return (
                value &&
                Truck &&
                Truck.m_name &&
                Truck.m_name.slice(0, 8).includes(value) ||
                Truck.m_name.toLowerCase().includes(value) ||
                Truck.m_name.toUpperCase().includes(value) ||
                Truck.t_serial_num &&
                Truck.t_serial_num.slice(0, 8).includes(value) ||
                Truck.t_serial_num.toLowerCase().includes(value) ||
                Truck.t_serial_num.toUpperCase().includes(value) ||
                Truck.t_chassis &&
                Truck.t_chassis.slice(0, 18).includes(value) ||
                Truck.t_chassis.toLowerCase().includes(value) ||
                Truck.t_chassis.toUpperCase().includes(value)
            );
        });
        console.log("eiei", results);

        setValue(results);
    };

    const toggleDropdown = () => {
        setIsOpen2(!isOpen2);
        if (input === "") {
            fetchData(optionS);
        } else {
            fetchData(input);
        }
    };

    const handleChange = async (value: (SetStateAction<string>)) => {
        setInput(value);
        fetchData(value);
    };

    const deChange = () => {
        setInput("");
        fetchData("");
        setOptionS("")
        setIsOpen2(false);
    };
    const stateChange = (s: string) => {
        setOptionS(s);
        if (input === "") {
            fetchData(s);
        } else {
            fetchData(input);
        }

        setIsOpen2(false);
    };

    const onChangeDate = (dates: any) => {
        const [start, end] = dates;
        // console.log(start, end);

        setStartDate(start);
        setEndDate(end);

        const day = start == null ? 1 : start.getDate();
        const month = start == null ? 1 : start.getMonth() + 1;
        const year = start == null ? 2024 : start.getFullYear();
        const date = `${year}-${month}-${day}`;

        const day2 = end == null ? 1 : end.getDate();
        const month2 = end == null ? 1 : end.getMonth() + 1;
        const year2 = end == null ? 2024 : end.getFullYear();
        const date2 = `${year2}-${month2}-${day2}`;

        fetchData(date);
        setStartDate2(date);
        setEndDate2(date2);
    };
    const onChangeDate2 = () => {
        setStartDate(new Date());
        setEndDate(null);
        setStartDate2("");
        setEndDate2("");
    };

    const dbView = async (id: string) => {
        console.log(id);
        router.push(`/truck/${id}`)

    }

    const dbEdit = async (id: string) => {
        console.log(id);
        router.push(`/truck/editTrucks/${id}`)

    }

    const handleDelete = async (id: any) => {
        const confirmBox = window.confirm(
            `คุณต้องการลบข้อมูล ${id} หรือไม่?`
        )

        if (confirmBox == true) {
            alert("ลบข้อมูลสำเร็จ")
            try {
                await deleteDoc(doc(data, id));


            } catch (e) {
                console.error("Error adding document: ", e);
            }

        }

    };

    //Pagination2
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;


    const onPageChange = (page: SetStateAction<number>) => {
        setCurrentPage(page);
    };
    const onPageChange2 = (page: SetStateAction<number>) => {
        setCurrentPage(page);
    };

    const lastPostIndex = currentPage * pageSize;
    const firstPostIndex = lastPostIndex - pageSize;
    const currentPosts = value.slice(firstPostIndex, lastPostIndex);
    const currentPosts2 = items.slice(firstPostIndex, lastPostIndex);



    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen ">
            {/* text header */}
            <div className="text header">
                <p className=" text-2xl md:text-3xl font-bold">ข้อมูลรถ</p>
            </div>

            {/* tool ค้นหา */}
            <div className="pt-4">
                <div className=" bg-cyan-50  w-full p-4 md:p-8 shadow-md rounded-2xl flex flex-wrap gap-4  items-center">
                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-md:max-w-20 md:max-w-32 w-full max-md:text-sm">ค้นหารุ่นรถ:</p>
                        <input
                            placeholder="Type to search..."
                            value={input}
                            onChange={(e) => { handleChange(e.target.value) }}
                            className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                        />

                    </div>

                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-md:max-w-20 md:max-w-32 w-full max-md:text-sm">ค้นหาสถานะ:</p>

                        <div className="relative md:w-[199.2px] w-full">
                            <button
                                className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                onClick={toggleDropdown}
                            >
                                {optionS == "undefined" || optionS == "" ? "เลือกประเภทรถ" : optionS != "" ? optionS : "เลือกประเภทรถ"}

                                {isOpen2 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                            </button>
                            {isOpen2 && (
                                <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                    {typeS?.map((option: {
                                        id: ""
                                        s_name: ""
                                    }) => (
                                        <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${optionS == option.s_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                            stateChange(option.s_name)
                                        }}

                                        >
                                            {option.s_name}
                                        </div>
                                    ))}

                                </div>
                            )}



                        </div>

                    </div>


                    <button
                        className="flex justify-center rounded-md text-center text-white bg-sky-600 hover:bg-sky-700 p-2 max-w-20 w-full text-sm"
                        onClick={deChange}
                    >

                        ล้าง
                    </button>



                    {/* <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">ระยะเวลา:</p>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText="Select Start Date"
                                    dateFormat="dd/MM/yyyy"
                            onChange={(update: any) => {
                                onChangeDate(update);
                            }}
                            className='pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full'
                        />
                        <button
                            className=""
                            onClick={() => onChangeDate2()}
                        >
                            {startDate2 != ""  ? "x" : ""}

                        </button>

                        <p>{startDate2}</p>
                        <p>{endDate2}</p>

                    </div> */}

                </div>

            </div>

            {/* ปุ่ม เพิ่มข้อมูล ข้อมูลหน้าละ 15 ตัว */}
            <div className="flex w-full ">
                {/* <div className="w-full">


                    <div className={`py-6 flex space-x-4 `}>

                        <button onClick={() => {
                            const wb = utils.table_to_book(tbl.current);
                            // write to XLSX เปลี่ยนชื่อไฟล์
                            writeFileXLSX(wb, `${now}.xlsx`);
                        }}>Export XLSX</button>

                    </div>


                </div> */}

                <div className=" py-6 flex flex-row-reverse">
                    {
                        role === "admin" ? <Link className="w-24 bg-green-500 text-white rounded-md hover:bg-green-600 h-8 text-center py-1" href='/truck/createTrucks'>เพิ่มข้อมูล</Link>
                            : ""
                    }

                </div>

            </div>


            <div className="md:px-6 p-4 bg-cyan-50 shadow-md rounded-2xl ">
                <table className="table-fixed  max-w-[1680px] w-full divide-y " ref={tbl}>
                    <thead >
                        <tr >

                            <th className="">รุ่นรถ</th>
                            <th className=" max-md:hidden">เลขเครื่อง</th>
                            <th className="max-lg:hidden">เลขคัสซี</th>
                            <th className="">สถานะ</th>
                            <th className="">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {
                            value.length != 0 ?
                                currentPosts?.map((u: {
                                    m_name: "",
                                    t_chassis: "",
                                    t_serial_num: "",
                                    t_status: "",
                                    id: "",
                                }) => (
                                    <tr key={u.id} className="">
                                        <td className="">{u.m_name}</td>
                                        <td className="text-center max-md:hidden">{u.t_serial_num}</td>
                                        <td className="text-center max-lg:hidden">{u.t_chassis}</td>
                                        <td className="text-center ">{u.t_status}</td>
                                        <td className="flex lg:gap-6 max-lg:space-x-4 justify-center my-2" >
                                            <button className="flex justify-between rounded-md text-center text-white bg-sky-600 hover:bg-sky-700 p-2 max-w-20 w-full text-sm" onClick={() => dbView(u.id)} ><View_icon color="#fff" /> ดู</button>
                                            {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-amber-500 hover:bg-amber-600 p-2 max-w-20 w-full text-sm" onClick={() => dbEdit(u.id)}  ><Edit_icon color="#fff" /> แก้ไข</button>
                                                : ""}
                                            {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-red-500 hover:bg-red-600 max-xl:hidden p-2 max-w-20 w-full text-sm" onClick={() => handleDelete(u.id)} ><Delete_icon color="#fff" />ลบ</button>
                                                : ""}
                                        </td>

                                    </tr>

                                ))
                                :
                                currentPosts2?.map((u: {
                                    m_name: "",
                                    t_chassis: "",
                                    t_serial_num: "",
                                    t_status: "",
                                    id: "",
                                }) => (
                                    <tr key={u.id} className="">
                                        <td className="">{u.m_name}</td>
                                        <td className="text-center max-md:hidden">{u.t_serial_num}</td>
                                        <td className="text-center  max-lg:hidden">{u.t_chassis}</td>
                                        <td className="text-center  ">{u.t_status}</td>
                                        <td className="flex lg:gap-6 max-lg:space-x-4 justify-center my-2" >
                                            <button className="flex justify-between rounded-md text-center text-white bg-sky-600 hover:bg-sky-700 p-2 max-w-20 w-full text-sm" onClick={() => dbView(u.id)} ><View_icon color="#fff" /> ดู</button>
                                            {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-amber-500 hover:bg-amber-600 p-2 max-w-20 w-full text-sm" onClick={() => dbEdit(u.id)}  ><Edit_icon color="#fff" /> แก้ไข</button>
                                                : ""}
                                            {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-red-500 hover:bg-red-600 max-xl:hidden p-2 max-w-20 w-full text-sm" onClick={() => handleDelete(u.id)} ><Delete_icon color="#fff" />ลบ</button>
                                                : ""}
                                        </td>

                                    </tr>

                                ))
                        }


                    </tbody>
                </table>


            </div>

            <div className="my-5">
                <Pagination2
                    items={value.length != 0 ? value.length : items.length} // 100
                    currentPage={currentPage} // 1
                    pageSize={pageSize} // 10
                    onPageChange={onPageChange}
                    onPageChange2={onPageChange2}
                />


            </div>


        </div>
    )

};
