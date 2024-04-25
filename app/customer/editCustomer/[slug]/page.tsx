"use client";
import { useRouter } from 'next/navigation'
import { useState, useEffect, SetStateAction } from "react";
import { collection, query, addDoc, where, onSnapshot, doc, getDoc, getFirestore, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import Loading from '@/app/components/Loading';
import { Arrow_donw_icon, Arrow_left_icon, Arrow_up_icon } from '@/app/icons/activeIcon';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Percent = [
    { id: 1, label: "0%", value: 0 },
    { id: 2, label: "5%", value: 5 },
    { id: 3, label: "10%", value: 10 },
    { id: 4, label: "15%", value: 15 },
    { id: 5, label: "20%", value: 20 },
    { id: 6, label: "25%", value: 25 },
    { id: 7, label: "30%", value: 30 },
    { id: 8, label: "35%", value: 35 },
    { id: 9, label: "40%", value: 40 },
    { id: 10, label: "50%", value: 50 },
    { id: 11, label: "60%", value: 60 },
    { id: 12, label: "70%", value: 70 },
    { id: 13, label: "80%", value: 80 },
    { id: 14, label: "90%", value: 90 },
    { id: 15, label: "100%", value: 100 },
]

let data = collection(db, "TruckModel")
let data2 = collection(db, "Status")
let data3 = collection(db, "Business")
let data4 = collection(db, "Booking")
let data5 = collection(db, "Garage")
let data6 = collection(db, "Equipment")

export default function EditCustomer(props: any) {
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
    const [realPrice, setRealPrice] = useState(0);
    const [typeT, setTypeT] = useState<ArrayType>([]);
    const [typeS, setTypeS] = useState<ArrayType>([]);
    const [garage, setGarage] = useState<ArrayType>([]);
    const [typeB, setTypeB] = useState<ArrayType>([]);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState<any>([]);
    const [itemB, setItemB] = useState<any>([]);
    const [cusName, setCusName] = useState("");
    const [cusTel, setCusTel] = useState("");
    const [saleName, setSaleName] = useState("");
    const [dateBooking, setDateBooking] = useState<any>(null);
    const [optionB, setOptionB] = useState("");
    const [optionGarage, setOptionGarage] = useState("");
    const [idB, setIdB] = useState("");
    const [equipment, setEquipment] = useState<ArrayType>([]);
    const [emType, setEMType] = useState<ArrayType>([]);
    const [dateEM, setDateEM] = useState("");
    const [dateEM2, setDateEM2] = useState("");
    const [optionEM, setOptionEM] = useState("");
    const [note, setNote] = useState("");
    const [salesTax, setSalesTax] = useState("");
    const [emPrice, setEMprice] = useState<number>(0);
    const [sumPrice, setSumPrice] = useState<number>(0);
    const [downPay, setDownPay] = useState<number>(0);
    const [finance, setFinance] = useState<number>(0);
    const [percent, setPercent] = useState(0);
    const [spinner, setSpinner] = useState(false);
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

    const getData = async () => {
        const db = getFirestore()
        const docRef = doc(db, "Truck", DataID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const product = { id: docSnap.id, ...docSnap.data() };
            const product2 = { id: docSnap.id, name: docSnap.data().m_name, ...docSnap.data() };
            const product3 = { id: docSnap.id, date: docSnap.data().t_deduction_date, ...docSnap.data() };

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

    const q = query(data, where("m_name", "==", input));
    const unsub = onSnapshot(q, (querySnapshot) => {
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {
            setPs(doc.data().m_ps)
            setLength(doc.data().m_length)
            setImg(doc.data().m_image)
        });
    });


    const em = query(data6, where("et_name", "==", dateEM));
    const unsubEM = onSnapshot(em, (querySnapshot) => {
        const cities: any[] = [];
        querySnapshot.forEach((doc) => {

            setEMType(doc.data().et_option)

        });
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

    const getTypeB = () => {
        const subTypeB = onSnapshot(data3, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTypeB(newData);
        });
        return () => {
            subTypeB();
        };
    };

    const getGarage = () => {
        const subGarage = onSnapshot(data5, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGarage(newData);
        });
        return () => {
            subGarage();
        };
    };

    const getEM = () => {
        const subEm = onSnapshot(data6, (snapshot) => {
            const newData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEquipment(newData);
        });
        return () => {
            subEm();
        };
    };

    const getBooking = () => {
        const q = query(data4, where("b_IDtruck", "==", DataID));
        const unsubbook = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                setIdB(doc.id);
                setOptionB(doc.data().b_businessType);
                setCusName(doc.data().b_cusName);
                setCusTel(doc.data().b_cusTel);
                setSaleName(doc.data().b_saleName);
                setDateBooking(doc.data().b_dateBooking);
                setRealPrice(doc.data().b_realPrice);
                setOptionGarage(doc.data().b_garage)
                setDateEM(doc.data().b_equipment)
                setDateEM2(doc.data().b_equipment)
                setOptionEM(doc.data().b_optionEM)
                setNote(doc.data().b_note)
                setSalesTax(doc.data().b_salesTax)
                setEMprice(doc.data().b_emPrice)
                setPercent(doc.data().b_percent)
                setSumPrice(doc.data().b_sumPrice)
            });
            setItemB(cities);

        });

        return () => {
            unsubbook();
        };
    };

    useEffect(() => {
        const unsubscribe = loadRealtime();
        const sub = getStatus();
        const subTypeB = getTypeB();
        const unsubbook = getBooking();
        const subGarage = getGarage();
        const subEm = getEM();
        getData();
        return () => {
            unsubscribe();
            unsubbook();
            
            subTypeB();
            unsub();
            sub();
            subGarage();
            subEm();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            setSpinner(true);
            try {
                const SwapUpdateRefBooking = doc(db, "Booking", idB);
                //DataID
                if (DataID === "undefined" || DataID === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_IDtruck: DataID,
                    });
                }
                //realPrice
                if (realPrice === items.b_realPrice) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_realPrice: items.b_realPrice,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_realPrice: realPrice,
                    });
                }

                //cusName
                if (cusName === "undefined" || cusName === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_cusName: items.b_cusName,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_cusName: cusName,
                    });
                }
                //cusTel
                if (cusTel === "undefined" || cusTel === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_cusTel: items.b_cusTel,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_cusTel: cusTel,
                    });
                }
                //saleName
                if (saleName === "undefined" || saleName === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_saleName: items.b_saleName,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_saleName: saleName,
                    });
                }

                //dateBooking
                if (dateBooking === "undefined" || dateBooking === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_dateBooking: items.b_dateBooking,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_dateBooking: dateBooking,
                    });
                }

                //optionB
                if (optionB === "undefined" || optionB === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_businessType: items.b_businessType,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_businessType: optionB,
                    });
                }
                //อู่แต่งรถ
                if (optionGarage === "undefined" || optionGarage === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_garage: items.b_garage,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_garage: optionGarage,
                    });
                }
                //อุปกรณ์แต่งรถ
                if (dateEM === items.b_equipment) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_equipment: items.b_equipment,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_equipment: dateEM,
                    });
                }
                //อุปกรณ์แต่งรถ
                if (optionEM === items.b_optionEM) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_optionEM: items.b_optionEM,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_optionEM: optionEM,
                    });
                }
                //หมายเหตุ
                if (note === items.b_note) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_note: items.b_note,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_note: note,
                    });
                }
                //salesTax
                if (salesTax === items.b_salesTax) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_salesTax: items.b_salesTax,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_salesTax: salesTax,
                    });
                }
                //emPrice
                if (emPrice === items.b_emPrice) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_emPrice: items.b_emPrice,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_emPrice: emPrice,
                    });
                }
                //ราคารถ + อุปกรณ์
                if (sumPrice === items.b_sumPrice) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_sumPrice: items.b_sumPrice,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_sumPrice: sumPrice,
                    });
                }
                //เปอร์เซ็นต์
                if (percent === items.b_percent) {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_percent: items.b_percent,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_percent: percent,
                    });
                }
                //รูปภาพ
                if (img === "undefined" || img === "") {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_Mimg: items.b_Mimg,
                    });
                } else {
                    await updateDoc(SwapUpdateRefBooking, {
                        b_Mimg: img,
                    });
                }
                // //เงินดาวน์
                // if (downPay === items.b_downPay) {
                //     await updateDoc(SwapUpdateRefBooking, {
                //         b_downPay: items.b_downPay,
                //     });
                // } else {
                //     await updateDoc(SwapUpdateRefBooking, {
                //         b_downPay: (((+emPrice) + (+realPrice)) * percent / 100),
                //     });
                // }
                // //ยอดจัดไฟแนนซ์
                // if (finance === "undefined" || finance === "") {
                //     await updateDoc(SwapUpdateRefBooking, {
                //         b_finance: items.b_finance,
                //     });
                // } else {
                //     await updateDoc(SwapUpdateRefBooking, {
                //         b_finance: (+emPrice) + (+realPrice) - (((+emPrice) + (+realPrice)) * percent / 100),
                //     });
                // }




                //--------------------------------------------------------------

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

                // ราคาจริง
                if (realPrice === items.t_realPrice) {
                    await updateDoc(SwapUpdateRef, {
                        t_realPrice: items.t_realPrice,
                    });

                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_realPrice: realPrice,
                    });
                }
                // dateBooking
                if (dateBooking === "undefined" || dateBooking === "") {
                    await updateDoc(SwapUpdateRef, {
                        t_dateBooking: items.t_dateBooking,
                    });
                    console.error("Error adding document: ");
                } else {
                    await updateDoc(SwapUpdateRef, {
                        t_dateBooking: dateBooking,
                    });
                }

                alert("บันทึกสำเร็จ")
                router.push('/customer')

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
            router.push('/customer')
        }
    }
    //---------------

    const [isOpen, setIsOpen] = useState(false);
    const [optionT, setOptionT] = useState("");
    const [optionS, setOptionS] = useState("");
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [isOpen5, setIsOpen5] = useState(false);
    const [isOpen6, setIsOpen6] = useState(false);
    const [isOpen7, setIsOpen7] = useState(false);

    const toggleDropdown = () => {
        setIsOpen2(!isOpen2);
    };

    const toggleDropdown2 = () => {
        setIsOpen3(!isOpen3);
    };

    const toggleDropdown3 = () => {
        setIsOpen4(!isOpen4);
    };

    const toggleDropdown4 = () => {
        setIsOpen5(!isOpen5);
    };

    const toggleDropdown5 = () => {
        setIsOpen6(!isOpen6);
    };
    const toggleDropdown6 = () => {
        setIsOpen7(!isOpen7);
    };
    function hasSelectPercent(nt: any) {
        setPercent(nt.target.value)
    }

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

    const handleChangeDate = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;
        setDeductionDate(date);

    };
    const handleChangeDate2 = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;
        setDateBooking(date);

    };

    function getPrice(event: any) {
        switch (event.target.name) {
            case "realPrice":
                setRealPrice(event.target.value);
                setSumPrice(+event.target.value);
                break;
            case "emPrice":
                setEMprice(event.target.value);
                setSumPrice(+event.target.value + (+realPrice));
                break;
        }
    };

    function getDownPay(val: any) {
        setPercent(val)
        if (emPrice != 0) {
            setDownPay((+sumPrice) - ((+sumPrice) * val / 100))
        } else {
            setDownPay(((+realPrice) * percent / 100))
        }
    }

    return (
        <div >
           
            <div className={spinner === true ? 'absolute left-1/2 top-1/2 z-50' : ' hidden'}>
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


            <div className={spinner === true ? `md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen opacity-50` :`md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen`}>
                {/* text header */}
                <div className="text header">
                    <div className='mb-6'>
                        <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                    </div>

                    <p className="text-2xl md:text-3xl font-bold">จองรถ</p>
                    <p className="pt-2">เพิ่มข้อมูลการจองรถภายในระบบฐานข้อมูล</p>
                </div>

                {/* tool ค้นหา */}
                <div className="pt-4 space-y-4">
                    {/* ส่วนที่ 1 ข้อมูลรถ */}
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
                                    className='pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full'
                                />


                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">INV.:</p>
                                <input type="text"
                                    defaultValue={items.t_inv_num}
                                    onChange={(e) => setInvNum(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ใบกำกับภาษีสินค้า:</p>
                                <input type="text"
                                    defaultValue={items.t_product_tax}
                                    onChange={(e) => setProductTax(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            {/* seach to input value */}
                            <div className="flex gap-4 max-md:w-full" >
                                <p className="max-w-32 md:w-32 w-full font-bold">รุ่นรถ:</p>
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



                                    <div className="pl-1 ring-1 absolute mt-6 bg-white ring-inset ring-gray-300  max-md:w-[199.2px] z-10" >
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
                                <p className="max-w-32 md:w-32 w-full font-bold">แรงม้า:</p>



                                <input type="text"
                                    value={ps}
                                    onChange={(e) => setPs(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />

                            </div>


                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ความยาวรถ:</p>
                                <input type="text"
                                    value={length}
                                    onChange={(e) => setLength(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" disabled />
                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">หมายเลขเครื่อง:</p>
                                <input type="text"
                                    defaultValue={items.t_serial_num}
                                    onChange={(e) => setSerialNum(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">หมายเลขคัสซี:</p>
                                <input type="text"
                                    defaultValue={items.t_chassis}
                                    onChange={(e) => setChassis(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ที่จอดรถ:</p>
                                <input type="text"
                                    defaultValue={items.t_parking}
                                    onChange={(e) => setParking(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">สถานะ:</p>

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

                    {/* ส่วนที่ 2 ข้อมูลราคา */}
                    <div className=' bg-cyan-50  w-full p-8 shadow-md rounded-2xl'>
                        <p className="pb-4 text-xl font-bold">ส่วนที่ 2 - ข้อมูลราคา</p>

                        <div className='flex flex-wrap gap-4'>
                            {
                                role === "admin" ? <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">ราคาทุน:</p>
                                <input type="number"
                                    defaultValue={input == "" ? costprice : items.m_costprice}
                                    // value={costprice}
                                    onChange={(e) => setCostprice(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>
                            : ""
                            }
                            

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">LP:</p>
                                <input type="number"
                                    defaultValue={input == "" ? lp : items.m_lp}
                                    // value={lp}
                                    onChange={(e) => setLp(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">IRP:</p>
                                <input type="text"
                                    defaultValue={input == "" ? irp : items.m_irp}
                                    // value={irp}
                                    onChange={(e) => setIrp(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">Code ราคา:</p>
                                <input type="text"
                                    defaultValue={input == "" ? codeprice : items.m_codeprice}
                                    onChange={(e) => setCodeprice(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">ราคาขายจริง:</p>
                                <input type="number"
                                    value={realPrice}
                                    name='realPrice'
                                    onChange={getPrice}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">ราคาอุปกรณ์:</p>
                                <input type="number"
                                    value={emPrice}
                                    name='emPrice'
                                    onChange={getPrice}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">ใบกำกับภาษีขาย:</p>
                                <input type="text"
                                    defaultValue={salesTax}
                                    onChange={(e) => setSalesTax(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                        </div>
                    </div>

                    {/* ส่วนที่ 2 ข้อมูลราคา */}
                    <div className=' bg-cyan-50  w-full p-8 shadow-md rounded-2xl'>
                        <p className="pb-4 text-xl font-bold">ส่วนที่ 2.1 - คำนวณราคา</p>

                        <div className='flex flex-wrap gap-4'>
                            <div className='flex flex-wrap gap-4'>
                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full font-bold">ราคารถ + อุปกรณ์:</p>

                                    <input
                                        type='number'
                                        value={realPrice === 0 ? 0 : sumPrice === 0 ? realPrice : sumPrice}
                                        onChange={getPrice}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search"

                                    />
                                </div>
                            </div>


                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">เปอร์เซ็นต์:</p>

                                <div className="relative md:w-[199.2px] w-full">
                                    <button
                                        className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                        onClick={toggleDropdown6}
                                    >
                                        {percent == 0 ? "0%" : `${percent}%`}

                                        {isOpen7 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                    </button>
                                    {isOpen7 && (
                                        <div className='bg-white text-gray-800 pt-1 absolute w-full z-30'>

                                            {
                                                Percent.map((option) => (
                                                    <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${percent == option.value ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                        getDownPay(option.value);
                                                        setIsOpen7(false);
                                                    }}>{option.label}</div>
                                                ))
                                            }

                                        </div>
                                    )}

                                </div>


                            </div>





                            <div className='flex flex-wrap gap-4'>
                                <div className="flex gap-4 max-md:w-full">

                                    <p className="max-w-32 md:w-32 w-full font-bold">เงินดาวน์</p>
                                    <input
                                        disabled
                                        value={realPrice === 0 ? 0 : sumPrice === 0 ? ((+realPrice) * percent / 100) : ((+sumPrice) * +percent / 100)}
                                        onChange={(e) => setDownPay}
                                        type="number"
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                        placeholder="ราคารถ"

                                    ></input>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-4'>
                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full font-bold">ยอดจัดไฟแนนซ์:</p>
                                    <input type="number"

                                        // value={realPrice === 0 ? 0 : sumPrice === 0 ? ((+realPrice) - (((+emPrice) + (+realPrice)) * percent / 100)) : (+emPrice) + (+realPrice) - (((+emPrice) + (+realPrice)) * percent / 100)}
                                        value={realPrice === 0 ? 0 : sumPrice === 0 ? (realPrice - (realPrice * percent / 100)) : ((+sumPrice) - ((+sumPrice) * percent / 100))}
                                        onChange={(e) => setFinance}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* ส่วนที่ 3 จอง */}
                    <div className=' bg-cyan-50  w-full p-8 shadow-md rounded-2xl'>
                        <p className="pb-4 text-xl font-bold">ส่วนที่ 3 - ข้อมูลการจอง</p>

                        <div className='flex flex-wrap gap-4'>
                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">ชื่อ-นามสกุลผู้จอง:</p>
                                <input type="text"
                                    defaultValue={cusName}
                                    onChange={(e) => setCusName(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full z-20" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">ประเภทธุรกิจ:</p>

                                <div className="relative md:w-[199.2px] w-full">
                                    <button
                                        className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                        onClick={toggleDropdown2}
                                    >
                                        {/* {optionB == "undefined" || optionB == "" ? "เลือกประเภทะธุรกิจ" : optionB != "" ? optionB : "เลือกประเภทะธุรกิจ"} */}
                                        {optionB == "undefined" || optionB == "" && itemB.b_businessType == "" || itemB.b_businessType == "undefined" ? "เลือกประเภทรถ" : optionB != "" ? optionB : itemB.b_businessType}


                                        {isOpen3 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                    </button>
                                    {isOpen3 && (
                                        <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                            {typeB?.map((option: {
                                                id: ""
                                                b_name: ""
                                            }) => (
                                                <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${optionB == option.b_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                    setOptionB(option.b_name);
                                                    setIsOpen3(false);
                                                }}

                                                >
                                                    {option.b_name}
                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>

                            </div>


                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">เบอร์โทรติดต่อ:</p>
                                <input type="text"
                                    defaultValue={cusTel}

                                    onChange={(e) => setCusTel(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>

                            <div className="flex gap-4 max-md:w-full z-10">
                                <p className="max-w-32 md:w-32 w-full font-bold">วันที่จอง:</p>
                                <DatePicker
                                    selected={dateBooking}
                                    selectsStart
                                    placeholderText="Select Start Date"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        // setDateBooking(date);
                                        handleChangeDate2(date);
                                    }}
                                    className='pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full'
                                />

                            </div>

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">เซลล์ผู้ขาย:</p>
                                <input type="text"
                                    // value={saleName}
                                    defaultValue={saleName}
                                    onChange={(e) => setSaleName(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                            <div className="flex gap-4 max-md:w-full z-10" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">อู่แต่งรถ:</p>

                                <div className="relative md:w-[199.2px] w-full">
                                    <button
                                        className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                        onClick={toggleDropdown3}
                                    >

                                        {optionGarage == "undefined" || optionGarage == "" && itemB.b_garage == "" || itemB.b_garage == "undefined" ? "เลือกอู่แต่งรถ" : optionGarage != "" ? optionGarage : itemB.b_garage}


                                        {isOpen4 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                    </button>
                                    {isOpen4 && (
                                        <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                            {garage?.map((option: {
                                                id: ""
                                                garage_name: ""
                                            }) => (
                                                <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${optionGarage == option.garage_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                    setOptionGarage(option.garage_name);
                                                    setIsOpen4(false);
                                                }}
                                                >

                                                    {option.garage_name}

                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>

                            </div>


                            <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                <p className="max-w-32 md:w-32 w-full font-bold">อุปกรณ์แต่งรถ:</p>

                                <div className="relative md:w-[199.2px] w-full">
                                    <button
                                        className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                        onClick={toggleDropdown4}
                                    >

                                        {/* {dateEM == "undefined" || dateEM == "" && itemB.b_equipment == "" || itemB.b_equipment == "undefined" ? "เลือกอู่แต่งรถ" : dateEM != "" ? dateEM : itemB.b_equipment} */}
                                        {dateEM == "undefined" || dateEM == "" ? "เลือกอุปกรณ์แต่งรถ" : dateEM }


                                        {isOpen5 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                    </button>
                                    {isOpen5 && (
                                        <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                            {equipment?.map((option: {
                                                id: ""
                                                et_name: ""
                                            }) => (
                                                <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${dateEM == option.et_name ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                    setDateEM(option.et_name);
                                                    setIsOpen5(false);
                                                }}
                                                >

                                                    {option.et_name}

                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>

                            </div>

                            {emType.length != 0 ?
                                <div className="flex gap-4 max-md:w-full" onClick={(e) => setIsOpen(false)}>
                                    <p className="max-w-32 md:w-32 w-full font-bold">อุปกรณ์แต่งรถ:</p>

                                    <div className="relative md:w-[199.2px] w-full">
                                        <button
                                            className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                            onClick={toggleDropdown5}
                                        >

                                            {optionEM == "undefined" || optionEM == "" ? "อุปกรณ์แต่งรถ" : dateEM != dateEM2 ? "เลือกอุปกรณ์แต่งรถ" : optionEM != "" ? optionEM : itemB.b_optionEM}


                                            {isOpen6 == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                        </button>
                                        {isOpen6 && (
                                            <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                                {emType?.map((option: {
                                                    id: ""
                                                    eType: ""
                                                }, key: number) => (
                                                    <div key={key} className={`hover:bg-gray-100 py-1 px-4 ${optionEM == option.eType ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                        setOptionEM(option.eType);
                                                        setIsOpen6(false);
                                                        setDateEM2(dateEM)
                                                    }}
                                                    >

                                                        {option.eType}

                                                    </div>
                                                ))}

                                            </div>
                                        )}
                                    </div>

                                </div>

                                : ""

                            }

                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full font-bold">หมายเหตุ:</p>
                                <textarea
                                    defaultValue={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" placeholder="Search" />
                            </div>


                        </div>
                    </div>



                    {/* ปุ่ม */}
                    <div className="flex flex-wrap gap-8 py-5 justify-center ">
                        <button className=" bg-green-500 hover:bg-green-600 px-5 rounded text-white" onClick={() => functionSave()}>บันทึก</button>
                        <button className=" bg-red-500 hover:bg-red-600 px-5 rounded text-white" onClick={() => functionCancel()} >ยกเลิก</button>


                    </div>
                </div>
            </div>







        </div>
    )

};
