import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore, deleteDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
let data = collection(db, "Truck")

export function ShowTruck(props: any) {
    const DataID = props.DataID;
    const Truckname = props.truckname;
    const id = props.id;

    const [items, setItems] = useState<any>([]);
    const router = useRouter()

    const loadRealtime = () => {
        const q = query(data, where("t_status", "==", "STOCK"), where("m_name" , "==" , "Truckname"));
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
    console.log(items);
    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex gap-4 max-md:w-full">
           <p className="max-w-32 md:w-32 w-full font-semibold">จำนวนรถ:</p>
                <p>{Math.floor(items.length).toLocaleString("en-US")} </p>
        </div>
    )
}