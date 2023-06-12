import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
  readingTime?: string;
}

function CoffeeSvg({ size }: { size: "sm" | "lg" }) {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        size === "sm" ? "scale-90" : "scale-100"
      } mb-3 mr-1 inline-block h-6 w-6 fill-skin-base`}
      aria-hidden="true"
      viewBox="0 0 96.59 122.88"
    >
      <defs>
        <style>.cls-1</style>
      </defs>
      <title>coffee</title>
      <path d="M42.65,7.68A26.83,26.83,0,0,1,46.83,0a43.57,43.57,0,0,0-1.44,10.6C45.54,17.07,48.57,20.05,53,28c6.4,11.52,3.3,22.66-5.21,31.85C50.85,49.59,52.29,43,50,35.47a34,34,0,0,0-2.74-6.22c-2.86-5.21-6-9.51-5.69-15.8a20.81,20.81,0,0,1,1.13-5.77ZM10.89,54.6a2.43,2.43,0,0,1,.54-1.06c1.57-2.46,5.24-4.54,10.36-6A73.09,73.09,0,0,1,36.34,45,26.9,26.9,0,0,1,36,49.35a65.37,65.37,0,0,0-12.66,2.24c-4.17,1.22-7,2.63-7.69,4l-.15.92c.28,1.52,3.22,3.1,7.84,4.45a82.84,82.84,0,0,0,22.28,2.68A82.89,82.89,0,0,0,67.85,61c4.63-1.35,7.58-2.94,7.85-4.46l-.09-.74c-.56-1.44-3.42-2.91-7.76-4.18a60.51,60.51,0,0,0-7.74-1.65,28,28,0,0,0,1.2-4.18,63.87,63.87,0,0,1,8,1.74c5.48,1.61,9.31,3.87,10.67,6.56a2.41,2.41,0,0,1,.33.83,4.7,4.7,0,0,1,.22,1.39c0,.12,0,.23,0,.34.18,1.71.3,3.39.38,5,5-1.58,8.79-1,11.46.93a10.42,10.42,0,0,1,4.14,7.65,17.1,17.1,0,0,1-1.86,9.27c-3.09,6.2-9.92,11.7-20.42,11.72-.37.66-.76,1.3-1.16,1.92a44.38,44.38,0,0,1,11.74,4.64c3.94,2.42,6.17,5.35,6.17,8.64,0,5-5.46,9.35-14.29,12.22-8,2.62-19.06,4.24-31.2,4.24s-23.19-1.62-31.21-4.24C5.46,115.77,0,111.46,0,106.42c0-3.29,2.23-6.22,6.17-8.64a44.62,44.62,0,0,1,12.06-4.72,53,53,0,0,1-7.1-17.67A50.69,50.69,0,0,1,10,65.22a55.22,55.22,0,0,1,.58-8.75v-.19a4.89,4.89,0,0,1,.31-1.68Zm4,7.55c0,1-.07,2-.06,3a47.1,47.1,0,0,0,1,9.22c2.76,12.66,8.86,21.3,16.2,26a25,25,0,0,0,27.63-.13c7.2-4.69,13.11-13.28,15.65-25.76a47.39,47.39,0,0,0,.88-8.81v-.35a1.22,1.22,0,0,1,0-.27c0-.91,0-1.84-.06-2.78a29.17,29.17,0,0,1-6.79,2.82A88.4,88.4,0,0,1,45.57,68a88.53,88.53,0,0,1-23.78-2.9,28.94,28.94,0,0,1-6.93-2.91ZM81,66.74A49.81,49.81,0,0,1,80,75.41a57.12,57.12,0,0,1-3.33,10.88c7-.75,11.53-4.62,13.68-8.93a12.39,12.39,0,0,0,1.38-6.66,5.7,5.7,0,0,0-2.14-4.2c-1.73-1.23-4.58-1.4-8.64.24ZM70,97.33a35.47,35.47,0,0,1-7.74,6.91,29.83,29.83,0,0,1-32.82.16,35.43,35.43,0,0,1-8.12-7.15,43.56,43.56,0,0,0-12.65,4.64c-2.46,1.51-3.85,3.06-3.85,4.53,0,2.71,4.18,5.44,11,7.64,7.56,2.47,18.07,4,29.72,4s22.15-1.52,29.71-4c6.77-2.2,11-4.93,11-7.64,0-1.47-1.39-3-3.85-4.53A42.93,42.93,0,0,0,70,97.33Zm-32-82.06c-1.06,7-.13,9.16,2.17,12.45,2.55,3.64,4.7,6.48,5.33,10.05.88,5-1.41,10.36-4.45,14.22,4.76-23.42-13.36-17.91-3.05-36.72Z" />
    </svg>
  );
}

export default function MetaData({
  datetime,
  size = "sm",
  className,
  readingTime,
}: Props) {
  return (
    <div className={`flex items-center space-x-2 opacity-80 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } mb-1 inline-block h-6 w-6 fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>
      <span className="sr-only">Posted on:</span>
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime datetime={datetime} />
        {readingTime && (
          <>
            <span aria-hidden="true"> | </span>
            <CoffeeSvg size={size} />
            <span className="sr-only">and it takes </span>
            {readingTime}
          </>
        )}
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string | Date }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {date}
      <span aria-hidden="true"> | </span>
      <span className="sr-only">&nbsp;at&nbsp;</span>
      {time}
    </>
  );
};
