import {
  ArchiveSwitchStyle,
  ActivitySwitchBtn,
  ArchiveSwitchBtn
} from "../Archieve/ArchiveStyles";
import { CallBox, ArchiveOrUndo } from "../Activities/Activities";
import { ThreeDotVertStyle } from "../Archieve/ArchiveStyles";

const ArchiveSwitch = ({ activities, setSeeArchive, seeArchive }) => {
  const realActivities = (activities && activities.length > 0) ? 
                        activities.filter((val) => val.via && val.to && val.from && val.to !== val.from && val.is_archived == false).length : 
                        0;
  const realArchives = (activities && activities.length > 0) ? 
  activities.filter((val) => val.via && val.to && val.from && val.to !== val.from && val.is_archived == true).length : 
  0;
  return (
    <>
      <ArchiveSwitchStyle seeArchive={seeArchive}>
        <div id="btn"></div>
        <ActivitySwitchBtn
          seeArchive={seeArchive}
          onClick={() => setSeeArchive(false)}
        >
          Activity: {realActivities}
        </ActivitySwitchBtn>
        <ThreeDotVertStyle />
        <ArchiveSwitchBtn
          seeArchive={seeArchive}
          onClick={() => setSeeArchive(true)}
        >
          Archives: {realArchives}
        </ArchiveSwitchBtn>
      </ArchiveSwitchStyle>
    </>
  );
};

const ArchiveView = ({
  activities,
  setUpdated
}) => {
  if (activities) {
    return (
      <>
        <ArchiveOrUndo
          archiveOrUndo={"undo"}
          activities={activities}
          setUpdated={setUpdated}
        />
        {activities.filter((val) => val.via && val.to && val.from && val.to !== val.from).sort((a, b) => a.created_at - b.created_at).map((call, callIndex) =>
          call.is_archived ? (
            <CallBox
              key={call.id}
              date={call.created_at}
              from={call.from}
              to={call.to}
              callType={call.call_type}
              isArchived={call.is_archived}
              via={call.via}
              direction={call.direction}
              id={call.id}
              setUpdated={setUpdated}
              callIndex={callIndex}
            />
          ) : null
        )}
      </>
    );
  } else {
    return null;
  }
};

export { ArchiveSwitch, ArchiveView };
