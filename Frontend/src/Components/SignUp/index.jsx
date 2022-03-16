import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

const scheme = yup 
.object({
    email: yup.string().required,
    password: yup.string().min(8).required,
    verifyPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'not match')
        .required(),
    }).required();

const SignUp = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm({resolver: yupResolver(scheme),});

    const registerUser = (data) => {
        alert(JSON.stringly(data,undefined,2));
    }
    console.log(errors);
    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex items-center justify-center">
                <div className="w-[50%]">
                    <p className="mb-2 text-4xl font-semibold">Welcome to Cheetah</p>
                    <p className="mb-6 text-grey-500">Sign Up your Email</p>
                    
                    <form className="flex flex-col gap-y-2"
                        onSubmit={handleSubmit(registerUser)}
                    >
                        <label className="font-semibold text-sm">Email</label>
                        <input 
                            className="border py-1 px-2 rounded-lg" 
                            placeholder="Please enter your email"
                            {...register('email', {
                                required: 'Email is Required',
                                pattern: {
                                    value: 
                                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Please enter a valid email',
                                }
                            })}
                            />
                    
                        <label className="font-semibold text-sm">Password</label>
                        <input 
                            className="border py-1 px-2 rounded-lg"
                            placeholder="Please enter your password"
                            type="password" 
                            {...register('password', {
                                required: 'Password is Required',
                            })}
                        />

                        <label className="font-semibold text-sm">Verify Password</label>
                        <input
                            className="border py-1 px-2 rounded-lg"
                            placeholder="Please repeat your password"
                            type="password"
                            {...register('verifyPassword', {
                                required: 'Verify password is Required',
                                validate: (value) => 
                                value === watch ('password') ? true : 'Not match',
                            })}
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