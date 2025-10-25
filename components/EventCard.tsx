import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug?: string;
}

const EventCard = ({ title, image, location, date, time, slug }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="Location" width={16} height={16} />
        <p className="event-location">{location}</p>
      </div>
      <p className="event-title">{title}</p>
      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="Date" width={16} height={16} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="Time" width={16} height={16} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
