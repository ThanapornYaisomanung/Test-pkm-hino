export function DashBox(prop: any) {
    return (
        <div className="max-w-full md:w-80  md:h-40 bg-cyan-50 rounded-2xl shadow-md flex items-center p-4 justify-center gap-8">
            {/* icon */}
            <div className="w-14 h-14">
                {prop.icon}
            </div>

            <div className="flex flex-wrap">
                <ul>
                    <li className=" text-wrap md:text-xl font-bold w-36">{prop.text}</li>
                    <li className="text-2xl ">{prop.num}</li>
                </ul>
            </div>

        </div>
    )
};
