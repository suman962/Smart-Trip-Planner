import Nav from "../components/nav";
import MobilePhone from "../components/MobilePhone";

function Home() {

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('./assets/home.jpg')" }}
    >
      <Nav />
      <section className="h-80dvh flex items-center justify-center 
          py-20 md:py-30 lg:py-36">
        <div className="max-w-9xl mx-auto p-5 text-cyan-50 flex gap-15 
            lg:gap-60 flex-col md:flex-row md:items-center">
          <div>
            <h3 className="text-lg lg:text-2xl font-bold text-cyan-200">
              Welcome to Smart Trip Planner
            </h3>
            <h1 className="text-4xl lg:text-6xl font-bold">
              Make every trip <br />A smart move
            </h1>
            <p className="text-xl mt-2 text-opacity-75">With Us</p>
          </div>
          <div>
            <MobilePhone />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;
