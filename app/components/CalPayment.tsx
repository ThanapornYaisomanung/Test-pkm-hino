' ';

import { count } from "console";
import { useState, useEffect } from "react";

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
const TimeM = [
    { id: 0, label: "- เลือกระยะเวลา -", value: 0 },
    { id: 1, label: "12 เดือน", value: 12 },
    { id: 2, label: "24 เดือน", value: 24 },
    { id: 3, label: "36 เดือน", value: 36 },
    { id: 4, label: "48 เดือน", value: 48 },
    { id: 5, label: "60 เดือน", value: 60 },
    { id: 6, label: "72 เดือน", value: 72 },
    { id: 7, label: "84 เดือน", value: 84 },
    { id: 8, label: "96 เดือน", value: 96 },
    { id: 9, label: "108 เดือน", value: 108 },
    { id: 10, label: "120 เดือน", value: 120 },
]

export function CalPayment() {
    const [priceT, setPriceT] = useState(0);
    const [priceEM, setPriceEM] = useState(0);
    const [vat, setVat] = useState(0);
    const [totalVat, setTotalVat] = useState<number>(0);
    const [percent, setPercent] = useState(0);
    
    const [loan, setLoan] = useState(0);
    const [month, setMonth] = useState(0);
    const [interest, setInterest] = useState("");


    function hasSelectPercent(nt: any) {
        setPercent(nt.target.value)
    }
    function hasSelectTimeM(nt: any) {
        setMonth(nt.target.value)
    }

    function AddComma(val: any) {
        setPriceT(val)
        setTotalVat(val)
    }
    function sumPrice(val: any) {
        setPriceEM(val)
        setTotalVat(+val + (+priceT))
    }


 console.log(loan);
    return (
        <div className=" bg-cyan-50  w-full md:p-6 p-4 shadow-md rounded-2xl">


            <div className="flex flex-wrap items-center max-md:flex-col col-span-2 justify-center ">

                <div className="">
                    <div className="flex space-x-2">
                        <div className="">
                            <p className=" pb-1">ราคารถ</p>
                            <input
                                value={priceT}
                                type="number"
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="ราคารถ"
                                onChange={(e) => AddComma(e.target.value)}
                            ></input>
                        </div>

                        <div>
                            <p className=" pb-1">ราคาอุปกรณ์</p>
                            <input
                                value={priceEM}
                                type="number"
                                onChange={(e) => sumPrice(e.target.value)}
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="ราคารถ"
                            ></input>
                        </div>
                    </div>


                    <div className="py-2">
                        <div>
                            <p className=" pb-1">ราคาสุทธิรวม</p>
                            <input
                                value={totalVat}
                                type="number"
                                className="pl-1 ring-1 ring-inset ring-gray-300 w-full"
                                placeholder="ราคารถ"
                       
                            ></input>
                        </div>
                    </div>

                    <div className="flex space-x-2 py-2">
                        <div className="w-full">
                            <p className=" pb-1">เงินดาวน์</p>
                            <input
                            disabled
                                value={totalVat * percent / 100}
                                type="number"
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="ราคารถ"
                            ></input>
                        </div>

                        <div className="w-full">
                            <p className="w-full pb-1">เปอร์เซ็นต์</p>
                            <select className="max-w-[199.2px] w-full pl-1 ring-1 ring-inset ring-gray-300 " onChange={hasSelectPercent}>
                                {
                                    Percent.map((option) => (
                                        <option key={option.id} value={option.value}>{option.label}</option>
                                    ))
                                }
                            </select>
                    
                        </div>
                    </div>
                    <div className="py-2">
                        <div className="w-full">
                            <p className=" pb-1">ยอดเงินกู้</p>
                            <input
                            disabled
                                value={totalVat - (totalVat * percent / 100)}
                                type="number"
                                className="pl-1 ring-1 ring-inset ring-gray-300 w-full"
                                placeholder="ราคารถ"
                            ></input>
                        </div>
                    </div>
                    <div className="flex space-x-2 py-2">
                        <div className="w-full">
                            <p className=" pb-1">อัตราดอกเบี้ย</p>
                            <input
                                value={interest}
                                type="number"
                                className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full"
                                placeholder="ราคารถ"
                                onChange={(e) => setInterest(e.target.value)}
                            ></input>
                        </div>

                        <div className="w-full">
                            <p className="pb-1 line-clamp-1	">ระยะเวลาผ่อน</p>
                            <select className="max-w-[199.2px] pl-1 ring-1 ring-inset ring-gray-300 w-full" onChange={hasSelectTimeM}>
                                {
                                    TimeM.map((option) => (
                                        <option key={option.id} value={option.value}>{option.label}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                <div className="ring-1 ring-inset ring-gray-300 bg-white flex justify-center w-full max-w-[406px] h-72 md:m-8 rounded-lg">
                    <div className=" ">
                        <div className="text-center max-md:py-16 md:py-20">
                            <p className="font-bold text-bluesky-p text-xl">ยอดผ่อนต่อเดือน</p>
                            <p className="text-lg">฿ {!Math.floor((((+totalVat - (totalVat * percent / 100)) * +interest /100 ) + totalVat - (totalVat * percent / 100))/ month) ? "0" : Math.floor((((+totalVat - (totalVat * percent / 100)) * +interest /100 ) + totalVat - (totalVat * percent / 100))/ month).toLocaleString("en-US")}/เดือน</p>
                        </div>


                        <div className="px-4">
                            <hr></hr>
                            <p className="pt-4 text-sm line-clamp-4">ข้อความสำคัญ: อัตราดอกเบี้ยที่แสดงผลเป็นการประมาณการและขึ้นอยู่กับการประเมินสินเชื่อและวงเงินกู้จากสถาบันการเงิน</p>
                        </div>

                    </div>


                </div>

            </div>

        </div>
    )
};