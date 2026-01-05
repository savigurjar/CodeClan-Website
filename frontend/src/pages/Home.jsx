import AlgorithmsPage from "../Components/Algopage";
import AppLayout from "../Components/AppLayout";
import CompanyPracticePage from "../Components/Company";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import HeroPage from "../Components/Hero";
import LearningPathsPage from "../Components/Learning";
import PlatformFeaturesPage from "../Components/Platform";
import Animate from "../animate";

function Home() {
  return (
    // Wrap everything inside AppLayout so header/footer are included
    <AppLayout>
      {/* Optional Animate background */}
      {/* <Animate /> */}

      {/* Main content sections */}
      <HeroPage />
      <AlgorithmsPage />
      <LearningPathsPage />
      <PlatformFeaturesPage />
      <CompanyPracticePage />
    </AppLayout>
  );
}

export default Home;
