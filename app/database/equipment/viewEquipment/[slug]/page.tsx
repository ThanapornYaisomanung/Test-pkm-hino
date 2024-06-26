"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect } from "react";
import { collection, doc, getDoc, getFirestore, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import Loading from '@/app/components/Loading';
import { Arrow_left_icon, Delete_icon, Edit_icon } from '@/app/icons/activeIcon';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

let data = collection(db, "Equipment")

export default function ViewGarage(props: any) {
    const DataID = props.params.slug;
    const [items, setItems] = useState<any>([]);
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


    const getData = async () => {
        const db = getFirestore()
        const docRef = doc(db, "Equipment", DataID);
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

    // ปุ่ม
    const dbEdit = async (id: string) => {
        console.log(id);
        router.push(`/database/equipment/editEquipment/${id}`)
    }
    // ลบข้อมูล
    const handleDelete = async (id: any) => {
        const confirmBox = window.confirm(
            `คุณต้องการลบข้อมูล ${id} หรือไม่?`
        )

        if (confirmBox == true) {
            alert("ลบข้อมูลสำเร็จ")
            try {
                await deleteDoc(doc(data, id));
                router.push('/database/equipment')

            } catch (e) {
                console.error("Error adding document: ", e);
            }

        }
    };

    //ย้อนกลับ
    function functionBack() {
        router.back();
    }

    if (!items.et_name) {
        return (
            <div className=' h-screen'>
                <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 ">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }


    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen">

            {/* text header */}
            <div className="text header">
                <div className='mb-6'>
                    <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>

                <p className="text-2xl md:text-3xl font-bold">รายละเอียดข้อมูลอุปกรณ์</p>
                <p className="pt-2">รายละเอียดข้อมูลอุปกรณ์ภายในระบบฐานข้อมูล</p>
            </div>
            {/* tool ค้นหา */}
            <div className="pt-4 ">
                <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl  ">
                    {/* inputdata */}
                    <div className="gap-4 space-y-4">
                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full font-bold">ชื่ออุปกรณ์:</p>
                            <p>{items.et_name}</p>

                        </div>
                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-36 w-full font-bold">ลักษณะ:</p>
                            <div className="flex gap-4 max-md:w-full flex-col w-full">
                                {items.et_option?.map((o: {
                                    eType: "",
                                    id: ""
                                }, key: number) =>
                                    <div key={key} className="flex flex-col gap-4 px-2 rounded max-md:w-full">
                                        <p className=" max-md:w-full md:w-[199.2px] truncate ">{o.eType}</p>
                                    </div>
                                )}
                            </div>


                        </div>




                    </div>


                    {/* ปุ่ม */}
                    {
                        role === "admin" ? <div className="flex flex-wrap gap-8 pt-5 justify-center ">
                            <button className="flex justify-between rounded-md text-center text-white bg-amber-500 hover:bg-amber-600 p-2 max-w-20 w-full text-sm" onClick={() => dbEdit(DataID)} ><Edit_icon color="#fff" /> แก้ไข</button>
                            <button className="flex justify-between rounded-md text-center text-white bg-red-500 hover:bg-red-600 max-xl:hidden p-2 max-w-20 w-full text-sm" onClick={() => handleDelete(DataID)} ><Delete_icon color="#fff" /> ลบ</button>
                        </div> : ""
                    }


                </div>

            </div>







        </div>
    )
};
