"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getFirestore, deleteDoc, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/app/firebase";
let data = collection(db, "Booking")

export function TopMTruck(props: any) {
    const DataID = props.DataID;
    const Truckname = props.truckname;
    const id = props.id;

    const [items, setItems] = useState<any>([]);
    const router = useRouter()

    const loadRealtime = () => {
        const q = query(data, orderBy("b_Mname", "asc"), limit(5));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities: any[] = [[
                "Element",
                "Density",
                { role: "style" },
                {
                    sourceColumn: 0,
                    role: "annotation",
                    type: "string",
                    calc: "stringify",
                },
            ],];
            querySnapshot.docs.map((doc) => {
                const result = Object.values([doc.data().b_Mname]).length
                cities.push([doc.data().b_Mname,result,"#4B7CF2",null]);
            });
            setItems(cities);

        });

        return () => {
            unsubscribe();
        };
    };
    // console.log(items);
    useEffect(() => {
        const unsubscribe = loadRealtime();
        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const options = {
        title: "Top 5 รุ่นรถ",
        width: 600,
        height: 400,
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
    };

    return (
        <div className="flex gap-4 max-md:w-full">
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={items}
                options={options}
            />
        </div>
    )
}