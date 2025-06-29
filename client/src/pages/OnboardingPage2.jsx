import Footer from "../components/Footer";

export default function OnboardingPage2() {
    return (
        <div
            className="relative w-[1440px] h-[1000px] mx-auto"
            style={{ background: "#E6F3EC" }}
        >
            {/* ONBOARDING2.png */}
            <img
                src="/assets/ONBOARDING2.png"
                alt="Onboarding"
                className="absolute"
                style={{
                    width: "1327px",
                    height: "767px",
                    top: "17px",
                    left: "72px",
                    borderWidth: 0,
                    borderStyle: "solid",
                }}
            />

            {/* Button.png */}
            <img
                src="/assets/Button.png"
                alt="Button"
                className="absolute"
                style={{
                    width: "128px",
                    height: "124px",
                    top: "784px",
                    left: "656px",
                }}
            />

            {/* Footer */}
            <div
                className="absolute left-0"
                style={{
                    width: "1440px",
                    height: "75px",
                    top: "925px",
                }}
            >
                <Footer />
            </div>
        </div>
    );
}
