import "./scss/body.scss";
import "./scss/app.scss";
import "./scss/header.scss";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import ActivityFeed from "./components/Activities/Activities";
import { ArchiveView } from "./components/Archieve/Archive";
import ControlBar from "./components/ControlBar/ControlBar";

export default function App() {
  const [activities, setActivities] = useState(null);
  const [seeArchive, setSeeArchive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);

  /* Fetch all activities and store them into a useRef and a state.*/
  const fetchActivities = () => {
    const APIaddress = "https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/activities";

    fetch(APIaddress)
      .then((res) => res.json())
      .then(
        (data) => {
          setActivities(data);
        },
        (error) => {
          setError(error);
        }
      );
  };

  const setUpdated = () => {
    setIsLoaded(!isLoaded);
    setIsUpdated(!isUpdated);
  }

  useEffect(() => {
    fetchActivities();
    setIsLoaded(true);
  }, [isLoaded]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div id="app">
        <div className="container">
          <Header setSeeArchive={setSeeArchive} seeArchive={seeArchive} />
          <div className="container-view">
            {seeArchive ? (
              <ArchiveView
                activities={activities}
                setUpdated={setUpdated}
              />
            ) : (
              <ActivityFeed
                activities={activities}
                setUpdated={setUpdated}
              />
            )}
          </div>
          <ControlBar activities={activities} />
        </div>
      </div>
    );
  }
}
