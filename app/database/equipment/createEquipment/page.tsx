' ';

import { useRouter } from 'next/navigation'
import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import { collection, query, getDocs, addDoc, where, onSnapshot } from "firebase/firestore";
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
import Link from 'next/link';
import { Arrow_left_icon } from '@/app/icons/activeIcon';

export interface ITask {
    eType: string;
}

export default function CreateEquipment() {
    const router = useRouter()
    const [etName, setEtName] = useState("");
    const [task, setTask] = useState<string>("");
    const [deadline, setDealine] = useState<number>(0);
    const [etOption, setEtOption] = useState<ITask[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.name === "task") {
            setTask(event.target.value);
        } else {
            setDealine(Number(event.target.value));
        }
    };

    const addTask = (): void => {
        const newTask = { eType: task };
        setEtOption([...etOption, newTask]);
        setTask("");
        setDealine(0);
    };

    const completeTask = (taskNameToDelete: string): void => {
        setEtOption(
            etOption.filter((task) => {
                return task.eType != taskNameToDelete;
            })
        );
    };

    // ปุ่ม
    async function functionSave() {
        const confirmBox = window.confirm(
            "Do you really want to save this data?"
        )

        if (confirmBox == true) {
            alert("บันทึกสำเร็จ")
            try {
                const docRef = await addDoc(collection(db, "Equipment"), {
                    et_name: etName,
                    et_option: etOption,

                });

                router.push('/database/equipment')

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
            router.push('/database/equipment')
        }
    }

    function functionBack() {
        router.back();
    }

console.log(etOption);


    return (
        <div className="md:pt-8 md:pl-8 p-4 max-w-[1680px] w-full min-h-screen">

            {/* text header */}
            <div className="text header">
                <div className='mb-6'>
                    <button onClick={() => functionBack()} className='flex text-sm  items-center' > <Arrow_left_icon />ย้อนกลับ</button>
                </div>

                <p className=" text-3xl font-bold">เพิ่มข้อมูลอุปกรณ์ประกอบรถ</p>
                <p className="pt-2">เพิ่มข้อมูลอุปกรณ์ประกอบรถภายในระบบฐานข้อมูล</p>


            </div>

            {/* tool ค้นหา */}
            <div className="mt-4 bg-cyan-50  w-full p-8 shadow-md rounded-2xl ">
                <div className=" flex justify-center">

                    {/* inputdata */}
                    <div className="flex flex-col flex-wrap  gap-4">
                        <div>
                            <div className="flex gap-4 max-md:w-full">
                                <p className="max-w-32 md:w-32 w-full ">ชื่ออุปกรณ์:</p>
                                <input type="text"
                                    value={etName}
                                    onChange={(e) => setEtName(e.target.value)}
                                    className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                    placeholder="Search" />

                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className='flex md:gap-4 max-md:w-full'>
                                <div className='flex gap-4 max-md:w-full'>
                                    <p className="max-w-32 md:w-32 w-full ">เพิ่มลักษณะ:</p>
                                    <input
                                        type="text"
                                        placeholder="Task..."
                                        name="task"
                                        className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                        value={task}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button className='bg-green-500 hover:bg-green-600 px-5 rounded text-white' onClick={addTask}>เพิ่ม</button>
                            </div>
                            <p className="max-w-32 md:w-32 w-full ">ลักษณะอุปกรณ์:</p>
                            <div className='flex flex-col gap-4 w-full '>

                                {etOption.map((task: ITask, key: number) =>
                                    <div key={key} className="flex justify-between gap-4 px-2 rounded bg-white ring-1 ring-inset ring-gray-300 max-md:w-full">
                                        <p className=" max-md:w-full md:w-[199.2px] truncate ">{task.eType}</p>
                                        <button
                                            onClick={() => {
                                                completeTask(task.eType);
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>


                        </div>

                    </div>

                </div>






            </div>


            {/* ปุ่ม */}
            <div className="flex flex-wrap gap-8 pt-5 justify-center ">
                <button className=" bg-green-500 hover:bg-green-600 px-5 rounded text-white" onClick={() => functionSave()}>บันทึก</button>
                <button className=" bg-red-500 hover:bg-red-600 px-5 rounded text-white" onClick={() => functionCancel()} >ยกเลิก</button>

            </div>

        </div>


    )

};
