
const SignUp = () => {
    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[50%]">
                    <p className="mb-2 text-4xl font-semibold">Welcome to Cheetah</p>
                    <p className="mb-6 text-grey-500">Sign Up your Email</p>
                    
                    <form className="flex flex-col gap-y-2">
                        <label className="font-semibold text-sm">Email</label>
                        <input 
                            className="border py-1 px-2 rounded-lg" 
                            placeholder="Please enter your email"
                            />
                    
                        <label className="font-semibold text-sm">Password</label>
                        <input 
                            className="border py-1 px-2 rounded-lg"
                            placeholder="Please enter your password"
                            type="password" 
                        />

                        <label className="font-semibold text-sm"></label>
                        <input
                            className="border py-1 px-2 rounded-lg"
                            placeholder="Please repeat your password"
                            type="password"
                        />

                        <button className="bg-black hover:shadow-xl transition duration-300 text-white py-2 rounded-xl text-sm block">
                            Sign Up
                        </button>
                    </form>

                </div>
            </div>
                    
            <div  
                className="flex-1 bg-slate-50 relative " 
                style={{
                    background: 'url(/ilustrasi1.png)',
                    backgroundSize: 'cover'
                }}>
                    <div className="absolute left-10 rigth-10 bottom-10 backdrop-blur-xl p-10 text-white">
                    <p className="mb-1">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam quos quas voluptates,
                    deserunt totam recusandae dicta harum nihil excepturi
                    perspiciatis! Consequatur nemo est distinctio sequi ipsum consectetur eos optio minima?
                    </p>
                    <p className="text-xl text-right font-semibold">john done</p>
                    </div>
            </div>
        </div>
    )
};

export default SignUp;