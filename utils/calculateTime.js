import dayjs from "dayjs";

const calculateTime = (createdAt, isComment) => {
  const today = dayjs(Date.now());
  const postDate = dayjs(createdAt);
  const diffInWeeks = today.diff(postDate, "weeks");
  const diffInDays = today.diff(postDate, "days");
  const diffInHours = today.diff(postDate, "hours");
  const diffInMinutes = today.diff(postDate, "minutes");
  const diffInSeconds = today.diff(postDate, "seconds");

  if (diffInMinutes < 1) {
    return `${diffInSeconds} s`;
  }

  if (diffInHours < 1) {
    return `${diffInMinutes} m`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} h`;
    // return (
    //   <>
    //     {/* hh:mm A -> hours:minutes AM/PM */}
    //     Today, <dayjs format="hh:mm A">{createdAt}</dayjs>
    //   </>
    // );
  } else if (diffInHours >= 24 && diffInHours < 36) {
    if (isComment) {
      return `${diffInDays} d`;
    }
    return (
      <>
        Yesterday, <dayjs format="HH:mm">{createdAt}</dayjs>
      </>
    );
  } else if (diffInHours >= 36 && diffInHours < 168) {
    if (isComment) {
      return `${diffInDays} d`;
    }
    return (
      <>
        {/* date/month/year along with time */}
        <dayjs format="DD MMM YYYY, HH:mm">{createdAt}</dayjs>
      </>
    );
  } else if (diffInHours >= 168) {
    if (isComment) {
      return `${diffInWeeks} w`;
    }
    return (
      <>
        {/* date/month/year along with time */}
        <dayjs format="DD MMM YYYY, HH:mm">{createdAt}</dayjs>
      </>
    );
  }
};

export default calculateTime;
