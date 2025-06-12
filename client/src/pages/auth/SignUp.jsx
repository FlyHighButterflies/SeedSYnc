import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

function SignUp() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const steps = {
        1: { label: "Personal Information", fields: [] },
        2: { label: "Profile", fields: [] },
        3: { label: "Location & Logistics", fields: [] },
        4: { label: "Inventory", fields: [] },
        5: { label: "Review Your Profile", fields: [] },
    };

    return (
        <div className="w-full flex-1 flex flex-col items-center min-h-0">
            <div className="w-full h-16 flex justify-between items-center px-20 bg-lightGreen flex-shrink-0">
                <div className="text-2xl font-bold">SeedSync</div>
                <Button className="py-1 px-8">Sign In</Button>
            </div>
            <div className="flex-1 flex w-full min-h-0">
                <div className="bg-lighterGreen w-2/5 flex-shrink-0"></div>
                <div className="w-3/5 overflow-y-auto no-scrollbar-arrows">
                    <div className="flex flex-col items-center p-12">
                        <div className="w-full max-w-[500px]">
                            <div className="flex flex-col items-center mb-10">
                                <div className="flex justify-center mb-4">
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-2 w-16 rounded-full ${
                                                    step <= currentStep
                                                        ? "bg-normalGreen"
                                                        : "bg-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold">
                                    Personal Information
                                </p>
                            </div>
                            <div className="flex flex-col gap-6 w-[464px] mx-auto">
                                <Input type="text" placeholder="Email" />
                                <Input type="text" placeholder="First Name" />
                                <Input type="text" placeholder="Last Name" />
                                <Input type="password" placeholder="Password" />
                                <Input
                                    type="text"
                                    placeholder="Contact Number"
                                />
                                <Input type="text" placeholder="Testing" />
                                <Input type="text" placeholder="Testing" />
                                <Input type="text" placeholder="Testing" />
                            </div>
                            <div className="flex justify-between items-center mt-6 w-full">
                                <Button>Back</Button>
                                <Button>Next</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
