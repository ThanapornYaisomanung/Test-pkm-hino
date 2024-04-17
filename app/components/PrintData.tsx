"use client";

import { collection, doc, getDoc, getFirestore, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useEffect, useState } from "react";
import { child, get, getDatabase, ref } from "firebase/database";
let data = collection(db, "TruckModel")

export default function PrintData(props: any) {
    const dataID = props.data;
    const [items, setItems] = useState<any>([]);
    const [items2, setItems2] = useState({});


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

    useEffect(() => {
        return () => {
            loadRealtime();
        };
    })

  

    return (
        <div ref={props.componentRef}
            className=" px-16"
        >
            <table className="table-fixed divide-y w-full ">
                <thead  >
                    <tr >
                        <th className="pt-16">ชื่อรุ่น</th>
                        <th className="pt-16 ">ประเภทรถ</th>
                        <th className="pt-16">ความยาว</th>
                        <th className="pt-16">แรงม้า</th>

                    </tr>
                </thead>
                <tbody className="divide-y ">
                    {items?.map((u: {
                        m_name: "",
                        m_type: "",
                        m_length: "",
                        m_ps: "",
                        id: "",
                    }) => (


                        <tr key={u.id} className="py-1">
                            <td className="">{u.m_name}</td>
                            <td className="">{u.id}</td>
                            <td className="text-center ">{u.m_type}</td>
                            <td className="text-center  ">{u.m_length}</td>
                            <td className="text-center ">{u.m_ps}</td>
                        </tr>
                    ))}


                </tbody>
            </table>
        </div>
    )
}