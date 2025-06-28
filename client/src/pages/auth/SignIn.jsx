import { Button, Input, Dropdown } from "@/components";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function SignIn() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
            console.log("Login successful:", response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            alert("Login successful!");
            // Redirect based on role or to a dashboard
            if (response.data.user.role === "Farmer") {
                navigate("/farmer-dashboard"); // Example redirect
            } else if (response.data.user.role === "Buyer") {
                navigate("/buyer-dashboard"); // Example redirect
            } else {
                navigate("/"); // Default redirect
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert(`Login failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="w-full h-full flex-1 flex flex-col items-center">
            <div className="w-full h-16 flex justify-between items-center border-b border-black px-6 md:px-20 bg-lightGreen flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/seedsync-logo.png"
                        alt="seedsync logo"
                        className="w-auto h-10"
                    />
                    <div className="text-2xl font-bold">SeedSync</div>
                </div>
                <Link to="/signup">
                    <Button variant="primary" size="sm" className="py-1 px-8">
                        Sign Up
                    </Button>
                </Link>
            </div>
            <div className="flex-1 flex w-full min-h-0">
                <div className="md:flex justify-center items-center hidden bg-lighterGreen w-2/5 flex-shrink-0">
                    <img
                        src="/images/auth-farmer.png"
                        alt="farmer png"
                        className="w-auto h-5/6"
                    />
                </div>
                <div className="w-full md:w-3/5 overflow-y-auto no-scrollbar-arrows">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col items-center p-8 md:p-12"
                    >
                        <div className="w-full max-w-[500px]">
                            <div className="flex flex-col items-center mb-6 md:mb-10">
                                <p className="text-2xl md:text-3xl font-bold">
                                    Sign In
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 md:gap-6 w-full mx-auto">
                                <div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                    <Input
                                        {...register("email", { required: "Email is required" })}
                                        type="email"
                                        placeholder="Email"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                </div>
                                <div>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">
                                            {errors.password.message}
                                        </p>
                                    )}
                                    <Input
                                        {...register("password", { required: "Password is required" })}
                                        type="password"
                                        placeholder="Password"
                                        className={errors.password ? "border-red-500" : ""}
                                    />
                                </div>
                                <div>
                                    {errors.role && (
                                        <p className="text-red-500 text-sm">
                                            {errors.role.message}
                                        </p>
                                    )}
                                    <Dropdown
                                        {...register("role", { required: "Role is required" })}
                                        id="role"
                                        placeholder="Select Role"
                                        options={[
                                            { label: "Farmer", value: "farmer" },
                                            { label: "Buyer", value: "buyer" },
                                        ]}
                                        className={errors.role ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-6 w-full">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Signing In..." : "Sign In"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
