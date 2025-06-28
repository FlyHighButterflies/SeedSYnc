import { Button, Input, Dropdown } from "@/components";
import { useState, useRef, useEffect } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Step1({ register, errors }) {
    return (
        <>
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
                {errors.firstName && (
                    <p className="text-red-500 text-sm">
                        {errors.firstName.message}
                    </p>
                )}
                <Input
                    {...register("firstName", {
                        required: "First name is required",
                    })}
                    type="text"
                    placeholder="First Name"
                    className={errors.firstName ? "border-red-500" : ""}
                />
            </div>

            <div>
                {errors.lastName && (
                    <p className="text-red-500 text-sm">
                        {errors.lastName.message}
                    </p>
                )}
                <Input
                    {...register("lastName", {
                        required: "Last name is required",
                    })}
                    type="text"
                    placeholder="Last Name"
                    className={errors.lastName ? "border-red-500" : ""}
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
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                    })}
                    type="password"
                    placeholder="Password"
                    className={errors.password ? "border-red-500" : ""}
                />
            </div>

            <div>
                {errors.contactNumber && (
                    <p className="text-red-500 text-sm">
                        {errors.contactNumber.message}
                    </p>
                )}
                <Input
                    {...register("contactNumber", {
                        required: "Contact number is required",
                    })}
                    type="text"
                    placeholder="Contact Number"
                    className={errors.contactNumber ? "border-red-500" : ""}
                />
            </div>
        </>
    );
}

