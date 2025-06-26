import { Button, Input } from "@/components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Login Data:", data);
        alert("Login attempt successful! Check the console for data.");
    };

    return (
        <div className="w-full h-full flex-1 flex flex-col items-center bg-lighterGreen border">
            <div className="w-full h-16"></div>
            <div className="flex-1 flex w-full min-h-0">
                <div className="md:flex justify-center items-center hidden bg-lighterGreen w-2/5">
                    <img
                        src="/images/auth-farmer.png"
                        alt="farmer png"
                        className="w-auto h-5/6"
                    />
                </div>
                <div className="w-full md:w-3/5">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex justify-center p-8 md:p-12"
                    >
                        <div className="flex flex-col w-full max-w-[500px] gap-4">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/seedsync-logo.png"
                                        alt="seedsync logo"
                                        className="w-auto h-10"
                                    />
                                    <div className="text-4xl font-bold">
                                        SeedSync
                                    </div>
                                </div>
                            </div>

                            <p className="text-2xl font-bold">Sign In</p>

                            <div className="flex flex-col justify-center gap-4 md:gap-6 w-full h-[320px] mx-auto p-8 rounded-xl bg-white">
                                <div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                    <Input
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                        type="email"
                                        placeholder="Email"
                                        className={
                                            errors.email ? "border-red-500" : ""
                                        }
                                    />
                                </div>
                                <div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <Input
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                        type="password"
                                        placeholder="Password"
                                        className={
                                            errors.password
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                </div>
                                <div className="flex flex-col pt-2">
                                    <Button
                                        type="submit"
                                        variant="dark"
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        {isSubmitting
                                            ? "Signing In..."
                                            : "Sign In"}
                                    </Button>
                                    <p className="pt-3 font-bold cursor-pointer">
                                        Forgot password?
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2">
                                <p>New to SeedSync?</p>
                                <Link to="/signup" className="font-bold">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
