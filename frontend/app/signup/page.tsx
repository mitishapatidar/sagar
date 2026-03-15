"use client"

export default function SignupPage(){

return(

<div className="min-h-screen flex items-center justify-center bg-green-50">

<form className="bg-white p-8 rounded-xl shadow-lg w-96">

<h2 className="text-2xl font-bold text-center mb-6">
Create Account
</h2>

<input
type="text"
placeholder="Name"
className="w-full border p-3 mb-4 rounded"
/>

<input
type="email"
placeholder="Email"
className="w-full border p-3 mb-4 rounded"
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 mb-4 rounded"
/>

<button
className="w-full bg-green-600 text-white py-3 rounded-lg"
>

Signup

</button>

</form>

</div>

)
}