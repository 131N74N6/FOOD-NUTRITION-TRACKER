import Navbar from "../components/Navbar";
import ResultService from "../services/result.service";

export default function Results() {
    const { isProcessing } = ResultService();

    return (
        <section className="flex md:flex-row flex-col h-screen relative">
            {Navbar(isProcessing)}
            <div className="w-full md:w-3/4 h-full overflow-y-auto"></div>
        </section>
    );
}