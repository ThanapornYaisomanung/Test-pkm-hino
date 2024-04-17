'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect, SetStateAction, Suspense } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot, doc, getDoc, getFirestore, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/app/firebase";
import Loading from '@/app/components/Loading';
import { storage } from '@/app/firebase';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    uploadBytes,
    UploadTaskSnapshot,
} from "firebase/storage";
import { Arrow_donw_icon, Arrow_left_icon, Arrow_up_icon } from '@/app/icons/activeIcon';
import { getAuth, onAuthStateChanged } from 'firebase/auth';




let data = collection(db, "TruckType")

export default function EditTruckPModel(props: any) {
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
            router.push("/")
            setRole("")

        }
    });


    const getData = async (DataID: string) => {
        const db = getFirestore()
        const docRef = doc(db, "TruckModel", DataID);
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

    const [typeT, setTypeT] = useState<ArrayType>([]);
    console.log(typeT);


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

    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            getData(DataID);
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const [valueType, setValueType] = useState(); //ประเภทรถ
    const [nameModel, setNameModel] = useState("");
    const [ps, setPs] = useState("");
    const [costprice, setCostprice] = useState("");
    const [length, setLength] = useState("");
    const [lp, setLp] = useState("");
    const [irp, setIrp] = useState("");
    const [codeprice, setCodeprice] = useState("");
    const [s_price1, setS_Price1] = useState("");
    const [s_price2, setS_Price2] = useState("");
    const [discount, setDiscount] = useState("");
    const [contribution, setContribution] = useState("");
    const [per, setPerc] = useState(0);
    const [bdata, setBdata] = useState("");
    const [image, setImage] = useState<File | any>();
    const [spinner, setSpinner] = useState(false);

    const handleSelectedFile = (files: any) => {
        if (files && files[0].size < 10000000) {
            setImage(files[0])

            console.log(files[0])
        } else {
            console.log('File size to large')
        }
    }

    useEffect(() => {
        const uploadFile = () => {
            const name = items.m_name;

            console.log(name);
            const storageRef = ref(storage, `image/${name}`);
            const uploadTask = uploadBytesResumable(storageRef, image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setPerc(progress);
                    setTimeout(function () { alert("Upload is 100% done") }, 1500);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setBdata(downloadURL);
                    });
                }
            );
        };
        image && uploadFile();
    }, [image]);


    // ปุ่ม
    async function functionSave() {
        setNameModel(items.name)
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )
        if (confirmBox == true) {
            setSpinner(true);
            try {
                const SwapUpdateRef = doc(db, "TruckModel", DataID);

                // ชื่อรุ่น
                if (nameModel === "undefined" || nameModel === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_name: items.m_name,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_name: nameModel,
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

                // ราคาลดที่ 1
                if (s_price1 === "undefined" || s_price1 === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_s_price1: items.m_s_price1,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_s_price1: s_price1,
                    });
                }

                // ราคาลดที่ 2
                if (s_price2 === "undefined" || s_price2 === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_s_price2: items.m_s_price2,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_s_price2: s_price2,
                    });
                }

                // ส่วนลดพิเศษจาก hino
                if (discount === "undefined" || discount === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_discount: items.m_discount,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_discount: discount,
                    });
                }

                // เงินสมทบ
                if (contribution === "undefined" || contribution === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_contribution: items.m_contribution,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_contribution: contribution,
                    });
                }

                //ประเภทรถ
                if (optionT === "undefined" || optionT === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_type: items.m_type,
                    });
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_type: optionT,
                    });
                }

                //image
                if (bdata === "undefined" || bdata === "") {
                    await updateDoc(SwapUpdateRef, {
                        m_image: items.m_image,
                    });
                    console.error("Error adding document: ");
                } else {
                    await updateDoc(SwapUpdateRef, {
                        m_image: bdata,
                    });
                }
                alert("บันทึกสำเร็จ")
                router.push('/truckprice')

            } catch (e) {
                console.error("Error adding document: ", e);
            }


        }
    }
    console.log("asd", items.m_image);


    function functionCancel() {
        const confirmBox = window.confirm(
            "Do you really want to Cancel this data?"
        )

        if (confirmBox == true) {
            alert("ยกเลิกการเพิ่มข้อมูลสำเร็จ")
            router.push('/truckprice')
        }
    }
    //---------------

    console.log("items", items.m_type);
    const [isOpen, setIsOpen] = useState(false);
    const [optionT, setOptionT] = useState("");

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    console.log("dd", per);

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
                    <p className=" text-3xl font-bold">แก้ไขข้อมูล</p>
                    <p className="pt-2">แก้ไขข้อมูลรถภายในระบบฐานข้อมูล</p>
                </div>
                <Suspense fallback={'Loading..'}>



                    {/* tool ค้นหา */}
                    <div className="pt-4 ">
                        <div className=" bg-cyan-50  w-full p-8 shadow-md rounded-2xl  ">

                            {/* inputdata */}

                            <div className="flex flex-wrap gap-4">

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">ชื่อรุ่นรถ:</p>
                                    <input type="text"
                                        defaultValue={items.m_name}
                                        // value={nameModel}
                                        onChange={(e) => setNameModel(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded"
                                        placeholder="Search" />

                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">ประเภทรถ:</p>

                                    <div className="relative md:w-[199.2px] w-full">
                                        <button
                                            className="bg-white hover:bg-gray-100 pl-2 ring-1 ring-inset ring-gray-300 text-gray-800  rounded inline-flex items-center justify-between w-full"
                                            onClick={toggleDropdown}
                                        >
                                            {optionT == "undefined" || optionT == "" && items.m_type == "" || items.m_type == "undefined" ? "เลือกประเภทรถ" : optionT != "" ? optionT : items.m_type}

                                            {isOpen == true ? <Arrow_up_icon /> : <Arrow_donw_icon />}

                                        </button>
                                        {isOpen && (
                                            <div className='bg-white text-gray-800 pt-1 absolute w-full'>
                                                {typeT.map((option: {
                                                    id: ""
                                                    type_t_code: "",
                                                    type_t_name: ""
                                                }) => (
                                                    <div key={option.id} className={`hover:bg-gray-100 py-1 px-4 ${optionT == option.type_t_code ? "bg-gray-200" : ""}`} onClick={(e) => {
                                                        setOptionT(option.type_t_code);
                                                        setIsOpen(false);
                                                    }}

                                                    >
                                                        {option.type_t_code}
                                                    </div>
                                                ))}

                                            </div>
                                        )}

                                    </div>

                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">แรงม้า:</p>
                                    <input type="text"
                                        defaultValue={items.m_ps}
                                        onChange={(e) => setPs(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>


                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">ความยาวรถ:</p>
                                    <input type="text"
                                        defaultValue={items.m_length}
                                        onChange={(e) => setLength(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">LP:</p>
                                    <input type="number"
                                        defaultValue={items.m_lp}
                                        onChange={(e) => setLp(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">IRP:</p>
                                    <input type="text"
                                        defaultValue={items.m_irp}
                                        onChange={(e) => setIrp(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>


                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">Code ราคา:</p>
                                    <input type="text"
                                        defaultValue={items.m_codeprice}
                                        onChange={(e) => setCodeprice(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">ราคาพิเศษ 1:</p>
                                    <input type="text"
                                        defaultValue={items.m_s_price1}
                                        onChange={(e) => setS_Price1(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">ราคาพิเศษ 2:</p>
                                    <input type="text"
                                        defaultValue={items.m_s_price2}
                                        onChange={(e) => setS_Price2(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>

                                <div className="flex gap-4 max-md:w-full">
                                    <p className="max-w-32 md:w-32 w-full ">เงินสมทบ:</p>
                                    <input type="text"
                                        defaultValue={items.m_contribution}
                                        onChange={(e) => setContribution(e.target.value)}
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                </div>



                                {/*------------- เซลเห็นไม่ได้ -----------*/}
                                {
                                    role === "admin" ?
                                        <div>
                                            <div className="flex gap-4 max-md:w-full">
                                                <p className="max-w-32 md:w-32 w-full ">ส่วนลดพิเศษ Hino:</p>
                                                <input type="text"
                                                    defaultValue={items.m_discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                            </div>

                                            <div className="flex gap-4 max-md:w-full">
                                                <p className="max-w-32 md:w-32 w-full ">ราคาทุน:</p>
                                                <input type="text"
                                                    defaultValue={items.m_costprice}
                                                    onChange={(e) => setCostprice(e.target.value)}
                                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full rounded" placeholder="Search" />
                                            </div>
                                        </div>
                                        : ""
                                }




                                {/* -------------------------------------------- */}

                                {/* <div className="flex gap-4 max-md:w-full">
                            <p className="max-w-32 md:w-32 w-full ">รูปรถ:</p>
                            <input type="file" name="image" className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full" onChange={upImages} />
                        </div> */}

                                <div className="formInput">
                                    <label htmlFor="file">
                                        Image:
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={(files) => handleSelectedFile(files.target.files)}

                                    />

                                    <div className="left pt-4">
                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : items.m_image !== '' ? items.m_image : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                            }
                                            alt=""
                                            width={200}
                                            height={200}
                                        />

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
                </Suspense>






            </div>
        </div>

    )
};
