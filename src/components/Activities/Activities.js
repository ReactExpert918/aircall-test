import {
  ArchiveIcon,
  CallBoxStyle,
  CallDateStyle,
  CallDetailStyle,
  CallFromStyle,
  PhoneIncomingStyle,
  PhoneMissedStyle,
  VoicemailStyle,
  CallViaStyle,
  CallTimeStyle,
  ThreeDotVertStyle,
  ArchiveSwipeStyle,
  UndoStyle
} from "../Activities/ActivitiesStyles";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

// Implementing the swipe feature for archiving a call and undoing an archived call
const trailingActions = (handleCallArchive, isArchived) => (
  <TrailingActions>
    <SwipeAction onClick={() => handleCallArchive()} destructive={true}>
      <ArchiveSwipeStyle isArchived={isArchived}>
        {isArchived ? (
          <UndoStyle size="24" />
        ) : (
          <ArchiveIcon style={{ minWidth: "24px" }} />
        )}
      </ArchiveSwipeStyle>
    </SwipeAction>
  </TrailingActions>
);

const CallIcon = ({ callType }) => {
  if (callType === "answered") {
    return <PhoneIncomingStyle size="18" />;
  } else if (callType === "missed") {
    return <PhoneMissedStyle size="18" />;
  } else if (callType === "voicemail") {
    return <VoicemailStyle size="18" />;
  } else {
    return null;
  }
};

const CallVia = ({ via }) => {
  return (
    <>
      tried to call on
      <span style={{ fontSize: "12.7px", fontWeight: "900" }}> {via}</span>
    </>
  );
};

const CallFrom = ({ direction, from, to }) => {
  if (direction === "inbound") {
    return <>{from}</>;
  } else if (direction === "outbound") {
    return <>{to}</>;
  } else {
    return null;
  }
};

const CallBox = ({
  id,
  date,
  from,
  to,
  callType,
  isArchived,
  via,
  direction,
  setUpdated
}) => {
  let newDate = new Date(date);
  let dateOptions = { year: "numeric", month: "long", day: "numeric" };
  let timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };
  let formatDate = new Intl.DateTimeFormat("en-US", dateOptions);
  let formatTime = new Intl.DateTimeFormat("en-US", timeOptions);
  let shortDate = formatDate.format(newDate);
  let fullTime = formatTime.format(newDate);
  let time = fullTime.match(/[\d:]+/);
  let ampm = fullTime.match(/PM|AM/);

  const handleCallArchive = () => {
    const _data = {
      is_archived: !isArchived
    };

    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8", 'Accept': 'application/json' }
    };

    fetch(`https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/activities/${id}`, requestOptions)
      .then((response) => {
        setUpdated()
      })
      .catch((err) => console.log(err));
  };

  return (
    <CallBoxStyle>
      <CallDateStyle>{shortDate}</CallDateStyle>
      <SwipeableList destructiveCallbackDelay={100}>
        <SwipeableListItem
          trailingActions={trailingActions(handleCallArchive, isArchived)}
        >
          <CallDetailStyle>
            <CallIcon callType={callType} />
            <CallFromStyle>
              <CallFrom direction={direction} to={to} from={from} />
              <CallViaStyle>
                <CallVia via={via} />
              </CallViaStyle>
            </CallFromStyle>
            <ThreeDotVertStyle size="16" />
            <CallTimeStyle>
              <div id="time">{time}</div>
              <div id="ampm">{ampm}</div>
            </CallTimeStyle>
          </CallDetailStyle>
        </SwipeableListItem>
      </SwipeableList>
    </CallBoxStyle>
  );
};

const ArchiveOrUndo = ({
  archiveOrUndo,
  activities,
  setUpdated
}) => {
  // A function that parses through all activities and archives them all
  const handleArchiveAll = () => {
    let realActicities = activities.filter((val) => val.via && val.to && val.from && val.to !== val.from && val.is_archived == false);
    realActicities.forEach((call, callIndex) => {
      console.log(call.id, callIndex);
      const _data = {
        is_archived: true
      };
      const requestOptions = {
        method: "PATCH",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8", "Accept": "application/json" }
      };
      fetch(
        `https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/activities/${call.id}`,
          requestOptions
        )
          .then((response) => {
            if(callIndex == realActicities.length - 1) {
              setUpdated();
            }
          })
          .catch((err) => console.log(err));
    })
  };

  // A function that parses through all activities and unarchives them all
  const handleUndoAll = () => {
    const _data = {
      is_archived: false
    };

    const requestOptions = {
      method: "PATCH",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8", "Accept": "application/json" },
    };
    fetch(
      `https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/reset`,
      requestOptions
    )
      .then((response) => {
        setUpdated();
      })
      .catch((err) => console.log(err));
  };

  return (
    <CallBoxStyle>
      {archiveOrUndo === "archive" ? (
        <CallDetailStyle
          onClick={handleArchiveAll}
          style={{ marginTop: "0", marginBottom: "10px", padding: "15px 0" }}
        >
          <ArchiveIcon />
          <span style={{ fontWeight: "600" }}>Archive all calls</span>
        </CallDetailStyle>
      ) : archiveOrUndo === "undo" ? (
        <CallDetailStyle
          onClick={handleUndoAll}
          style={{ marginTop: "0", marginBottom: "10px", padding: "15px 0" }}
        >
          <UndoStyle size="20" />
          <span style={{ fontWeight: "600" }}>Undo all archived calls</span>
        </CallDetailStyle>
      ) : null}
    </CallBoxStyle>
  );
};

export default function ActivityFeed({
  activities,
  setUpdated
}) {
  if (activities) {
    return (
      <>
        <ArchiveOrUndo
          archiveOrUndo={"archive"}
          activities={activities}
          setUpdated={setUpdated}
        />
        {activities.filter((val) => val.via && val.to && val.from && val.to !== val.from).sort((a, b) => a.created_at - b.created_at).map((call, callIndex) =>
          !call.is_archived ? (
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
}

export { CallBox, ArchiveOrUndo };