import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore, deleteDoc, query, where, onSnapshot, updateDoc, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { Delete_icon, Edit_icon } from "@/app/icons/activeIcon";
import { getAuth, onAuthStateChanged } from "firebase/auth";
let data = collection(db, "Booking")
let data2 = collection(db, "Truck")

export default function ViewBooking(props: any) {
    const DataID = props.truckID;
    const router = useRouter()
    const [idB, setIdB] = useState("");
    const [typeB, setTypeB] = useState("");
    const [cusName, setCusName] = useState("");
    const [cusTel, setCusTel] = useState("");
    const [saleName, setSaleName] = useState("");
    const [dateBooking, setDateBooking] = useState("");
    const [items, setItems] = useState<any>([]);
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
        const q = query(data, where("b_IDtruck", "==", DataID));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                setIdB(doc.id);
                setTypeB(doc.data().b_businessType);
                setCusName(doc.data().b_cusName);
                setCusTel(doc.data().b_cusTel);
                setSaleName(doc.data().b_saleName);
                setDateBooking(doc.data().b_dateBooking);

            });
            setItems(cities);

        });

        return () => {
            unsubscribe();
        };
    };
    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ปุ่ม
    // แก้ไขข้อมูล
    const dbEdit = async (id: string) => {
        console.log(id);
        router.push(`/booking/editBooking/${id}`)
    }

    // ลบข้อมูล
    const handleDelete = async (id: any) => {
        const confirmBox = window.confirm(
            `คุณต้องการลบข้อมูล ${id} หรือไม่?`
        )

        if (confirmBox == true) {
            alert("ลบข้อมูลสำเร็จ")
            try {
                const SwapUpdateRef = doc(db, "Truck", DataID);
                // สถานะ
                await updateDoc(SwapUpdateRef, {
                    t_status: "STOCK",
                    t_dateBooking: ""
                });

                await deleteDoc(doc(data, id));
                router.push('/truck')

            } catch (e) {
                console.error("Error adding document: ", e);
            }

        }
    };

    return (
        <div className="">
            {/* ส่วนที่ 3 จอง */}
            <p className="pb-4 text-xl font-bold">ข้อมูลการจอง</p>
            <div className=' bg-cyan-50  w-full md:p-8 p-4 shadow-md rounded-2xl'>


                <div className='flex flex-wrap gap-4'>
                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">ชื่อ-นามสกุลผู้จอง:</p>
                        <p>{cusName}</p>
                    </div>

                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">ประเภทธุรกิจ:</p>
                        <p>{typeB}</p>

                    </div>


                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">เบอร์โทรติดต่อ:</p>
                        <p>{cusTel}</p>
                    </div>

                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">วันที่จอง:</p>
                        <p>{dateBooking}</p>
                    </div>

                    <div className="flex gap-4 max-md:w-full">
                        <p className="max-w-32 md:w-32 w-full ">เซลล์ผู้ขาย:</p>
                        <p>{saleName}</p>
                    </div>

                </div>
                {/* ปุ่ม */}
                {
                    role === "admin" ? <div className="flex flex-wrap gap-8 pt-5 justify-center ">
                        <button className="flex justify-between rounded-md text-center text-white bg-amber-500 hover:bg-amber-600 p-2 max-w-32 w-full text-sm" onClick={() => dbEdit(DataID)} ><Edit_icon color="#fff" />แก้ไขการจอง</button>
                        <button className="flex justify-between rounded-md text-center text-white bg-red-500 hover:bg-red-600 max-xl:hidden p-2 max-w-32 w-full text-sm" onClick={() => handleDelete(idB)} ><Delete_icon color="#fff" />ลบการจอง</button>

                    </div>
                        : ""
                }


            </div>
        </div>
    )
}