function Step2({ register, setValue, watch }) {
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
    const watchedImage = watch("profileImagePreview");

    // Initialize profile image from form state when component mounts
    useEffect(() => {
        if (watchedImage) {
            setProfileImage(watchedImage);
        }
    }, [watchedImage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePreview = e.target.result;
                setProfileImage(imagePreview);
                setValue("profileImage", file);
                setValue("profileImagePreview", imagePreview); // Store the preview URL
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setProfileImage(null);
        setValue("profileImage", null);
        setValue("profileImagePreview", null);
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
                onClick={!profileImage ? openFileDialog : undefined}
            >
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
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
                        type="button"
                        onClick={openFileDialog}
                        className="flex items-center justify-center w-16 h-16"
                    >
                        <Edit3 className="w-7 h-7 text-green-600" />
                    </button>
                    <button
                        type="button"
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

function Step3({ register }) {
    return (
        <>
            <Input {...register("country")} type="text" placeholder="Country" />
            <Input
                {...register("province")}
                type="text"
                placeholder="Province/Region"
            />
            <Input {...register("city")} type="text" placeholder="City/Town" />
            <Input {...register("address")} type="text" placeholder="Address" />
            <Input
                {...register("landmarks")}
                type="text"
                placeholder="Nearby Landmarks"
            />
            <Dropdown
                {...register("highway")}
                id="highway"
                placeholder="Major Highway"
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
            />
            <Dropdown
                {...register("port")}
                id="port"
                placeholder="Port/Hub"
                options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                ]}
            />
            <Dropdown
                {...register("transportation")}
                id="transportation"
                placeholder="Transportation Mode"
                options={[
                    { label: "Boat", value: "boat" },
                    { label: "Truck", value: "truck" },
                    { label: "On foot", value: "on-foot" },
                ]}
            />
        </>
    );
}

function Step4({ register, userType, setUserType }) {
    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    return (
        <>
            {/* User Type Toggle */}
            <div className="flex flex-col items-center mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1 w-full max-w-xs">
                    <button
                        type="button"
                        onClick={() => handleUserTypeChange("farmer")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            userType === "farmer"
                                ? "bg-normalGreen text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Farmer
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUserTypeChange("buyer")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                            userType === "buyer"
                                ? "bg-normalGreen text-white shadow-sm"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        Buyer
                    </button>
                </div>
            </div>

            {/* Conditional Fields Based on User Type */}
            {userType === "farmer" ? (
                <>
                    <Input
                        {...register("specialties")}
                        type="text"
                        placeholder="Crops/Specialties (comma separated)"
                    />
                    <Input
                        {...register("availableProduct")}
                        type="text"
                        placeholder="Available Products"
                    />
                    <Dropdown
                        {...register("surplus")}
                        id="surplus"
                        placeholder="Surplus Available"
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                    />
                    <Input
                        {...register("cropDiversityCount")}
                        type="number"
                        placeholder="Number of Crop Types"
                    />
                    <Dropdown
                        {...register("certifications")}
                        id="certifications"
                        placeholder="Certifications"
                        options={[
                            { label: "Organic", value: "organic" },
                            { label: "Non-GMO", value: "non-gmo" },
                            { label: "Fair-Trade", value: "fair-trade" },
                            { label: "None", value: "none" },
                        ]}
                    />
                    <Dropdown
                        {...register("farmingPractices")}
                        id="farmingPractices"
                        placeholder="Farming Practices"
                        options={[
                            { label: "Eco-friendly", value: "eco-friendly" },
                            {
                                label: "Water Efficient",
                                value: "water-efficient",
                            },
                            { label: "Traditional", value: "traditional" },
                            { label: "Sustainable", value: "sustainable" },
                        ]}
                    />
                </>
            ) : (
                <>
                    <Input
                        {...register("productsNeeded")}
                        type="text"
                        placeholder="Products Needed (comma separated)"
                    />
                    <Input
                        {...register("quantityRange")}
                        type="text"
                        placeholder="Quantity Range (e.g., 100-500 kg)"
                    />
                    <Dropdown
                        {...register("urgency")}
                        id="urgency"
                        placeholder="Urgency of Purchase"
                        options={[
                            { label: "Immediate", value: "immediate" },
                            { label: "Soon", value: "soon" },
                            { label: "Flexible", value: "flexible" },
                        ]}
                    />
                    <Dropdown
                        {...register("qualityStandards")}
                        id="qualityStandards"
                        placeholder="Preferred Quality Standards"
                        options={[
                            { label: "Organic", value: "organic" },
                            { label: "Non-GMO", value: "non-gmo" },
                            { label: "Fair-Trade", value: "fair-trade" },
                            { label: "Any", value: "any" },
                        ]}
                    />
                    <Dropdown
                        {...register("frequency")}
                        id="frequency"
                        placeholder="Frequency of Purchase"
                        options={[
                            { label: "Weekly", value: "weekly" },
                            { label: "Monthly", value: "monthly" },
                            { label: "Quarterly", value: "quarterly" },
                            { label: "As needed", value: "as-needed" },
                        ]}
                    />
                    <Dropdown
                        {...register("inventoryStatus")}
                        id="inventoryStatus"
                        placeholder="Current Inventory Status"
                        options={[
                            { label: "Low", value: "low" },
                            { label: "Normal", value: "normal" },
                            { label: "Sufficient", value: "sufficient" },
                        ]}
                    />
                </>
            )}
        </>
    );
}

function Step5({ register, errors, userType }) {
    return (
        <div className="flex flex-col gap-8 text-justify">
            <div className="bg-lightGreen p-4 rounded-lg">
                <h3 className="font-semibold text-darkGreen mb-2">
                    Registration Summary
                </h3>
                <p className="text-sm text-gray-700">
                    You are registering as a{" "}
                    <span className="font-semibold capitalize">{userType}</span>
                    . Please review all your information before submitting.
                </p>
            </div>

            <p>
                I hereby confirm that the information I have provided in this
                form is true, complete, and accurate to the best of my
                knowledge. I understand that any false or misleading information
                may result in the rejection or invalidation of my profile.
            </p>
            <p>
                By proceeding, I acknowledge that I have read and understood the
                terms and conditions of SeedSync, and I consent to the
                collection and processing of my personal data in accordance with
                the platform's privacy policy.
            </p>
            <div className="flex justify-center gap-3 items-center">
                <input
                    {...register("terms", {
                        required: "You must agree to the terms",
                    })}
                    type="checkbox"
                    id="terms"
                    className={`accent-normalGreen ${
                        errors.terms ? "accent-red-500" : ""
                    }`}
                />
                <label htmlFor="terms" className="cursor-pointer">
                    I agree to the terms stated above.
                </label>
            </div>
            {errors.terms && (
                <p className="text-red-500 text-sm text-center">
                    {errors.terms.message}
                </p>
            )}
        </div>
    );
}

function SignUp() {
    const [currentStep, setCurrentStep] = useState(1);
    const [userType, setUserType] = useState("farmer"); // Default to farmer
    const totalSteps = 5;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            userType: "farmer",
        },
    });

    // Update form value when userType changes
    useEffect(() => {
        setValue("userType", userType);
    }, [userType, setValue]);

    const steps = {
        1: {
            label: "Personal Information",
            fields: [
                "email",
                "firstName",
                "lastName",
                "password",
                "contactNumber",
            ],
        },
        2: { label: "Profile Picture", fields: [] },
        3: { label: "Location & Logistics", fields: [] },
        4: { label: "Business Information", fields: [] },
        5: { label: "Review Your Profile", fields: ["terms"] },
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = async () => {
        // Validate current step fields if they exist
        const fieldsToValidate = steps[currentStep].fields;
        if (fieldsToValidate.length > 0) {
            const isStepValid = await trigger(fieldsToValidate);
            if (!isStepValid) return;
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const onSubmit = (data) => {
        // Include userType in the form data
        const formData = {
            ...data,
            userType: userType,
        };
        console.log("Form Data:", formData);
        alert("Registration successful! Check console for data.");
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 1:
                return <Step1 register={register} errors={errors} />;
            case 2:
                return (
                    <Step2
                        register={register}
                        setValue={setValue}
                        watch={watch}
                    />
                );
            case 3:
                return <Step3 register={register} />;
            case 4:
                return (
                    <Step4
                        register={register}
                        userType={userType}
                        setUserType={setUserType}
                    />
                );
            case 5:
                return (
                    <Step5
                        register={register}
                        errors={errors}
                        userType={userType}
                    />
                );
            default:
                return null;
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
                <Link to="/login">
                    <Button variant="primary" size="sm" className="py-1 px-8">
                        Sign In
                    </Button>
                </Link>
            </div>
            <div className="flex-1 flex w-full min-h-0">
                {/* Hide on mobile with hidden class, show on medium screens and up */}
                <div className="md:flex justify-center items-center hidden bg-lighterGreen w-2/5 flex-shrink-0">
                    <img
                        src="/images/auth-farmer.png"
                        alt="farmer png"
                        className="w-auto h-5/6"
                    />
                </div>
                {/* Take full width on mobile, 3/5 width on medium screens and up */}
                <div className="w-full md:w-3/5 overflow-y-auto no-scrollbar-arrows">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col items-center p-8 md:p-12"
                    >
                        <div className="w-full max-w-[500px]">
                            <div className="flex flex-col items-center mb-6 md:mb-10">
                                <div className="flex justify-center mb-4">
                                    <div className="flex space-x-1 md:space-x-2">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-2 w-8 md:w-16 rounded-full ${
                                                    step <= currentStep
                                                        ? "bg-normalGreen"
                                                        : "bg-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-2xl md:text-3xl font-bold">
                                    {steps[currentStep].label}
                                </p>
                                {currentStep === 4 && (
                                    <p className="text-sm text-gray-600 mt-2 text-center">
                                        Choose your role and provide relevant
                                        information
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-4 md:gap-6 w-full mx-auto">
                                {renderStepContent(currentStep)}
                            </div>
                            <div className="flex justify-between items-center mt-6 w-full">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="lg"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                >
                                    Back
                                </Button>
                                {currentStep === totalSteps ? (
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Submitting..."
                                            : "Submit"}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
