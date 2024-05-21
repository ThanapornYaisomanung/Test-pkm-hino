"use client";

import { Clock } from "../components/Clock"
import { DashBox } from "../components/DashBox"
import { Booking_icon, Inbox_icon, Comp_icon, Truck_icon, Wait_icon } from "../icons/boxs"
import { TopMTruck } from "../components/TopMTruck";
import { TopEM } from "../components/TopEM";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore, deleteDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
let data = collection(db, "Truck")


export default function Dashboard() {
    const now = new Date();

    const [items, setItems] = useState<any>([]);
    const [items2, setItems2] = useState<any>([]);
    const [items3, setItems3] = useState<any>([]);
    const [items4, setItems4] = useState<any>([]);
    const router = useRouter()

    const loadRealtime = () => {
        const q = query(data, where("t_status", "==", "STOCK"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                cities.push(doc.data());
            });
            setItems(cities);
           
        });

        return () => {
            unsubscribe();
        };
    };
    const loadRealtime2 = () => {
        const q = query(data, where("t_status", "==", "จอง"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                cities.push(doc.data());
            });
            setItems2(cities);
           
        });

        return () => {
            unsubscribe();
        };
    };
    const loadRealtime3 = () => {
        const q = query(data, where("t_status", "==", "เสร็จสิ้น"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                cities.push(doc.data());
            });
            setItems3(cities);
           
        });

        return () => {
            unsubscribe();
        };
    };
    const loadRealtime4 = () => {
        const q = query(data, where("t_status", "==", "ดำเนินการ"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [];
            querySnapshot.docs.map((doc) => {
                cities.push(doc.data());
            });
            setItems4(cities);
           
        });

        return () => {
            unsubscribe();
        };
    };

    useEffect(() => {
        const unsubscribe = loadRealtime();
        const unsubscribe2 = loadRealtime2();
        const unsubscribe3 = loadRealtime3();
        const unsubscribe4 = loadRealtime4();
        return () => {
            unsubscribe();
            unsubscribe2();
            unsubscribe3();
            unsubscribe4();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!items) {
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
        <div className="md:pt-8 md:pl-8 p-4 min-h-screen w-full ">
            {/* text header */}
            <div className="text header">
                <p className="text-2xl md:text-3xl font-bold">Dashboard</p>
                {/* date time */}
                <div className="flex gap-4">
                    <p>Datetimes:</p>
                    <p>{now.getDate()}/{now.getMonth() + 1}/{now.getFullYear()}</p>

                    <Clock time={now.getTime()} />
                </div>
            </div>


            <div className="flex flex-wrap md:gap-8 gap-4 pt-4">
                <div>
                    <DashBox icon={<Truck_icon />} text={"จำนวนรถในคลัง"} num={Math.floor(items.length).toLocaleString("en-US")} />
                </div>
                <div>
                    <DashBox icon={<Booking_icon height="56px" width="56px" />} text={"จำนวนในการจอง"} num={Math.floor(items2.length).toLocaleString("en-US")} />
                </div>
                <div>
                    <DashBox icon={<Wait_icon />} text={"รอดำเนินการ"} num={Math.floor(items4.length).toLocaleString("en-US")}/>
                </div>
               
                <div>
                    <DashBox icon={<Comp_icon />} text={"จำนวนที่สำเร็จ"} num={Math.floor(items3.length).toLocaleString("en-US")}/>
                </div>

            </div>

            <div className="mt-4 p-4 ">
                <div className=" md:grid md:grid-cols-2">
                    <TopMTruck/>
                    <TopEM/>
                </div>

            
            </div>

        </div>
    )

};
