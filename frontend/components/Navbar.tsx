"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { useEffect, useState } from "react"
import { isLoggedIn, logout } from "../lib/auth"

export default function Navbar() {

const [logged,setLogged] = useState(false)

useEffect(()=>{
setLogged(isLoggedIn())
},[])

function handleLogout(){
logout()
window.location.href="/"
}

return (

<nav className="w-full bg-white shadow-md fixed top-0 z-50">

<div className="max-w-7xl mx-auto flex justify-between items-center p-4">

<div className="flex items-center gap-2 text-green-700 font-bold text-xl">
<Leaf/>
KhetMitra
</div>

<div className="flex gap-6 font-medium">

<Link href="/">Home</Link>

<Link href="/dashboard">Dashboard</Link>

<Link href="/sensors">Farm Sensors</Link>

{logged ? (
<>

<Link href="/profile">Profile</Link>

<button
onClick={handleLogout}
className="text-red-500"
>
Logout
</button>

</>
) : (

<Link href="/login">Login</Link>

)}

</div>

</div>

</nav>

)

}