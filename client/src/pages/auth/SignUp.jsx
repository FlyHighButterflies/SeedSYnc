import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState, useRef } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import Dropdown from "@/components/Dropdown";

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
    const [profileImage, setProfileImage] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setProfileImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Image Container */}
            <div
                className={`relative w-64 h-64 rounded-full overflow-hidden shadow-md transition-all duration-300 mb-4 ${
                    !profileImage ? "cursor-pointer" : ""
                }`}
                onMouseEnter={() => !profileImage && setIsHovered(true)}
                onMouseLeave={() => !profileImage && setIsHovered(false)}
                onClick={!profileImage ? openFileDialog : undefined}
            >
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    /* Empty state with plus icon */
                    <div className="w-full h-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors duration-200">
                        <Plus
                            className="w-12 h-12 text-green-600"
                            strokeWidth={1.5}
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons (only show when image exists) */}
            {profileImage && (
                <div className="flex space-x-4">
                    <button
                        onClick={openFileDialog}
                        className="flex items-center justify-center w-16 h-16"
                    >
                        <Edit3 className="w-7 h-7 text-green-600" />
                    </button>
                    <button
                        onClick={removeImage}
                        className="flex items-center justify-center w-16 h-16"
                    >
                        <Trash2 className="w-7 h-7 text-red-600" />
                    </button>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}

function Step3() {
    return (
        <>
            <Input type="text" placeholder="Country" />
            <Input type="text" placeholder="Province/Region" />
            <Input type="text" placeholder="City/Town" />
            <Input type="text" placeholder="Address" />
            <Input type="text" placeholder="Nearby Landmarks" />
            <Dropdown
                id="highway"
                placeholder="Major Highway"
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
            />
            <Dropdown
                id="port"
                placeholder="Port/Hub"
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
            />
            <Dropdown
                id="transporation"
                placeholder="Transportation Mode"
                options={[
                    { label: "Boat", value: "boat" },
                    { label: "Truck", value: "truck" },
                    { label: "On foot", value: "on foon" },
                ]}
            />
        </>
    );
}

function Step4() {
    return (
        // IF BUYER
        <>
            <Input type="text" placeholder="Products Needed" />
            <Input type="text" placeholder="Quantity Range" />
            <Dropdown
                id="urgency of purchase"
                placeholder="Urgency of Purchase"
                options={[
                    { label: "Immediate", value: "immediate" },
                    { label: "Soon", value: "oon" },
                    { label: "Flexible", value: "flexible" },
                ]}
            />
            <Dropdown
                id="quality standards"
                placeholder="Preferred Quality Standards"
                options={[
                    { label: "Organic", value: "organic" },
                    { label: "Non-GMO", value: "non-gmo" },
                    { label: "Fair-Trade", value: "fair-trade" },
                ]}
            />
            <Dropdown
                id="frequency"
                placeholder="Frequency of Purchase"
                options={[
                    { label: "Weekly", value: "weekly" },
                    { label: "Monthly", value: "monthly" },
                    { label: "Quarterly", value: "quarterly" },
                ]}
            />
            <Dropdown
                id="inventory status"
                placeholder="Inventory Status"
                options={[
                    { label: "Low", value: "low" },
                    { label: "Normal", value: "normal" },
                    { label: "Sufficient", value: "sufficient" },
                ]}
            />
        </>

        // IF SELLER
        // <>
        //     <Input type="text" placeholder="Crops in Possession" />
        //     <Input type="text" placeholder="Available Product" />
        //     <Dropdown
        //         id="surplus"
        //         placeholder="surplus"
        //         options={[
        //             { label: "Yes", value: "yes" },
        //             { label: "No", value: "no" },
        //         ]}
        //     />
        //     <Input type="text" placeholder="Crop Diversity Count" />
        //     <Dropdown
        //         id="certifications"
        //         placeholder="Certifications"
        //         options={[
        //             { label: "Organic", value: "organic" },
        //             { label: "Non-GMO", value: "non-gmo" },
        //             { label: "Fair-Trade", value: "fair-trade" },
        //         ]}
        //     />
        //     <Dropdown
        //         id="farming practices"
        //         placeholder="Farming Practices"
        //         options={[
        //             { label: "Eco-friendly", value: "eco-friendly" },
        //             { label: "Water Efficient", value: "water efficient" },
        //         ]}
        //     />
        // </>
    );
}

function Step5() {
    return (
        <div className="flex flex-col gap-8 text-justify">
            <p>
                I hereby confirm that the information I have provided in this
                form is true, complete, and accurate to the best of my
                knowledge. I understand that any false or misleading information
                may result in the rejection or invalidation of my profile.
            </p>
            <p>
                I hereby confirm that the information I have provided in this
                form is true, complete, and accurate to the best of my
                knowledge. I understand that any false or misleading information
                may result in the rejection or invalidation of my profile.
            </p>
            <div className="flex justify-center gap-3">
                <input type="checkbox" id="terms" />
                <p>I agree to the terms stated above.</p>
            </div>
        </div>
    );
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
                <Button variant="dark" className="py-1 px-8">
                    Sign In
                </Button>
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
                                    {steps[currentStep].label}
                                </p>
                            </div>
                            <div className="flex flex-col gap-6 w-full mx-auto">
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
