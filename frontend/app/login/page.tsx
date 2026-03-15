"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "../../lib/auth"

export default function LoginPage() {

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

function handleLogin(e:any){

e.preventDefault()

if(email === "admin@gmail.com" && password === "123456"){

login()

router.push("/dashboard")

}else{

alert("Invalid Credentials")

}

}

return(

<div className="min-h-screen flex items-center justify-center bg-green-50">

<form
onSubmit={handleLogin}
className="bg-white p-8 rounded-xl shadow-lg w-96"
>

<h2 className="text-2xl font-bold mb-6 text-center">
Login to KhetMitra
</h2>

<input
type="email"
placeholder="Email"
className="w-full border p-3 mb-4 rounded"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 mb-4 rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="w-full bg-green-600 text-white py-3 rounded-lg"
>
Login
</button>

</form>

</div>

)

}