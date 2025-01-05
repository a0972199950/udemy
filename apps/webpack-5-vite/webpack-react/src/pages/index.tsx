import { lazy, Suspense, useState } from "react";
import Test from "@/components/Test";
import imageLondon from "@/assets/images/london.png";

const LazyPerson = lazy(() => import("@/components/Person"));

const Home = () => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(true);
  };
  return (
    <>
      <h1>Hello react</h1>
      <img src={imageLondon} alt="" />
      <img src="/images/london.png" alt="" />
      <Test />

      <button onClick={handleClick}>lazy load person</button>

      {show && (
        <Suspense fallback={<div>Loading...</div>}>
          <LazyPerson />
        </Suspense>
      )}
    </>
  );
};

export default Home;
