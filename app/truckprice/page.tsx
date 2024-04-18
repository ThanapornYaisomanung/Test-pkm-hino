"use client";

import Link from "next/link"
import { Delete_icon, Edit_icon, View_icon, Print_icon } from "../icons/activeIcon";
import { useState, useEffect, SetStateAction, useRef, MutableRefObject } from "react";
import { useRouter } from 'next/navigation'
import { collection, query, getDocs, limit, where, onSnapshot, startAfter, deleteDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Pagination2 from "../components/Pagination2";
import Search from "../components/Search";
import ReactToPrint from "react-to-print";
import PrintData from "../components/PrintData";
import React from "react";
// import PrintData from "../printdata/page";
import { utils, writeFileXLSX } from "xlsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let data = collection(db, "TruckModel")



export default function TruckPrice() {
    const [items, setItems] = useState<ArrayType>([]);
    const [totalP, setTotalP] = useState<ArrayType>([]);
    const [afterThis, setAfterThis] = useState(null)
    const [slug, setSlug] = useState(null)
    const [beforeThis, setBeforeThis] = useState(null)
    const [page, setPage] = useState(1)
    const router = useRouter()
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
            setRole("")
            return router.push("/")


        }
    });


    const loadRealtime = () => {
        const unsubscribe = onSnapshot(data, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(newData);
        });
        return () => {
            unsubscribe();
        };
    };


    const [input, setInput] = useState("");
    const [value, setValue] = useState([]);

    const fetchData = (value: any) => {
        const results = items.filter((TruckModel: { m_name: string; }) => {
            return (
                value &&
                TruckModel &&
                TruckModel.m_name &&
                TruckModel.m_name.slice(0, 8).includes(value) ||
                TruckModel.m_name.toLowerCase().includes(value) ||
                TruckModel.m_name.toUpperCase().includes(value)
            );
        });
        console.log("eiei", results);

        setValue(results);
    };

    const handleChange = async (value: (SetStateAction<string>)) => {
        setInput(value);
        fetchData(value);
    };


    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const dbView = async (id: string) => {
        console.log(id);
        router.push(`/truckprice/${id}`)

    }

    const dbEdit = async (id: string) => {
        console.log(id);
        router.push(`/truckprice/editTruck/${id}`)

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
    console.log(currentPosts);

    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState<CheckData[]>([]);
    const componentRef = React.useRef<HTMLDivElement>(null);
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, []);

    const tbl = useRef(null);

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(items.map((li: { id: any; }) => li.id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleClick = (e: { target: { id: any; checked: any; }; }) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };


    const deChange = () => {
        setInput("");
        fetchData("");
    };



    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen ">
            {/* text header */}
            <div className="text header">
                <p className=" text-2xl md:text-3xl font-bold">ตรวจสอบราคารถ</p>
            </div>

            {/* tool ค้นหา */}
            <div className="pt-4">
                <div className=" bg-cyan-50 items-center w-full p-4 md:p-8 shadow-md rounded-2xl flex flex-wrap gap-4 ">
                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-20 md:max-w-32 w-full max-md:text-sm">ค้นหารุ่นรถ:</p>
                        <input
                            placeholder="Type to search..."
                            value={input}
                            onChange={(e) => { handleChange(e.target.value) }}
                            className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                        />
                    </div>



                    <button
                        className="flex justify-center rounded-md text-center text-white bg-sky-600 hover:bg-sky-700 p-2 max-w-20 w-full text-sm"
                        onClick={deChange}
                    >
                        ล้าง
                    </button>

                </div>

            </div>

            {/* ปุ่ม เพิ่มข้อมูล ข้อมูลหน้าละ 15 ตัว */}
            <div className="flex w-full">
                {/* <div className="w-full">


                    <div className={`py-6 flex space-x-4 `}>

                        <button onClick={() => {
                            const wb = utils.table_to_book(tbl.current);
                            // write to XLSX เปลี่ยนชื่อไฟล์
                            writeFileXLSX(wb, "SheetJSReactExport.xlsx");
                        }}>Export XLSX</button>

                        <div>
                            <ReactToPrint
                                trigger={() => <button>Print this out!</button>}
                                content={reactToPrintContent}
                            />

                        </div>
                    </div>


                </div> */}


                <div className=" py-6 flex flex-row-reverse">
                    {
                        role === "admin" ? <Link className="w-24 bg-green-500 text-white rounded-md hover:bg-green-600 h-8 text-center py-1" href='/truckprice/createTruck'>เพิ่มข้อมูล</Link>
                            : ""
                    }
                </div>
            </div>

            <div className=" hidden">

                <PrintData data={isCheck} componentRef={componentRef} />
            </div>




            <div className="md:px-6 p-4 bg-cyan-50 shadow-md rounded-2xl " >
                <table className="table-fixed  max-w-[1680px] w-full divide-y" ref={tbl}>
                    <thead >
                        <tr >

                            {/* <th className="w-14"><input
                                type="checkbox"
                                name="selectAll"
                                id="selectAll"
                                onChange={handleSelectAll}
                                checked={isCheckAll}

                            /></th> */}
                            <th className="">ชื่อรุ่น</th>
                            <th className=" max-md:hidden">ประเภทรถ</th>
                            <th className="max-sm:hidden">ความยาว</th>
                            <th className="max-sm:hidden">แรงม้า</th>
                            <th className="">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {value.length != 0 ?
                            currentPosts?.map((u: {
                                m_name: "",
                                m_type: "",
                                m_length: "",
                                m_ps: "",
                                id: "",
                            }) => (
                                <tr key={u.id} className="">
                                    {/* <td className="text-center"><input
                                    type="checkbox"
                                    value={u.id}
                                    name="id"
                                    onChange={handleClick}
                                    id={u.id}
                                    checked={isCheck.includes(u.id)}

                                /></td> */}
                                    <td className="max-md:text-sm">{u.m_name}</td>
                                    <td className="text-center max-md:hidden max-md:text-sm">{u.m_type}</td>
                                    <td className="text-center  max-sm:hidden max-md:text-sm">{u.m_length}</td>
                                    <td className="text-center  max-sm:hidden max-md:text-sm">{u.m_ps}</td>
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
                                m_type: "",
                                m_length: "",
                                m_ps: "",
                                id: "",
                            }) => (
                                <tr key={u.id} className="">
                                    {/* <td className="text-center"><input
                                    type="checkbox"
                                    value={u.id}
                                    name="id"
                                    onChange={handleClick}
                                    id={u.id}
                                    checked={isCheck.includes(u.id)}

                                /></td> */}
                                    <td className="">{u.m_name}</td>
                                    <td className="text-center max-md:hidden">{u.m_type}</td>
                                    <td className="text-center  max-sm:hidden">{u.m_length}</td>
                                    <td className="text-center  max-sm:hidden">{u.m_ps}</td>
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
