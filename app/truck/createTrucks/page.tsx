"use client";

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot, doc, getDocFromCache, getDoc, getFirestore } from "firebase/firestore";
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
import { Arrow_donw_icon, Arrow_left_icon, Arrow_up_icon } from '@/app/icons/activeIcon';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

let data = collection(db, "TruckModel")

export default function CreateTrucksTest() {
    const router = useRouter()
    const [nameModel, setNameModel] = useState("");
    const [ps, setPs] = useState("");
    const [costprice, setCostprice] = useState("");
    const [length, setLength] = useState("");
    const [lp, setLp] = useState("");
    const [irp, setIrp] = useState("");
    const [codeprice, setCodeprice] = useState("");

    const [invNum, setInvNum] = useState("");
    const [productTax, setProductTax] = useState("");
    const [serialNum, setSerialNum] = useState("");
    const [chassis, setChassis] = useState("");
    const [parking, setParking] = useState("");
    const [img, setImg] = useState("");
    const [typeT, setTypeT] = useState<ArrayType>([]);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState<any>([]);
    const [spinner, setSpinner] = useState(false);
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
            setTypeT(newData);
        });
        return () => {
            unsubscribe();
        };
    };

    const [input, setInput] = useState("");

    const fetchData = (value: any) => {
        const results = typeT.filter((TruckModel: { m_name: string; }) => {
            return (
                value &&
                TruckModel &&
                TruckModel.m_name &&
                // TruckModel.m_name.slice(0,8).includes(value)
                TruckModel.m_name.toLowerCase().includes(value) ||
                TruckModel.m_name.toUpperCase().includes(value)
            );
        });

        setValue(results);
    };

    const handleChange = async (value: SetStateAction<string>) => {
        setInput(value);
        fetchData(value);
        setNameModel(value);


    };

    const q = query(data, where("m_name", "==", input));
    const unsub = onSnapshot(q, (querySnapshot) => {
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            // cities.push(doc.data().m_ps);
            setPs(doc.data().m_ps)
            setLength(doc.data().m_length)
            setIrp(doc.data().m_irp)
            setCostprice(doc.data().m_costprice)
            setLp(doc.data().m_lp)
            setCodeprice(doc.data().m_codeprice)
            setImg(doc.data().m_image)
        });
        // console.log("Current cities in CA: ", cities.join(", "));
    });


    useEffect(() => {
        const unsubscribe = loadRealtime();

        return () => {
            unsubscribe();
            unsub();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            setSpinner(true)
            try {
                const docRef = await addDoc(collection(db, "Truck"), {
                    t_deduction_date: deductionDate,
                    t_inv_num: invNum,
                    t_product_tax: productTax,
                    m_name: input,
                    m_ps: ps,
                    m_length: length,
                    t_serial_num: serialNum,
                    t_chassis: chassis,
                    t_parking: parking,
                    m_img: img,
                    m_costprice: costprice,
                    m_lp: lp,
                    m_irp: irp,
                    m_codeprice: codeprice,

                    t_status: "STOCK",
                });
                alert("บันทึกสำเร็จ")
                router.push('/truck')

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
            router.push('/truck')
        }
    }
    //---------------



    const [isOpen, setIsOpen] = useState(false);
    const [optionT, setOptionT] = useState("");
    const [deductionDate, setDeductionDate] = useState<any>(null);
    const handleChangeDate = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;

        console.log(date);
        setDeductionDate(date);

    };
    console.log("date", deductionDate);

    //ย้อนกลับ
    function functionBack() {
        router.back();
    }


    return (
        <div>
            <div className={spinner === true ? 'absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-50' : ' hidden'}>
                <center className=''>
                    <div id="spinner" className='flex justify-center items-center' >
                        {/* loading */}
                        <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                </center><br />
            </div>


            <div className={spinner === true ? `md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen opacity-50` : `md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen`}>


                {/* text header */}
                <div className="text header">
                    <div className='mb-6'>
                        <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold">เพิ่มข้อมูลรถ</p>
                    <p className="pt-2">เพิ่มข้อมูลรถภายในระบบฐานข้อมูล</p>
                </div>

                {/* tool ค้นหา */}
                <div className="pt-4 space-y-4">
                    <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl">
                        <p className="pb-4 text-xl font-bold" onClick={(e) => setIsOpen(false)}>ส่วนที่ 1 - ข้อมูลรถ</p>


                        {/* inputdata */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">วันที่ตัดบัญชี:</p>
                                <DatePicker
                                    selected={deductionDate}
                                    selectsStart
                                    placeholderText="Select Start Date"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(e) => {
                                        // setDeductionDate(e);
                                        handleChangeDate(e)
                                    }}
                                />
                                {/* <input type="date"
                                value={deductionDate}
                                onChange={(e) => setDeductionDate(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full w-[199.2px]"
                                placeholder="Search" /> */}

                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">INV.:</p>
                                <input type="text"
                                    value={invNum}
                                    onChange={(e) => setInvNum(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ใบกำกับภาษีสินค้า:</p>
                                <input type="text"
                                    value={productTax}
                                    onChange={(e) => setProductTax(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            {/* seach to input value */}
                            <div className="flex gap-4 max-md:w-full" >
                                <p className="max-w-32 md:w-32 w-full font-bold" onClick={(e) => setIsOpen(false)}>รุ่นรถ:</p>
                                <div className='flex flex-col'>
                                    <input
                                        placeholder="Type to search..."
                                        value={input}
                                        onChange={(e) => { handleChange(e.target.value) }}
                                        onClick={(e) => {

                                            setIsOpen(true);
                                        }}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    />

                                    <div className="pl-1 ring-1 absolute mt-6 bg-white ring-inset ring-gray-300 min-w-[199.2px]" >
                                        {isOpen == true && (

                                            value?.map((option: {
                                                id: "",
                                                m_name: ""
                                            }) => (
                                                <option key={option.id} className='max-md:truncate hover:bg-slate-100 ' value={option.m_name} onClick={(e) => {
                                                    setInput(option.m_name);
                                                    setIsOpen(false);
                                                }}>{option.m_name}</option>
                                            ))

                                        )}
                                    </div>


                                </div>
                                {/* <input type="text"
                                value={nameModel}
                                onChange={(e) => setNameModel(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" /> */}
                            </div>


                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">แรงม้า:</p>



                                <input type="text"
                                    value={input == "" ? "" : ps}
                                    onChange={(e) => setPs(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />

                            </div>


                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ความยาวรถ:</p>
                                <input type="text"
                                    value={input == "" ? "" : length}
                                    onChange={(e) => setLength(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />
                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">หมายเลขเครื่อง:</p>
                                <input type="text"
                                    value={serialNum}
                                    onChange={(e) => setSerialNum(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">หมายเลขคัสซี:</p>
                                <input type="text"
                                    value={chassis}
                                    onChange={(e) => setChassis(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ที่จอดรถ:</p>
                                <input type="text"
                                    value={parking}
                                    onChange={(e) => setParking(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />
                            </div>

                            <div>

                            </div>

                        </div>
                    </div>


                    {/* price */}
                    <div className=' bg-cyan-50  w-full p-8 shadow-md rounded-2xl'>
                        <p className="pb-4 text-xl font-bold">ส่วนที่ 2 - ข้อมูลราคา</p>

                        <div className='flex flex-wrap gap-4'>
                            {
                                role === "admin" ? 
                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full font-bold">ราคาทุน:</p>
                                    <input type="number"
                                        value={input == "" ? "" : costprice}

                                        onChange={(e) => setCostprice(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                                </div> 
                                : ""
                            }


                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">LP:</p>
                                <input type="number"
                                    value={input == "" ? "" : lp}
                                    onChange={(e) => setLp(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">IRP:</p>
                                <input type="text"

                                    value={input == "" ? "" : irp}
                                    onChange={(e) => setIrp(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">Code ราคา:</p>
                                <input type="text"
                                    value={input == "" ? "" : codeprice}

                                    onChange={(e) => setCodeprice(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                        </div>
                    </div>

                    {/* cus */}
                    {/* <div className=' bg-cyan-50  w-full p-8 shadow-md rounded-2xl'>
                    <p className="pb-4 text-xl font-bold">ส่วนที่ 3 - ข้อมูลการจอง</p>

                    <div className='flex flex-wrap gap-4'>
                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ชื่อ-นามสกุลผู้จอง:</p>
                            <input type="text"
                                value={contribution}
                                onChange={(e) => setContribution(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">ส่วนลดพิเศษ Hino:</p>
                            <input type="text"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>
                    </div> 
                </div>*/}



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
