" ";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from '../public/6f6f9279f.png';
import bg from '../public/Logistics-4.png';
import { useRouter } from "next/navigation";
import signIn from "./signin";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const handleForm = async (event: any) => {
    event.preventDefault()

    const { result, error } = await signIn(email, password);

    if (error) {
      return console.log(error)
    }

    // else successful
    console.log(result)
    return router.push("/dashboard")
  }

  return (
    <div className=" bg-hero-pattern">
      <main className="flex min-h-screen w-screen items-center ">

        <div className="absolute justify-center flex w-full ">
          <div className="relative w-full max-w-96 bg-white max-md:p-4 md:p-8 rounded-lg shadow-md z-10 opacity-80" >

            <div className="flex justify-center my-6">
              <Image src={logo} alt="Pkmhino Logo" className="max-w-20 max-h-20 " />
            </div>
            <h1 className="text-center text-2xl font-medium mb-8">ยินดีต้อนรับเข้าสู่ PKM HINO</h1>

            <form onSubmit={handleForm} className="space-y-4">

              <div className="flex flex-col space-y-2">

                <label>อีเมล</label>
                <input type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full text-xl"
                  placeholder="อีเมล" />
                {/* <input type="text" className="pl-1 ring-1 ring-inset ring-gray-300 rounded" placeholder="User Name" ></input> */}
              </div>
              <div className="flex flex-col space-y-2">
                <label>รหัสผ่าน</label>
                <input type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-1 ring-1 ring-inset ring-gray-300 max-md:w-full text-xl"
                  placeholder="รหัสผ่าน" />
                {/* <input type="password" className="pl-1 ring-1 ring-inset ring-gray-300 rounded" placeholder="Password"></input> */}
              </div>

              <div className="flex justify-center pt-4">
                <button type="submit" className="btn btn-black w-full bg-green-500 text-white rounded-md hover:bg-green-600 text-center py-1">เข้าสู่ระบบ</button>

              </div>


            </form>

          </div>

          <div className="max-sm:hidden relative sm:-left-48 ">

            <div className="absolute -left-56 top-10 w-64 h-64 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob ">
            </div>
            <div className="absolute w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000">
            </div>

          </div>

        </div>
        {/* <Image src={bg} alt="Pkmhino Logo" className="bg-repeat-y bg-center h-screen" /> */}
      </main>

    </div>

  );
}
