" ";
import { useState, useEffect, SetStateAction } from "react";
import Link from "next/link";
import { collection, query, getDocs, limit, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Arrow_left_icon, Delete_icon, Edit_icon, View_icon } from "../icons/activeIcon";
import { useRouter } from "next/navigation";
import Pagination2 from "../components/Pagination2";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let data = collection(db, "Employees")

export default function Employee() {
    const router = useRouter()
    const [items, setItems] = useState<ArrayType>([]);
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

    useEffect(() => {
        return onSnapshot(data, (res) => {
            setItems(res.docs.map((item) => {
                return { ...item.data(), id: item.id }
            }))
        })
    }, [])



    const [input, setInput] = useState("");
    const [value, setValue] = useState([]);

    const fetchData = (value: any) => {
        const results = items.filter((Employees: { employee_fname: string; employee_lname: string; employee_nickname: string }) => {
            return (
                value &&
                Employees &&
                Employees.employee_fname &&
                Employees.employee_fname.slice(0, 8).includes(value) ||
                Employees.employee_fname.toLowerCase().includes(value) ||
                Employees.employee_fname.toUpperCase().includes(value) ||
                Employees.employee_lname &&
                Employees.employee_lname.slice(0, 8).includes(value) ||
                Employees.employee_lname.toLowerCase().includes(value) ||
                Employees.employee_lname.toUpperCase().includes(value) ||
                Employees.employee_nickname &&
                Employees.employee_nickname.slice(0, 8).includes(value) ||
                Employees.employee_nickname.toLowerCase().includes(value) ||
                Employees.employee_nickname.toUpperCase().includes(value)
            );
        });
        console.log("eiei", results);

        setValue(results);
    };

    const handleChange = async (value: (SetStateAction<string>)) => {
        setInput(value);
        fetchData(value);
    };

    const deChange = () => {
        setInput("");
        fetchData("");
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

    const dbView = async (id: string) => {
        console.log(id);
        router.push(`/employee/${id}`)

    }

    const dbEdit = async (id: string) => {
        console.log(id);
        router.push(`/employee/editEmployee/${id}`)

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

    //ย้อนกลับ
    function functionBack() {
        router.back();
    }


    return (
        <div className="md:pt-8 md:pl-8 p-4 min-h-screen ">
            {/* text header */}
            <div className="text header">
                <div className='mb-6'>
                    <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>
                <p className=" text-3xl font-bold">ข้อมูลพนักงาน</p>

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

            {/* ปุ่ม เพิ่มข้อมูล */}
            <div className=" py-6 flex flex-row-reverse">
                {
                    role === "admin" ? <Link className="w-24 bg-green-500 text-white rounded-md hover:bg-green-600 h-8 text-center py-1" href='/employee/createEmployee'>เพิ่มข้อมูล</Link>
                        : ""
                }
            </div>


            <div className="md:px-6 p-4 bg-cyan-50 shadow-md rounded-2xl ">
                <table className="table-fixed  max-w-[1680px] w-full divide-y">
                    <thead >
                        <tr >

                            <th className="">ชื่อรุ่น</th>
                            <th className=" max-md:hidden">ประเภทรถ</th>
                            <th className="max-md:hidden">ความยาว</th>
                            <th className="max-md:hidden">แรงม้า</th>
                            <th className="">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {value.length != 0 ?
                            currentPosts?.map((u: {
                                role_id: "",
                                employee_fname: "",
                                employee_lname: "",
                                employee_nickname: "",
                                employee_tel: "",
                                employee_email: ""
                                id: "",
                            }) => (
                                <tr key={u.id} className="">
                                    <td className="">{u.employee_fname} {u.employee_lname}</td>
                                    <td className="text-center max-md:hidden">{u.employee_nickname}</td>
                                    <td className="text-center  max-md:hidden">{u.employee_tel}</td>
                                    <td className="text-center  max-md:hidden">{u.employee_email}</td>
                                    <td className="flex lg:gap-6 max-lg:space-x-4 justify-center my-2" >
                                        <button className="flex justify-between rounded-md text-center text-white bg-sky-600 hover:bg-sky-700 p-2 max-w-20 w-full text-sm" onClick={() => dbView(u.id)} ><View_icon color="#fff" /> ดู</button>
                                        {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-amber-500 hover:bg-amber-600 p-2 max-w-20 w-full text-sm" onClick={() => dbEdit(u.id)}  ><Edit_icon color="#fff" /> แก้ไข</button>
                                            : ""}
                                        {role === "admin" ? <button className="flex justify-between rounded-md text-center text-white bg-red-500 hover:bg-red-600 max-xl:hidden p-2 max-w-20 w-full text-sm" onClick={() => handleDelete(u.id)} ><Delete_icon color="#fff" />ลบ</button>
                                            : ""}
                                    </td>

                                </tr>

                            ))
                            : currentPosts2?.map((u: {
                                role_id: "",
                                employee_fname: "",
                                employee_lname: "",
                                employee_nickname: "",
                                employee_tel: "",
                                employee_email: ""
                                id: "",
                            }) => (
                                <tr key={u.id} className="">
                                    <td className="">{u.employee_fname} {u.employee_lname}</td>
                                    <td className="text-center max-md:hidden">{u.employee_nickname}</td>
                                    <td className="text-center  max-md:hidden">{u.employee_tel}</td>
                                    <td className="text-center  max-md:hidden">{u.employee_email}</td>
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
