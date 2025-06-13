import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

function Step1() {
    return (
        <>
            <Input type="text" placeholder="Email" />
            <Input type="text" placeholder="First Name" />
            <Input type="text" placeholder="Last Name" />
            <Input type="password" placeholder="Password" />
            <Input type="text" placeholder="Contact Number" />
        </>
    );
}

function Step2() {
    return;
}

function Step3() {
    return (
        <>
            <Input type="text" placeholder="Country" />
            <Input type="text" placeholder="Province/Region" />
            <Input type="text" placeholder="City/Town" />
            <Input type="text" placeholder="Address" />
            <Input type="text" placeholder="Nearby Landmarks" />
            <Input type="text" placeholder="Major Highway" />
            <Input type="text" placeholder="Port/Hub" />
            <Input type="text" placeholder="Transportation Mode Available" />
        </>
    );
}

function Step4() {
    return;
}

function Step5() {
    return;
}

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

    function handleBack() {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }

    function handleNext() {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    }

    function renderStepContent(step) {
        switch (step) {
            case 1:
                return <Step1 />;
            case 2:
                return <Step2 />;
            case 3:
                return <Step3 />;
            case 4:
                return <Step4 />;
            case 5:
                return <Step5 />;
            default:
                return null;
        }
    }

    return (
        <div className="w-full flex-1 flex flex-col items-center min-h-0">
            <div className="w-full h-16 flex justify-between items-center px-20 bg-lightGreen flex-shrink-0">
                <div className="text-2xl font-bold">SeedSync</div>
                <Button className="py-1 px-8">Sign In</Button>
            </div>
            <div className="flex-1 flex w-full min-h-0">
                <div className="bg-lighterGreen w-2/5 flex-shrink-0"></div>
                <div className="w-3/5 overflow-y-auto no-scrollbar-arrows border border-red-500">
                    <div className="flex flex-col items-center p-12 border border-black">
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
                                    {steps[currentStep].label}
                                </p>
                            </div>
                            <div className="flex flex-col gap-6 w-[464px] mx-auto border border-blue-500">
                                {renderStepContent(currentStep)}
                            </div>
                            <div className="flex justify-between items-center mt-6 w-full">
                                <Button
                                    variant="light"
                                    handleClick={handleBack}
                                >
                                    Back
                                </Button>
                                <Button variant="dark" handleClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
