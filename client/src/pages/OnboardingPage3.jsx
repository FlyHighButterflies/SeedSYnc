import Footer from "../components/Footer";
export default function OnboardingPage3() {
    // Example click handler
    const handleButtonClick = () => {
        alert("Button clicked!");
    };

    return (
        <div
            className="relative w-[1977px] h-[913px] mx-flex justify-center items-center"
            style={{ background: "#E6F3EC" }}
        >
            {/* ONBOARDING3.png */}
            <img
                src="/images/Landingpage3.png"
                alt="Onboarding"
                className="absolute"
                style={{
                    width: "1750px",
                    height: "920px",
                    top: "1px",
                    left: "110px",
                    borderWidth: 0,
                    borderStyle: "solid",
                }}
            />

            {/* Button.png as clickable button */}
            <button
                onClick={handleButtonClick}
                style={{
                    position: "absolute",
                    width: "100px",
                    height: "10px",
                    top: "770px",
                    left: "1790px",
                    padding: 0,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                }}
            >
                <img
                    src="/images/Button.png"
                    alt="Button"
                    style={{
                        width: "80px",
                        height: "80px",
                        display: "block",
                    }}
                />
            </button>
         {/* Footer at the bottom */}
            <div
                className="absolute left-0"
                style={{
                    width: "100%",
                    height: "30px",
                    bottom: 0,
                }}
            >
                <Footer />
            </div>
        </div>
    );
}