'use client';

import { collection, doc, getDoc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import { db } from "@/app/firebase";
import Search from "../components/Search";
import Pagination2 from "../components/Pagination2";
import { Arrow_donw_icon, Arrow_up_icon } from "../icons/activeIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let data = collection(db, "Truck")
let data2 = collection(db, "Status")

export default function PrintData() {

    const [items, setItems] = useState<ArrayType>([]);
    const [typeT, setTypeT] = useState<ArrayType>([]);
    const [value, setValue] = useState([]);
    const [input, setInput] = useState("");
    const [test, setTest] = useState("");
    const [typeS, setTypeS] = useState<ArrayType>([]);
    const [typeM, setTypeM] = useState<ArrayType>([]);
    const [isOpen2, setIsOpen2] = useState(false);

    const loadRealtime = () => {
        // const q = query(data, where("m_type", "==", optionS));
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
            sub();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = (value: any) => {
        const results = typeT.filter((Truck: { m_name: string; b_dateBooking:string}) => {
            return (
                value &&
                Truck &&
                // Truck.m_name &&
                // Truck.m_name.slice(0, 8).includes(value) ||
                // Truck.m_name.toLowerCase().includes(value) ||
                // Truck.m_name.toUpperCase().includes(value)||
                Truck.b_dateBooking &&
                Truck.b_dateBooking.slice(0, 9).includes(value) 
            
            );
        });

        setValue(results);
    };

    const handleChange = async (value: (SetStateAction<string>)) => {
        setInput(value);
        fetchData(value);
    };

    //Pagination2
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;


    const onPageChange = (page: SetStateAction<number>) => {
        setCurrentPage(page);
    };
    const onPageChange2 = (page: SetStateAction<number>) => {
        setCurrentPage(page);
    };

    const lastPostIndex = currentPage * pageSize;
    const firstPostIndex = lastPostIndex - pageSize;
    const currentPosts = value.slice(firstPostIndex, lastPostIndex);
    const currentPosts2 = typeT.slice(firstPostIndex, lastPostIndex);
    // console.log(currentPosts);


    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);

    const handleChangeDate = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;
        fetchData(date);
        setStartDate(date)
    };
    const handleChangeDate2 = async (value: any) => {
        const day = value.getDate();
        const month = value.getMonth() + 1;
        const year = value.getFullYear();
        const date = `${year}-${month}-${day}`;
        setEndDate(date)
        fetchData(date);
    };

    console.log(startDate, endDate);



    return (
        <div>

            <DatePicker
                selected={startDate}
                selectsStart
                placeholderText="Select Start Date"
                dateFormat="dd/MM/yyyy"
                isClearable={true}
                onChange={(e) => {
                    // setDeductionDate(e);
                    handleChangeDate(e)
                }}
                className='pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full'
            />
            <DatePicker
                selected={endDate}
                minDate={startDate}
                isClearable={true}
                selectsStart
                placeholderText="Select End Date"
                dateFormat="dd/MM/yyyy"
                onChange={(e) => {
                    // setDeductionDate(e);
                    handleChangeDate2(e)
                }}

                className='pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full'
            />


            <div>
                <input
                    placeholder="Type to search..."
                    value={input}
                    onChange={(e) => { handleChange(e.target.value) }}
                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                />
            </div>

            {
                value.length != 0 || startDate != null || endDate != null ?
                    value?.map((option: {
                        id: "",
                        m_name: ""
                        m_type: ""
                    }) => (
                        <option key={option.id} className='max-md:truncate hover:bg-slate-100 ' value={option.m_name} >{option.m_name}</option>
                    ))

                    :
                    typeT?.map((option: {
                        id: "",
                        m_name: ""
                    }) => (
                        <option key={option.id} className='max-md:truncate hover:bg-slate-100 ' value={option.m_name} >{option.m_name}</option>
                    ))

            }



            <div className="my-5">
                <Pagination2
                    items={value.length} // 100
                    currentPage={currentPage} // 1
                    pageSize={pageSize} // 10
                    onPageChange={onPageChange}
                    onPageChange2={onPageChange2}
                />


            </div>


        </div>
    )
}