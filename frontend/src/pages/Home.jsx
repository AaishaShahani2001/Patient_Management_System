// Home page. One hero banner: clinic photo plus a few short quotes.
import aboutImage from '../assets/about_image.png'

const quotes = [
    'Care that starts with listening.',
    'Your health, looked after with patience and skill.',
    'A trusted team, close when you need them.',
]

export default function Home() {
    return (
        <main className="flex flex-1 items-center bg-[#f5f9fa] px-4 py-8 sm:px-10">
            {/* Photo on the left, quotes on the right. They stack on a narrow screen. */}
            <section className="mx-auto grid w-full max-w-6xl items-center gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
                <img
                    src={aboutImage}
                    alt="MediCare doctors standing in the clinic"
                    className="h-72 w-full rounded-2xl object-cover sm:h-96"
                />

                <div>
                    <p className="text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">MEDICARE</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Care you can count on</h1>

                    {/* Each quote sits on its own line with a blue bar beside it. */}
                    <ul className="mt-6 space-y-4">
                        {quotes.map((quote) => (
                            <li key={quote} className="border-l-4 border-[#2F6FED] pl-4 text-lg text-slate-600">
                                “{quote}”
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    )
}
