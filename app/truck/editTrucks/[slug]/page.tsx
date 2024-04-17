'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect, SetStateAction } from "react";
import { collection, query, addDoc, where, onSnapshot, doc, getDoc, getFirestore, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import Loading from '@/app/components/Loading';
import { Arrow_donw_icon, Arrow_left_icon, Arrow_up_icon } from '@/app/icons/activeIcon';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';


let data = collection(db, "TruckModel")
let data2 = collection(db, "Status")

export default function EditTrucksTest(props: any) {
    const DataID = props.params.slug;
    const router = useRouter()
    const [nameModel, setNameModel] = useState("");
    const [ps, setPs] = useState("");
    const [costprice, setCostprice] = useState("");
    const [length, setLength] = useState("");
    const [lp, setLp] = useState("");
    const [irp, setIrp] = useState("");
    const [codeprice, setCodeprice] = useState("");
    const [deductionDate, setDeductionDate] = useState<any>(null);
    const [invNum, setInvNum] = useState("");
    const [productTax, setProductTax] = useState("");
    const [serialNum, setSerialNum] = useState("");
    const [chassis, setChassis] = useState("");
    const [parking, setParking] = useState("");
    const [status, setStatus] = useState("");
    const [typeT, setTypeT] = useState<ArrayType>([]);
    const [typeS, setTypeS] = useState<ArrayType>([]);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState<any>([]);
    const [img, setImg] = useState("");
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

    const getData = async (DataID: string) => {
        const db = getFirestore()
        const docRef = doc(db, "Truck", DataID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const product = { id: docSnap.id, ...docSnap.data() };
            const product2 = { id: docSnap.id, name: docSnap.data().m_name, ...docSnap.data() };
            const product3 = { id: docSnap.id, date: docSnap?.data().t_deduction_date, ...docSnap.data() };

            setDeductionDate(product3.date)
            setInput(product2.name)
            setItems(product);
            return product;
        } else {
            console.log("No such document!");
        }
    }

    const fetchData = (value: any) => {
        const results = typeT.filter((TruckModel: { m_name: string; }) => {
            return (
                value &&
                TruckModel &&
                TruckModel.m_name &&
                TruckModel.m_name.toLowerCase().includes(value)
            );
        });

        setValue(results);
    };

    const handleChange = async (value: SetStateAction<string>) => {
        setInput(value);
        fetchData(value);
        setNameModel(value);
    };
    const handleChangeDate = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;

        console.log(date);
        setDeductionDate(date);

    };


    const q = query(data, where("m_name", "==", input));
    const unsub = onSnapshot(q, (querySnapshot) => {
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            // cities.push(doc.data().m_ps);
            setPs(doc.data().m_ps)
            setLength(doc.data().m_length)
            setImg(doc.data().m_image)
        });
        // console.log("Current cities in CA: ", cities.join(", "));
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
        const unsubscribe = loadRealtime();
        const sub = getStatus();
        return () => {
            unsubscribe();
            getData(DataID);
            unsub();
            sub();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            alert("บันทึกสำเร็จ")
            try {
                const SwapUpdateRef = doc(db, "Truck", DataID);

                //วันที่ตัดบิล
                if (deductionDate === "undefined" || deductionDate === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_deduction_date: items.t_deduction_date,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_deduction_date: deductionDate,
                    });
                }

                //inv
                if (invNum === "undefined" || invNum === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_inv_num: items.t_inv_num,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_inv_num: invNum,
                    });
                }

                //ใบกำกับภาษีสินค้า
                if (productTax === "undefined" || productTax === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_product_tax: items.t_product_tax,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_product_tax: productTax,
                    });
                }

                // ชื่อรุ่น
                if (input === "undefined" || input === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_name: items.m_name,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_name: input,
                    });
                }

                // แรงม้า
                if (ps === "undefined" || ps === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_ps: items.m_ps,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_ps: ps,
                    });
                }

                // ความยาว
                if (length === "undefined" || length === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_length: items.m_length,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_length: length,
                    });
                }

                // หมายเลขเครื่อง
                if (serialNum === "undefined" || serialNum === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_serial_num: items.m_length,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_serial_num: serialNum,
                    });
                }

                // หมายเลขคัสซี
                if (chassis === "undefined" || chassis === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_chassis: items.t_chassis,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_chassis: chassis,
                    });
                }

                // ที่จอดรถ
                if (parking === "undefined" || parking === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_parking: items.t_parking,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_parking: parking,
                    });
                }


                // ที่จอดรถ
                if (parking === "undefined" || parking === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_parking: items.t_parking,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_parking: parking,
                    });
                }

                // ราคาทุน
                if (costprice === "undefined" || costprice === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_costprice: items.m_costprice,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_costprice: costprice,
                    });
                }

                // lp
                if (lp === "undefined" || lp === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_lp: items.m_lp,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_lp: lp,
                    });
                }

                // irp
                if (irp === "undefined" || irp === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_irp: items.m_irp,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_irp: irp,
                    });
                }

                // โค้ดราคา
                if (codeprice === "undefined" || codeprice === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_codeprice: items.m_codeprice,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_codeprice: codeprice,
                    });
                }


                // สถานะ
                if (optionS === "undefined" || optionS === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_status: items.t_status,
                    });

                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_status: optionS,
                    });
                }
                // สถานะ
                if (img === "undefined" || img === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_img: items.m_img,
                    });

                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_img: img,
                    });
                }


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

    const [isOpen2, setIsOpen2] = useState(false);
    const [optionS, setOptionS] = useState("");

    const toggleDropdown = () => {
        setIsOpen2(!isOpen2);
    };

    if (!items.m_name) {
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
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen" >

            {/* text header */}
            <div className="text header">
                <div className='mb-6'>
                    <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>
                <p className=" text-3xl font-bold">แก้ไขข้อมูลรถ</p>
                <p className="pt-2">แก้ไขข้อมูลรถภายในระบบฐานข้อมูล</p>
            </div>

            {/* tool ค้นหา */}
            <div className="pt-4 space-y-4">
                <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl">
                    <p className="pb-4 text-xl font-bold" onClick={(e) => setIsOpen(false)}>ส่วนที่ 1 - ข้อมูลรถ</p>


                    {/* inputdata */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">วันที่ตัดบัญชี:</p>
                            <DatePicker
                                selected={deductionDate}
                                selectsStart
                                placeholderText="Select Start Date"
                                dateFormat="dd/MM/yyyy"
                                onChange={(e) => {
                                    handleChangeDate(e)
                                }}
                            />
                            {/* <input type="text"
                                defaultValue={items.t_deduction_date}
                                // value={status}
                                form='DD/MM/YYYY'
                                onChange={(e) => setDeductionDate(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full w-[199.2px]"
                                placeholder="Search" /> */}

                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">INV.:</p>
                            <input type="text"
                                defaultValue={items.t_inv_num}
                                onChange={(e) => setInvNum(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">ใบกำกับภาษีสินค้า:</p>
                            <input type="text"
                                defaultValue={items.t_product_tax}
                                onChange={(e) => setProductTax(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        {/* seach to input value */}
                        <div className="flex gap-4 max-md:w-full" >
                            <p className="max-w-32 md:w-32 w-full ">รุ่นรถ:</p>
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



                                <div className="pl-1 ring-1 absolute mt-6 bg-white ring-inset ring-gray-300  min-w-[199.2px] z-10" >
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

                        </div>


                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">แรงม้า:</p>



                            <input type="text"
                                value={ps}
                                onChange={(e) => setPs(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />

                        </div>


                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">ความยาวรถ:</p>
                            <input type="text"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />
                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">หมายเลขเครื่อง:</p>
                            <input type="text"
                                defaultValue={items.t_serial_num}
                                onChange={(e) => setSerialNum(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />

                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">หมายเลขคัสซี:</p>
                            <input type="text"
                                defaultValue={items.t_chassis}
                                onChange={(e) => setChassis(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">ที่จอดรถ:</p>
                            <input type="text"
                                defaultValue={items.t_parking}
                                onChange={(e) => setParking(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                            <p className="max-w-32 md:w-32 w-full ">สถานะ:</p>

                            <div className="relative md:w-[199.2px] w-full">
                                <button
                                    className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                    onClick={toggleDropdown}
                                >
                                    {optionS == "undefined" || optionS == "" && items.t_status == "" || items.t_status == "undefined" ? "เลือกประเภทรถ" : optionS != "" ? optionS : items.t_status}

                                    {isOpen2 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                </button>
                                {isOpen2 && (
                                    <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                        {typeS?.map((option: {
                                            id: ""
                                            s_name: ""
                                        }) => (
                                            <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${optionT == option.s_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                setOptionS(option.s_name);
                                                setIsOpen2(false);
                                            }}

                                            >
                                                {option.s_name}
                                            </div>
                                        ))}

                                    </div>
                                )}

                            </div>

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
                                <p className="max-w-32 md:w-32 w-full ">ราคาทุน:</p>
                                <input type="number"
                                    defaultValue={input == "" ? costprice : items.m_costprice}
                                    // value={costprice}
                                    onChange={(e) => setCostprice(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div> 
                            : ""
                        }


                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">LP:</p>
                            <input type="number"
                                defaultValue={input == "" ? lp : items.m_lp}
                                // value={lp}
                                onChange={(e) => setLp(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>

                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">IRP:</p>
                            <input type="text"
                                defaultValue={input == "" ? irp : items.m_irp}
                                // value={irp}
                                onChange={(e) => setIrp(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>


                        <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">Code ราคา:</p>
                            <input type="text"
                                defaultValue={input == "" ? codeprice : items.m_codeprice}
                                onChange={(e) => setCodeprice(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                        </div>


                    </div>
                </div>

                <div className="left pt-4">
                    <img
                        src={
                            img
                                ? img
                                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                        alt=""
                        width={250}
                        height={250}
                    />

                </div>



                {/* ปุ่ม */}
                <div className="flex flex-wrap gap-8 pt-5 justify-center ">
                    <button className=" bg-green-500 hover:bg-green-600 px-5 rounded text-white" onClick={() => functionSave()}>บันทึก</button>
                    <button className=" bg-red-500 hover:bg-red-600 px-5 rounded text-white" onClick={() => functionCancel()} >ยกเลิก</button>

                </div>
            </div>




        </div>
    )

};
